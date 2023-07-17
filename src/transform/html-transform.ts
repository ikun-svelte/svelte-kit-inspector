import * as path from 'path'
import MagicString from 'magic-string'
import { normalizePath } from 'vite'
import { parse } from 'svelte/compiler';
import {TemplateNode} from "svelte/types/compiler/interfaces";

const attr = 'data-sv-inspector'
export function htmlTransform(code, id){
  const s = new MagicString(code)
  if(!id.endsWith('.svelte')) return s

  // @ts-ignore
  const relativePath = normalizePath(path.relative(process.cwd(), id)).replaceAll('\\', '/')
  const filename = relativePath.split('/').pop()
  let htmlAST:TemplateNode | null = null
  try {
    //TODO: 无法解析 ts？
    //TODO: 如何解析行数？
    const { html } = parse(code, { filename })
    htmlAST = html
  }catch (e){
    console.error(e)
  }

  walkHtmlAST(htmlAST, s, relativePath)
  return s
}

function walkHtmlAST(
    ast: TemplateNode,
    s:MagicString,
    relativePath:string
){
  for (let i = 0; i < ast.children.length; i++) {
    if(ast.children[i].type === 'Element'){
      const start = ast.children[i].start + ast.children[i].name.length + 1
      s.appendRight(start, ` ${attr}='${relativePath}:x:${ast.children[i].start}'`)
      if(ast.children[i].children && ast.children[i].children.length > 0){
        walkHtmlAST(ast.children[i], s, relativePath)
      }
    }
  }
}
