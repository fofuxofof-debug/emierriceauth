import { NextResponse, type NextRequest } from 'next/server'
import { keysDb, hwidsDb, logsDb, generateKey } from '@/lib/db'

export async function GET() {
  const keys = await keysDb.list()
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
  let body: {
    label?: string | null
    max_devices?: number
    expires_in_days?: number
    discord_id?: string | null
    notes?: string | null
    quantity?: number
    custom_key?: string | null
    product?: string | null
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
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
      // Se a key já existe (renovação do cliente):
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
        details: { key: targetKey, days, newExpires },
      })
      return NextResponse.json({ data: [updated || existing], count: 1 })
    }

    // Cria nova key tendo o Discord ID como a própria Key de Licença
    const k = await keysDb.create({
      key: targetKey,
      label: body.label || null,
      max_devices: devices,
      expires_at: expires,
      discord_id: body.discord_id || null,
      notes: body.notes || null,
      product,
    })
    await logsDb.create({
      key_id: k.id,
      event_type: 'key_created',
      details: { key: k.key, label: k.label, product, custom: true },
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
    })
    await logsDb.create({
      key_id: k.id,
      event_type: 'key_created',
      details: { key: k.key, label: k.label, product },
    })
    created.push(k)
  }

  return NextResponse.json({ data: created, count: created.length })
}
