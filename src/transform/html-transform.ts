import * as path from 'path'
import MagicString from 'magic-string'
import { normalizePath } from 'vite'

export function htmlTransform(id, code){
  const s = new MagicString(code)
  const relativePath = normalizePath(path.relative(process.cwd(), id))
  debugger
}
