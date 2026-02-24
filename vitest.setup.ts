import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// 加载环境变量
import 'dotenv/config'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
