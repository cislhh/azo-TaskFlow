/**
 * 题目生成提示模板
 */

export const QUESTION_GENERATION_SYSTEM_PROMPT = `你是一位专业的技术面试官。根据候选人的简历信息，生成30道针对性面试题。

**题目要求：**

1. **题目类型**：
   - 15道客观题（单选题）：考察基础知识和概念理解
   - 15道主观题（简答题）：考察深度理解、项目经验、问题解决能力

2. **难度分布**：
   - 简单（第1-10题）：基础知识，候选人应该掌握
   - 中等（第11-20题）：需要一定的理解和应用能力
   - 困难（第21-30题）：需要深入理解或丰富经验

3. **内容覆盖**：
   - 题目必须覆盖候选人的技术栈
   - 结合候选人的项目经验出题
   - 重点关注候选人的重点考察领域
   - 题目应该由浅入深，循序渐进

4. **客观题格式**：
   - 提供4个选项（A、B、C、D）
   - 标注正确答案
   - 提供简要解释

5. **主观题格式**：
   - 题目明确具体
   - 要求候选人提供具体例子或代码
   - 提供参考答案要点

请以 JSON 格式返回，格式如下：
\`\`\`json
{
  "questions": [
    {
      "type": "objective",
      "difficulty": "easy",
      "text": "题目内容",
      "options": ["A选项", "B选项", "C选项", "D选项"],
      "correctAnswer": "A",
      "explanation": "答案解释"
    },
    {
      "type": "subjective",
      "difficulty": "medium",
      "text": "题目内容",
      "correctAnswer": "参考答案要点（用于评分）",
      "explanation": "题目考察点说明"
    }
  ]
}
\`\`\`

要求：
- 严格按照30道题生成（15客观 + 15主观）
- 题目顺序必须由易到难
- 确保返回有效的 JSON 格式
- 题目要具体、专业、有针对性`

export interface Question {
  type: 'objective' | 'subjective'
  difficulty: 'easy' | 'medium' | 'hard'
  text: string
  options?: string[]
  correctAnswer: string
  explanation: string
}

export interface QuestionGenerationResult {
  questions: Question[]
}

/**
 * 生成题目生成的提示
 */
export function generateQuestionGenerationPrompt(resumeAnalysis: {
  techStack: string[]
  projects: Array<{
    name: string
    technologies: string[]
    responsibilities: string[]
    achievements: string[]
  }>
  level: 'junior' | 'mid' | 'senior'
  focusAreas: string[]
}): string {
  return `请根据以下候选人信息生成30道针对性面试题：

**技术栈**：${resumeAnalysis.techStack.join(', ')}

**候选人级别**：${resumeAnalysis.level}

**重点考察领域**：${resumeAnalysis.focusAreas.join(', ')}

**项目经验**：
${resumeAnalysis.projects.map((p, i) => `
项目${i + 1}: ${p.name}
- 技术栈: ${p.technologies.join(', ')}
- 职责: ${p.responsibilities.join('; ')}
- 成果: ${p.achievements.join('; ')}
`).join('\n')}

请生成30道面试题（15道客观题 + 15道主观题），由易到难排列，题目要结合候选人的技术栈和项目经验。`
}
