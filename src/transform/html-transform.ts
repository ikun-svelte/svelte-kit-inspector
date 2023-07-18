import * as path from 'path'
import MagicString from 'magic-string'
import { normalizePath } from 'vite'
import { parse, preprocess } from 'svelte/compiler'
import { typescript } from 'svelte-preprocess'
import type { TemplateNode } from 'svelte/types/compiler/interfaces'

const KEY_DATA = 'data-sv-inspector'
export async function htmlTransform(code, id) {
  const s = new MagicString(code)
  if (!id.endsWith('.svelte')) return s

  // @ts-expect-error
  const relativePath = normalizePath(path.relative(process.cwd(), id)).replaceAll('\\', '/')
  const filename = relativePath.split('/').pop()
  let htmlAST: TemplateNode | null = null
  let offset = 0
  try {
    let orgCode = code
    if (code.includes('lang="ts"') || code.includes("lang='ts'")) {
      // preprocess typescript
      const preprocessRes = await preprocess(code, typescript(), { filename })
      orgCode = preprocessRes.toString()
      offset = orgCode.length - code.length
    }

    const { html } = parse(orgCode, { filename })
    htmlAST = html
  } catch (e) {
    console.error(e)
  }

  walkHtmlAST(htmlAST, s, relativePath, offset)
  return s
}

function walkHtmlAST(
  ast: TemplateNode,
  s: MagicString,
  relativePath: string,
  offset: number,
) {
  for (let i = 0; i < ast.children.length; i++) {
    if (ast.children[i].type === 'Element') {
      const start = ast.children[i].start + ast.children[i].name.length + 1 - offset
      s.appendRight(start, ` ${KEY_DATA}='true'`)
      if (ast.children[i].children && ast.children[i].children.length > 0)
        walkHtmlAST(ast.children[i], s, relativePath, offset)
    }
  }
}
