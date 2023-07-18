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
export default defineConfig(config as Options)
