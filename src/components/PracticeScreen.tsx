/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Eye,
  Filter,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Question } from "../types";

interface PracticeScreenProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  shownAnswers: Record<string, boolean>;
  ratings: Record<string, number>;
  mastery: Record<string, "high" | "mid" | "low" | undefined>;
  filter: "all" | "unanswered" | "unrated" | "needs_review" | "not_mastered" | "mastered";
  onSetIndex: (idx: number) => void;
  onUpdateAnswer: (qId: string, text: string) => void;
  onRevealAnswer: (qId: string) => void;
  onSetRating: (qId: string, score: number) => void;
  onSetMastery: (qId: string, status: "high" | "mid" | "low") => void;
  onSetFilter: (newFilter: any) => void;
  onNavigate: (screen: "home" | "practice" | "results") => void;
}

// Academic labels based on self-evaluation score
function getAcademicLabel(score: number): string {
  if (score === 0) return "بحاجة لتركيز أكبر وتأسيس كامل ❌";
  if (score <= 2) return "تحتاج جهد إضافي ومراجعة دقيقة ⚠️";
  if (score <= 4) return "مقبول — تحتاج سد بعض الثغرات 👍";
  if (score <= 6) return "جيد — أداء مرضي ومتماسك ✨";
  if (score <= 8) return "جيد جداً — اقتربت من الإتقان الكامل 🌟";
  if (score <= 9) return "ممتاز — فهم عميق ومتميز 🏆";
  return "أداء عبقري ودرجة كاملة! 👑";
}

export default function PracticeScreen({
  questions,
  currentIndex,
  answers,
  shownAnswers,
  ratings,
  mastery,
  filter,
  onSetIndex,
  onUpdateAnswer,
  onRevealAnswer,
  onSetRating,
  onSetMastery,
  onSetFilter,
  onNavigate,
}: PracticeScreenProps) {
  const [pulseBadgeId, setPulseBadgeId] = useState<string | null>(null);
  const activeDotRef = useRef<HTMLDivElement>(null);
  const activePageBtnRef = useRef<HTMLButtonElement>(null);

  // Filter helper functions
  const filteredQuestions = questions.filter((q) => {
    const isAnswered = !!answers[q.id] && answers[q.id].trim().length > 0;
    const hasRating = ratings[q.id] !== undefined;
    const masteryStatus = mastery[q.id];

    if (filter === "unanswered") return !isAnswered;
    if (filter === "unrated") return !hasRating;
    if (filter === "needs_review") return masteryStatus === "mid";
    if (filter === "not_mastered") return masteryStatus === "low";
    if (filter === "mastered") return masteryStatus === "high";
    return true; // "all"
  });

  const currentQuestion = questions[currentIndex];
  const filteredIndex = filteredQuestions.findIndex((q) => q.id === currentQuestion?.id);

  // Auto scroll navigation elements into view
  useEffect(() => {
    if (activeDotRef.current) {
      activeDotRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (activePageBtnRef.current) {
      activePageBtnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  // Adjust active index if filtered list shifts and excludes current question
  useEffect(() => {
    if (filteredQuestions.length > 0 && filteredIndex === -1) {
      const targetQ = filteredQuestions[0];
      const origIndex = questions.findIndex((q) => q.id === targetQ.id);
      if (origIndex !== -1) {
        onSetIndex(origIndex);
      }
    }
  }, [filter]);

  // Calculate stats
  const answeredCount = questions.filter((q) => (answers[q.id] || "").trim().length > 0).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  const ratedCount = questions.filter((q) => ratings[q.id] !== undefined).length;
  const ratedPercent = Math.round((ratedCount / questions.length) * 100);

  const q = currentQuestion;
  const originalNum = currentIndex + 1;

  if (!q) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-theme-card border border-theme-border rounded-2xl max-w-lg mx-auto">
        <Filter className="text-theme-primary mb-4 opacity-50" size={48} />
        <h3 className="text-xl font-bold text-theme-text-main mb-2">لا توجد أسئلة تطابق التصفية الحالية</h3>
        <p className="text-theme-text-muted mb-6 text-sm">
          جرب اختيار تصنيف تصفية آخر أو عرض جميع الأسئلة للحل والتقييم الذاتي الأكاديمي.
        </p>
        <button
          className="bg-theme-primary hover:bg-theme-primary-hover text-white font-bold py-2 px-6 rounded-lg cursor-pointer transition-colors"
          onClick={() => onSetFilter("all")}
        >
          عرض جميع الأسئلة
        </button>
      </div>
    );
  }

  const isAnswered = !!answers[q.id] && answers[q.id].trim().length > 0;
  const isShown = !!shownAnswers[q.id];
  const hasRating = ratings[q.id] !== undefined;
  const masteryStatus = mastery[q.id];

  // Status Badge styles
  let statusText = "لم تتم الإجابة";
  let statusBadgeClass = "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400";

  if (hasRating) {
    statusText = "تم التقييم";
    statusBadgeClass = "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400";
  } else if (isShown) {
    statusText = "تم عرض الجواب";
    statusBadgeClass = "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400";
  } else if (isAnswered) {
    statusText = "تمت الإجابة";
    statusBadgeClass = "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400";
  }

  // Next and prev handlers
  const handlePrev = () => {
    if (filteredIndex > 0) {
      const targetQ = filteredQuestions[filteredIndex - 1];
      const origIndex = questions.findIndex((item) => item.id === targetQ.id);
      if (origIndex !== -1) onSetIndex(origIndex);
    }
  };

  const handleNext = () => {
    if (filteredIndex < filteredQuestions.length - 1) {
      const targetQ = filteredQuestions[filteredIndex + 1];
      const origIndex = questions.findIndex((item) => item.id === targetQ.id);
      if (origIndex !== -1) onSetIndex(origIndex);
    }
  };

  const handleRatingClick = (qId: string, score: number) => {
    onSetRating(qId, score);
    setPulseBadgeId(qId);
    setTimeout(() => setPulseBadgeId(null), 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Progress Bars and Filtering Controls */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
        {/* Double progress bars */}
        <div className="space-y-3">
          {/* Progress 1: Answered */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-theme-text-muted flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-theme-primary"></span>
                أسئلة أجبت عليها: {answeredCount} من {questions.length}
              </span>
              <span className="text-theme-primary font-bold">{progressPercent}%</span>
            </div>
            <div className="bg-theme-border h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-theme-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Progress 2: Rated */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-theme-text-main flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                أسئلة قيّمتها ذاتياً: {ratedCount} من {questions.length}
              </span>
              <span className="text-emerald-500 font-bold">{ratedPercent}%</span>
            </div>
            <div className="bg-theme-border h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${ratedPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 pt-3 border-t border-theme-border">
          <span className="text-sm font-bold text-theme-text-main flex items-center gap-1.5 shrink-0">
            <Filter size={15} />
            تصفية الأسئلة:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "الكل" },
              { id: "unanswered", label: "غير المحلولة" },
              { id: "unrated", label: "لم يتم التقييم" },
              { id: "needs_review", label: "تحتاج مراجعة" },
              { id: "not_mastered", label: "غير متمكن" },
              { id: "mastered", label: "متمكن" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSetFilter(opt.id as any)}
                className={`text-xs font-bold py-1.5 px-4 rounded-full border cursor-pointer transition-all ${
                  filter === opt.id
                    ? "bg-theme-primary border-theme-primary text-white shadow-sm"
                    : "bg-theme-bg border-theme-border text-theme-text-muted hover:border-theme-primary hover:text-theme-primary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Navigation dot rail of filtered questions */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-theme-border scrollbar-track-transparent">
          {filteredQuestions.map((item, idx) => {
            const origIdx = questions.findIndex((x) => x.id === item.id);
            const isDotActive = origIdx === currentIndex;
            const isDotAnswered = !!answers[item.id] && answers[item.id].trim().length > 0;

            return (
              <div
                key={item.id}
                ref={isDotActive ? activeDotRef : null}
                onClick={() => onSetIndex(origIdx)}
                className={`min-w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm border cursor-pointer select-none transition-all ${
                  isDotActive
                    ? "bg-theme-primary border-theme-primary text-white shadow-sm"
                    : isDotAnswered
                    ? "bg-theme-accent border-theme-primary text-theme-primary hover:bg-theme-accent/80"
                    : "bg-theme-card border-theme-border text-theme-text-main hover:border-theme-primary hover:text-theme-primary"
                }`}
                title={`سؤال ${origIdx + 1}`}
              >
                {origIdx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Question Card */}
      <div
        id={`card-${q.id}`}
        className="bg-theme-card border-2 border-theme-primary rounded-2xl shadow-md transition-all overflow-hidden"
      >
        {/* Card Header (Standardized collapsed-like styling but expanded) */}
        <div className="bg-theme-bg/50 border-b border-theme-border px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-theme-primary text-white font-extrabold w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm shrink-0">
              {originalNum}
            </span>
            <span className="text-sm font-bold text-theme-text-main truncate max-w-md">
              {q.sourceActivityLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {masteryStatus && (
              <span
                className={`text-xs font-extrabold py-1 px-2.5 rounded-full border ${
                  masteryStatus === "high"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900"
                    : masteryStatus === "mid"
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900"
                    : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900"
                }`}
              >
                {masteryStatus === "high" ? "متمكن" : masteryStatus === "mid" ? "يحتاج مراجعة" : "غير متمكن"}
              </span>
            )}
            <span className={`text-xs font-bold py-1 px-2.5 rounded-full ${statusBadgeClass}`}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Year/Exam Badge row */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900 text-xs font-bold py-1 px-3 rounded">
              {q.year}
            </span>
            <span className="bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900 text-xs font-bold py-1 px-3 rounded">
              الصفحة {q.sourcePage}
            </span>
          </div>

          {/* Quranic Citation */}
          {q.type === "quran" && q.verse && (
            <div className="my-4">
              <div
                dir="rtl"
                lang="ar"
                className="text-center font-serif text-2xl md:text-3xl leading-relaxed text-theme-quran-text bg-theme-quran-bg border-y border-theme-quran-border px-6 py-6 rounded-2xl shadow-inner border-r-4 border-l-4 border-r-theme-primary border-l-theme-primary select-none"
              >
                {q.verse}
              </div>
            </div>
          )}

          {/* Poetry Split hemistich layout */}
          {q.type === "poetry" && q.poetryLines && (
            <div className="my-4 space-y-3">
              <div className="text-xs font-bold text-theme-text-muted text-right">قال الشاعر:</div>
              {q.poetryLines.map((line, idx) => (
                <div
                  key={idx}
                  className="bg-theme-bg/30 border border-dashed border-theme-border rounded-xl p-4 text-center space-y-2 sm:space-y-0 sm:flex sm:justify-center sm:items-center sm:gap-6 font-medium text-lg"
                >
                  <span className="block sm:inline">{line.first}</span>
                  <span className="hidden sm:inline text-theme-primary font-bold opacity-60">—</span>
                  <span className="block sm:inline text-theme-text-main">{line.second}</span>
                </div>
              ))}
            </div>
          )}

          {/* Prose specific layout (if there is verse text but not poetry/quran) */}
          {q.type === "prose" && q.verse && (
            <div className="my-4 p-4 bg-theme-bg/40 border border-theme-border rounded-xl font-semibold text-lg text-center leading-relaxed">
              « {q.verse} »
            </div>
          )}

          {/* Question text with elegant vertical anchor line */}
          <div className="border-r-4 border-theme-primary pr-3 py-1 text-right">
            <h3 className="text-xl font-extrabold text-theme-text-main leading-relaxed">
              {q.text}
            </h3>
          </div>

          {/* Textarea answer input */}
          <div className="space-y-2">
            <label htmlFor={`textarea-${q.id}`} className="block text-sm font-bold text-theme-text-main">
              إجابتك الشخصية يا بطل:
            </label>
            <textarea
              id={`textarea-${q.id}`}
              disabled={isShown}
              value={answers[q.id] || ""}
              onChange={(e) => onUpdateAnswer(q.id, e.target.value)}
              placeholder="اكتب هنا إجابتك النحوية الكاملة بموضوعية قبل عرض الإجابة النموذجية..."
              className="w-full h-32 p-4 rounded-xl border border-theme-border bg-theme-bg/20 text-theme-text-main focus:border-theme-primary focus:ring-3 focus:ring-theme-primary/15 outline-none resize-none transition-all disabled:opacity-75 disabled:cursor-not-allowed font-sans text-base leading-relaxed"
            />
          </div>

          {/* Submit/Reveal model answer button */}
          {!isShown && (
            <div className="flex justify-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!answers[q.id] || answers[q.id].trim().length === 0}
                onClick={() => onRevealAnswer(q.id)}
                className="flex items-center gap-2 bg-theme-primary hover:bg-theme-primary-hover active:bg-theme-primary-active text-white font-bold py-2.5 px-6 rounded-full cursor-pointer transition-colors shadow-sm disabled:bg-theme-border disabled:text-theme-text-muted disabled:cursor-not-allowed text-sm"
              >
                <Eye size={16} />
                تمت الإجابة — أظهر الجواب النموذجي
              </motion.button>
            </div>
          )}

          {/* Hidden/Revealed components */}
          <AnimatePresence>
            {isShown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-4 border-t border-dashed border-theme-border"
              >
                {/* Model Answer container */}
                <div className="relative bg-theme-card border-2 border-theme-border rounded-xl p-5 pt-7 mt-3">
                  <div className="absolute -top-3.5 right-6 bg-theme-primary text-white text-xs font-bold py-1 px-4 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 size={14} />
                    الجواب النموذجي من المصدر:
                  </div>
                  <p className="text-theme-text-main font-bold leading-relaxed whitespace-pre-line text-base">
                    {q.modelAnswer}
                  </p>
                </div>

                {/* Self Evaluation Slider */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-lg font-black text-theme-primary flex items-center gap-2">
                    <Award size={20} />
                    ميزان التقييم الذاتي الأكاديمي (0 - 10 درجات)
                  </h4>
                  <p className="text-sm text-theme-text-muted leading-relaxed">
                    قارن إجابتك بالحل النموذجي أعلاه بدقة وأمانة، ثم اختر الدرجة التي تستحقها على هذا التدريج الأكاديمي:
                  </p>

                  <div className="bg-theme-bg/40 border border-theme-border rounded-2xl p-5 space-y-6">
                    {/* Top rating feedback */}
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-sm font-bold text-theme-text-main">التقدير الأكاديمي:</span>
                      <div
                        className={`text-sm font-extrabold py-2 px-4 rounded-full border bg-theme-accent border-theme-primary text-theme-primary transition-all duration-300 ${
                          pulseBadgeId === q.id ? "animate-badge-pulse" : ""
                        }`}
                      >
                        {ratings[q.id] !== undefined
                          ? `${ratings[q.id]} / 10 — ${getAcademicLabel(ratings[q.id])}`
                          : "يرجى اختيار درجة التقييم"}
                      </div>
                    </div>

                    {/* Interactive Slider Track and Steps */}
                    <div className="relative pt-6 pb-2">
                      {/* Interactive nodes */}
                      <div className="flex justify-between items-center relative z-10">
                        {Array.from({ length: 11 }).map((_, i) => {
                          const isSelected = ratings[q.id] === i;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleRatingClick(q.id, i)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border shadow-sm transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-theme-primary border-theme-primary text-white scale-125 z-20"
                                  : "bg-theme-card border-theme-border text-theme-text-muted hover:border-theme-primary hover:text-theme-primary hover:scale-110"
                              }`}
                              title={`تقييم بـ ${i} درجات`}
                            >
                              {i}
                            </button>
                          );
                        })}
                      </div>

                      {/* Track fill */}
                      <div className="absolute top-[29px] left-0 right-0 h-1.5 bg-theme-border rounded-full z-0">
                        <div
                          className="h-full bg-gradient-to-r from-theme-primary to-purple-400 rounded-full transition-all duration-300"
                          style={{
                            width: `${ratings[q.id] !== undefined ? ratings[q.id] * 10 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Descriptive Milestones */}
                    <div className="flex justify-between items-center pt-2 border-t border-dashed border-theme-border text-xs font-bold text-theme-text-muted">
                      <span className="text-rose-500">تأسيس وتركيز مكثف (0-2)</span>
                      <span className="text-amber-500">مقبول إلى جيد (3-6)</span>
                      <span className="text-emerald-500">ممتاز ومتمكن (7-10)</span>
                    </div>
                  </div>
                </div>

                {/* Mastery Level Buttons */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-theme-text-main">
                    تصنيف مستوى تمكنك الشخصي من السؤال:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "high", label: "متمكن من السؤال", color: "high" },
                      { id: "mid", label: "أحتاج إلى مراجعة الموضوع", color: "mid" },
                      { id: "low", label: "غير متمكن", color: "low" },
                    ].map((btn) => {
                      const isBtnSelected = mastery[q.id] === btn.id;
                      let btnStyle = "bg-theme-card border-theme-border text-theme-text-main hover:border-theme-primary";
                      if (isBtnSelected) {
                        if (btn.color === "high") {
                          btnStyle = "bg-emerald-100 border-emerald-400 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700";
                        } else if (btn.color === "mid") {
                          btnStyle = "bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700";
                        } else {
                          btnStyle = "bg-rose-100 border-rose-400 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700";
                        }
                      }

                      return (
                        <button
                          key={btn.id}
                          onClick={() => onSetMastery(q.id, btn.id as any)}
                          className={`py-2.5 px-4 rounded-xl border font-bold text-xs transition-all cursor-pointer ${btnStyle}`}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Pagination Quick Navigation Grid */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <span className="text-sm font-bold text-theme-text-main flex items-center gap-1.5">
            <LayoutGrid size={16} className="text-theme-primary" />
            الوصول السريع لجميع الأسئلة:
          </span>
          <div className="flex gap-4 items-center flex-wrap text-xs font-semibold text-theme-text-muted">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-theme-bg border border-theme-border inline-block"></span>
              غير مُجاب
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-theme-accent border border-theme-primary inline-block"></span>
              مُجاب
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-theme-primary inline-block"></span>
              السؤال الحالي
            </span>
          </div>
        </div>

        {/* Scrollable button rail for all filtered questions */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-theme-border scrollbar-track-transparent">
          {filteredQuestions.map((item) => {
            const origIdx = questions.findIndex((x) => x.id === item.id);
            const isCurrent = origIdx === currentIndex;
            const isQAnswered = !!answers[item.id] && answers[item.id].trim().length > 0;

            return (
              <button
                key={item.id}
                ref={isCurrent ? activePageBtnRef : null}
                onClick={() => onSetIndex(origIdx)}
                className={`min-w-12 h-12 flex flex-col items-center justify-center rounded-xl font-bold border transition-all cursor-pointer relative p-1 shrink-0 ${
                  isCurrent
                    ? "bg-theme-primary border-theme-primary text-white shadow-md"
                    : isQAnswered
                    ? "bg-theme-accent border-theme-primary text-theme-primary"
                    : "bg-theme-bg border-theme-border text-theme-text-main"
                }`}
                title={`سؤال ${origIdx + 1}`}
              >
                <span className="text-sm">{origIdx + 1}</span>
                {isQAnswered ? (
                  <Check size={10} strokeWidth={3} className="absolute bottom-1.5" />
                ) : (
                  <span className="w-1 h-1 bg-theme-text-muted/60 rounded-full absolute bottom-2"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prev, Next, and Finish controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-theme-border">
        <button
          disabled={filteredIndex <= 0}
          onClick={handlePrev}
          className="flex items-center justify-center gap-2 bg-theme-card border border-theme-border text-theme-text-main hover:bg-theme-bg disabled:opacity-50 disabled:cursor-not-allowed font-bold py-2.5 px-6 rounded-xl cursor-pointer transition-colors w-full sm:w-auto"
        >
          <ArrowRight size={18} />
          السؤال السابق
        </button>

        <button
          onClick={() => onNavigate("results")}
          className="bg-theme-primary hover:bg-theme-primary-hover active:bg-theme-primary-active text-white font-bold py-3 px-8 rounded-full shadow-md cursor-pointer transition-colors w-full sm:w-auto text-center"
        >
          إنهاء التدريب وعرض النتيجة
        </button>

        <button
          disabled={filteredIndex === -1 || filteredIndex >= filteredQuestions.length - 1}
          onClick={handleNext}
          className="flex items-center justify-center gap-2 bg-theme-card border border-theme-border text-theme-text-main hover:bg-theme-bg disabled:opacity-50 disabled:cursor-not-allowed font-bold py-2.5 px-6 rounded-xl cursor-pointer transition-colors w-full sm:w-auto"
        >
          السؤال التالي
          <ArrowLeft size={18} />
        </button>
      </div>
    </div>
  );
}
