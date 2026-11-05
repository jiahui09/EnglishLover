import 'package:flutter/material.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../design/el_theme.dart';
import '../design/el_tokens.dart';
import '../features/coach/coach_page.dart';
import '../features/home/home_page.dart';
import '../features/reading/reading_page.dart';
import '../features/words/words_page.dart';
import '../shared/learning_session.dart';

class ELAppShell extends StatefulWidget {
  const ELAppShell({super.key});

  @override
  State<ELAppShell> createState() => _ELAppShellState();
}

class _ELAppShellState extends State<ELAppShell> {
  int _selectedIndex = 0;
  late final LearningSessionController _session;

  @override
  void initState() {
    super.initState();
    _session = LearningSessionController()..addListener(_handleSessionUpdate);
  }

  @override
  void dispose() {
    _session
      ..removeListener(_handleSessionUpdate)
      ..dispose();
    super.dispose();
  }

  void _handleSessionUpdate() {
    if (!mounted) return;
    setState(() {});
  }

  void _selectPage(int index) {
    if (index == 3) {
      _session.markCoachReviewed();
    }
    setState(() => _selectedIndex = index);
  }

  void _returnToToday() {
    _selectPage(0);
  }

  @override
  Widget build(BuildContext context) {
    final colors = ELTheme.colorsOf(context);
    final pages = [
      HomePage(session: _session, onNavigate: _selectPage),
      WordsPage(session: _session, onNavigate: _selectPage, onExitFocus: _returnToToday),
      ReadingPage(session: _session, onNavigate: _selectPage, onExitFocus: _returnToToday),
      CoachPage(session: _session, onNavigate: _selectPage),
    ];

    return LayoutBuilder(
        builder: (context, constraints) {
          final useRail = constraints.maxWidth >= ELTokens.sideRailBreakpoint;
          final focusMode = _session.isWordFocusActive || _session.isReadingFocusActive;
        final content = Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(
              maxWidth: ELTokens.maxContentWidth,
            ),
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 180),
              switchInCurve: Curves.easeOut,
              switchOutCurve: Curves.easeIn,
              child: KeyedSubtree(
                key: ValueKey(_selectedIndex),
                child: pages[_selectedIndex],
              ),
            ),
          ),
        );

        if (useRail && !focusMode) {
          return Scaffold(
            body: SafeArea(
              child: Row(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 16,
                    ),
                    child: NavigationRail(
                      selectedIndex: _selectedIndex,
                      onDestinationSelected: _selectPage,
                      labelType: NavigationRailLabelType.all,
                      leading: const _BrandMark(),
                      destinations: _railDestinations,
                    ),
                  ),
                  Container(width: 1, color: colors.border),
                  Expanded(child: content),
                ],
              ),
            ),
          );
        }

        return Scaffold(
          body: SafeArea(child: content),
          bottomNavigationBar: focusMode
              ? null
              : NavigationBar(
                  selectedIndex: _selectedIndex,
                  onDestinationSelected: _selectPage,
                  destinations: _barDestinations,
                ),
        );
      },
    );
  }
}

const _barDestinations = [
  NavigationDestination(
    icon: Icon(LucideIcons.house),
    selectedIcon: Icon(LucideIcons.house),
    label: '今日',
  ),
  NavigationDestination(
    icon: Icon(LucideIcons.bookMarked),
    selectedIcon: Icon(LucideIcons.bookMarked),
    label: '单词',
  ),
  NavigationDestination(
    icon: Icon(LucideIcons.bookOpenText),
    selectedIcon: Icon(LucideIcons.bookOpenText),
    label: '阅读',
  ),
  NavigationDestination(
    icon: Icon(LucideIcons.brain),
    selectedIcon: Icon(LucideIcons.brain),
    label: '教练',
  ),
];

const _railDestinations = [
  NavigationRailDestination(
    icon: Icon(LucideIcons.house),
    selectedIcon: Icon(LucideIcons.house),
    label: Text('今日学习'),
  ),
  NavigationRailDestination(
    icon: Icon(LucideIcons.bookMarked),
    selectedIcon: Icon(LucideIcons.bookMarked),
    label: Text('单词训练'),
  ),
  NavigationRailDestination(
    icon: Icon(LucideIcons.bookOpenText),
    selectedIcon: Icon(LucideIcons.bookOpenText),
    label: Text('阅读训练'),
  ),
  NavigationRailDestination(
    icon: Icon(LucideIcons.brain),
    selectedIcon: Icon(LucideIcons.brain),
    label: Text('教练建议'),
  ),
];

class _BrandMark extends StatelessWidget {
  const _BrandMark();

  @override
  Widget build(BuildContext context) {
    final colors = ELTheme.colorsOf(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: colors.primary,
          borderRadius: ELTokens.radius16All,
        ),
        alignment: Alignment.center,
        child: Text(
          'EL',
          style: TextStyle(
            color: colors.surface,
            fontSize: 15,
            fontWeight: FontWeight.w800,
            letterSpacing: .3,
          ),
        ),
      ),
    );
  }
}
