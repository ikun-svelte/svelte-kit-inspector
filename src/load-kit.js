import { load } from 'virtual:svelte-kit-inspector-path:app.js'
import { browser } from '$app/environment'
if (browser)
    load()
