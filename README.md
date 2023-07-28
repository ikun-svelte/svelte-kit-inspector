# svelte-kit-inspector
🧩 jump to local IDE source code while click the element of browser automatically. [opn in stackblitz](https://stackblitz.com/edit/vitejs-vite-dalqvi?file=src%2Froutes%2F%2Bpage.svelte)

English | [中文](https://github.com/baiwusanyu-c/svelte-kit-inspector/blob/master/README.ZH-CN.md)

## Install

```bash
npm i svelte-kit-inspector-D
```
或
```bash
yarn add svelte-kit-inspector -D
```
或
```bash
pnpm add svelte-kit-inspector -D
```

## Usage

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import svelteKitInspector from 'svelte-kit-inspector'
import { sveltekit } from '@sveltejs/kit/vite'
import type { PluginOption } from 'vite'
export default defineConfig({
  plugins: [
     svelteKitInspector({
        /** plugin options **/
     }),
     sveltekit(),
  ],
})
```

## Option

```typescript
export interface VitePluginInspectorOptions {
   /**
    * Enabled by default
    * @default false
    */
   enabled?: boolean

   /**
    * Pick component only once every time
    * @default false
    */
   pickOnlyOnce?: boolean

   /**
    * Define the assembly to call out the inspector
    * win: control + shift
    * mac: meta + shift
    * @default 'control-shift' on windows, 'meta-shift' on other os
    *
    * any number of modifiers `control` `shift` `alt` `meta` followed by zero or one regular key, separated by -
    * examples: control-shift, control-o, control-alt-s  meta-x control-meta
    * Some keys have native behavior (e.g. alt-s opens history menu on firefox).
    * To avoid conflicts or accidentally typing into inputs, modifier only combinations are recommended.
    * You can also disable it by setting `false`.
    */
   toggleComboKey?: string | false

   /**
    * Visibility of the trigger button
    * @default 'active'
    */
   toggleButtonVisibility?: 'always' | 'active' | 'never'

   /**
    * The location of the trigger button
    * @default top-right
    */
   toggleButtonPos?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

   /**
    * append an import to the module id ending with `appendTo` instead of adding a script into body
    * useful for frameworks that do not support transformIndexHtml hook (e.g. Nuxt3)
    *
    * WARNING: only set this if you know exactly what it does.
    */
   kit: true
}
```


## Thanks
* [react-dev-inspector](https://github.com/zthxxx/react-dev-inspector)
* [vite-plugin-vue-inspector](https://github.com/webfansplz/vite-plugin-vue-inspector)

