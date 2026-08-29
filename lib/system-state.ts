import fs from 'fs'
import path from 'path'

export interface SystemStatus {
  auth_enabled: boolean
  site_enabled: boolean
  maintenance_message: string
  freefire_enabled: boolean
  valorant_enabled: boolean
  cs2_enabled: boolean
  updated_at: string
}

const defaultStatus: SystemStatus = {
  auth_enabled: true,
  site_enabled: true,
  maintenance_message: 'Sistema temporariamente em manutenção para atualização de segurança.',
  freefire_enabled: true,
  valorant_enabled: true,
  cs2_enabled: true,
  updated_at: new Date().toISOString(),
}

let inMemoryStatus: SystemStatus = { ...defaultStatus }

function getFilePath() {
  return path.join(process.cwd(), '.system_state.json')
}

export function getSystemStatus(): SystemStatus {
  try {
    const p = getFilePath()
    if (fs.existsSync(p)) {
      const data = fs.readFileSync(p, 'utf-8')
      const parsed = JSON.parse(data)
      inMemoryStatus = { ...defaultStatus, ...parsed }
      return inMemoryStatus
    }
  } catch {}
  return inMemoryStatus
}

export function updateSystemStatus(updates: Partial<SystemStatus>): SystemStatus {
  const current = getSystemStatus()
  const next: SystemStatus = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  }
  inMemoryStatus = next
  try {
    const p = getFilePath()
    fs.writeFileSync(p, JSON.stringify(next, null, 2), 'utf-8')
  } catch {}
  return next
}
