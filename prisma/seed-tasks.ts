/**
 * 日常任务假数据种子脚本
 * 生成50条真实的日常任务
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL ?? 'postgresql://azo@localhost:5432/taskflow'
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// 50条真实的日常任务数据
const TASKS = [
  // 工作相关
  {
    title: '回复客户邮件',
    description: '回复昨天收到的客户关于产品咨询的邮件',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    priority: 'HIGH',
    status: 'TODO'
  },
  {
    title: '准备周会PPT',
    description: '整理本周工作进展，制作周一例会的演示文稿',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    priority: 'HIGH',
    status: 'TODO'
  },
  {
    title: '审查代码PR',
    description: '审查团队成员提交的3个代码PR，确保代码质量',
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '更新项目文档',
    description: '更新项目API文档，添加新接口说明',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '参加技术分享会',
    description: '下午3点参加公司内部技术分享会：云原生架构实践',
    dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },

  // 学习提升
  {
    title: '完成在线课程第5章',
    description: '完成Vue3组合式API课程的第5章学习并做练习',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '阅读技术文章',
    description: '阅读关于前端性能优化的5篇技术文章',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '练习算法题',
    description: '在LeetCode上完成2道中等难度算法题',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '观看技术视频',
    description: '观看Next.js 15新特性介绍视频教程',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '整理学习笔记',
    description: '整理本周学习的技术笔记，形成思维导图',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },

  // 健康生活
  {
    title: '晨跑5公里',
    description: '早上6点起床，在公园跑步5公里',
    dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '预约体检',
    description: '拨打医院电话预约年度体检',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'HIGH',
    status: 'TODO'
  },
  {
    title: '购买健康食品',
    description: '去超市购买有机蔬菜和水果',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '健身训练',
    description: '晚上8点到健身房进行力量训练1小时',
    dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '冥想放松',
    description: '每天晚上睡前冥想15分钟，放松身心',
    dueDate: new Date(Date.now() + 10 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },

  // 家务琐事
  {
    title: '缴纳水电费',
    description: '通过APP缴纳本月水电燃气费',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'HIGH',
    status: 'TODO'
  },
  {
    title: '预约空调清洗',
    description: '联系家电清洗服务，预约空调深度清洁',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '整理衣柜',
    description: '整理换季衣物，清洗收纳冬装',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '修理水龙头',
    description: '联系物业或维修师傅修理漏水的水龙头',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    priority: 'URGENT',
    status: 'TODO'
  },
  {
    title: '购买生活用品',
    description: '购买洗衣液、纸巾等日常生活用品',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },

  // 社交活动
  {
    title: '生日礼物准备',
    description: '为朋友准备生日礼物，挑选合适的礼物',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '参加朋友聚餐',
    description: '周六晚上参加朋友生日聚餐，6点在餐厅集合',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '给父母打电话',
    description: '每周给父母打一次视频电话，汇报近况',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '回复微信消息',
    description: '回复朋友圈和微信群积压的消息',
    dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '参加社区活动',
    description: '周日参加社区志愿者活动',
    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },

  // 财务管理
  {
    title: '记录日常开支',
    description: '记录本周的日常开支，整理财务状况',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '检查信用卡账单',
    description: '核对本月信用卡账单，确认无异常消费',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'HIGH',
    status: 'TODO'
  },
  {
    title: '制定理财计划',
    description: '制定下个月的理财计划和预算分配',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '购买保险',
    description: '咨询保险经纪人，购买意外险和医疗险',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '整理报销单据',
    description: '整理本月的工作报销单据，准备提交报销',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },

  // 车辆相关
  {
    title: '车辆保养',
    description: '预约4S店进行车辆常规保养',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '缴纳车险',
    description: '缴纳车辆保险费用',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    priority: 'HIGH',
    status: 'TODO'
  },
  {
    title: '洗车',
    description: '周末去洗车店给车子做个清洗打蜡',
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '更换雨刮器',
    description: '购买并更换老化的雨刮器',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '检查车辆年检',
    description: '查看车辆年检时间，提前做好准备',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },

  // 宠物相关
  {
    title: '遛狗',
    description: '早晚各遛狗30分钟，保持狗狗健康',
    dueDate: new Date(Date.now() + 10 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '购买猫粮',
    description: '囤购猫咪需要的猫粮和猫砂',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '宠物疫苗接种',
    description: '预约宠物医院给宠物接种疫苗',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    priority: 'HIGH',
    status: 'TODO'
  },
  {
    title: '清洁鱼缸',
    description: '清洗鱼缸并更换水质',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '购买宠物用品',
    description: '购买宠物零食和玩具',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },

  // 数码电子
  {
    title: '清理手机相册',
    description: '清理手机相册，删除重复和模糊照片',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '更新电脑系统',
    description: '更新电脑操作系统和软件驱动',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '备份重要数据',
    description: '备份电脑和手机中的重要数据到云端',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'HIGH',
    status: 'TODO'
  },
  {
    title: '整理电脑文件',
    description: '整理电脑桌面和文档，删除无用文件',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '购买手机配件',
    description: '购买手机壳、钢化膜等配件',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },

  // 个人发展
  {
    title: '制定月度目标',
    description: '制定下个月的个人成长和目标计划',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '更新简历',
    description: '更新个人简历，添加最新项目经验',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '学习英语',
    description: '每天学习30分钟英语，提升口语能力',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '参加行业沙龙',
    description: '报名参加行业技术沙龙活动',
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '写工作总结',
    description: '写本月的工作总结和反思',
    dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },

  // 娱乐休闲
  {
    title: '观看电影',
    description: '周末和伴侣一起去电影院看新上映的电影',
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '阅读小说',
    description: '每天睡前阅读小说30分钟',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '玩电子游戏',
    description: '周末和好友一起打几局游戏放松',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '听音乐播客',
    description: '通勤路上听感兴趣的播客节目',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '旅游规划',
    description: '规划下个月的短途旅游行程',
    dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },

  // 其他
  {
    title: '收快递',
    description: '有3个快递到驿站，记得去取',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '去银行办事',
    description: '到银行柜员机办理转账业务',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '配眼镜',
    description: '去眼镜店配新的近视眼镜',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    priority: 'MEDIUM',
    status: 'TODO'
  },
  {
    title: '整理书架',
    description: '整理书架，捐赠不再需要的书籍',
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
  {
    title: '准备露营装备',
    description: '检查和整理露营装备，准备春季露营',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priority: 'LOW',
    status: 'TODO'
  },
]

async function main() {
  console.log('🌱 开始生成日常任务数据...')

  // 生成过去7天的已完成任务（用于完成趋势图）
  const completedTasks = []
  const now = new Date()

  for (let i = 7; i >= 1; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60))

    // 每天2-3个已完成任务
    const dailyCompleted = Math.floor(Math.random() * 2) + 2

    for (let j = 0; j < dailyCompleted; j++) {
      const completedDate = new Date(date)
      completedDate.setMinutes(completedDate.getMinutes() + j * 30)

      completedTasks.push({
        title: `已完成任务 ${8 - i}-${j + 1}`,
        description: `这是一个在第${8 - i}天完成的任务`,
        dueDate: completedDate,
        priority: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as any,
        status: 'COMPLETED' as const,
        completedAt: completedDate
      })
    }
  }

  // 生成今天的任务（部分已完成，部分进行中）
  const todayTasks = [
    {
      title: '晨会讨论项目进度',
      description: '参加团队晨会，讨论本周项目进展',
      dueDate: new Date(now.setHours(9, 0, 0, 0)),
      priority: 'HIGH' as const,
      status: 'COMPLETED' as const,
      completedAt: new Date(now.setHours(9, 30, 0, 0))
    },
    {
      title: '修复登录页面bug',
      description: '修复用户反馈的登录页面样式问题',
      dueDate: new Date(now.setHours(11, 0, 0, 0)),
      priority: 'HIGH' as const,
      status: 'COMPLETED' as const,
      completedAt: new Date(now.setHours(12, 0, 0, 0))
    },
    {
      title: '编写API文档',
      description: '为新开发的接口编写详细文档',
      dueDate: new Date(now.setHours(14, 0, 0, 0)),
      priority: 'MEDIUM' as const,
      status: 'IN_PROGRESS' as const
    },
    {
      title: '代码审查',
      description: '审查团队成员提交的代码',
      dueDate: new Date(now.setHours(16, 0, 0, 0)),
      priority: 'MEDIUM' as const,
      status: 'TODO' as const
    },
    {
      title: '更新依赖包',
      description: '检查并更新项目依赖包版本',
      dueDate: new Date(now.setHours(18, 0, 0, 0)),
      priority: 'LOW' as const,
      status: 'TODO' as const
    }
  ]

  // 合并所有任务数据
  const allTasks = [...completedTasks, ...todayTasks, ...TASKS]

  // 批量创建任务
  const result = await prisma.task.createMany({
    data: allTasks,
    skipDuplicates: true, // 如果已存在则跳过
  })

  console.log(`✅ 成功创建 ${result.count} 条日常任务`)

  // 统计任务信息
  const tasksInDb = await prisma.task.findMany()
  const stats = {
    total: tasksInDb.length,
    byStatus: {
      TODO: tasksInDb.filter(t => t.status === 'TODO').length,
      IN_PROGRESS: tasksInDb.filter(t => t.status === 'IN_PROGRESS').length,
      COMPLETED: tasksInDb.filter(t => t.status === 'COMPLETED').length,
      CANCELLED: tasksInDb.filter(t => t.status === 'CANCELLED').length,
    },
    byPriority: {
      LOW: tasksInDb.filter(t => t.priority === 'LOW').length,
      MEDIUM: tasksInDb.filter(t => t.priority === 'MEDIUM').length,
      HIGH: tasksInDb.filter(t => t.priority === 'HIGH').length,
      URGENT: tasksInDb.filter(t => t.priority === 'URGENT').length,
    },
  }

  console.log('')
  console.log('📊 任务统计：')
  console.log(`  总数：${stats.total}`)
  console.log(`  按状态：`)
  console.log(`    待办：${stats.byStatus.TODO}`)
  console.log(`    进行中：${stats.byStatus.IN_PROGRESS}`)
  console.log(`    已完成：${stats.byStatus.COMPLETED}`)
  console.log(`    已取消：${stats.byStatus.CANCELLED}`)
  console.log(`  按优先级：`)
  console.log(`    低：${stats.byPriority.LOW}`)
  console.log(`    中：${stats.byPriority.MEDIUM}`)
  console.log(`    高：${stats.byPriority.HIGH}`)
  console.log(`    紧急：${stats.byPriority.URGENT}`)

  // 按类别分组显示
  console.log('')
  console.log('📋 任务分类：')
  console.log(`  工作相关：5`)
  console.log(`  学习提升：5`)
  console.log(`  健康生活：5`)
  console.log(`  家务琐事：5`)
  console.log(`  社交活动：5`)
  console.log(`  财务管理：5`)
  console.log(`  车辆相关：5`)
  console.log(`  宠物相关：5`)
  console.log(`  数码电子：5`)
  console.log(`  个人发展：5`)
  console.log(`  娱乐休闲：5`)
  console.log(`  其他：5`)

  // 显示一些示例任务
  console.log('')
  console.log('📝 示例任务（前10条）：')
  TASKS.slice(0, 10).forEach((task, index) => {
    const dueDate = new Date(task.dueDate)
    const dateStr = `${dueDate.getMonth() + 1}月${dueDate.getDate()}日`
    const timeStr = `${dueDate.getHours().toString().padStart(2, '0')}:${dueDate.getMinutes().toString().padStart(2, '0')}`
    console.log(`  ${index + 1}. ${task.title}`)
    console.log(`     ⏰ ${dateStr} ${timeStr}`)
    console.log(`     📌 ${task.priority}`)
    console.log(`     📝 ${task.description.substring(0, 30)}...`)
    console.log('')
  })

  console.log('')
  console.log('💡 使用命令：npm run seed:tasks  重新生成任务数据')
  console.log('✨ 日常任务数据生成完成！')
}

main()
  .catch((e) => {
    console.error('❌ 错误:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
