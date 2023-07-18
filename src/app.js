import App from 'virtual:svelte-kit-inspector-path:Overlay.svelte'
function createInspectorContainer() {
    if (document.getElementById('__SVELTE_KIT_INSPECTOR_CONTAINER') != null)
        throw new Error('SvelteKitInspectorContainer element already exists')

    const el = document.createElement('div')
    el.setAttribute('id', '__SVELTE_KIT_INSPECTOR_CONTAINER')
    document.getElementsByTagName('body')[0].appendChild(el)
    return el
}

export function load() {
    new App({
        target: createInspectorContainer()
    })
}
