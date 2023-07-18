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

export default defineConfig(config as Options)
