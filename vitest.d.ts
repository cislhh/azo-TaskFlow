import type { TestingLibraryMatchers } from '@testing-library/dom'

declare module 'vitest' {
  export interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
  export interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, void> {}
}
