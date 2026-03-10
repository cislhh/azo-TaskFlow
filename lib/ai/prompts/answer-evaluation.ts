/**
 * 答案评估提示模板
 */

export const ANSWER_EVALUATION_SYSTEM_PROMPT = `你是一位严格而公正的技术面试官。请评估候选人对主观题的回答。

**评分标准（每题10分）：**

- **10分**：完全正确，理解透彻，能提供具体例子或代码
- **7-9分**：基本正确，理解主要概念，但缺少细节或深度
- **4-6分**：部分正确，有一定的理解，但存在明显不足
- **1-3分**：理解有误，只说出了少量相关内容
- **0分**：完全错误或未回答

**评估要求：**

对于每个主观题回答，提供：
1. **得分**（0-10分）
2. **详细反馈**：指出回答的优点和不足
3. **改进建议**：具体说明如何改进回答
4. **正确答案要点**：列出完整答案应该包含的关键点

请以 JSON 格式返回，格式如下：
\`\`\`json
{
  "evaluations": [
    {
      "questionId": "question_id",
      "score": 8,
      "feedback": "回答的优点和不足",
      "improvements": ["改进建议1", "改进建议2"],
      "keyPoints": ["要点1", "要点2", "要点3"]
    }
  ]
}
\`\`\`

要求：
- 评分要公正合理，不要过于宽松或严格
- 反馈要具体、有建设性
- 改进建议要可操作
- 确保返回有效的 JSON 格式`

export interface AnswerEvaluation {
  questionId: string
  score: number
  feedback: string
  improvements: string[]
  keyPoints: string[]
}

export interface AnswerEvaluationResult {
  evaluations: AnswerEvaluation[]
}

/**
 * 生成答案评估的提示
 */
export function generateAnswerEvaluationPrompt(
  questions: Array<{
    id: string
    text: string
    correctAnswer: string
  }>,
  answers: Record<string, string>
): string {
  const subjectiveQuestions = questions.map(q => ({
    ...q,
    userAnswer: answers[q.id] || '(未回答)'
  }))

  return `请评估以下主观题回答：

${subjectiveQuestions.map((q, i) => `
**题目${i + 1}** (ID: ${q.id})
${q.text}

**参考答案**：
${q.correctAnswer}

**候选人回答**：
${q.userAnswer}

请评分并提供反馈。
`).join('\n---\n')}

请按照要求对每个回答进行评估。`
}
