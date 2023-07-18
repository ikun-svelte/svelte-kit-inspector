import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

const config = {
  entry: ['src/index.ts'],
  external: [
    'magic-string',
  ],
  format: ['cjs', 'esm'],
  clean: true,
  minify: false,
  dts: true,

}

// TODO: README
// TODO: README.ZH-CN
// TODO: build script
// TODO: logo
// TODO: expose api
export default defineConfig(config as Options)
