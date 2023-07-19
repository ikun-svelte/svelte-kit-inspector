import {
  PLUGIN_NAME,
  DEFAULT_CONFIG,
  V_INSPECTOR_OPTIONS,
  V_INSPECTOR_PATH,
  LOG_TIP,
  VitePluginInspectorOptions,
  normalizeComboKeyPrint,
  idToFile,
  parseSvelteRequest,
} from './utils'

import type { PluginOption, ServerOptions } from "vite";
import { extend } from "baiwusanyu-utils";
import * as fs from 'fs'
import { normalizePath } from "vite";
import * as path from "path";
import { fileURLToPath } from "url";
import MagicString from "magic-string";

function getInspectorPath() {
  // @ts-ignore
  const pluginPath = normalizePath(path.dirname(fileURLToPath(import.meta.url)))
  return pluginPath.replace(/\/dist$/, '/src')
}

function svelteKitInspector(options: VitePluginInspectorOptions = DEFAULT_CONFIG): PluginOption {
  const inspectorPath = getInspectorPath()
  let serverOptions: ServerOptions | undefined
  const finalOptions = extend(DEFAULT_CONFIG, options)
  const { kit } = finalOptions

  return {
    name: PLUGIN_NAME,
    enforce: 'pre',

    apply(_, { command }) {
      // apply only on serve and not for test
      return command === 'serve' && process.env.NODE_ENV !== 'test'
    },

    configResolved(resolvedConfig) {
      serverOptions = resolvedConfig.server
    },

    async resolveId(importee: string) {
      if (importee.startsWith(V_INSPECTOR_OPTIONS)) {
        return importee
      } else if (importee.startsWith(V_INSPECTOR_PATH)) {
        return importee.replace(V_INSPECTOR_PATH, `${inspectorPath}/`)
      }
    },

    async load(id) {
      if (id === V_INSPECTOR_OPTIONS) {
        return `export default ${JSON.stringify({ ...finalOptions, serverOptions })}`
      } else if (id.startsWith(inspectorPath)) {
        const { query } = parseSvelteRequest(id)
        if (query.type)
          return
        // read file ourselves to avoid getting shut out by vite fs.allow check
        const file = idToFile(id)
        if (fs.existsSync(file))
          return await fs.promises.readFile(file, 'utf-8')
        else
          console.error(`failed to find file for svelte-kit-inspector: ${file}, referenced by id ${id}.`)
      }
    },

    configureServer(server) {
      const _printUrls = server.printUrls
      const { toggleComboKey } = finalOptions

      toggleComboKey && (server.printUrls = () => {
        const keys = normalizeComboKeyPrint(toggleComboKey)
        _printUrls()
        console.log(LOG_TIP(keys))
      })
    },

    async transform(code: string, id: string) {
      const { filename, query } = parseSvelteRequest(id)
      const isTpl = filename.endsWith('.svelte') && query.type !== 'style' && !query.raw
      if (isTpl) {
        const mgcStr = new MagicString(code)
        // inject load-kit.js into root sfc
        if (filename.includes('root.svelte')) {
          mgcStr.replaceAll('<script>', `<script>\nimport '${V_INSPECTOR_PATH}load-kit.js'`)
        }

        return {
          code: mgcStr.toString(),
          get map() {
            return mgcStr.generateMap({
              source: id,
              includeContent: true,
              hires: true,
            })
          },
        }
      }
    },

    // If not svelte-kit, we inject load.js into html
    transformIndexHtml(html) {
      if (kit)
        return

      return {
        html,
        tags: [
          {
            tag: 'script',
            injectTo: 'head',
            attrs: {
              type: 'module',
              src: `/@id/${V_INSPECTOR_PATH}load.js`,
            },
          },
        ],
      }
    },
  }
}

export default svelteKitInspector
