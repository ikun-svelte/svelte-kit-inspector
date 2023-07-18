import { beforeEach, describe, expect, test } from 'vitest'
import { htmlTransform } from '../html-transform'
// @ts-expect-error
import code from './test.svelte?raw'

describe('transform html inspector data', () => {
  test('inspector data', () => {
    const id = 'D:\\project-chabaidao\\svelte-kit-inspector\\src\\transform\\__test__\\test.svelte'
    htmlTransform(id, code)
    debugger
  })
})
