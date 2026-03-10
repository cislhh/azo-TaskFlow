/**
 * 预设的面试数据
 * 用于演示和测试，避免调用真实的 AI 接口
 */

// 预设的前端简历内容
export const PRESET_RESUME_CONTENT = `张三
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

// 预设的简历分析结果
export const PRESET_ANALYSIS_RESULT = {
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

// 预设的30道面试题
export const PRESET_QUESTIONS = [
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
    correctAnswer: `虚拟 DOM 是 React 在内存中维护的一个轻量级 JavaScript 对象树，它是真实 DOM 的抽象表示。

性能提升原理：
1. **批量更新**：多个状态变更会被合并成一次 DOM 操作
2. **Diff 算法**：通过对比新旧虚拟 DOM 树，只更新变化的部分
3. **减少重排重绘**：最小化对真实 DOM 的操作，避免昂贵的浏览器重排和重绘

工作流程：
1. 状态变化 → 创建新的虚拟 DOM
2. 与旧的虚拟 DOM 进行 diff 对比
3. 计算出最小变更集
4. 只更新需要变化的真实 DOM 节点`,
    explanation: '这是面试高频题，关键点要提到：轻量级对象、批量更新、Diff算法、减少真实DOM操作。'
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'HARD' as const,
    text: '请描述一下浏览器从输入 URL 到页面渲染的完整过程。',
    correctAnswer: `1. **DNS 解析**：将域名解析为 IP 地址
   - 检查浏览器缓存 → 系统缓存 → hosts 文件 → DNS 服务器

2. **TCP 连接**：三次握手建立连接
   - 客户端发送 SYN
   - 服务端回复 SYN + ACK
   - 客户端发送 ACK

3. **发送 HTTP 请求**：
   - 构建 HTTP 请求报文（请求行、请求头、请求体）
   - 通过 TCP 发送请求

4. **服务器处理**：
   - 解析请求、处理业务逻辑
   - 生成 HTTP 响应

5. **返回响应**：
   - 返回 HTML、CSS、JS 等资源
   - 状态码（200、301、404、500 等）

6. **浏览器渲染**：
   - **解析 HTML** → 构建 DOM 树
   - **解析 CSS** → 构建 CSSOM 树
   - **合并** → 生成渲染树（Render Tree）
   - **布局**（Layout）：计算元素位置和大小
   - **绘制**（Paint）：绘制像素到图层
   - **合成**（Composite）：合并图层显示`,
    explanation: '这道题考察全面性，需要涵盖网络和渲染两部分，可以画图辅助说明。'
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: 'TypeScript 中的 interface 和 type 有什么区别？分别在什么场景使用？',
    correctAnswer: `**主要区别：**

1. **声明方式**：
   - interface: interface User { name: string }
   - type: type User = { name: string }

2. **扩展方式**：
   - interface: interface ExtendedUser extends User { age: number }
   - type: type ExtendedUser = User & { age: number }

3. **重复声明**：
   - interface: 可以多次声明，会自动合并
   - type: 不允许重复声明

4. **适用类型**：
   - interface: 只能定义对象、函数的结构
   - type: 可以定义任何类型（联合、交叉、元组等）

**使用场景：**

使用 interface：
- 定义对象的形状
- 需要可以被扩展
- 类的实现（class implements）

使用 type：
- 定义联合类型（type Status = 'pending' | 'success'）
- 定义元组类型（type Position = [number, number]）
- 提取类型工具（type Keys = keyof User）`,
    explanation: '实际开发中，对象定义优先用 interface，类型别名用 type。两者可以配合使用。'
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: '请解释 JavaScript 中的闭包是什么，并给出一个实际应用场景。',
    correctAnswer: `**闭包的定义：**
闭包是指函数能够记住并访问其定义时所在的词法作用域，即使函数在其词法作用域之外执行。

**核心特点：**
1. 内部函数可以访问外部函数的变量
2. 外部函数执行完后，变量不会被销毁
3. 每个闭包都维护独立的作用域链

**实际应用场景：**

1. **数据私有化**：
\`\`\`javascript
function createCounter() {
  let count = 0  // 私有变量
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  }
}
\`\`\`

2. **函数柯里化**：
\`\`\`javascript
function add(a) {
  return function(b) {
    return a + b
  }
}
const add5 = add(5)
\`\`\`

3. **防抖和节流**：
\`\`\`javascript
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}
\`\`\``,
    explanation: '闭包是 JavaScript 面试必考题，一定要能用代码举例说明实际应用。'
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'HARD' as const,
    text: 'React 中，useEffect 和 useLayoutEffect 有什么区别？分别应该在什么场景使用？',
    correctAnswer: `**主要区别：**

1. **执行时机**：
   - useEffect: 在浏览器绘制**之后**异步执行
   - useLayoutEffect: 在浏览器绘制**之前**同步执行

2. **对渲染的影响**：
   - useEffect: 不会阻塞浏览器绘制
   - useLayoutEffect: 会阻塞浏览器绘制

**执行顺序：**
1. React 修改 DOM
2. useLayoutEffect 执行
3. 浏览器绘制
4. useEffect 执行

**使用场景：**

useEffect（默认选择）：
- 数据获取（API 调用）
- 订阅事件
- 手动修改 DOM
- 不需要阻塞渲染的操作

useLayoutEffect（谨慎使用）：
- 需要读取 DOM 布局信息
- 需要在绘制前同步修改 DOM
- 避免闪烁的布局调整
- 动画相关的 DOM 操作

**示例：**
\`\`\`javascript
// ❌ 使用 useEffect 会有闪烁
useEffect(() => {
  ref.current.style.transform = 'translateX(100px)'
}, [])

// ✅ 使用 useLayoutEffect 避免闪烁
useLayoutEffect(() => {
  ref.current.style.transform = 'translateX(100px)'
}, [])
\`\`\``,
    explanation: '99% 的场景用 useEffect 就够了，只有处理布局和动画时才考虑 useLayoutEffect。'
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: '请解释什么是防抖（debounce）和节流（throttle），它们的应用场景是什么？',
    correctAnswer: `**防抖：**
在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时。

\`\`\`javascript
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
\`\`\`

应用场景：
- 搜索框输入（用户停止输入后再搜索）
- 窗口 resize（调整结束后再执行）
- 表单验证

**节流：**
规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

\`\`\`javascript
function throttle(fn, delay) {
  let last = 0
  return function(...args) {
    const now = Date.now()
    if (now - last > delay) {
      last = now
      fn.apply(this, args)
    }
  }
}
\`\`\`

应用场景：
- 滚动事件（scroll）
- 鼠标移动（mousemove）
- 按钮连续点击

**对比总结：**
- 防抖：最后触发后执行（只执行最后一次）
- 节流：固定间隔执行（按固定频率执行）`,
    explanation: '可以用比喻来记忆：防抖是电梯等人齐了才关门，节流是地铁每隔几分钟一班。'
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'HARD' as const,
    text: '请描述一下你在项目中如何优化前端性能？包括但不限于加载速度、渲染性能等方面。',
    correctAnswer: `**加载速度优化：**

1. **代码分割**：
   - React.lazy() 动态导入组件
   - 路由级别代码分割
   - Webpack splitChunks 配置

2. **资源优化**：
   - 图片压缩（WebP 格式、响应式图片）
   - 字体子集化
   - Gzip/Brotli 压缩
   - CDN 加速

3. **缓存策略**：
   - HTTP 缓存（Cache-Control）
   - Service Worker 离线缓存
   - LocalStorage/IndexedDB

**渲染性能优化：**

1. **减少不必要的渲染**：
   - React.memo() 组件记忆化
   - useMemo() 缓存计算结果
   - useCallback() 稳定函数引用

2. **列表优化**：
   - 虚拟滚动（react-window）
   - 合适的 key 值
   - 避免匿名函数作为 props

3. **CSS 优化**：
   - 减少重排重绘（使用 transform 和 opacity）
   - will-change 属性
   - CSS containment

**网络优化：**

1. **请求优化**：
   - 请求合并
   - 预加载关键资源
   - HTTP/2 多路复用

2. **数据优化**：
   - 分页加载
   - GraphQL 按需查询
   - SWR/React Query 缓存

**监控和测量：**

- Lighthouse 评分
- Chrome DevTools Performance
- Web Vitals（LCP、FID、CLS）`,
    explanation: '性能优化是一个很大的话题，关键是要有实际项目经验，能说出具体的数据提升效果。'
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: 'CSS Grid 和 Flexbox 有什么区别？分别在什么场景使用？',
    correctAnswer: `**主要区别：**

1. **维度**：
   - Flexbox: 一维布局（行或列）
   - Grid: 二维布局（行和列同时控制）

2. **定位机制**：
   - Flexbox: 基于内容的流动（content-first）
   - Grid: 基于布局的定位（layout-first）

3. **对齐控制**：
   - Flexbox: 主要在容器级别控制对齐
   - Grid: 可以在容器和项目两个级别控制

**使用场景：**

Flexbox 适用：
- 导航栏（水平排列）
- 列表项（垂直居中）
- 卡片内部布局
- 一行/一列的元素排列

Grid 适用：
- 整体页面布局
- 二维卡片网格
- 复杂的排版需求
- 需要精确控制的布局

**实际建议：**
- 大多数简单布局用 Flexbox
- 整体框架用 Grid
- 两者经常配合使用（Grid 容器 + Flexbox 子项）

**示例对比：**
\`\`\`css
/* Flexbox - 一行元素 */
.nav {
  display: flex;
  justify-content: space-between;
}

/* Grid - 二维网格 */
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\``,
    explanation: 'Grid 更适合宏观布局，Flexbox 适合微观布局。现代开发中两者配合使用效果最好。'
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'HARD' as const,
    text: '请解释 Next.js 的服务端渲染（SSR）和客户端渲染（CSR）的区别，以及各自的优缺点。',
    correctAnswer: `**服务端渲染（SSR）：**

工作流程：
1. 服务器接收到请求
2. 在服务器端执行 React 代码
3. 生成完整的 HTML
4. 返回给浏览器
5. 浏览器显示 HTML（ hydration）

优点：
- ✅ SEO 友好（爬虫可以直接读取内容）
- ✅ 首屏渲染快（HTML 直出）
- ✅ 社交媒体分享良好
- ✅ 更适合动态内容

缺点：
- ❌ 服务器负载增加
- ❌ 页面切换可能较慢
- ❌ 开发调试相对复杂
- ❌ TTFB 可能增加

**客户端渲染（CSR）：**

工作流程：
1. 返回空 HTML + JS bundle
2. 浏览器下载和执行 JS
3. React 渲染页面
4. 用户看到内容

优点：
- ✅ 服务器压力小
- ✅ 页面切换流畅
- ✅ 开发体验好
- ✅ 可以使用浏览器 API

缺点：
- ❌ SEO 不友好
- ❌ 首屏慢（白屏时间长）
- ❌ 不适合内容型网站

**Next.js 的策略：**
- 默认使用 SSR（getServerSideProps）
- 可以选择 CSR（useEffect 获取数据）
- 静态生成（getStaticProps）性能最佳
- 混合使用（SSR + CSR）最灵活

**选择建议：**
- 营销页面 → SSR/SSG
- 管理后台 → CSR
- 电商首页 → SSR
- 个人设置 → CSR`,
    explanation: 'Next.js 的优势在于可以混合使用 SSR 和 CSR，根据页面特性选择合适的渲染方式。'
  },
  {
    type: 'SUBJECTIVE' as const,
    difficulty: 'MEDIUM' as const,
    text: '你在项目中遇到过哪些技术难题？是如何解决的？请详细描述。',
    correctAnswer: `【这是一个开放性问题，以下提供两个案例参考】

**案例一：性能优化**

**问题：**
管理后台的数据表格渲染卡顿，1000+ 条数据时滚动不流畅。

**分析过程：**
1. 使用 Chrome DevTools Performance 分析
2. 发现渲染和重排耗时过长
3. 列表项使用了匿名函数和内联样式

**解决方案：**
1. 使用虚拟滚动（react-window）
   - 只渲染可视区域的 DOM 节点
   - 性能提升 80%

2. 优化列表组件
   - 使用 React.memo() 包裹列表项
   - 稳定 key 值（使用 ID 而不是索引）
   - useCallback 优化事件处理

3. 代码分割
   - 路由级别懒加载
   - 减少首屏 JS 体积

**结果：**
- 首屏加载时间从 3.5s 降到 1.2s
- 滚动帧率稳定在 60fps

**案例二：状态管理**

**问题：**
多组件共享状态导致 props drilling 难以维护。

**解决方案：**
1. 引入 Zustand 进行全局状态管理
2. 按功能模块拆分 store
3. 使用 selector 避免不必要的重渲染

**关键收获：**
- 遇到问题先分析瓶颈
- 用数据说话（性能指标）
- 渐进式优化，不盲目追求新技术`,
    explanation: '这道题考察问题解决能力和技术深度，建议结合真实项目经历，按照 STAR 法则（情境、任务、行动、结果）来回答。'
  },
] as const

// 环境变量控制是否使用预设数据
export const USE_PRESET_DATA = process.env.USE_PRESET_INTERVIEW_DATA === 'true'
