/**
 * 简历上传组件 - 紧凑版本
 * 用于测验页面左侧
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IconLoader2, IconUpload, IconFileText, IconCircleCheck, IconArrowRight, IconRefresh } from '@tabler/icons-react'
import { PRESET_RESUME_CONTENT } from '@/lib/interview/preset-data'

type UploadStep = 'idle' | 'uploading' | 'analyzing' | 'generating' | 'done'

interface ResumeUploadCompactProps {
  onResumeUploaded?: (resumeId: string) => void
}

export function ResumeUploadCompact({ onResumeUploaded }: ResumeUploadCompactProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'text' | 'file'>('text')
  const [textContent, setTextContent] = useState(PRESET_RESUME_CONTENT)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<UploadStep>('idle')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{
    techStack: string[]
    level: string
    focusAreas: string[]
  } | null>(null)

  const handleTextSubmit = async () => {
    if (textContent.length < 50) {
      setError('简历内容至少需要50个字符')
      return
    }

    setLoading(true)
    setError(null)
    setStep('uploading')

    try {
      // 步骤 1: 上传简历
      const formData = new FormData()
      formData.append('text', textContent)

      const uploadResponse = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || '上传失败')
      }

      const resumeId = uploadData.resume.id
      setTextContent('')

      // 步骤 2: 分析简历（模拟 4-6 秒）
      setStep('analyzing')
      await new Promise(resolve => setTimeout(resolve, 4000 + Math.random() * 2000))

      const analyzeResponse = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      })

      const analyzeData = await analyzeResponse.json()

      if (!analyzeResponse.ok) {
        throw new Error(analyzeData.error || '分析失败')
      }

      // 保存分析结果
      setAnalysisResult({
        techStack: analyzeData.analysis.techStack,
        level: analyzeData.analysis.level,
        focusAreas: analyzeData.analysis.focusAreas,
      })

      // 步骤 3: 生成测验（模拟 5-7 秒）
      setStep('generating')
      await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 2000))

      const quizResponse = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      })

      const quizData = await quizResponse.json()

      if (!quizResponse.ok) {
        throw new Error(quizData.error || '生成测验失败')
      }

      setStep('done')
      setSuccess(true)

      // 刷新页面
      setTimeout(() => {
        router.push(`/interview/quiz/${quizData.quiz.id}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
      setStep('idle')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSubmit = async () => {
    if (!file) {
      setError('请选择文件')
      return
    }

    setLoading(true)
    setError(null)
    setStep('uploading')

    try {
      // 步骤 1: 上传简历
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || '上传失败')
      }

      const resumeId = uploadData.resume.id
      setFile(null)

      // 步骤 2: 分析简历（模拟 4-6 秒）
      setStep('analyzing')
      await new Promise(resolve => setTimeout(resolve, 4000 + Math.random() * 2000))

      const analyzeResponse = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      })

      const analyzeData = await analyzeResponse.json()

      if (!analyzeResponse.ok) {
        throw new Error(analyzeData.error || '分析失败')
      }

      // 保存分析结果
      setAnalysisResult({
        techStack: analyzeData.analysis.techStack,
        level: analyzeData.analysis.level,
        focusAreas: analyzeData.analysis.focusAreas,
      })

      // 步骤 3: 生成测验（模拟 5-7 秒）
      setStep('generating')
      await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 2000))

      const quizResponse = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      })

      const quizData = await quizResponse.json()

      if (!quizResponse.ok) {
        throw new Error(quizData.error || '生成测验失败')
      }

      setStep('done')
      setSuccess(true)

      // 刷新页面
      setTimeout(() => {
        router.push(`/interview/quiz/${quizData.quiz.id}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
      setStep('idle')
    } finally {
      setLoading(false)
    }
  }

  const getStepMessage = (): string => {
    switch (step) {
      case 'uploading':
        return '正在上传简历...'
      case 'analyzing':
        return 'AI 正在分析简历...'
      case 'generating':
        return 'AI 正在生成面试题...'
      case 'done':
        return '完成！'
      default:
        return ''
    }
  }

  const getLevelText = (level: string): string => {
    const levelMap: Record<string, string> = {
      junior: '初级',
      mid: '中级',
      senior: '高级',
      lead: '专家',
      unknown: '未知',
    }
    return levelMap[level] || level
  }

  const handleReset = () => {
    setTextContent(PRESET_RESUME_CONTENT)
    setStep('idle')
    setSuccess(false)
    setAnalysisResult(null)
    setError(null)
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">上传简历</h3>
          {!loading && textContent !== PRESET_RESUME_CONTENT && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-6 text-xs"
            >
              <IconRefresh className="mr-1 h-3 w-3" />
              恢复
            </Button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <IconLoader2 className="h-3 w-3 animate-spin" />
              <span>{getStepMessage()}</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{
                  width: step === 'uploading' ? '33%' :
                         step === 'analyzing' ? '66%' :
                         step === 'generating' ? '100%' : '0%'
                }}
              />
            </div>
          </div>
        ) : analysisResult && step === 'done' ? (
          <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3 space-y-2">
            <div className="flex items-center gap-1 text-green-700 text-xs font-medium">
              <IconCircleCheck className="h-3.5 w-3.5" />
              <span>分析完成！</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-muted-foreground">级别：</span>
                <span className="font-medium">{getLevelText(analysisResult.level)}</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-muted-foreground">技术栈：</span>
                <div className="flex flex-wrap gap-1">
                  {analysisResult.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 bg-green-500/20 text-green-700 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {analysisResult.techStack.length > 4 && (
                    <span className="text-muted-foreground text-xs">
                      +{analysisResult.techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'text' | 'file')}>
            <TabsList className="grid w-full grid-cols-2 h-7">
              <TabsTrigger value="text" disabled={loading} className="text-xs">
                <IconFileText className="mr-1 h-3 w-3" />
                文本
              </TabsTrigger>
              <TabsTrigger value="file" disabled={loading} className="text-xs">
                <IconUpload className="mr-1 h-3 w-3" />
                PDF
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-3 mt-3">
              <Textarea
                placeholder="粘贴简历内容..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={6}
                className="resize-none text-xs"
                disabled={loading}
              />
              <Button
                onClick={handleTextSubmit}
                disabled={loading || textContent.length < 50}
                className="w-full h-8 text-xs"
              >
                上传并分析
                <IconArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </TabsContent>

            <TabsContent value="file" className="space-y-3 mt-3">
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading}
                className="text-xs h-8"
              />
              {file && (
                <div className="text-xs text-muted-foreground truncate">
                  已选择: {file.name}
                </div>
              )}
              <Button
                onClick={handleFileSubmit}
                disabled={loading || !file}
                className="w-full h-8 text-xs"
              >
                上传并分析
                <IconArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </TabsContent>
          </Tabs>
        )}

        {error && (
          <div className="mt-3 rounded-md bg-destructive/15 p-2 text-xs text-destructive">
            {error}
          </div>
        )}
      </div>
    </Card>
  )
}
