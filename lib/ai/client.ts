/**
 * GLM AI Client
 * 使用原生 fetch API 调用智谱 AI GLM-4.7-Flash
 * 文档: https://open.bigmodel.cn/dev/api
 *
 * 认证方式: 直接使用 API Key
 * - API Key 格式: id.secret
 * - 使用 Bearer Token 认证: Authorization: Bearer your-api-key
 *
 * @example
 * ```typescript
 * import { glmClient } from '@/lib/ai/client'
 *
 * // 基础调用
 * const response = await glmClient.chat([
 *   { role: 'system', content: '你是一个助手' },
 *   { role: 'user', content: '你好' }
 * ])
 *
 * // 启用思考模式（适合复杂任务）
 * const response = await glmClient.chat(messages, {
 *   thinking: true,
 *   maxTokens: 16384,
 * })
 *
 * // JSON 响应解析
 * const data = await glmClient.chatJSON<MyType>(messages)
 * ```
 */

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ThinkingConfig {
  type: 'enabled' | 'disabled' | 'auto'
}

interface ChatCompletionRequest {
  model: string
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
  thinking?: ThinkingConfig
}

interface ChatCompletionResponse {
  id: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface AIConfig {
  apiKey: string
  baseURL: string
  model: string
}

export class GLMClient {
  private config: AIConfig

  constructor(config: AIConfig) {
    this.config = config
  }

  /**
   * 调用 GLM Chat Completions API
   *
   * @param messages - 对话消息数组
   * @param options - 可选配置
   * @param options.temperature - 温度参数 (0-1)，默认 0.7
   * @param options.maxTokens - 最大输出 tokens，默认 8192（最大 131072）
   * @param options.thinking - 是否启用思考模式，适合复杂任务
   * @returns Promise<string> - AI 响应内容
   */
  async chat(messages: ChatMessage[], options?: {
    temperature?: number
    maxTokens?: number
    thinking?: boolean
  }): Promise<string> {
    const requestBody: ChatCompletionRequest = {
      model: this.config.model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 8192,
      thinking: options?.thinking
        ? { type: 'enabled' }
        : undefined,
    }

    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`GLM API 请求失败: ${response.status} - ${errorText}`)
      }

      const data: ChatCompletionResponse = await response.json()

      // 返回第一个消息的内容
      return data.choices[0]?.message?.content || ''
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`GLM API 调用错误: ${error.message}`)
      }
      throw new Error('GLM API 调用失败')
    }
  }

  /**
   * 带重试的 chat 方法，自动处理临时网络错误
   *
   * @param messages - 对话消息数组
   * @param options - 可选配置
   * @param options.temperature - 温度参数
   * @param options.maxTokens - 最大输出 tokens
   * @param options.maxRetries - 最大重试次数，默认 3
   * @param options.retryDelay - 初始重试延迟（毫秒），默认 1000
   * @returns Promise<string> - AI 响应内容
   */
  async chatWithRetry(
    messages: ChatMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      maxRetries?: number
      retryDelay?: number
      thinking?: boolean
    }
  ): Promise<string> {
    const maxRetries = options?.maxRetries ?? 3
    const retryDelay = options?.retryDelay ?? 1000

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.chat(messages, options)
      } catch (error) {
        const isLastAttempt = attempt === maxRetries - 1

        if (isLastAttempt) {
          throw error
        }

        // 指数退避
        const delay = retryDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw new Error('重试次数已用尽')
  }

  /**
   * 调用 API 并解析 JSON 响应
   * 支持从 markdown 代码块中提取 JSON
   *
   * @template T - 期望的 JSON 类型
   * @param messages - 对话消息数组
   * @param options - 可选配置
   * @returns Promise<T> - 解析后的 JSON 对象
   *
   * @example
   * ```typescript
   * interface Question {
   *   text: string
   *   options: string[]
   *   answer: number
   * }
   *
   * const questions = await glmClient.chatJSON<Question[]>([
   *   { role: 'user', content: '生成 5 个选择题，返回 JSON 格式' }
   * ])
   * ```
   */
  async chatJSON<T>(messages: ChatMessage[], options?: {
    temperature?: number
    maxTokens?: number
    thinking?: boolean
  }): Promise<T> {
    const content = await this.chatWithRetry(messages, options)

    try {
      // 尝试从 markdown 代码块中提取 JSON
      let jsonContent = content
      const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (codeBlockMatch) {
        jsonContent = codeBlockMatch[1]
      }

      return JSON.parse(jsonContent) as T
    } catch (error) {
      throw new Error(`JSON 解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
}

// 创建默认客户端实例
export const glmClient = new GLMClient({
  apiKey: process.env.GLM_API_KEY || '',
  baseURL: process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4',
  model: process.env.GLM_MODEL || 'glm-4.7-flash',
})

// 验证配置
if (!process.env.GLM_API_KEY) {
  console.warn('警告: GLM_API_KEY 环境变量未设置')
}
