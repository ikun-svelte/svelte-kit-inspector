import {PLUGIN_NAME} from "./utils";
import { htmlTransform } from "./transform/html-transform";

export function svelteKitInspector(options = {}){
  return {
    name: PLUGIN_NAME,
    enforce: 'pre',
    async transform(code: string, id: string){
      const mgcStr = await htmlTransform(code, id)
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
  }
}
