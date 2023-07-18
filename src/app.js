import { CONTAINER_ID } from "./utils/constant.ts";
import App from 'virtual:svelte-kit-inspector-path:Overlay.svelte'
function createInspectorContainer() {
    if (document.getElementById(CONTAINER_ID) != null)
        throw new Error('SvelteKitInspectorContainer element already exists')

    const el = document.createElement('div')
    el.setAttribute('id', CONTAINER_ID)
    document.getElementsByTagName('body')[0].appendChild(el)
    return el
}

export function load() {
    new App({
        target: createInspectorContainer()
    })
}
