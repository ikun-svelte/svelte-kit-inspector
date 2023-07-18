import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

const config = {
  entry: ['src/index.ts'],
  external: [
    'vite',
  ],
  format: ['esm', 'cjs'],
  clean: true,
  minify: false,
  dts: true,
  shims: true,
}

// TODO: README
// TODO: README.ZH-CN
// TODO: build script
// TODO: logo
export default defineConfig(config as Options)
