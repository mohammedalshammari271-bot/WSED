/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { QUESTIONS_DATA } from "./questionsData";
import { AppState } from "./types";
import Navbar from "./components/Navbar";
import HomeScreen from "./components/HomeScreen";
import PracticeScreen from "./components/PracticeScreen";
import ResultsScreen from "./components/ResultsScreen";
import { motion, AnimatePresence } from "motion/react";

const STORAGE_KEY = "madrasati-arabic-interrogatives-v2";

export default function App() {
  // Primary state hook
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          currentScreen: parsed.currentScreen || "home",
          currentIndex: parsed.currentIndex !== undefined ? parsed.currentIndex : 0,
          answers: parsed.answers || {},
          shownAnswers: parsed.shownAnswers || {},
          ratings: parsed.ratings || {},
          mastery: parsed.mastery || {},
          expandedCards: parsed.expandedCards || { "p50-q01": true },
          theme: parsed.theme || "light",
          filter: parsed.filter || "all",
        };
      } catch (e) {
        console.error("Error reading saved state:", e);
      }
    }

    return {
      currentScreen: "home",
      currentIndex: 0,
      answers: {},
      shownAnswers: {},
      ratings: {},
      mastery: {},
      expandedCards: { "p50-q01": true },
      theme: "light",
      filter: "all",
    };
  });

  const [showResetModal, setShowResetModal] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Sync html data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  // Reset progress handler
  const handleReset = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: "practice",
      currentIndex: 0,
      answers: {},
      shownAnswers: {},
      ratings: {},
      mastery: {},
      expandedCards: { "p50-q01": true },
      filter: "all",
    }));
    setShowResetModal(false);
  };

  const handleToggleTheme = () => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const handleNavigate = (screen: "home" | "practice" | "results") => {
    setState((prev) => ({
      ...prev,
      currentScreen: screen,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSetIndex = (idx: number) => {
    setState((prev) => ({
      ...prev,
      currentIndex: idx,
    }));
  };

  const handleUpdateAnswer = (qId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [qId]: text,
      },
    }));
  };

  const handleRevealAnswer = (qId: string) => {
    setState((prev) => ({
      ...prev,
      shownAnswers: {
        ...prev.shownAnswers,
        [qId]: true,
      },
    }));
  };

  const handleSetRating = (qId: string, score: number) => {
    setState((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [qId]: score,
      },
    }));
  };

  const handleSetMastery = (qId: string, status: "high" | "mid" | "low") => {
    setState((prev) => ({
      ...prev,
      mastery: {
        ...prev.mastery,
        [qId]: status,
      },
    }));
  };

  const handleSetFilter = (
    newFilter: "all" | "unanswered" | "unrated" | "needs_review" | "not_mastered" | "mastered"
  ) => {
    setState((prev) => ({
      ...prev,
      filter: newFilter,
    }));
  };

  const handleJumpToQuestion = (idx: number) => {
    setState((prev) => ({
      ...prev,
      currentScreen: "practice",
      currentIndex: idx,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const answeredCount = Object.keys(state.answers).filter(
    (k) => state.answers[xId(k)]?.trim().length > 0
  ).length;

  function xId(id: string): string {
    return id;
  }

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg text-theme-text-main transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentScreen={state.currentScreen}
        theme={state.theme}
        onNavigate={handleNavigate}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="container mx-auto max-w-4xl px-4 py-8 flex-1">
        {state.currentScreen === "home" && (
          <HomeScreen
            totalQuestions={QUESTIONS_DATA.length}
            answeredCount={answeredCount}
            onNavigate={handleNavigate}
            onResetPrompt={() => setShowResetModal(true)}
          />
        )}

        {state.currentScreen === "practice" && (
          <PracticeScreen
            questions={QUESTIONS_DATA}
            currentIndex={state.currentIndex}
            answers={state.answers}
            shownAnswers={state.shownAnswers}
            ratings={state.ratings}
            mastery={state.mastery}
            filter={state.filter}
            onSetIndex={handleSetIndex}
            onUpdateAnswer={handleUpdateAnswer}
            onRevealAnswer={handleRevealAnswer}
            onSetRating={handleSetRating}
            onSetMastery={handleSetMastery}
            onSetFilter={handleSetFilter}
            onNavigate={handleNavigate}
          />
        )}

        {state.currentScreen === "results" && (
          <ResultsScreen
            questions={QUESTIONS_DATA}
            answers={state.answers}
            shownAnswers={state.shownAnswers}
            ratings={state.ratings}
            mastery={state.mastery}
            onNavigate={handleNavigate}
            onJumpToQuestion={handleJumpToQuestion}
            onResetPrompt={() => setShowResetModal(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="text-center py-6 px-4 text-xs font-semibold text-theme-text-muted bg-theme-card border-t border-theme-border transition-colors duration-200">
        <p>© ٢٠٢٦ تطبيق مدرسي التعليمي — جميع الأسئلة والأجوبة مأخوذة بأمانة تامة من المصادر الرسمية لوزارة التربية العراقية.</p>
      </footer>

      {/* Custom Reset Confirmation Modal Dialog */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowResetModal(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="bg-theme-card border border-theme-border rounded-2xl p-6 w-full max-w-md shadow-2xl relative z-10 text-center space-y-4"
            >
              <h3 className="text-xl font-black text-theme-primary">
                تأكيد إعادة التدريب والمحاولة
              </h3>
              <p className="text-sm text-theme-text-muted leading-relaxed font-semibold">
                هل أنت متأكد من رغبتك في حذف جميع إجاباتك السابقة، التقييمات الذاتية، ومستويات تمكنك وبدء محاولة نظيفة من الصفر؟ لا يمكن التراجع عن هذا الإجراء مطلقاً.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-5 rounded-full cursor-pointer transition-colors text-sm"
                  onClick={handleReset}
                >
                  نعم، ابدأ محاولة جديدة
                </button>
                <button
                  className="bg-theme-bg border border-theme-border text-theme-text-main hover:bg-theme-bg/80 font-bold py-2.5 px-5 rounded-full cursor-pointer transition-colors text-sm"
                  onClick={() => setShowResetModal(false)}
                >
                  إلغاء التراجع
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
