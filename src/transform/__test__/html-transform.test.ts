import { htmlTransform } from "../html-transform";
// @ts-ignore
import code from './test.svelte?raw'
import { beforeEach, describe, expect, test } from 'vitest'

describe('transform html inspector data', () =>{
  test('inspector data', () => {
    const id = 'D:\\project-chabaidao\\svelte-kit-inspector\\src\\transform\\__test__\\test.svelte'
    htmlTransform(id, code)
    debugger
  })
})
