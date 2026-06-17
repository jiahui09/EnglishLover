import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class TodayMetric {
  const TodayMetric({required this.value, required this.label});

  final String value;
  final String label;
}

class WordItem {
  const WordItem({
    required this.word,
    required this.partOfSpeech,
    required this.meaning,
    required this.example,
    required this.contextHint,
  });

  final String word;
  final String partOfSpeech;
  final String meaning;
  final String example;
  final String contextHint;
}

class QuestionItem {
  const QuestionItem({
    required this.type,
    required this.question,
    required this.options,
    required this.answer,
    required this.reason,
  });

  final String type;
  final String question;
  final List<String> options;
  final String answer;
  final String reason;
}

class CoachInsight {
  const CoachInsight({
    required this.title,
    required this.description,
    required this.icon,
  });

  final String title;
  final String description;
  final IconData icon;
}

const todayMetrics = [
  TodayMetric(value: '20', label: '今日单词'),
  TodayMetric(value: '1 篇', label: '阅读输出'),
  TodayMetric(value: '15–25', label: '预计分钟'),
];

const targetWords = [
  'context',
  'assume',
  'significant',
  'evaluate',
  'maintain',
];

const wordItems = [
  WordItem(
    word: 'significant',
    partOfSpeech: 'adj.',
    meaning: '重要的；显著的',
    example: 'The policy had a significant impact on economic growth.',
    contextHint: '常用于描述影响、变化、差异是否“重要或显著”。',
  ),
  WordItem(
    word: 'evaluate',
    partOfSpeech: 'v.',
    meaning: '评估；评价',
    example: 'Researchers need to evaluate the long-term effect of the plan.',
    contextHint: '阅读中常与研究、政策、证据和结果搭配。',
  ),
  WordItem(
    word: 'maintain',
    partOfSpeech: 'v.',
    meaning: '维持；主张',
    example: 'The author maintains that context shapes individual choices.',
    contextHint: '注意它既能表示“保持”，也能表示作者“主张”。',
  ),
];

const readingParagraphs = [
  'In recent years, universities have paid increasing attention to how students build habits outside the classroom. A significant finding is that learning rarely improves through isolated memory work alone. It becomes more stable when new knowledge is repeatedly used in meaningful contexts.',
  'This is especially true for language learners. A student may assume that knowing a word list is enough, but reading requires the learner to evaluate how each word works with surrounding ideas. When vocabulary appears in an argument, a sentence may test not only meaning but also logic.',
  'For this reason, effective learners often maintain a simple cycle: remember, read, answer, and review. The cycle does not promise quick results, but it helps learners notice weak words and return to them with clearer purpose.',
];

const questions = [
  QuestionItem(
    type: '主旨题',
    question: 'What is the passage mainly about?',
    options: [
      'The pressure created by university reading tasks.',
      'The value of connecting vocabulary memory with reading practice.',
      'The importance of replacing word lists with grammar drills.',
      'The reason why quick results are common in language learning.',
    ],
    answer: 'B',
    reason: '文章反复强调“单词记忆 + 阅读语境 + 复盘”的循环，因此 B 最符合主旨。',
  ),
  QuestionItem(
    type: '推断题',
    question: 'What can be inferred about isolated memory work?',
    options: [
      'It should be avoided in every learning plan.',
      'It is useful but insufficient without later use.',
      'It works better than reading for most learners.',
      'It is only suitable for advanced learners.',
    ],
    answer: 'B',
    reason: '原文说 isolated memory work alone 难以稳定提升，暗示它需要与使用场景结合。',
  ),
];

const coachInsights = [
  CoachInsight(
    title: '判断',
    description: '你的词汇识别不错，但推断题还需要把“词义”放回段落逻辑中判断。',
    icon: LucideIcons.brain,
  ),
  CoachInsight(
    title: '原因',
    description: '最近薄弱词多出现在观点转折和作者态度句，单独背词时容易忽略语气。',
    icon: LucideIcons.route,
  ),
  CoachInsight(
    title: '下一步',
    description: '先复习 4 个薄弱词，再做 1 篇推断题更明显的阅读；解析时标出原文依据。',
    icon: LucideIcons.target,
  ),
];
