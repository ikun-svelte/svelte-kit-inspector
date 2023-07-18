import {VitePluginInspectorOptions} from "./types";


export const DEFAULT_CONFIG:VitePluginInspectorOptions = {
  enabled: false,
  toggleComboKey: process.platform === 'darwin' ? 'meta-shift' : 'control-shift',
  toggleButtonVisibility: 'always',
  toggleButtonPos: 'top-right',
  kit: true,
}
