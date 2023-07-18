import colors from "ansi-colors";

export const PLUGIN_NAME = 'svelte-kit-inspector'
export const V_INSPECTOR_OPTIONS = 'virtual:svelte-kit-inspector-options'

export const V_INSPECTOR_PATH = 'virtual:svelte-kit-inspector-path:'

export const LOG_TIP = (keys: string) => ` ${colors.greenBright('🎯')}  ${colors.blueBright.bold('Svelte Kit Inspector')}: ${colors.greenBright(`Press ${colors.yellowBright(keys)} in App to toggle the Inspector`)}\n`

export const CONTAINER_ID = '__SVELTE_KIT_INSPECTOR_CONTAINER'
