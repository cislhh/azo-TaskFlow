/**
 * PDF 解析工具
 */

import { PDFParse } from 'pdf-parse'

export interface PDFParseResult {
  text: string
  pages: number
  metadata?: Record<string, unknown>
}

export class PDFParserError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message)
    this.name = 'PDFParserError'
  }
}

/**
 * 解析 PDF 缓冲区
 */
export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  try {
    const pdfParse = new PDFParse({ data: buffer })
    const textResult = await pdfParse.getText()
    const info = await pdfParse.getInfo()

    return {
      text: textResult.text,
      pages: info.total,
      metadata: info.info ? {
        title: info.info.Title,
        author: info.info.Author,
        subject: info.info.Subject,
        creator: info.info.Creator,
        producer: info.info.Producer,
        creationDate: info.info.CreationDate,
        modificationDate: info.info.ModDate,
      } : undefined,
    }
  } catch (error) {
    throw new PDFParserError(
      `PDF 解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
      error
    )
  }
}

/**
 * 从 File 对象提取文本
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  // 验证文件类型
  if (file.type !== 'application/pdf') {
    throw new PDFParserError(`不支持的文件类型: ${file.type}，仅支持 PDF 格式`)
  }

  // 验证文件大小（5MB 限制）
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new PDFParserError(`文件过大: ${file.size} 字节，最大支持 ${maxSize} 字节`)
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await parsePDF(buffer)
    return result.text
  } catch (error) {
    if (error instanceof PDFParserError) {
      throw error
    }
    throw new PDFParserError(
      `文件处理失败: ${error instanceof Error ? error.message : '未知错误'}`,
      error
    )
  }
}

/**
 * 清理提取的文本
 */
export function cleanExtractedText(text: string): string {
  return text
    // 移除多余的空白行
    .replace(/\n{3,}/g, '\n\n')
    // 移除行首行尾空白
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // 移除首尾空白
    .trim()
}
