# svelte-kit-inspector
🧩 通过点击元素能够自动跳转打开到 `IDE` `svelte` 源码的插件

[English](https://github.com/baiwusanyu-c/svelte-kit-inspector/blob/master/README.md) | 中文

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
    * 是否默认开启
    * @default false
    */
   enabled?: boolean

   /**
    * 是否每次开启只选择一次组件
    * @default false
    */
   pickOnlyOnce?: boolean

   /**
    * 呼出 inpector 的组合键
    * win: control + shift
    * mac: meta + shift
    * @default 'control-shift' on windows, 'meta-shift' on other os
    */
   toggleComboKey?: string | false

   /**
    * 触发显示 inspector 按钮的方式
    * @default 'active'
    */
   toggleButtonVisibility?: 'always' | 'active' | 'never'

   /**
    * 触发显示 inspector 按钮的位置
    * @default top-right
    */
   toggleButtonPos?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

   /**
    * 标记是否为 svelte-kit 运行
    * @default true
    */
   kit: true
}
```


## Thanks
* [react-dev-inspector](https://github.com/zthxxx/react-dev-inspector)
* [vite-plugin-vue-inspector](https://github.com/webfansplz/vite-plugin-vue-inspector)
