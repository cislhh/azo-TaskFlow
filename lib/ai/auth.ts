/**
 * 智谱 AI 认证工具
 * 从 API Key 生成 JWT token
 * API Key 格式: id.secret
 */

import { createHmac, timingSafeEqual } from 'crypto'

export interface TokenPayload {
  api_key: string
  exp: number
  timestamp: number
}

export interface TokenHeader {
  alg: 'HS256'
  sign_type: 'SIGN'
}

/**
 * Base64 URL 编码（不使用 padding）
 */
function base64UrlEncode(data: Buffer | string): string {
  const base64 = Buffer.isBuffer(data)
    ? data.toString('base64')
    : Buffer.from(data).toString('base64')

  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * 生成智谱 AI JWT Token
 * @param apiKey - API Key (格式: id.secret)
 * @param expSeconds - 过期时间（秒），默认 3600
 * @returns JWT Token
 */
export function generateGLMToken(apiKey: string, expSeconds: number = 3600): string {
  const parts = apiKey.split('.')
  if (parts.length !== 2) {
    throw new Error('API Key 格式不正确，应为 id.secret 格式')
  }

  const [id, secret] = parts

  const now = Date.now()

  // Header
  const header: TokenHeader = {
    alg: 'HS256',
    sign_type: 'SIGN',
  }

  // Payload
  const payload: TokenPayload = {
    api_key: id,
    exp: now + expSeconds * 1000,
    timestamp: now,
  }

  // 编码 header 和 payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))

  // 生成签名
  const signatureInput = `${encodedHeader}.${encodedPayload}`
  const signature = createHmac('sha256', secret)
    .update(signatureInput)
    .digest()

  const encodedSignature = base64UrlEncode(signature)

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
}

/**
 * 验证 Token（仅用于调试）
 */
export function verifyGLMToken(token: string, apiKey: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return false
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts
    const [_, secret] = apiKey.split('.')

    // 重新计算签名
    const signatureInput = `${encodedHeader}.${encodedPayload}`
    const expectedSignature = createHmac('sha256', secret)
      .update(signatureInput)
      .digest()

    // 解码收到的签名
    const receivedSignature = Buffer.from(
      encodedSignature.replace(/-/g, '+').replace(/_/g, '/'),
      'base64'
    )

    return timingSafeEqual(expectedSignature, receivedSignature)
  } catch {
    return false
  }
}
