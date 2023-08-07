
export * from './constant'
export * from './config'
export * from './types'

const toggleComboKeysMap = {
  control: process.platform === 'darwin' ? 'Control(^)' : 'Ctrl(^)',
  meta: 'Command(⌘)',
  shift: 'Shift(⇧)',
}

export function normalizeComboKeyPrint(toggleComboKey: string) {
  return toggleComboKey.split('-').map(key => toggleComboKeysMap[key as keyof typeof toggleComboKeysMap] || key[0].toUpperCase() + key.slice(1)).join('+')
}


const FS_PREFIX = '/@fs/'
const IS_WINDOWS = process.platform === 'win32'
const queryRE = /\?.*$/s
const hashRE = /#.*$/s

export function idToFile(id: string): string {
  // strip /@fs/ but keep leading / on non-windows
  if (id.startsWith(FS_PREFIX))
    id = id = id.slice(IS_WINDOWS ? FS_PREFIX.length : FS_PREFIX.length - 1)

  // strip query and hash
  return id.replace(hashRE, '').replace(queryRE, '')
}

export function parseSvelteRequest(id: string) {
  const [filename] = id.split('?', 2)
  const url = new URL(id, 'http://domain.inspector')
  const query = Object.fromEntries(url.searchParams.entries()) as any
  if (query.svelte != null)
    query.svelte = true

  if (query.src != null)
    query.src = true

  if (query.index != null)
    query.index = Number(query.index)

  if (query.raw != null)
    query.raw = true

  if (query.hasOwnProperty('lang.tsx') || query.hasOwnProperty('lang.jsx'))
    query.isJsx = true

  return {
    filename,
    query,
  }
}
