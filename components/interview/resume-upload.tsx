/**
 * 简历上传组件
 * 支持文本粘贴和 PDF 上传
 * 使用预设数据模拟完整的面试流程
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { IconLoader2, IconUpload, IconFileText, IconCircleCheck, IconArrowRight, IconCheck, IconRefresh } from '@tabler/icons-react'
import { PRESET_RESUME_CONTENT } from '@/lib/interview/preset-data'

type UploadStep = 'idle' | 'uploading' | 'analyzing' | 'generating' | 'done'

export function ResumeUpload({ onResumeUploaded }: { onResumeUploaded?: (resumeId: string) => void }) {
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

      // 延迟后跳转到测验页面
      setTimeout(() => {
        router.push(`/interview/quiz/${quizData.quiz.id}`)
      }, 2000)
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

      // 延迟后跳转到测验页面
      setTimeout(() => {
        router.push(`/interview/quiz/${quizData.quiz.id}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
      setStep('idle')
    } finally {
      setLoading(false)
    }
  }

  // 辅助函数
  const getProgress = () => {
    const stepOrder: UploadStep[] = ['uploading', 'analyzing', 'generating', 'done']
    const currentIndex = stepOrder.indexOf(step)
    return ((currentIndex + 1) / stepOrder.length) * 100
  }

  const getStepStatus = (currentStep: UploadStep): string => {
    const stepOrder: UploadStep[] = ['uploading', 'analyzing', 'generating', 'done']
    const currentIndex = stepOrder.indexOf(step)
    const stepIndex = stepOrder.indexOf(currentStep)

    if (stepIndex < currentIndex) {
      return 'text-green-600 font-medium'
    } else if (stepIndex === currentIndex) {
      return 'text-primary font-medium'
    } else {
      return 'text-muted-foreground'
    }
  }

  const getStepIcon = (currentStep: UploadStep): React.ReactNode => {
    const stepOrder: UploadStep[] = ['uploading', 'analyzing', 'generating', 'done']
    const currentIndex = stepOrder.indexOf(step)
    const stepIndex = stepOrder.indexOf(currentStep)

    if (stepIndex < currentIndex) {
      return <IconCheck className="h-4 w-4 text-green-600" />
    } else if (stepIndex === currentIndex) {
      return <IconLoader2 className="h-4 w-4 animate-spin text-primary" />
    } else {
      return null
    }
  }

  const getStepMessage = (): string => {
    switch (step) {
      case 'uploading':
        return '正在上传简历...'
      case 'analyzing':
        return 'AI 正在分析简历，提取技术栈和项目经验...'
      case 'generating':
        return 'AI 正在根据简历生成个性化面试题...'
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
      <CardHeader>
        <CardTitle>上传简历</CardTitle>
        <CardDescription>
          支持文本粘贴或 PDF 上传，AI 将自动分析简历并生成面试题
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'text' | 'file')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" disabled={loading}>
              <IconFileText className="mr-2 h-4 w-4" />
              文本粘贴
            </TabsTrigger>
            <TabsTrigger value="file" disabled={loading}>
              <IconUpload className="mr-2 h-4 w-4" />
              PDF 上传
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="resume-text">简历内容</Label>
                {!loading && textContent !== PRESET_RESUME_CONTENT && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-7 text-xs"
                  >
                    <IconRefresh className="mr-1 h-3 w-3" />
                    恢复示例
                  </Button>
                )}
              </div>
              <Textarea
                id="resume-text"
                placeholder="粘贴简历内容..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={12}
                className="resize-none"
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                至少需要 50 个字符
              </p>
            </div>
            <Button onClick={handleTextSubmit} disabled={loading || textContent.length < 50} className="w-full">
              {loading ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  上传并分析
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume-file">PDF 文件</Label>
              <Input
                id="resume-file"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                仅支持 PDF 格式，最大 5MB
              </p>
            </div>
            {file && (
              <div className="text-sm text-muted-foreground">
                已选择: {file.name}
              </div>
            )}
            <Button onClick={handleFileSubmit} disabled={loading || !file} className="w-full">
              {loading ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  上传并分析
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {/* 进度指示器 */}
        {loading && (
          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={getStepStatus('uploading')}>上传简历</span>
                {getStepIcon('uploading')}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={getStepStatus('analyzing')}>AI 分析简历</span>
                {getStepIcon('analyzing')}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={getStepStatus('generating')}>生成面试题</span>
                {getStepIcon('generating')}
              </div>
            </div>
            {getStepMessage() && (
              <p className="text-xs text-muted-foreground text-center">
                {getStepMessage()}
              </p>
            )}
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        )}

        {/* 分析结果显示 */}
        {analysisResult && step === 'done' && (
          <div className="mt-4 rounded-md bg-green-500/10 border border-green-500/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-green-700">
              <IconCircleCheck className="h-5 w-5" />
              <span className="font-medium">分析完成！正在跳转...</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">技术栈：</span>
                <div className="flex flex-wrap gap-1">
                  {analysisResult.techStack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-green-500/20 text-green-700 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {analysisResult.techStack.length > 5 && (
                    <span className="text-muted-foreground text-xs">
                      +{analysisResult.techStack.length - 5}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">级别：</span>
                <span className="font-medium">{getLevelText(analysisResult.level)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">重点：</span>
                <span className="text-xs text-muted-foreground">
                  {analysisResult.focusAreas.slice(0, 3).join('、')}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
