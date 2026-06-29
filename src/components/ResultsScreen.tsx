/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Award, Edit3, Lock, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { Question } from "../types";

interface ResultsScreenProps {
  questions: Question[];
  answers: Record<string, string>;
  shownAnswers: Record<string, boolean>;
  ratings: Record<string, number>;
  mastery: Record<string, "high" | "mid" | "low" | undefined>;
  onNavigate: (screen: "home" | "practice" | "results") => void;
  onJumpToQuestion: (idx: number) => void;
  onResetPrompt: () => void;
}

export default function ResultsScreen({
  questions,
  answers,
  shownAnswers,
  ratings,
  mastery,
  onNavigate,
  onJumpToQuestion,
  onResetPrompt,
}: ResultsScreenProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => (answers[q.id] || "").trim().length > 0).length;
  const shownCount = questions.filter((q) => shownAnswers[q.id]).length;
  const ratedCount = questions.filter((q) => ratings[q.id] !== undefined).length;

  const maxScore = totalQuestions * 10;
  let totalScore = 0;
  questions.forEach((q) => {
    if (ratings[q.id] !== undefined) {
      totalScore += ratings[q.id];
    }
  });

  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // Calculate mastery counters
  let masteryHigh = 0;
  let masteryMid = 0;
  let masteryLow = 0;
  questions.forEach((q) => {
    const m = mastery[q.id];
    if (m === "high") masteryHigh++;
    else if (m === "mid") masteryMid++;
    else if (m === "low") masteryLow++;
  });

  // Find unrated questions (viewed but no score)
  const unratedQuestions: { num: number; id: string }[] = [];
  questions.forEach((q, idx) => {
    if (shownAnswers[q.id] && ratings[q.id] === undefined) {
      unratedQuestions.push({ num: idx + 1, id: q.id });
    }
  });

  // Pure SVG Golden Medal
  const GoldBadgeSvg = (
    <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>
      {/* Ribbons */}
      <path d="M40 55 L30 90 L50 80 L70 90 L60 55 Z" fill="url(#ribbonGrad)" />
      <path d="M50 55 L45 88 L50 82 L55 88 Z" fill="#991B1B" opacity="0.4" />
      {/* Outer Glow */}
      <circle cx="50" cy="45" r="38" fill="#FEF08A" opacity="0.25" />
      {/* Outer Gold ring */}
      <circle cx="50" cy="45" r="32" fill="url(#goldGrad)" stroke="#FEF08A" strokeWidth="2" />
      {/* Inner Ring */}
      <circle cx="50" cy="45" r="26" fill="#854D0E" />
      <circle cx="50" cy="45" r="24" fill="url(#goldGrad)" />
      {/* Star/Crown */}
      <path
        d="M50 28 L53 37 L62 37 L55 43 L58 52 L50 46 L42 52 L45 43 L38 37 L47 37 Z"
        fill="#FFFFFF"
        stroke="#854D0E"
        strokeWidth="1.5"
      />
    </svg>
  );

  // Pure SVG Silver Medal
  const SilverBadgeSvg = (
    <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      {/* Ribbons */}
      <path d="M40 55 L30 90 L50 80 L70 90 L60 55 Z" fill="#3B82F6" />
      <path d="M40 55 L30 90 L50 80 L70 90 L60 55 Z" fill="linear-gradient(to bottom, #3B82F6, #1D4ED8)" />
      {/* Outer Glow */}
      <circle cx="50" cy="45" r="38" fill="#E2E8F0" opacity="0.3" />
      {/* Outer ring */}
      <circle cx="50" cy="45" r="32" fill="url(#silverGrad)" stroke="#CBD5E1" strokeWidth="2" />
      {/* Inner Ring */}
      <circle cx="50" cy="45" r="26" fill="#334155" />
      <circle cx="50" cy="45" r="24" fill="url(#silverGrad)" />
      {/* Star */}
      <path
        d="M50 28 L53 37 L62 37 L55 43 L58 52 L50 46 L42 52 L45 43 L38 37 L47 37 Z"
        fill="#FFFFFF"
        stroke="#334155"
        strokeWidth="1.5"
      />
    </svg>
  );

  // Pure SVG Bronze Medal
  const BronzeBadgeSvg = (
    <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEDD5" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
      {/* Ribbons */}
      <path d="M40 55 L30 90 L50 80 L70 90 L60 55 Z" fill="#10B981" />
      {/* Outer ring */}
      <circle cx="50" cy="45" r="32" fill="url(#bronzeGrad)" stroke="#FED7AA" strokeWidth="2" />
      {/* Inner Ring */}
      <circle cx="50" cy="45" r="26" fill="#451A03" />
      <circle cx="50" cy="45" r="24" fill="url(#bronzeGrad)" />
      {/* Star */}
      <path
        d="M50 28 L53 37 L62 37 L55 43 L58 52 L50 46 L42 52 L45 43 L38 37 L47 37 Z"
        fill="#FFFFFF"
        stroke="#451A03"
        strokeWidth="1.5"
      />
    </svg>
  );

  // Locked Badge Svg
  const LockedBadgeSvg = (
    <svg className="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="45" r="32" fill="#334155" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="50" cy="45" r="26" fill="#1E293B" />
      {/* Lock Icon */}
      <path
        d="M38 52 L62 52 L62 68 L38 68 Z M44 52 L44 42 A6 6 0 0 1 56 42 L55 52"
        stroke="#94A3B8"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Generate Mastery level heights for the custom interactive SVG bar chart
  const maxVal = Math.max(masteryHigh, masteryMid, masteryLow, 4);
  const scaleVal = 140 / maxVal;

  const hHigh = masteryHigh * scaleVal;
  const hMid = masteryMid * scaleVal;
  const hLow = masteryLow * scaleVal;

  const yHigh = 190 - hHigh;
  const yMid = 190 - hMid;
  const yLow = 190 - hLow;

  const yTicks = [
    { y: 190, val: 0 },
    { y: 143, val: Math.round(maxVal * 0.33) },
    { y: 96, val: Math.round(maxVal * 0.67) },
    { y: 50, val: maxVal },
  ];

  return (
    <div className="bg-theme-card border border-theme-border rounded-2xl p-6 md:p-8 shadow-md max-w-3xl mx-auto space-y-8 transition-colors">
      <h2 className="text-3xl font-black text-theme-primary text-center">
        تقرير الأداء والتقييم الذاتي الأكاديمي
      </h2>

      {/* Dynamic Score Circle */}
      <div className="flex justify-center">
        <div className="w-40 h-40 rounded-full border-[10px] border-theme-accent border-t-theme-primary flex flex-col items-center justify-center shadow-md">
          <span className="text-3xl font-extrabold text-theme-primary leading-none">
            {totalScore} / {maxScore}
          </span>
          <span className="text-xs text-theme-text-muted mt-2 font-bold">النسبة المئوية: {percentage}%</span>
        </div>
      </div>

      {/* Medals and Trophies (Earned based on full-completion) */}
      <div className="max-w-md mx-auto">
        {answeredCount === totalQuestions ? (
          <div
            className={`relative bg-theme-card border-2 rounded-3xl p-6 pt-10 text-center shadow-lg transition-transform hover:-translate-y-1 ${
              percentage >= 90
                ? "border-yellow-400 bg-yellow-500/5"
                : percentage >= 70
                ? "border-slate-400 bg-slate-500/5"
                : "border-amber-600 bg-amber-600/5"
            }`}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-theme-primary text-white text-xs font-black py-1.5 px-6 rounded-full shadow-md whitespace-nowrap">
              وسام الإنجاز والتمكن الأكاديمي
            </div>
            <div className="flex justify-center mb-4">
              {percentage >= 90
                ? GoldBadgeSvg
                : percentage >= 70
                ? SilverBadgeSvg
                : BronzeBadgeSvg}
            </div>
            <h3 className="text-xl font-extrabold text-theme-text-main mb-2">
              {percentage >= 90
                ? "وسام التميز الأكاديمي الذهبي"
                : percentage >= 70
                ? "وسام الإبداع اللغوي الفضي"
                : "وسام المثابرة والاجتهاد البرونزي"}
            </h3>
            <p className="text-sm text-theme-text-muted leading-relaxed max-w-sm mx-auto font-medium">
              {percentage >= 90
                ? "ألف مبروك! لقد أتممت حل جميع الأسئلة وحققت مستوى تمكن استثنائي باهر (90% فما فوق). أنت بطل حقيقي وقائد متميز في قواعد اللغة العربية!"
                : percentage >= 70
                ? "أداء ممتاز جداً! أتممت حل جميع الأسئلة بمهارة عالية ودقة ممتازة (70% - 89%). واصل هذا التميز اللغوي الرائع لتعتلي الصدارة دائماً!"
                : "أحسنت صنعاً! لقد أثبتّ التزامك التام وحللت جميع أسئلة الوحدة بجد واجتهاد. استمر في المراجعة والتدرب لتطوير نقاط تمكنك وستصل للذهبي قريباً!"}
            </p>
          </div>
        ) : (
          <div className="relative bg-theme-bg/30 border border-theme-border border-dashed rounded-3xl p-6 pt-10 text-center opacity-85">
            <div className="flex justify-center mb-4">{LockedBadgeSvg}</div>
            <h3 className="text-xl font-extrabold text-theme-text-muted mb-2">أوسمة التمكن مغلقة</h3>
            <p className="text-sm text-theme-text-muted leading-relaxed max-w-xs mx-auto font-medium">
              أكمل حل جميع الأسئلة ({answeredCount} من أصل {totalQuestions}) لتفتح وسام التمكن والتميز وتزين به سجل إنجازاتك في اللغة العربية!
            </p>
          </div>
        )}
      </div>

      {/* SVG Interactive Recharts-style Mastery Level Bar Chart */}
      <div className="bg-theme-card border-2 border-theme-border rounded-2xl p-5 shadow-sm max-w-lg mx-auto">
        <h4 className="text-base font-black text-theme-text-main mb-4 flex justify-between items-center">
          <span>📊 توزيع مستويات التمكن الأكاديمي (تفاعلي)</span>
          <span className="text-xs text-theme-text-muted font-normal">مرر مؤشر الماوس للتفاصيل</span>
        </h4>

        <div className="relative">
          <svg viewBox="0 0 450 250" width="100%" height="100%" className="overflow-visible select-none">
            <defs>
              <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#047857" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="colorMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#B45309" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#B91C1C" stopOpacity={0.9} />
              </linearGradient>
            </defs>

            {/* Y-Axis Grid Lines */}
            {yTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1="50"
                  y1={tick.y}
                  x2="400"
                  y2={tick.y}
                  className="stroke-theme-border"
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
                <text
                  x="35"
                  y={tick.y + 4}
                  className="fill-theme-text-muted text-[11px] font-semibold text-left font-sans"
                  textAnchor="end"
                >
                  {tick.val}
                </text>
              </g>
            ))}

            {/* X-Axis Line */}
            <line x1="50" y1="190" x2="400" y2="190" className="stroke-theme-border" strokeWidth={1.5} />

            {/* High Mastery Bar */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredBar("high")}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <rect
                x="90"
                y={yHigh}
                width="45"
                height={hHigh || 2}
                rx="6"
                ry="6"
                fill="url(#colorHigh)"
                className="transition-all duration-300 hover:brightness-110"
              />
              <text x="112.5" y={yHigh - 8} fill="#10B981" className="text-xs font-bold text-center font-sans">
                {masteryHigh}
              </text>
              {hoveredBar === "high" && (
                <g className="pointer-events-none">
                  <rect x="72.5" y={yHigh - 45} width="80" height="30" rx="6" fill="#1D2433" opacity="0.95" />
                  <text
                    x="112.5"
                    y={yHigh - 26}
                    fill="white"
                    className="text-[11px] font-bold text-center font-sans"
                  >
                    متمكن: {masteryHigh}
                  </text>
                </g>
              )}
            </g>

            {/* Mid Mastery Bar */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredBar("mid")}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <rect
                x="202.5"
                y={yMid}
                width="45"
                height={hMid || 2}
                rx="6"
                ry="6"
                fill="url(#colorMid)"
                className="transition-all duration-300 hover:brightness-110"
              />
              <text x="225" y={yMid - 8} fill="#F59E0B" className="text-xs font-bold text-center font-sans">
                {masteryMid}
              </text>
              {hoveredBar === "mid" && (
                <g className="pointer-events-none">
                  <rect x="180" y={yMid - 45} width="90" height="30" rx="6" fill="#1D2433" opacity="0.95" />
                  <text
                    x="225"
                    y={yMid - 26}
                    fill="white"
                    className="text-[10px] font-bold text-center font-sans"
                  >
                    مراجعة: {masteryMid}
                  </text>
                </g>
              )}
            </g>

            {/* Low Mastery Bar */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHoveredBar("low")}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <rect
                x="315"
                y={yLow}
                width="45"
                height={hLow || 2}
                rx="6"
                ry="6"
                fill="url(#colorLow)"
                className="transition-all duration-300 hover:brightness-110"
              />
              <text x="337.5" y={yLow - 8} fill="#EF4444" className="text-xs font-bold text-center font-sans">
                {masteryLow}
              </text>
              {hoveredBar === "low" && (
                <g className="pointer-events-none">
                  <rect x="292.5" y={yLow - 45} width="90" height="30" rx="6" fill="#1D2433" opacity="0.95" />
                  <text
                    x="337.5"
                    y={yLow - 26}
                    fill="white"
                    className="text-[10px] font-bold text-center font-sans"
                  >
                    غير متمكن: {masteryLow}
                  </text>
                </g>
              )}
            </g>

            {/* X-Axis Labels */}
            <text x="112.5" y="212" className="fill-theme-text-main text-xs font-bold text-center font-sans">
              متمكن
            </text>
            <text x="225" y="212" className="fill-theme-text-main text-xs font-bold text-center font-sans">
              يحتاج مراجعة
            </text>
            <text x="337.5" y="212" className="fill-theme-text-main text-xs font-bold text-center font-sans">
              غير متمكن
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2 text-[11px] font-bold">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
            متمكن
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span>
            أحتاج مراجعة
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span>
            غير متمكن
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-theme-bg/40 border border-theme-border rounded-xl p-4 text-center">
          <div className="text-theme-text-muted text-xs font-bold mb-1">الأسئلة الكلية</div>
          <div className="text-2xl font-black text-theme-text-main">{totalQuestions}</div>
        </div>
        <div className="bg-theme-bg/40 border border-theme-border rounded-xl p-4 text-center">
          <div className="text-theme-text-muted text-xs font-bold mb-1">الأسئلة المجابة</div>
          <div className="text-2xl font-black text-theme-text-main">{answeredCount}</div>
        </div>
        <div className="bg-theme-bg/40 border border-theme-border rounded-xl p-4 text-center">
          <div className="text-theme-text-muted text-xs font-bold mb-1">الأجوبة المعروضة</div>
          <div className="text-2xl font-black text-theme-text-main">{shownCount}</div>
        </div>
        <div className="bg-theme-bg/40 border border-theme-border rounded-xl p-4 text-center">
          <div className="text-theme-text-muted text-xs font-bold mb-1">التقييمات المسجلة</div>
          <div className="text-2xl font-black text-theme-text-main">{ratedCount}</div>
        </div>
      </div>

      {/* Mastery Summary */}
      <div className="bg-theme-bg/30 border border-theme-border rounded-2xl p-5 space-y-4">
        <h3 className="text-base font-black text-theme-text-main border-b border-theme-border pb-2">
          ملخص مستويات التمكن الأكاديمي:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-theme-card border border-theme-border p-4 rounded-xl text-center space-y-1">
            <span className="text-2xl font-black text-emerald-600 block">{masteryHigh}</span>
            <span className="text-xs text-theme-text-muted font-bold">متمكن من السؤال</span>
          </div>
          <div className="bg-theme-card border border-theme-border p-4 rounded-xl text-center space-y-1">
            <span className="text-2xl font-black text-amber-600 block">{masteryMid}</span>
            <span className="text-xs text-theme-text-muted font-bold">أحتاج إلى مراجعة الموضوع</span>
          </div>
          <div className="bg-theme-card border border-theme-border p-4 rounded-xl text-center space-y-1">
            <span className="text-2xl font-black text-rose-600 block">{masteryLow}</span>
            <span className="text-xs text-theme-text-muted font-bold">غير متمكن</span>
          </div>
        </div>
      </div>

      {/* Unrated Warnings */}
      {unratedQuestions.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 rounded-2xl p-5 space-y-3">
          <div className="font-extrabold text-sm flex items-center gap-1.5">
            تنبيه: لديك أسئلة تم عرض إجابتها النموذجية ولكن لم تقيّمها ذاتياً بعد:
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {unratedQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => onJumpToQuestion(q.num - 1)}
                className="bg-theme-card border border-amber-400/40 text-amber-700 dark:text-amber-300 py-1.5 px-4 rounded-lg hover:bg-amber-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                سؤال {q.num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex justify-center gap-4 flex-wrap pt-4 border-t border-theme-border">
        <button
          onClick={() => onNavigate("practice")}
          className="flex items-center gap-2 bg-theme-primary hover:bg-theme-primary-hover active:bg-theme-primary-active text-white font-extrabold py-3 px-8 rounded-full cursor-pointer transition-colors shadow-md text-sm"
        >
          <Edit3 size={16} />
          العودة لتعديل التقييمات
        </button>

        <button
          onClick={onResetPrompt}
          className="flex items-center gap-2 bg-theme-card border border-theme-border text-theme-text-main hover:bg-theme-bg font-extrabold py-3 px-8 rounded-full cursor-pointer transition-colors shadow-sm text-sm"
        >
          <RotateCcw size={16} />
          بدء محاولة جديدة تماماً
        </button>
      </div>
    </div>
  );
}
