import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../../components/el_badge.dart';
import '../../components/el_button.dart';
import '../../components/el_card.dart';
import '../../components/el_empty_state.dart';
import '../../components/el_section_header.dart';
import '../../design/el_tokens.dart';
import '../../shared/mock_learning_data.dart';

class WordsPage extends StatefulWidget {
  const WordsPage({super.key, required this.onNavigate});

  final ValueChanged<int> onNavigate;

  @override
  State<WordsPage> createState() => _WordsPageState();
}

class _WordsPageState extends State<WordsPage> {
  var _index = 0;
  var _showMeaning = false;

  WordItem get _word => wordItems[_index];

  void _nextWord() {
    setState(() {
      _index = (_index + 1).clamp(0, wordItems.length - 1);
      _showMeaning = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final completed = _index == wordItems.length - 1;
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('单词训练', style: theme.textTheme.h1),
          const SizedBox(height: ELTokens.space8),
          Text('这些词会用于稍后的考研阅读生成。请按真实掌握情况选择。', style: theme.textTheme.lead),
          const SizedBox(height: ELTokens.space20),
          ELCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    ELBadge('第 ${_index + 1} / ${wordItems.length} 个'),
                    const Spacer(),
                    const ELBadge('预计 6 分钟', tone: ELBadgeTone.word),
                  ],
                ),
                const SizedBox(height: ELTokens.space16),
                ShadProgress(
                  value: (_index + 1) / wordItems.length,
                  color: ELTokens.coachGreen,
                  backgroundColor: ELTokens.quietLine,
                  minHeight: 10,
                  semanticsLabel: '单词训练进度',
                  semanticsValue: '${_index + 1}/${wordItems.length}',
                ),
              ],
            ),
          ),
          const SizedBox(height: ELTokens.space16),
          _WordCard(
            word: _word,
            showMeaning: _showMeaning,
            onReveal: () => setState(() => _showMeaning = true),
          ),
          const SizedBox(height: ELTokens.space16),
          ELCard(
            shadows: const [],
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const ELSectionHeader(
                  title: '掌握反馈',
                  subtitle: '三个按钮权重一致，避免为了进度误选“认识”。',
                ),
                const SizedBox(height: ELTokens.space16),
                LayoutBuilder(
                  builder: (context, constraints) {
                    final stacked = constraints.maxWidth < 520;
                    final buttons = [
                      ELButton.outline(
                        label: '认识',
                        onPressed: completed ? null : _nextWord,
                        expands: stacked,
                      ),
                      ELButton.outline(
                        label: '模糊',
                        onPressed: completed ? null : _nextWord,
                        expands: stacked,
                      ),
                      ELButton.outline(
                        label: '不认识',
                        onPressed: completed ? null : _nextWord,
                        expands: stacked,
                      ),
                    ];
                    if (stacked) {
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          for (var i = 0; i < buttons.length; i++) ...[
                            if (i > 0) const SizedBox(height: ELTokens.space8),
                            buttons[i],
                          ],
                        ],
                      );
                    }
                    return Row(
                      children: [
                        for (var i = 0; i < buttons.length; i++) ...[
                          if (i > 0) const SizedBox(width: ELTokens.space8),
                          Expanded(child: buttons[i]),
                        ],
                      ],
                    );
                  },
                ),
                const SizedBox(height: ELTokens.space12),
                Text('本轮已标记：认识 3 · 模糊 2 · 不认识 1', style: theme.textTheme.small),
              ],
            ),
          ),
          const SizedBox(height: ELTokens.space16),
          ELEmptyState(
            title: '本轮完成后建议进入阅读',
            description: '把刚复习的词放进文章里使用，能同时强化知识输入与输出。',
            actionLabel: '生成阅读',
            onAction: () => widget.onNavigate(2),
          ),
        ],
      ),
    );
  }
}

class _WordCard extends StatelessWidget {
  const _WordCard({
    required this.word,
    required this.showMeaning,
    required this.onReveal,
  });

  final WordItem word;
  final bool showMeaning;
  final VoidCallback onReveal;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return ELCard(
      backgroundColor: ELTokens.card,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(word.word, style: theme.textTheme.h1.copyWith(fontSize: 34)),
          const SizedBox(height: ELTokens.space8),
          Text('先回忆它的意思，再点击查看释义。', style: theme.textTheme.muted),
          const SizedBox(height: ELTokens.space20),
          if (!showMeaning)
            ELButton.primary(label: '查看释义', onPressed: onReveal)
          else ...[
            Text(
              '${word.partOfSpeech} ${word.meaning}',
              style: theme.textTheme.h4,
            ),
            const SizedBox(height: ELTokens.space16),
            _WordInfoBlock(title: '例句', body: word.example),
            const SizedBox(height: ELTokens.space12),
            _WordInfoBlock(title: '考研语境提示', body: word.contextHint),
          ],
        ],
      ),
    );
  }
}

class _WordInfoBlock extends StatelessWidget {
  const _WordInfoBlock({required this.title, required this.body});

  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: ELTokens.paper,
        borderRadius: ELTokens.radius16All,
        border: Border.all(color: ELTokens.line),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: theme.textTheme.small),
          const SizedBox(height: ELTokens.space4),
          Text(body, style: theme.textTheme.p),
        ],
      ),
    );
  }
}
