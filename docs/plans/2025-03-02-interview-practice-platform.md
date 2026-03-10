# 面试练习平台实现计划

## 概述

将现有的 Next.js 任务管理应用 (azo-taskflow) 转换为一个综合的 AI 驱动面试练习平台。该平台将分析简历、生成针对性的面试题、评估用户答案,并通过错题本功能跟踪进度。实现将利用 GLM-4.7-Flash AI 进行智能题目生成和答案评估。

## 功能需求总结

1. **简历上传与分析**: 支持文本粘贴和 PDF 上传,提取技术栈和项目经验
2. **AI 题目生成**: 30 道题 (15 道客观题 + 15 道主观题),由浅入深
3. **答题界面**: 显示所有题目,TanStack Form 表单处理
4. **AI 评估与打分**: 评估主观题答案,提供反馈
5. **错题本**: 记录错题,专项练习,改进跟踪
6. **统计分析**: 答题历史,正确率趋势,薄弱环节分析

## 架构变更

### 新增数据库模型
- **文件**: `/Users/azo/Workspace/azo-taskflow/prisma/schema.prisma`
- 添加 Resume, Quiz, Question, Answer, Mistake 模型

### 新增目录
- `/Users/azo/Workspace/azo-taskflow/app/interview/` - 面试练习页面
- `/Users/azo/Workspace/azo-taskflow/app/api/resume/` - 简历 API 路由
- `/Users/azo/Workspace/azo-taskflow/app/api/quiz/` - 测验 API 路由
- `/Users/azo/Workspace/azo-taskflow/app/api/mistakes/` - 错题本 API 路由
- `/Users/azo/Workspace/azo-taskflow/components/interview/` - 面试专用组件
- `/Users/azo/Workspace/azo-taskflow/lib/ai/` - AI 服务集成
- `/Users/azo/Workspace/azo-taskflow/lib/pdf/` - PDF 解析工具

---

## 数据库 Schema 设计

### Prisma Schema 更新

**文件**: `/Users/azo/Workspace/azo-taskflow/prisma/schema.prisma`

在现有 Goal 模型后添加以下模型:

```prisma
// Enums for Interview Practice
enum ResumeSource {
  TEXT_PASTE
  PDF_UPLOAD
}

enum QuestionType {
  OBJECTIVE  // Multiple choice, single answer
  SUBJECTIVE // Text answer requiring AI evaluation
}

enum QuizStatus {
  DRAFT
  IN_PROGRESS
  COMPLETED
}

enum DifficultyLevel {
  EASY
  MEDIUM
  HARD
}

// Resume model - stores user resume data
model Resume {
  id          String       @id @default(cuid())
  userId      String?      // Optional for future multi-user support
  source      ResumeSource
  content     String       @db.Text // Raw text content
  filePath    String?      // For uploaded PDFs

  // AI-extracted data
  techStack   String[]     @default([])
  projects    Json?        // Structured project data

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  quizzes     Quiz[]

  @@index([userId])
  @@index([createdAt])
}

// Quiz model - represents a complete quiz session
model Quiz {
  id          String       @id @default(cuid())
  resumeId    String
  resume      Resume       @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  userId      String?      // Optional for future multi-user support

  status      QuizStatus   @default(DRAFT)
  score       Int?         // Final score (0-100)

  startedAt   DateTime?
  completedAt DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  questions   Question[]
  mistakes    Mistake[]

  @@index([resumeId])
  @@index([userId])
  @@index([status])
}

// Question model - individual questions within a quiz
model Question {
  id              String         @id @default(cuid())
  quizId          String
  quiz            Quiz           @relation(fields: [quizId], references: [id], onDelete: Cascade)

  type            QuestionType
  difficulty      DifficultyLevel
  order           Int            // Question order (1-30)

  // Question content
  text            String         @db.Text
  options         Json?          // For objective questions: [{id, text}]
  correctAnswer   String?        // For objective questions
  explanation     String?        @db.Text // AI-generated explanation

  // User's answer
  userAnswer      String?        @db.Text
  isCorrect       Boolean?

  // AI evaluation (for subjective questions)
  aiEvaluation    Json?          // {score: number, feedback: string, corrections: string[]}

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  mistakes        Mistake[]

  @@index([quizId])
  @@index([type])
  @@index([difficulty])
}

// Mistake model - tracks wrong answers for focused practice
model Mistake {
  id              String         @id @default(cuid())
  quizId          String
  quiz            Quiz           @relation(fields: [quizId], references: [id], onDelete: Cascade)
  questionId      String
  question        Question       @relation(fields: [questionId], references: [id], onDelete: Cascade)

  // Track mastery
  timesAttempted  Int            @default(1)
  timesCorrect    Int            @default(0)
  masteredAt      DateTime?

  // Snapshot of the question when mistake was recorded
  questionSnapshot Json          // Preserves question state

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([quizId])
  @@index([questionId])
  @@index([masteredAt])
}
```

---

## 实施步骤

### 第一阶段: 基础设置

#### 步骤 1.1: 安装额外依赖
**文件**: `/Users/azo/Workspace/azo-taskflow/package.json`
- **操作**: 添加 PDF 解析库和 AI SDK
- **依赖**:
  - `pdf-parse` - PDF 文本提取
  - `openai` - GLM-4.7-Flash 的 OpenAI 兼容客户端
- **原因**: 需要 PDF 解析用于简历上传,AI 客户端用于 GLM 集成
- **依赖**: 无
- **风险**: 低

```bash
pnpm add pdf-parse openai
pnpm add -D @types/pdf-parse
```

#### 步骤 1.2: 更新数据库 Schema
**文件**: `/Users/azo/Workspace/azo-taskflow/prisma/schema.prisma`
- **操作**: 添加新模型 (Resume, Quiz, Question, Mistake) 和枚举
- **原因**: 所有面试练习功能的基础
- **依赖**: 步骤 1.1
- **风险**: 中 - Schema 变更需要迁移

#### 步骤 1.3: 创建并运行迁移
**操作**: 生成并应用 Prisma 迁移
- **原因**: 更新数据库结构
- **依赖**: 步骤 1.2
- **风险**: 中 - 运行前备份数据库

```bash
npx prisma migrate dev --name add_interview_practice_tables
```

#### 步骤 1.4: 更新导航
**文件**: `/Users/azo/Workspace/azo-taskflow/components/layout/aside.tsx`
- **操作**: 添加面试练习导航项
- **原因**: 用户访问新功能
- **依赖**: 无
- **风险**: 低

```typescript
const navItems = [
  { href: '/', label: '仪表板' },
  { href: '/interview', label: '面试练习' },
  { href: '/interview/mistakes', label: '错题本' },
  { href: '/interview/statistics', label: '统计分析' },
] as const
```

#### 步骤 1.5: 配置环境变量
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/.env.example`
- **操作**: 添加 GLM API 配置模板
- **原因**: 记录所需的环境变量
- **依赖**: 无
- **风险**: 低

```env
# GLM AI Configuration
GLM_API_KEY=your_api_key_here
GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
GLM_MODEL=glm-4-flash
```

---

### 第二阶段: AI 服务集成

#### 步骤 2.1: 创建 AI 客户端工具
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/lib/ai/client.ts`
- **操作**: 创建 GLM-4.7-Flash 客户端包装器
- **原因**: 集中的 AI API 通信
- **依赖**: 步骤 1.1, 步骤 1.5
- **风险**: 中 - API 集成

```typescript
// Structure
interface AIConfig {
  apiKey: string
  baseURL: string
  model: string
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
  }
}

export class GLMClient {
  constructor(config: AIConfig)

  chat(messages: ChatMessage[], options?: {
    temperature?: number
    maxTokens?: number
  }): Promise<AIResponse>

  // Helper methods for specific use cases
  analyzeResume(content: string): Promise<ResumeAnalysis>
  generateQuestions(resume: ResumeAnalysis): Promise<Question[]>
  evaluateAnswers(questions: Question[], answers: Answer[]): Promise<Evaluation>
}

export const glmClient = new GLMClient({
  apiKey: process.env.GLM_API_KEY!,
  baseURL: process.env.GLM_BASE_URL!,
  model: process.env.GLM_MODEL || 'glm-4-flash'
})
```

#### 步骤 2.2: 创建简历分析提示模板
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/lib/ai/prompts/resume-analysis.ts`
- **操作**: 定义简历分析的结构化提示
- **原因**: 确保一致、高质量的 AI 响应
- **依赖**: 步骤 2.1
- **风险**: 低

#### 步骤 2.3: 创建题目生成提示
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/lib/ai/prompts/question-generation.ts`
- **操作**: 定义生成题目的提示
- **原因**: 控制题目质量和进度
- **依赖**: 步骤 2.2
- **风险**: 中 - 对用户体验至关重要

#### 步骤 2.4: 创建答案评估提示
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/lib/ai/prompts/answer-evaluation.ts`
- **操作**: 定义评估主观题答案的提示
- **原因**: 提供准确的评分和有用的反馈
- **依赖**: 步骤 2.3
- **风险**: 中 - 影响评分准确性

---

### 第三阶段: 简历管理

#### 步骤 3.1: 创建 PDF 解析工具
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/lib/pdf/parser.ts`
- **操作**: 实现 PDF 文本提取
- **原因**: 解析上传的 PDF 简历
- **依赖**: 步骤 1.1
- **风险**: 中 - PDF 格式变化

#### 步骤 3.2: 创建简历验证 Schema
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/lib/validations/resume.ts`
- **操作**: 定义简历操作的 Zod schema
- **原因**: 输入验证和类型安全
- **依赖**: 无
- **风险**: 低

#### 步骤 3.3: 创建简历 API 路由 - 上传
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/api/resume/upload/route.ts`
- **操作**: 处理 PDF 上传和文本粘贴
- **原因**: 简历数据输入端点
- **依赖**: 步骤 3.1, 步骤 3.2
- **风险**: 中 - 文件处理

#### 步骤 3.4: 创建简历 API 路由 - 分析
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/api/resume/analyze/route.ts`
- **操作**: 触发 AI 分析简历
- **原因**: 提取技术栈和项目经验
- **依赖**: 步骤 2.1, 步骤 2.2
- **风险**: 中 - AI API 可靠性

#### 步骤 3.5: 创建简历列表 API
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/api/resume/route.ts`
- **操作**: GET 简历列表, DELETE 简历
- **原因**: 简历管理
- **依赖**: 步骤 3.3
- **风险**: 低

---

### 第四阶段: 测验管理

#### 步骤 4.1: 创建测验验证 Schema
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/lib/validations/quiz.ts`
- **操作**: 定义测验操作的 Zod schema
- **原因**: 输入验证
- **依赖**: 无
- **风险**: 低

#### 步骤 4.2: 创建测验生成 API
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/api/quiz/generate/route.ts`
- **操作**: 使用 AI 生成 30 道题
- **原因**: 核心题目生成功能
- **依赖**: 步骤 2.1, 步骤 2.3, 步骤 4.1
- **风险**: 高 - AI 生成内容质量

#### 步骤 4.3: 创建测验提交 API
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/api/quiz/submit/route.ts`
- **操作**: 提交答案,触发 AI 评估
- **原因**: 完成测验流程
- **依赖**: 步骤 2.1, 步骤 2.4, 步骤 4.1
- **风险**: 高 - 评分准确性至关重要

#### 步骤 4.4: 创建测验详情/状态 API
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/api/quiz/[id]/route.ts`
- **操作**: GET 测验详情, DELETE 测验
- **原因**: 测验管理
- **依赖**: 步骤 4.2
- **风险**: 低

---

### 第五阶段: 错题本

#### 步骤 5.1: 创建错题 API 路由
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/api/mistakes/route.ts`
- **操作**: GET 所有错题,按掌握状态过滤
- **原因**: 查看错题用于练习
- **依赖**: 第四阶段完成
- **风险**: 低

#### 步骤 5.2: 创建错题练习 API
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/api/mistakes/practice/route.ts`
- **操作**: 从错题生成练习测验
- **原因**: 专项练习薄弱环节
- **依赖**: 步骤 5.1
- **风险**: 中

#### 步骤 5.3: 创建错题更新 API
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/api/mistakes/[id]/route.ts`
- **操作**: 更新错题掌握状态
- **原因**: 跟踪改进
- **依赖**: 步骤 5.1
- **风险**: 低

---

### 第六阶段: 统计仪表板

#### 步骤 6.1: 创建统计 API
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/api/statistics/route.ts`
- **操作**: 计算测验历史、正确率、薄弱环节
- **原因**: 统计仪表板数据
- **依赖**: 所有前面的阶段
- **风险**: 低

---

### 第七阶段: 前端组件

#### 步骤 7.1: 创建简历上传组件
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/components/interview/resume-upload.tsx`
- **操作**: 文本粘贴和 PDF 上传组件
- **原因**: 简历输入 UI
- **依赖**: 步骤 3.3
- **风险**: 低

#### 步骤 7.2: 创建测验界面组件
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/components/interview/quiz-interface.tsx`
- **操作**: 使用 TanStack Form 显示所有 30 道题
- **原因**: 主要答题 UI
- **依赖**: 步骤 4.2, 步骤 4.4
- **风险**: 中 - 复杂的表单处理

#### 步骤 7.3: 创建测验结果组件
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/components/interview/quiz-result.tsx`
- **操作**: 显示分数、反馈、纠正
- **原因**: 测验后反馈 UI
- **依赖**: 步骤 4.3
- **风险**: 低

#### 步骤 7.4: 创建错题本组件
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/components/interview/mistake-notebook.tsx`
- **操作**: 显示错题并提供练习选项
- **原因**: 错题复习 UI
- **依赖**: 步骤 5.1
- **风险**: 低

#### 步骤 7.5: 创建统计仪表板组件
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/components/interview/statistics-dashboard.tsx`
- **操作**: 显示图表和趋势
- **原因**: 可视化统计
- **依赖**: 步骤 6.1, Recharts (已安装)
- **风险**: 低

---

### 第八阶段: 页面

#### 步骤 8.1: 创建面试首页
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/interview/page.tsx`
- **操作**: 面试练习主要入口点
- **原因**: 面试功能的中心枢纽
- **依赖**: 步骤 7.1, 步骤 7.2
- **风险**: 低

#### 步骤 8.2: 创建测验页面
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/interview/quiz/[id]/page.tsx`
- **操作**: 单个测验页面
- **原因**: 参加和查看测验
- **依赖**: 步骤 7.2, 步骤 7.3
- **风险**: 低

#### 步骤 8.3: 创建错题页面
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/interview/mistakes/page.tsx`
- **操作**: 错题本页面
- **原因**: 查看和练习错题
- **依赖**: 步骤 7.4
- **风险**: 低

#### 步骤 8.4: 创建统计页面
**文件**: 创建 `/Users/azo/Workspace/azo-taskflow/app/interview/statistics/page.tsx`
- **操作**: 统计仪表板页面
- **原因**: 查看进度和分析
- **依赖**: 步骤 7.5
- **风险**: 低

---

## 测试策略

### 单元测试
- **AI 客户端**: `/Users/azo/Workspace/azo-taskflow/lib/ai/__tests__/client.test.ts`
- **PDF 解析器**: `/Users/azo/Workspace/azo-taskflow/lib/pdf/__tests__/parser.test.ts`
- **验证**: `lib/validations/__tests__/` 中的所有验证 schema
- **工具**: `/Users/azo/Workspace/azo-taskflow/lib/__tests__/utils.test.ts`

### 集成测试
- **API 路由**: 使用模拟 AI 响应测试所有 API 端点
- **数据库操作**: 测试所有新模型的 CRUD 操作
- **AI 集成**: 测试提示生成和响应解析

### E2E 测试
- **简历上传流程**: 上传简历 -> 查看分析 -> 生成测验
- **答题流程**: 开始测验 -> 回答问题 -> 提交 -> 查看结果
- **错题练习流程**: 查看错题 -> 练习测验 -> 标记已掌握
- **统计查看**: 查看仪表板 -> 验证图表数据

---

## 风险与缓解措施

| 风险 | 严重程度 | 缓解措施 |
|------|----------|------------|
| **GLM API 速率限制** | 高 | 实现请求队列、缓存和带指数退避的重试逻辑 |
| **AI 响应格式不一致** | 高 | 添加严格的 AI 响应 Zod 验证和回退错误处理 |
| **PDF 解析失败** | 中 | 支持多个 PDF 解析器,提供文本粘贴作为后备 |
| **主观题评分准确性** | 高 | 使用样本答案校准提示,允许手动调整分数 |
| **数据库迁移问题** | 中 | 在 staging 上测试迁移,创建回滚计划 |
| **TanStack Form 学习曲线** | 低 | 遵循官方文档,从简单的表单开始 |
| **文件上传存储** | 中 | 最初使用本地存储,设计 S3 迁移 |
| **题目生成时间** | 中 | 显示加载状态,如需要实现流式响应 |

---

## 成功标准

- [ ] 用户可以通过文本粘贴或 PDF 上传简历
- [ ] AI 准确地从简历中提取技术栈和项目
- [ ] 系统生成 30 道题 (15 道客观题 + 15 道主观题)
- [ ] 题目由易到难排列
- [ ] 用户可以使用 TanStack Form 完成测验
- [ ] AI 评估主观题答案并提供有意义的反馈
- [ ] 最终分数计算准确
- [ ] 错题记录在错题本中
- [ ] 用户可以专门练习错题
- [ ] 统计仪表板显示测验历史和趋势
- [ ] 根据错题识别薄弱环节
- [ ] 数据库 schema 支持未来的多用户扩展
- [ ] 所有 API 路由都有适当的错误处理
- [ ] 测试覆盖率超过 80%
- [ ] UI 响应式且可访问

---

## 估计复杂度

| 阶段 | 估计时间 | 复杂度 |
|-------|----------|------------|
| 第一阶段: 基础设置 | 4-6 小时 | 低 |
| 第二阶段: AI 服务集成 | 8-12 小时 | 中 |
| 第三阶段: 简历管理 | 6-8 小时 | 中 |
| 第四阶段: 测验管理 | 12-16 小时 | 高 |
| 第五阶段: 错题本 | 6-8 小时 | 中 |
| 第六阶段: 统计仪表板 | 4-6 小时 | 低 |
| 第七阶段: 前端组件 | 16-20 小时 | 中 |
| 第八阶段: 页面 | 4-6 小时 | 低 |
| 测试与优化 | 8-12 小时 | 中 |
| **总计** | **68-94 小时** | **中-高** |

---

## 其他考虑

### 未来多用户扩展
Schema 包含 `userId` 字段(可选)以准备未来的身份验证。添加 auth 时:
1. 添加带有身份验证字段的 `User` 模型
2. 使 `userId` 必需(非 null)
3. 添加行级安全或按用户过滤查询
4. 添加用户特定的 API 速率限制

### 性能优化
1. 在适当的地方缓存 AI 响应
2. 为错题本实现分页
3. 对常见查询使用数据库索引
4. 考虑初始页面加载的服务器端渲染

### UI/UX 增强
1. 在 AI 处理期间添加进度指示器
2. 实现问题导航(跳转到特定问题)
3. 添加暗黑模式支持
4. 包括测验导航的键盘快捷键
