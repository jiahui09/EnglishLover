import 'dart:async';

import 'package:flutter/foundation.dart';

import 'mock_learning_data.dart';

enum WordFeedback { known, unsure, unknown }

enum ReadingStage { intro, generating, article, quiz, result }

class LearningSessionController extends ChangeNotifier {
  bool _disposed = false;

  bool _wordFocusActive = false;
  bool _wordSessionCompleted = false;
  bool _reviewWeakWordsOnly = false;
  int _wordIndex = 0;
  bool _wordMeaningVisible = false;
  final Map<String, WordFeedback> _wordFeedbackByWord = {};

  ReadingStage _readingStage = ReadingStage.intro;
  bool _usingPresetReading = false;
  bool _coachReviewed = false;
  int _questionIndex = 0;
  final Map<int, String> _selectedAnswers = {};

  bool get isWordFocusActive => _wordFocusActive;
  bool get isReadingFocusActive => _readingStage != ReadingStage.intro;
  bool get wordSessionCompleted => _wordSessionCompleted;
  bool get reviewWeakWordsOnly => _reviewWeakWordsOnly;
  bool get wordMeaningVisible => _wordMeaningVisible;
  ReadingStage get readingStage => _readingStage;
  bool get usingPresetReading => _usingPresetReading;
  bool get coachReviewed => _coachReviewed;
  int get questionIndex => _questionIndex;

  List<WordItem> get activeWords {
    if (!_reviewWeakWordsOnly) return wordItems;
    final weak = weakWordItems;
    return weak.isEmpty ? wordItems : weak;
  }

  WordItem get currentWord => activeWords[_wordIndex];
  int get wordIndex => _wordIndex;
  int get wordTotal => activeWords.length;
  int get answeredWordCount => _wordFeedbackByWord.length;
  int get knownCount => _countWordFeedback(WordFeedback.known);
  int get unsureCount => _countWordFeedback(WordFeedback.unsure);
  int get unknownCount => _countWordFeedback(WordFeedback.unknown);
  double get todayProgress {
    var completedSteps = 0;
    if (_wordSessionCompleted) completedSteps += 1;
    if (_readingStage == ReadingStage.result) completedSteps += 2;
    if (_coachReviewed && _readingStage == ReadingStage.result) completedSteps += 1;
    return completedSteps / 4;
  }

  List<String> get weakWords {
    final weak = <String>{};
    _wordFeedbackByWord.forEach((word, feedback) {
      if (feedback != WordFeedback.known) weak.add(word);
    });
    if (_readingStage == ReadingStage.result && accuracy < 1) {
      for (final word in targetWords.take(3)) {
        weak.add(word);
      }
    }
    return weak.toList(growable: false);
  }

  List<WordItem> get weakWordItems {
    final weak = weakWords.toSet();
    return wordItems.where((item) => weak.contains(item.word)).toList(growable: false);
  }

  bool get canGenerateReading => _wordSessionCompleted;
  bool get readingCompleted => _readingStage == ReadingStage.result;
  bool get hasAnyLearningRecord => _wordSessionCompleted || _readingStage == ReadingStage.result;
  bool get hasEnoughDataForCoach => _wordSessionCompleted && _readingStage == ReadingStage.result;
  bool get isTodayComplete => _coachReviewed && _readingStage == ReadingStage.result;

  QuestionItem get currentQuestion => questions[_questionIndex];
  int get questionTotal => questions.length;

  double get accuracy {
    if (_readingStage != ReadingStage.result) return 0;
    final correct = correctAnswersCount;
    return questions.isEmpty ? 0 : correct / questions.length;
  }

  int get correctAnswersCount {
    var correct = 0;
    for (var i = 0; i < questions.length; i++) {
      if (_selectedAnswers[i] == questions[i].answer) correct += 1;
    }
    return correct;
  }

  String? selectedAnswerFor(int index) => _selectedAnswers[index];

  void startWords({bool reviewWeakWordsOnly = false}) {
    _reviewWeakWordsOnly = reviewWeakWordsOnly;
    _wordFocusActive = true;
    _wordSessionCompleted = false;
    _wordIndex = 0;
    _wordMeaningVisible = false;
    notifySafely();
  }

  void revealMeaning() {
    if (_wordMeaningVisible) return;
    _wordMeaningVisible = true;
    notifySafely();
  }

  void submitWordFeedback(WordFeedback feedback) {
    final word = currentWord.word;
    _wordFeedbackByWord[word] = feedback;
    if (_wordIndex >= activeWords.length - 1) {
      _wordFocusActive = false;
      _wordSessionCompleted = true;
      _reviewWeakWordsOnly = false;
      _wordMeaningVisible = false;
      notifySafely();
      return;
    }
    _wordIndex += 1;
    _wordMeaningVisible = false;
    notifySafely();
  }

  void abandonWordFocus() {
    _wordFocusActive = false;
    _wordMeaningVisible = false;
    notifySafely();
  }

  void openReadingIntro() {
    if (_readingStage == ReadingStage.intro) return;
    _readingStage = ReadingStage.intro;
    notifySafely();
  }

  void startReadingGeneration() {
    _readingStage = ReadingStage.generating;
    _usingPresetReading = false;
    _questionIndex = 0;
    _selectedAnswers.clear();
    notifySafely();

    Future<void>.delayed(const Duration(milliseconds: 1200), () {
      if (_disposed || _readingStage != ReadingStage.generating) return;
      _readingStage = ReadingStage.article;
      notifySafely();
    });
  }

  void usePresetReading() {
    _readingStage = ReadingStage.article;
    _usingPresetReading = true;
    notifySafely();
  }

  void retryReadingGeneration() {
    startReadingGeneration();
  }

  void startQuiz() {
    _readingStage = ReadingStage.quiz;
    _questionIndex = 0;
    notifySafely();
  }

  void selectAnswer(String answer) {
    _selectedAnswers[_questionIndex] = answer;
    notifySafely();
  }

  bool get hasAnsweredCurrentQuestion =>
      _selectedAnswers.containsKey(_questionIndex);

  bool get isOnLastQuestion => _questionIndex == questions.length - 1;

  void nextQuestion() {
    if (_questionIndex >= questions.length - 1) return;
    _questionIndex += 1;
    notifySafely();
  }

  void submitQuiz() {
    _readingStage = ReadingStage.result;
    notifySafely();
  }

  void markCoachReviewed() {
    if (!readingCompleted || _coachReviewed) return;
    _coachReviewed = true;
    notifySafely();
  }

  String get coachHeadline {
    if (!hasEnoughDataForCoach) {
      return '先完成一组单词和一篇阅读，我会给出更准确的下一步建议。';
    }
    if (accuracy < .6) {
      return '先压缩新词量，回炉薄弱词，再做一篇推断题更明显的阅读。';
    }
    if (unknownCount > 0 || unsureCount > 0) {
      return '先复习 ${weakWords.length} 个薄弱词，再把它们放回一篇阅读里。';
    }
    return '今天的闭环已经跑通，明天先复习薄弱词，再继续稳定阅读正确率。';
  }

  String get coachReason {
    if (!hasEnoughDataForCoach) {
      return '目前记录还不足，建议先完成单词输入和阅读输出，再根据表现做个性化调整。';
    }
    return '最近阅读正确率 ${(accuracy * 100).round()}%，词汇识别 ${vocabularyRecognitionRate.round()}%。推断题和薄弱词回流最值得优先处理。';
  }

  int get vocabularyRecognitionRate {
    final total = knownCount + unsureCount + unknownCount;
    if (total == 0) return 0;
    return ((knownCount + unsureCount * .5) / total * 100).round();
  }

  int _countWordFeedback(WordFeedback feedback) {
    return _wordFeedbackByWord.values.where((value) => value == feedback).length;
  }

  void notifySafely() {
    if (_disposed) return;
    notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }
}
