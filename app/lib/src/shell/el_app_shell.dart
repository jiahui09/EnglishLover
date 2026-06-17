import 'package:flutter/material.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import '../design/el_tokens.dart';
import '../features/coach/coach_page.dart';
import '../features/home/home_page.dart';
import '../features/reading/reading_page.dart';
import '../features/words/words_page.dart';

class ELAppShell extends StatefulWidget {
  const ELAppShell({super.key});

  @override
  State<ELAppShell> createState() => _ELAppShellState();
}

class _ELAppShellState extends State<ELAppShell> {
  int _selectedIndex = 0;

  void _selectPage(int index) {
    setState(() => _selectedIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      HomePage(onNavigate: _selectPage),
      WordsPage(onNavigate: _selectPage),
      ReadingPage(onNavigate: _selectPage),
      CoachPage(onNavigate: _selectPage),
    ];

    return LayoutBuilder(
      builder: (context, constraints) {
        final useRail = constraints.maxWidth >= ELTokens.sideRailBreakpoint;
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

        if (useRail) {
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
                  Container(width: 1, color: ELTokens.line),
                  Expanded(child: content),
                ],
              ),
            ),
          );
        }

        return Scaffold(
          body: SafeArea(child: content),
          bottomNavigationBar: NavigationBar(
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
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Container(
        width: 44,
        height: 44,
        decoration: const BoxDecoration(
          color: ELTokens.coachGreen,
          borderRadius: ELTokens.radius16All,
        ),
        alignment: Alignment.center,
        child: const Text(
          'EL',
          style: TextStyle(
            color: ELTokens.card,
            fontSize: 15,
            fontWeight: FontWeight.w800,
            letterSpacing: .3,
          ),
        ),
      ),
    );
  }
}
