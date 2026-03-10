/**
 * 简历面板组件 - 左侧
 * 优化布局：顶部对齐，一屏高度，内容可滚动
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { IconLoader2, IconUpload, IconFileText, IconCheck, IconRefresh } from '@tabler/icons-react'
import { PRESET_RESUME_CONTENT } from '@/lib/interview/preset-data'

type UploadStep = 'idle' | 'uploading' | 'analyzing' | 'generating' | 'done'

export function ResumePanel() {
  const router = useRouter()
  const [mode, setMode] = useState<'text' | 'file'>('text')
  const [textContent, setTextContent] = useState(PRESET_RESUME_CONTENT)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<UploadStep>('idle')
  const [error, setError] = useState<string | null>(null)
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

      setAnalysisResult({
        techStack: analyzeData.analysis.techStack,
        level: analyzeData.analysis.level,
        focusAreas: analyzeData.analysis.focusAreas,
      })

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

  return (
    <div className="flex flex-col h-full gap-4">
      {/* 上传区域 - 固定高度 */}
      <Card className="shrink-0 shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-base text-slate-900 leading-tight">上传简历</h3>
              <p className="text-xs text-slate-500 mt-1">AI 将生成针对性面试题</p>
            </div>
            {!loading && textContent !== PRESET_RESUME_CONTENT && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTextContent(PRESET_RESUME_CONTENT)
                  setAnalysisResult(null)
                  setError(null)
                }}
                className="h-7 text-xs px-2 hover:bg-slate-100 transition-colors"
              >
                <IconRefresh className="mr-1 h-3.5 w-3.5" />
                恢复示例
              </Button>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <IconLoader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span className="text-sm">
                  {step === 'uploading' && '正在上传简历...'}
                  {step === 'analyzing' && 'AI 正在分析简历...'}
                  {step === 'generating' && 'AI 正在生成面试题...'}
                  {step === 'done' && '完成！'}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500 ease-out"
                  style={{
                    width: step === 'uploading' ? '33%' :
                           step === 'analyzing' ? '66%' :
                           step === 'generating' ? '100%' : '0%'
                  }}
                />
              </div>
            </div>
          ) : analysisResult && step === 'done' ? (
            <div className="rounded-xl bg-green-50 border border-green-200 p-3 space-y-2">
              <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                <IconCheck className="h-5 w-5" />
                <span>分析完成！正在跳转...</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 text-xs">级别：</span>
                  <span className="font-semibold text-slate-900 text-xs">{getLevelText(analysisResult.level)}</span>
                </div>
                <div className="flex items-start gap-2 flex-wrap">
                  <span className="text-slate-600 text-xs">技术栈：</span>
                  <div className="flex flex-wrap gap-1">
                    {analysisResult.techStack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                        {tech}
                      </Badge>
                    ))}
                    {analysisResult.techStack.length > 4 && (
                      <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-slate-200">
                        +{analysisResult.techStack.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Tabs value={mode} onValueChange={(v) => setMode(v as 'text' | 'file')}>
              <TabsList className="grid w-full grid-cols-2 h-8 bg-slate-100 p-1">
                <TabsTrigger
                  value="text"
                  disabled={loading}
                  className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <IconFileText className="mr-1.5 h-3.5 w-3.5" />
                  文本粘贴
                </TabsTrigger>
                <TabsTrigger
                  value="file"
                  disabled={loading}
                  className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <IconUpload className="mr-1.5 h-3.5 w-3.5" />
                  PDF 上传
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-2 mt-2">
                <Textarea
                  placeholder="粘贴简历内容..."
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={4}
                  className="resize-none text-xs border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors max-h-[80px]"
                  disabled={loading}
                />
                <Button
                  onClick={handleTextSubmit}
                  disabled={loading || textContent.length < 50}
                  className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                >
                  上传并分析
                </Button>
              </TabsContent>

              <TabsContent value="file" className="space-y-2 mt-2">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={loading}
                  className="text-xs h-8 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                />
                {file && (
                  <div className="text-sm text-slate-600 flex items-center gap-1.5">
                    <IconCheck className="h-3.5 w-3.5 text-green-500" />
                    <span className="truncate text-xs">{file.name}</span>
                  </div>
                )}
                <Button
                  onClick={handleTextSubmit}
                  disabled={loading || !file}
                  className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                >
                  上传并分析
                </Button>
              </TabsContent>
            </Tabs>
          )}

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-2.5 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </Card>

      {/* 简历内容展示 - 占据剩余空间，完整框架可见 */}
      <Card className="flex-1 min-h-0 overflow-hidden flex flex-col shadow-md">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <h3 className="font-semibold text-sm text-slate-900">简历内容</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
          {textContent || '暂无简历内容，请先上传简历'}
        </div>
      </Card>
    </div>
  )
}
