import { NextResponse, type NextRequest } from 'next/server'
import { keysDb, hwidsDb, logsDb, generateKey } from '@/lib/db'
import {
  getSessionUser,
  isSamuca,
  isMrcrlq,
} from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const user = getSessionUser(request)
  const ownerParam = request.nextUrl.searchParams.get('owner')?.toLowerCase()

  let keys = await keysDb.list()

  // Se o usuário logado for Samuca, ele NUNCA vê chaves de mrcrlq
  if (user && isSamuca(user.username)) {
    keys = keys.filter((k) => isSamuca(k.created_by))
  } else if (user && isMrcrlq(user.username)) {
    // Para mrcrlq (admin):
    // Padrão (se não passar ?owner ou se passar ?owner=mrcrlq ou ?owner=me): mostra APENAS seus clientes para não misturar!
    if (!ownerParam || ownerParam === 'me' || ownerParam === 'mrcrlq') {
      keys = keys.filter((k) => !k.created_by || isMrcrlq(k.created_by))
    } else if (ownerParam === 'samuca' || ownerParam === 'samucax') {
      // Se mrcrlq filtrar pelos clientes de Samuca:
      keys = keys.filter((k) => isSamuca(k.created_by))
    }
    // Se ownerParam === 'all', retorna todas sem filtrar
  } else if (ownerParam) {
    if (ownerParam === 'samuca' || ownerParam === 'samucax') {
      keys = keys.filter((k) => isSamuca(k.created_by))
    } else if (ownerParam === 'mrcrlq' || ownerParam === 'me') {
      keys = keys.filter((k) => !k.created_by || isMrcrlq(k.created_by))
    }
  }

  // Enriquece cada key com seus HWIDs vinculados (pra exibicao na tabela)
  const enriched = await Promise.all(
    keys.map(async (k) => ({
      ...k,
      hwids: await hwidsDb.listByKey(k.id),
    }))
  )
  return NextResponse.json({ data: enriched })
}

export async function POST(request: NextRequest) {
  const user = getSessionUser(request)
  let body: {
    label?: string | null
    max_devices?: number
    expires_in_days?: number
    discord_id?: string | null
    notes?: string | null
    quantity?: number
    custom_key?: string | null
    product?: string | null
    created_by?: string | null
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  // Determina quem é o dono da key
  let ownerName = 'mrcrlq'
  if (user && isSamuca(user.username)) {
    ownerName = 'SamucaX'
  } else if (body.created_by && isSamuca(body.created_by)) {
    ownerName = 'SamucaX'
  } else if (user && isMrcrlq(user.username)) {
    // Se o admin mrcrlq escolheu criar explicitamente para Samuca, permite; senão é mrcrlq
    if (body.created_by && isSamuca(body.created_by)) {
      ownerName = 'SamucaX'
    } else {
      ownerName = 'mrcrlq'
    }
  } else if (body.created_by) {
    ownerName = body.created_by
  }

  const qty = Math.min(Math.max(Number(body.quantity) || 1, 1), 50)
  const days = Math.max(Number(body.expires_in_days) || 30, 1)
  const devices = Math.max(Number(body.max_devices) || 1, 1)
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()

  // Normaliza o produto pra slug (lowercase, sem espacos)
  const product = body.product?.trim().toLowerCase() || null

  // Se custom_key foi passado OU discord_id foi passado, usa como chave de licença
  const targetKey = (body.custom_key || body.discord_id)?.trim() || null

  if (targetKey) {
    const existing = await keysDb.findByKey(targetKey)
    if (existing) {
      // Se a key já existe, verifica permissão caso seja Samuca
      if (user && isSamuca(user.username) && !isSamuca(existing.created_by)) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 })
      }

      // Renovação da key
      const baseTime = new Date(existing.expires_at) > new Date()
        ? new Date(existing.expires_at).getTime()
        : Date.now()
      const newExpires = new Date(baseTime + days * 24 * 60 * 60 * 1000).toISOString()
      const updated = await keysDb.update(existing.id, {
        status: 'active',
        expires_at: newExpires,
        discord_id: body.discord_id || existing.discord_id,
        label: body.label || existing.label,
        notes: body.notes || existing.notes,
        product: product || existing.product,
      })
      await logsDb.create({
        key_id: existing.id,
        event_type: 'key_renewed',
        details: { key: targetKey, days, newExpires, renewed_by: ownerName },
      })
      return NextResponse.json({ data: [updated || existing], count: 1 })
    }

    // Cria nova key tendo o Discord ID / custom_key como a própria Key de Licença
    const k = await keysDb.create({
      key: targetKey,
      label: body.label || null,
      max_devices: devices,
      expires_at: expires,
      discord_id: body.discord_id || null,
      notes: body.notes || null,
      product,
      created_by: ownerName,
    })
    await logsDb.create({
      key_id: k.id,
      event_type: 'key_created',
      details: { key: k.key, label: k.label, product, custom: true, created_by: ownerName },
    })
    return NextResponse.json({ data: [k], count: 1 })
  }

  // Modo padrão: gera N keys aleatórias
  const created = []
  for (let i = 0; i < qty; i++) {
    const k = await keysDb.create({
      key: generateKey(),
      label: body.label || null,
      max_devices: devices,
      expires_at: expires,
      discord_id: body.discord_id || null,
      notes: body.notes || null,
      product,
      created_by: ownerName,
    })
    await logsDb.create({
      key_id: k.id,
      event_type: 'key_created',
      details: { key: k.key, label: k.label, product, created_by: ownerName },
    })
    created.push(k)
  }

  return NextResponse.json({ data: created, count: created.length })
}
