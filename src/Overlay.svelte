<script>
    import inspectorOptions from 'virtual:svelte-kit-inspector-options'
    import {onDestroy, onMount} from "svelte";
    import Logo from "./components/Logo.svelte";
    const isClient = typeof window !== 'undefined'
    const importMetaUrl = isClient ? new URL(import.meta.url) : {}
    const protocol = inspectorOptions.serverOptions?.https ? 'https:' : importMetaUrl?.protocol
    const hostOpts = inspectorOptions.serverOptions?.host
    const host = hostOpts && hostOpts !== true ? hostOpts : importMetaUrl?.hostname
    const port = inspectorOptions.serverOptions?.port ?? importMetaUrl?.port
    const baseUrl = isClient ? `${protocol}//${host}:${port}` : ''

    const KEY_DATA = 'data-sv-inspector'
    const KEY_IGNORE = 'data-sv-inspector-ignore'
    let containerRef = null
    let floatsRef = null
    let enabled = inspectorOptions.enabled
    const toggleCombo = inspectorOptions.toggleComboKey?.toLowerCase?.()?.split?.('-') ?? false
    let overlayVisible = null
    const position = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }
    let linkParams = {
        file: '',
        line: 0,
        column: 0,
    }

    $:logoColors = enabled ? ['#42D392', '#213547', '#42b883'] : ['#E2C6C6', '#E2C6C6', '#E2C6C6']

    const { toggleButtonVisibility } = inspectorOptions
    $: containerVisible = toggleButtonVisibility === 'always' || (toggleButtonVisibility === 'active' && enabled)

    $: containerPosition = inspectorOptions.toggleButtonPos .split('-') .map(p => `${p}: 15px;`) .join('')

    $: bannerPosition = () => {
        const [x, y] = inspectorOptions.toggleButtonPos.split('-')
        return `${x === 'top' ? 'bottom' : 'top'}: -45px; ${y}: 0`
    }

    $: floatsStyle = () => {
        let margin = 10
        let x = position.x + (position.width / 2)
        let y = position.y + position.height + 5
        let floatsWidth = floatsRef?.clientWidth ?? 0
        let floatsHeight = floatsRef?.clientHeight ?? 0

        x = Math.max(margin, x)
        x = Math.min(x, window.innerWidth - floatsWidth - margin)

        y = Math.max(margin, y)
        y = Math.min(y, window.innerHeight - floatsHeight - margin)

        return `left: ${x}px; top: ${y}px;`
    }

    $: sizeIndicatorStyle = `
    left: ${position.x}px;
    top: ${position.y}px;
    width: ${position.width}px;
    height: ${position.height}px;`

    onMount(() => {
        toggleCombo && document.body.addEventListener('keydown', onKeydown)
        toggleEventListener()
    })

    onDestroy(() => {
        enabled = false
        toggleEventListener()
    })
  
    function toggleEventListener() {
        const listener = enabled ? document.body.addEventListener : document.body.removeEventListener
        listener?.('resize', resetLinkParams)
        listener?.('scroll', resetLinkParams)
        listener?.('mousemove', updateLinkParams)
        listener?.('click', handleClick, true)
    }

    function toggleEnabled() {
        enabled = !enabled
        overlayVisible = false
        toggleEventListener()
    }

    function onKeydown(event) {
        if (event.repeat || event.key === undefined)
            return

        const isCombo = toggleCombo?.every(key => isKeyActive(key, event))
        if (isCombo)
            toggleEnabled()
    }

    function isKeyActive(key, event) {
        switch (key) {
            case 'shift':
            case 'control':
            case 'alt':
            case 'meta':
                return event.getModifierState(key.charAt(0).toUpperCase() + key.slice(1))
            default:
                return key === event.key.toLowerCase()
        }
    }

    function getTargetNode(e) {
        const path = e.path ?? e.composedPath()
        if (!path) {
            return {
                targetNode: null,
                params: null,
            }
        }
        const ignoreIndex = path.findIndex(node => node?.hasAttribute?.(KEY_IGNORE))
        const targetNode = path.slice(ignoreIndex + 1).find(node => node)

        if (targetNode === path[ignoreIndex] || targetNode.contains(path[ignoreIndex])) {
            return {
                targetNode: null,
                params: null,
            }
        }
        if(!targetNode.__svelte_meta){
            return {
                targetNode: null,
                params: null,
            }
        }
        const { file, line, column } = targetNode.__svelte_meta.loc
        return {
            targetNode,
            params: {
                file,
                line,
                column,
                title: file,
            }
        }
    }

    function handleClick(e) {
        const { targetNode, params } = getTargetNode(e)
        if (!targetNode)
            return
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        const { file, line, column } = params
        overlayVisible = false
        exposeInstance.openInEditor(baseUrl, file, line, column)

        inspectorOptions.pickOnlyOnce && exposeInstance.disable()
    }

    function updateLinkParams(e) {
        const { targetNode, params } = getTargetNode(e)
        if (targetNode) {
            const rect = targetNode.getBoundingClientRect()
            overlayVisible = true
            position.x = rect.x
            position.y = rect.y
            position.width = rect.width
            position.height = rect.height
            linkParams = params
        }
        else resetLinkParams()
    }

    function resetLinkParams() {
        overlayVisible = false
        linkParams = {
            file: '',
            line: 0,
            column: 0,
        }
    }

    // Public methods
    const exposeInstance = {
        enable: () => {
            if (enabled)
                return
            toggleEnabled()
        },
        disable: () => {
            if (!enabled)
                return
            toggleEnabled()
        },
        openInEditor: (baseUrl, file, line, column) => {
            /**
             * Vite built-in support
             * https://github.com/vitejs/vite/blob/d59e1acc2efc0307488364e9f2fad528ec57f204/packages/vite/src/node/server/index.ts#L569-L570
             * */
            return fetch(`${baseUrl}/__open-in-editor?file=${encodeURIComponent(`${file}:${line}:${column}`)}`)
        }
    }
    // Expose control to global
    window.__SVELTE_KIT_INSPECTOR__ = exposeInstance
</script>

<div data-sv-inspector-ignore>
    {#if containerVisible}
        <div bind:this={containerRef}
             class="svelte-kit-inspector-container {!enabled ? 'svelte-kit-inspector-container--disabled' : ''}"
             style={containerPosition}>
            <!-- Logo -->
            <div on:click|stopPropagation|preventDefault ={toggleEnabled} class="svelte-kit-inspector-logo">
                <Logo marginBottom="8px"></Logo>
                <span>Inspector</span>
            </div>

            <!-- Banner  -->
            <a style={bannerPosition()}
               class="svelte-kit-inspector-banner svelte-kit-inspector-card"
               href="https://github.com/baiwusanyu-c/svelte-kit-inspector"
               target="_blank">
                <div>svelte-kit-inspector</div>
                <div class="tip">Click on a element › Open IDE › Link to File</div>
            </a>
        </div>
    {/if}

    <!-- Overlay -->
    {#if overlayVisible && linkParams}
        <div bind:this={floatsRef}
             class="svelte-kit-inspector-floats svelte-kit-inspector-card"
             style={floatsStyle()}>
            <div>{ linkParams.title }:{ linkParams.line }:{ linkParams.column }</div>
            <div class="tip">
                Click to go to the file
            </div>
        </div>
        <div class="svelte-kit-inspector-size-indicator"
             style={sizeIndicatorStyle}>
        </div>
    {/if}
</div>

<style>
    .svelte-kit-inspector-container {
        cursor: pointer;
        position: fixed;
        text-align: center;
        z-index: 2147483647;
        font-family: Arial, Helvetica, sans-serif;
    }

    .svelte-kit-inspector-card {
        font-family: Arial, Helvetica, sans-serif;
        padding: 5px 8px;
        border-radius: 4px;
        text-align: left;
        color:#e9e9e9;
        font-size: 14px;
        background-color: #ff7548;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    }

    .svelte-kit-inspector-card .tip {
        font-size: 11px;
        opacity: 0.7;
    }

    .svelte-kit-inspector-banner {
        display: none;
        position: absolute;
        margin: 0;
        width: 260px;
        text-decoration: none;
    }

    .svelte-kit-inspector-container:hover .svelte-kit-inspector-banner, .svelte-kit-inspector-banner:hover {
        display: block;
    }

    .svelte-kit-inspector-container--disabled:hover .svelte-kit-inspector-banner {
        display: none;
    }

    .svelte-kit-inspector-floats {
        z-index: 2147483647;
        position: fixed;
        transform: translateX(-50%);
        transition: all 0.1s ease-in;
        pointer-events: none;
    }

    .svelte-kit-inspector-size-indicator {
        z-index: 2147483646;
        position: fixed;
        background-color: rgba(243, 101, 61, 0.47);
        border: 1px solid #fd9b7b;
        border-radius: 5px;
        transition: all 0.1s ease-in;
        pointer-events: none;
    }
    .svelte-kit-inspector-logo{
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        background-color: white;
        padding: 4px;
        box-sizing: border-box;
    }
    .svelte-kit-inspector-logo span{
       margin: 0 4px;
    }
</style>
