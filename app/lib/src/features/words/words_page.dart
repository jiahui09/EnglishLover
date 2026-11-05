import 'package:flutter/material.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../../components/el_button.dart';
import '../../design/el_theme.dart';
import '../../design/el_tokens.dart';
import '../../shared/mock_learning_data.dart';

class WordsPage extends StatefulWidget {
  const WordsPage({
    super.key,
    required this.onNavigate,
    required this.onExitFocus,
  });

  final ValueChanged<int> onNavigate;
  final VoidCallback onExitFocus;

  @override
  State<WordsPage> createState() => _WordsPageState();
}

class _WordsPageState extends State<WordsPage> {
  var _index = 0;
  var _isFlipped = false;
  var _sessionDone = false;

  WordItem get _word => wordItems[_index];

  void _flipToBack() {
    if (_isFlipped) return;
    setState(() => _isFlipped = true);
  }

  void _recordFeedback() {
    if (!_isFlipped) return;
    setState(() {
      if (_index >= wordItems.length - 1) {
        _sessionDone = true;
        return;
      }
      _index += 1;
      _isFlipped = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = ELTheme.colorsOf(context);

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: _sessionDone
            ? _WordSessionDone(
                onExit: widget.onExitFocus,
                onGenerateReading: () => widget.onNavigate(2),
              )
            : _WordImmersiveStage(
                word: _word,
                index: _index,
                total: wordItems.length,
                isFlipped: _isFlipped,
                onFlip: _flipToBack,
                onFeedback: _recordFeedback,
                onExit: widget.onExitFocus,
              ),
      ),
    );
  }
}

class _WordImmersiveStage extends StatelessWidget {
  const _WordImmersiveStage({
    required this.word,
    required this.index,
    required this.total,
    required this.isFlipped,
    required this.onFlip,
    required this.onFeedback,
    required this.onExit,
  });

  final WordItem word;
  final int index;
  final int total;
  final bool isFlipped;
  final VoidCallback onFlip;
  final VoidCallback onFeedback;
  final VoidCallback onExit;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: isFlipped ? null : onFlip,
            child: Center(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 180),
                switchInCurve: Curves.easeOut,
                switchOutCurve: Curves.easeIn,
                child: isFlipped
                    ? _WordBackFace(
                        key: ValueKey('back-${word.word}'),
                        word: word,
                      )
                    : _WordFrontFace(
                        key: ValueKey('front-${word.word}'),
                        word: word,
                      ),
              ),
            ),
          ),
        ),
        Positioned(
          top: ELTokens.space8,
          left: ELTokens.space8,
          child: _FocusIconButton(
            icon: LucideIcons.x,
            semanticLabel: '退出单词训练',
            onPressed: onExit,
          ),
        ),
        Positioned(
          top: ELTokens.space8,
          right: ELTokens.space8,
          child: _FocusIconButton(
            icon: LucideIcons.settings2,
            semanticLabel: '单词训练设置',
            onPressed: () {},
          ),
        ),
        if (isFlipped)
          Positioned(
            left: ELTokens.space24,
            right: ELTokens.space24,
            bottom: ELTokens.space72,
            child: AnimatedOpacity(
              opacity: 1,
              duration: const Duration(milliseconds: 160),
              child: _EqualFeedbackButtons(onFeedback: onFeedback),
            ),
          ),
        Positioned(
          left: ELTokens.space24,
          right: ELTokens.space24,
          bottom: ELTokens.space8,
          child: _ZenProgress(index: index, total: total),
        ),
      ],
    );
  }
}

class _FocusIconButton extends StatelessWidget {
  const _FocusIconButton({
    required this.icon,
    required this.semanticLabel,
    required this.onPressed,
  });

  final IconData icon;
  final String semanticLabel;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final colors = ELTheme.colorsOf(context);
    return IconButton(
      icon: Icon(icon, size: 20),
      color: colors.mutedText,
      tooltip: semanticLabel,
      onPressed: onPressed,
    );
  }
}

class _WordFrontFace extends StatelessWidget {
  const _WordFrontFace({super.key, required this.word});

  final WordItem word;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final colors = ELTheme.colorsOf(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          word.word,
          textAlign: TextAlign.center,
          style: theme.textTheme.h1.copyWith(
            color: colors.primary,
            fontSize: 48,
            fontWeight: FontWeight.w700,
            height: 1.05,
          ),
        ),
        const SizedBox(height: ELTokens.space8),
        Text(_phoneticFor(word.word), style: theme.textTheme.muted),
        const SizedBox(height: ELTokens.space24),
        Text('点击屏幕任意区域显示释义', style: theme.textTheme.small),
      ],
    );
  }
}

class _WordBackFace extends StatelessWidget {
  const _WordBackFace({super.key, required this.word});

  final WordItem word;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final colors = ELTheme.colorsOf(context);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: ELTokens.space24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Transform.translate(
            offset: const Offset(0, -ELTokens.space24),
            child: Text(
              word.word,
              textAlign: TextAlign.center,
              style: theme.textTheme.h1.copyWith(
                color: colors.primary,
                fontSize: 42,
                fontWeight: FontWeight.w700,
                height: 1.08,
              ),
            ),
          ),
          const SizedBox(height: ELTokens.space16),
          Text(
            '${word.partOfSpeech} ${word.meaning}',
            textAlign: TextAlign.center,
            style: theme.textTheme.h2.copyWith(
              color: colors.text,
              fontSize: 22,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: ELTokens.space24),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: Text(
              word.example,
              textAlign: TextAlign.center,
              style: theme.textTheme.p.copyWith(
                color: colors.mutedText,
                height: 1.6,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EqualFeedbackButtons extends StatelessWidget {
  const _EqualFeedbackButtons({required this.onFeedback});

  final VoidCallback onFeedback;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: ELButton.outline(
            label: '认识',
            onPressed: onFeedback,
            expands: true,
          ),
        ),
        const SizedBox(width: ELTokens.space8),
        Expanded(
          child: ELButton.outline(
            label: '模糊',
            onPressed: onFeedback,
            expands: true,
          ),
        ),
        const SizedBox(width: ELTokens.space8),
        Expanded(
          child: ELButton.outline(
            label: '不认识',
            onPressed: onFeedback,
            expands: true,
          ),
        ),
      ],
    );
  }
}

class _ZenProgress extends StatelessWidget {
  const _ZenProgress({required this.index, required this.total});

  final int index;
  final int total;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final colors = ELTheme.colorsOf(context);
    final progress = (index + 1) / total;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            Text('${index + 1}/$total', style: theme.textTheme.small),
            const Spacer(),
            Text('00:14', style: theme.textTheme.small),
          ],
        ),
        const SizedBox(height: ELTokens.space8),
        ClipRRect(
          borderRadius: BorderRadius.circular(999),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 2,
            backgroundColor: colors.quietSurface,
            valueColor: AlwaysStoppedAnimation<Color>(
              colors.primary.withValues(alpha: .45),
            ),
            semanticsLabel: '单词训练进度',
            semanticsValue: '${(progress * 100).round()}%',
          ),
        ),
      ],
    );
  }
}

class _WordSessionDone extends StatelessWidget {
  const _WordSessionDone({
    required this.onExit,
    required this.onGenerateReading,
  });

  final VoidCallback onExit;
  final VoidCallback onGenerateReading;

  @override
  Widget build(BuildContext context) {
    final theme = ShadTheme.of(context);
    final colors = ELTheme.colorsOf(context);
    return Stack(
      children: [
        Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: ELTokens.space24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '本轮单词已完成',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.h1.copyWith(color: colors.primary),
                ),
                const SizedBox(height: ELTokens.space16),
                Text(
                  '这些词已经进入今日阅读的目标词池，下一步把它们放回文章语境。',
                  textAlign: TextAlign.center,
                  style: theme.textTheme.lead,
                ),
                const SizedBox(height: ELTokens.space24),
                ELButton.primary(
                  label: '生成今日阅读',
                  onPressed: onGenerateReading,
                  trailing: const Icon(LucideIcons.arrowRight, size: 18),
                ),
              ],
            ),
          ),
        ),
        Positioned(
          top: ELTokens.space8,
          left: ELTokens.space8,
          child: _FocusIconButton(
            icon: LucideIcons.x,
            semanticLabel: '返回今日学习',
            onPressed: onExit,
          ),
        ),
      ],
    );
  }
}

String _phoneticFor(String word) {
  return switch (word.toLowerCase()) {
    'significant' => '/sɪɡˈnɪfɪkənt/',
    'evaluate' => '/ɪˈvæljueɪt/',
    'maintain' => '/meɪnˈteɪn/',
    _ => '/ ${word.toLowerCase()} /',
  };
}
