/**
 * 面试功能假数据种子脚本
 * 生成预设的简历、面试题、测验记录等假数据
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL ?? 'postgresql://azo@localhost:5432/taskflow'
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// 预设的前端简历内容
const FRONTEND_RESUME = `张三
前端开发工程师 | 3年经验
邮箱：zhangsan@example.com | 电话：138-0000-0000

专业技能
• 核心技术：HTML5、CSS3、JavaScript (ES6+)、TypeScript
• 框架：React 18、Next.js 14、Vue 3
• 状态管理：Redux Toolkit、Zustand、Pinia
• 样式方案：Tailwind CSS、CSS Modules、Sass
• 工程化：Webpack、Vite、ESLint、Prettier
• 测试：Vitest、Jest、React Testing Library
• 版本控制：Git、GitHub Actions

工作经历

ABC科技有限公司 | 前端开发工程师 | 2022.03 - 至今
• 负责 SaaS 管理平台的前端开发，使用 React + TypeScript + Ant Design
• 实现了复杂的数据可视化模块，性能提升 40%
• 搭建组件库和设计系统，提高团队开发效率 30%
• 优化首屏加载时间，从 3.5s 降低到 1.2s

XYZ 互联网公司 | 前端开发工程师 | 2021.07 - 2022.02
• 开发电商小程序，使用 Uni-app 框架
• 实现购物车、订单管理、支付等功能
• 处理兼容性问题，支持多端运行

项目经验

企业级后台管理系统 (2023.01 - 2023.06)
技术栈：Next.js 14、TypeScript、Tailwind CSS、Prisma、PostgreSQL
• 实现了 RBAC 权限管理系统
• 开发了通用的表单组件库
• 集成了 WebSocket 实时通知功能
• 部署在 Vercel，实现了 CI/CD 自动化

数据可视化大屏 (2022.09 - 2022.12)
技术栈：React 18、ECharts、D3.js、WebSocket
• 实现了实时数据展示和动态图表
• 优化了大量数据渲染性能，使用虚拟滚动
• 响应式设计，支持多种屏幕尺寸

教育背景
XX 大学 | 软件工程 | 本科 | 2018.09 - 2022.06
• 主修课程：数据结构、算法、计算机网络、操作系统
• 获得过校级奖学金
`

// 预设的面试题目（30道）
const PRESET_QUESTIONS = [
  // 客观题（20道）
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'EASY' as const,
    text: '以下哪个不是 JavaScript 的基本数据类型？',
    options: [
      { id: 'a', text: 'String' },
      { id: 'b', text: 'Number' },
      { id: 'c', text: 'Array' },
      { id: 'd', text: 'Boolean' },
    ],
    correctAnswer: 'c',
    explanation: 'JavaScript 的基本数据类型有：String、Number、Boolean、Null、Undefined、Symbol、BigInt。Array 是引用类型（对象）。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'EASY' as const,
    text: 'React 中，哪个 Hook 用于管理组件状态？',
    options: [
      { id: 'a', text: 'useEffect' },
      { id: 'b', text: 'useState' },
      { id: 'c', text: 'useContext' },
      { id: 'd', text: 'useMemo' },
    ],
    correctAnswer: 'b',
    explanation: 'useState 是 React 提供的用于在函数组件中添加状态的 Hook。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: '以下关于 TypeScript 的描述，哪项是错误的？',
    options: [
      { id: 'a', text: 'TypeScript 是 JavaScript 的超集' },
      { id: 'b', text: 'TypeScript 代码需要编译成 JavaScript 才能运行' },
      { id: 'c', text: 'TypeScript 在运行时进行类型检查' },
      { id: 'd', text: 'TypeScript 支持接口和类型别名' },
    ],
    correctAnswer: 'c',
    explanation: 'TypeScript 在编译时进行类型检查，而不是运行时。编译后的 JavaScript 代码不再包含类型信息。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'EASY' as const,
    text: 'CSS 中，flexbox 的哪个属性用于定义主轴方向？',
    options: [
      { id: 'a', text: 'justify-content' },
      { id: 'b', text: 'align-items' },
      { id: 'c', text: 'flex-direction' },
      { id: 'd', text: 'flex-wrap' },
    ],
    correctAnswer: 'c',
    explanation: 'flex-direction 属性决定主轴的方向（row | row-reverse | column | column-reverse）。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: '以下哪个方法可以改变数组本身？',
    options: [
      { id: 'a', text: 'map()' },
      { id: 'b', text: 'filter()' },
      { id: 'c', text: 'push()' },
      { id: 'd', text: 'slice()' },
    ],
    correctAnswer: 'c',
    explanation: 'push() 会改变原数组。map()、filter()、slice() 都返回新数组，不改变原数组。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: 'React 中，useEffect 的依赖数组为空时，effect 何时执行？',
    options: [
      { id: 'a', text: '每次渲染后' },
      { id: 'b', text: '仅首次渲染后' },
      { id: 'c', text: '组件卸载时' },
      { id: 'd', text: '状态更新时' },
    ],
    correctAnswer: 'b',
    explanation: '当依赖数组为空 [] 时，useEffect 仅在组件首次渲染后执行一次，类似于 componentDidMount。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'EASY' as const,
    text: 'HTML5 中，哪个标签用于定义页面的导航区域？',
    options: [
      { id: 'a', text: '<header>' },
      { id: 'b', text: '<nav>' },
      { id: 'c', text: '<section>' },
      { id: 'd', text: '<article>' },
    ],
    correctAnswer: 'b',
    explanation: '<nav> 标签专门用于定义导航链接的区域。<header> 是头部，<section> 是区块，<article> 是文章内容。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: '以下关于 Promise 的描述，哪项是正确的？',
    options: [
      { id: 'a', text: 'Promise 状态可以从 rejected 变为 pending' },
      { id: 'b', text: 'Promise 状态可以从 fulfilled 变为 pending' },
      { id: 'c', text: 'Promise 一旦 settled 就不可逆' },
      { id: 'd', text: 'Promise 必须有 then 方法' },
    ],
    correctAnswer: 'c',
    explanation: 'Promise 有三种状态：pending、fulfilled、rejected。一旦从 pending 变为 fulfilled 或 rejected，就不可再改变。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'HARD' as const,
    text: 'Next.js 中，getServerSideProps 和 getStaticProps 的主要区别是什么？',
    options: [
      { id: 'a', text: '一个是同步的，一个是异步的' },
      { id: 'b', text: '一个在请求时运行，一个在构建时运行' },
      { id: 'c', text: '一个用于客户端渲染，一个用于服务端渲染' },
      { id: 'd', text: '没有本质区别' },
    ],
    correctAnswer: 'b',
    explanation: 'getServerSideProps 在每次请求时运行（服务端渲染），getStaticProps 在构建时运行（静态生成）。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: 'CSS 中，position: absolute 相对于什么定位？',
    options: [
      { id: 'a', text: '浏览器窗口' },
      { id: 'b', text: '父元素' },
      { id: 'c', text: '最近的非 static 定位祖先元素' },
      { id: 'd', text: '文档流' },
    ],
    correctAnswer: 'c',
    explanation: 'absolute 定位相对于最近的非 static 定位祖先元素。如果没有，则相对于初始包含块（浏览器窗口）。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: 'React 中，key prop 的主要作用是什么？',
    options: [
      { id: 'a', text: '标识组件的唯一性' },
      { id: 'b', text: '用于样式选择器' },
      { id: 'c', text: '帮助 React 识别哪些元素改变了' },
      { id: 'd', text: '用于事件绑定' },
    ],
    correctAnswer: 'c',
    explanation: 'key 帮助 React 识别哪些元素改变了、添加了或删除了，从而优化 diff 算法和渲染性能。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'EASY' as const,
    text: '以下哪个不是 HTTP 请求方法？',
    options: [
      { id: 'a', text: 'GET' },
      { id: 'b', text: 'POST' },
      { id: 'c', text: 'PUSH' },
      { id: 'd', text: 'DELETE' },
    ],
    correctAnswer: 'c',
    explanation: 'HTTP 请求方法包括 GET、POST、PUT、DELETE、PATCH 等，没有 PUSH 方法。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: 'Redux 中，reducer 的特征是什么？',
    options: [
      { id: 'a', text: '可以有副作用' },
      { id: 'b', text: '必须是纯函数' },
      { id: 'c', text: '可以直接修改 state' },
      { id: 'd', text: '可以返回 undefined' },
    ],
    correctAnswer: 'b',
    explanation: 'Reducer 必须是纯函数：相同的输入总是产生相同的输出，没有副作用，不修改参数。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'HARD' as const,
    text: '以下关于浏览器事件循环的描述，哪项是正确的？',
    options: [
      { id: 'a', text: '宏任务优先于微任务执行' },
      { id: 'b', text: '微任务优先于宏任务执行' },
      { id: 'c', text: '宏任务和微任务交替执行' },
      { id: 'd', text: '没有优先级之分' },
    ],
    correctAnswer: 'b',
    explanation: '事件循环中，每个宏任务执行完后，会清空所有微任务，然后再执行下一个宏任务。微任务优先于宏任务。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: 'Tailwind CSS 中，如何设置一个元素的 flex 布局？',
    options: [
      { id: 'a', text: 'flexbox' },
      { id: 'b', text: 'flex' },
      { id: 'c', text: 'display-flex' },
      { id: 'd', text: 'd-flex' },
    ],
    correctAnswer: 'b',
    explanation: 'Tailwind CSS 使用 flex 类名来设置 display: flex。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'EASY' as const,
    text: 'Git 中，哪个命令用于创建新分支？',
    options: [
      { id: 'a', text: 'git checkout' },
      { id: 'b', text: 'git branch' },
      { id: 'c', text: 'git merge' },
      { id: 'd', text: 'git rebase' },
    ],
    correctAnswer: 'b',
    explanation: 'git branch 用于创建新分支。git checkout 用于切换分支，git merge 用于合并分支。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: 'React 中，Context API 的主要用途是什么？',
    options: [
      { id: 'a', text: '管理组件内部状态' },
      { id: 'b', text: '跨组件层级传递数据' },
      { id: 'c', text: '处理副作用' },
      { id: 'd', text: '优化性能' },
    ],
    correctAnswer: 'b',
    explanation: 'Context API 用于跨组件层级传递数据，避免 prop drilling（属性层层传递）。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'HARD' as const,
    text: '以下关于 Webpack 的描述，哪项是错误的？',
    options: [
      { id: 'a', text: 'Webpack 是一个静态模块打包工具' },
      { id: 'b', text: 'Webpack 只能处理 JavaScript 文件' },
      { id: 'c', text: 'Webpack 支持 code splitting' },
      { id: 'd', text: 'Webpack 支持 tree shaking' },
    ],
    correctAnswer: 'b',
    explanation: 'Webpack 可以通过各种 loader 处理多种类型的文件，如 CSS、图片、字体等，不只是 JavaScript。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: 'Vitest 和 Jest 的主要区别是什么？',
    options: [
      { id: 'a', text: '一个是 TypeScript 编写，一个是 JavaScript 编写' },
      { id: 'b', text: 'Vitest 更快，专为 Vite 项目设计' },
      { id: 'c', text: 'Jest 支持更多功能' },
      { id: 'd', text: '没有本质区别' },
    ],
    correctAnswer: 'b',
    explanation: 'Vitest 专为 Vite 项目设计，利用 Vite 的优势，速度更快，配置更简单。',
  },
  {
    type: 'OBJECTIVE' as const,
    difficulty: 'EASY' as const,
    text: '以下哪个不是 CSS 盒模型的部分？',
    options: [
      { id: 'a', text: 'margin' },
      { id: 'b', text: 'padding' },
      { id: 'c', text: 'border' },
      { id: 'd', text: 'spacing' },
    ],
    correctAnswer: 'd',
    explanation: 'CSS 盒模型包括：content、padding、border、margin。spacing 不是盒模型的一部分。',
  },

  // 主观题（10道）
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: '请解释 React 的虚拟 DOM 是什么，它如何提升性能？',
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'HARD' as const,
    text: '请描述一下浏览器从输入 URL 到页面渲染的完整过程。',
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: 'TypeScript 中的 interface 和 type 有什么区别？分别在什么场景使用？',
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: '请解释 JavaScript 中的闭包是什么，并给出一个实际应用场景。',
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'HARD' as const,
    text: 'React 中，useEffect 和 useLayoutEffect 有什么区别？分别应该在什么场景使用？',
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: '请解释什么是防抖（debounce）和节流（throttle），它们的应用场景是什么？',
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'HARD' as const,
    text: '请描述一下你在项目中如何优化前端性能？包括但不限于加载速度、渲染性能等方面。',
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: 'CSS Grid 和 Flexbox 有什么区别？分别在什么场景使用？',
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'HARD' as const,
    text: '请解释 Next.js 的服务端渲染（SSR）和客户端渲染（CSR）的区别，以及各自的优缺点。',
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: '你在项目中遇到过哪些技术难题？是如何解决的？请详细描述。',
  },
]

// 预设的简历分析结果
const PRESET_ANALYSIS = {
  techStack: [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue', 'HTML5', 'CSS3',
    'Tailwind CSS', 'Redux', 'Zustand', 'Webpack', 'Vite', 'Git', 'Vitest'
  ],
  projects: [
    {
      name: '企业级后台管理系统',
      description: '基于 Next.js 14 和 TypeScript 的管理系统',
      techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
      role: '主要开发者',
    },
    {
      name: '数据可视化大屏',
      description: '实时数据展示和动态图表',
      techStack: ['React', 'ECharts', 'D3.js', 'WebSocket'],
      role: '前端负责人',
    },
  ],
  level: 'mid',
  focusAreas: ['React 生态', '性能优化', '工程化'],
}

async function main() {
  console.log('🌱 开始生成面试假数据...')

  // 清理旧数据（可选）
  // await prisma.mistake.deleteMany({})
  // await prisma.question.deleteMany({})
  // await prisma.quiz.deleteMany({})
  // await prisma.resume.deleteMany({})

  // 1. 创建简历
  console.log('📄 创建简历...')
  const resume = await prisma.resume.upsert({
    where: { id: 'preset-resume-1' },
    update: {},
    create: {
      id: 'preset-resume-1',
      source: 'TEXT_PASTE',
      content: FRONTEND_RESUME,
      techStack: PRESET_ANALYSIS.techStack,
      projects: PRESET_ANALYSIS.projects,
      level: PRESET_ANALYSIS.level,
      focusAreas: PRESET_ANALYSIS.focusAreas,
    },
  })
  console.log(`✅ 简历创建成功: ${resume.id}`)

  // 2. 创建测验和题目
  console.log('📝 创建测验和题目...')
  const quiz = await prisma.quiz.upsert({
    where: { id: 'preset-quiz-1' },
    update: {},
    create: {
      id: 'preset-quiz-1',
      resumeId: resume.id,
      status: 'COMPLETED',
      score: 78,
      startedAt: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
      completedAt: new Date(),
      questions: {
        create: PRESET_QUESTIONS.map((q, index) => {
          const question: any = {
            type: q.type,
            difficulty: q.difficulty,
            order: index + 1,
            text: q.text,
          }

          // 客观题
          if (q.type === 'OBJECTIVE') {
            question.options = { options: q.options }
            question.correctAnswer = q.correctAnswer
            question.explanation = q.explanation

            // 模拟一些答题结果
            const isCorrect = Math.random() > 0.3 // 70% 正确率
            question.userAnswer = isCorrect ? q.correctAnswer : q.options?.[Math.floor(Math.random() * 4)].id
            question.isCorrect = isCorrect
          }

          // 主观题
          if (q.type === 'SUBJECTIVE') {
            // 模拟一些答题结果
            if (index < 5) {
              question.userAnswer = '这是一个示例答案...'
              question.aiEvaluation = {
                score: Math.floor(Math.random() * 30) + 70, // 70-100分
                feedback: '回答比较全面，但可以更深入一些。',
                corrections: [],
              }
            }
          }

          return question
        }),
      },
    },
    include: {
      questions: true,
    },
  })
  console.log(`✅ 测验创建成功: ${quiz.id}，共 ${quiz.questions.length} 道题`)

  // 3. 创建错题记录（答错的题目）
  console.log('📕 创建错题记录...')
  const wrongQuestions = quiz.questions.filter(q => !q.isCorrect && q.type === 'OBJECTIVE')
  let mistakeCount = 0

  for (const question of wrongQuestions) {
    await prisma.mistake.create({
      data: {
        quizId: quiz.id,
        questionId: question.id,
        timesAttempted: 1,
        timesCorrect: 0,
        questionSnapshot: {
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        },
      },
    })
    mistakeCount++
  }
  console.log(`✅ 错题记录创建成功: ${mistakeCount} 条`)

  // 4. 创建第二个已完成测验（更多题目）
  console.log('📝 创建第二个测验...')
  const quiz2 = await prisma.quiz.upsert({
    where: { id: 'preset-quiz-2' },
    update: {},
    create: {
      id: 'preset-quiz-2',
      resumeId: resume.id,
      status: 'COMPLETED',
      score: 85,
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 25),
      questions: {
        create: PRESET_QUESTIONS.slice(0, 15).map((q, index) => {
          const question: any = {
            type: q.type,
            difficulty: q.difficulty,
            order: index + 1,
            text: q.text,
          }

          if (q.type === 'OBJECTIVE') {
            question.options = { options: q.options }
            question.correctAnswer = q.correctAnswer
            question.explanation = q.explanation
            question.userAnswer = q.correctAnswer
            question.isCorrect = true
          }

          return question
        }),
      },
    },
  })
  console.log(`✅ 第二个测验创建成功: ${quiz2.id}`)

  console.log('')
  console.log('🎉 面试假数据生成完成！')
  console.log('')
  console.log('📊 数据统计：')
  console.log(`  - 简历: 1 份`)
  console.log(`  - 测验: 2 次`)
  console.log(`  - 题目: ${PRESET_QUESTIONS.length} 道`)
  console.log(`  - 错题: ${mistakeCount} 条`)
  console.log('')
  console.log('🔗 可以使用以下简历 ID 测试：')
  console.log(`  ${resume.id}`)
  console.log('')
  console.log('🔗 可以使用以下测验 ID 测试：')
  console.log(`  ${quiz.id}`)
  console.log(`  ${quiz2.id}`)
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
