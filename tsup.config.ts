import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

const config = {
  entry: ['src/index.ts'],
  external: [
      'vite',
  ],
  noExternal: [
      'baiwusanyu-utils',
      'ansi-colors',
      'magic-string'
  ],
  format: ['esm', 'cjs'],
  clean: true,
  minify: false,
  dts: true,
  shims: true,
  onSuccess: () => {

  }
}

// TODO: README
// TODO: README.ZH-CN
// TODO: build script
// TODO: logo
export default defineConfig(config as Options)
