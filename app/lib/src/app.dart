import 'package:flutter/material.dart' show ThemeMode;
import 'package:flutter/widgets.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

import 'design/el_theme.dart';
import 'shell/el_app_shell.dart';

class EnglishLoverApp extends StatelessWidget {
  const EnglishLoverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ShadApp(
      title: 'EnglishLover',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.light,
      theme: ELTheme.shadTheme,
      materialThemeBuilder: ELTheme.materialThemeBuilder,
      home: const ELAppShell(),
      builder: (context, child) => child!,
    );
  }
}
