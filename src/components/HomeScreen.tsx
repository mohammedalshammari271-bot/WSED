/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, Play, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

interface HomeScreenProps {
  totalQuestions: number;
  answeredCount: number;
  onNavigate: (screen: "home" | "practice" | "results") => void;
  onResetPrompt: () => void;
}

export default function HomeScreen({
  totalQuestions,
  answeredCount,
  onNavigate,
  onResetPrompt,
}: HomeScreenProps) {
  const hasHistory = answeredCount > 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center gap-6 py-8 px-4 max-w-2xl mx-auto"
    >
      {/* Title & Subtitle */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-black text-theme-primary tracking-tight">
          تطبيق مدرسي التعليمي
        </h1>
        <p className="text-lg md:text-xl text-theme-text-muted max-w-xl mx-auto leading-relaxed">
          الأسئلة الوزارية الشاملة حول الاستفهام بأحد أسماء الاستفهام لقواعد اللغة العربية للصف السادس الإعدادي
        </p>
      </motion.div>

      {/* Guide Card */}
      <motion.div
        variants={itemVariants}
        className="bg-theme-card border border-theme-border rounded-2xl w-full p-6 shadow-md text-right space-y-4"
      >
        <h3 className="text-xl font-bold text-theme-text-main pb-2 border-b border-theme-border flex items-center gap-2">
          <span className="w-2 h-6 bg-theme-primary rounded-full"></span>
          طريقة العمل المختصرة في التطبيق:
        </h3>
        <ul className="flex flex-col gap-4">
          <li className="flex items-start gap-3">
            <span className="bg-theme-accent text-theme-primary font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm mt-0.5">
              ١
            </span>
            <span className="text-theme-text-main font-medium leading-relaxed">
              اكتب جوابك الشخصي كاملاً وبكل أمانة في الحقل المخصص لكل سؤال.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-theme-accent text-theme-primary font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm mt-0.5">
              ٢
            </span>
            <span className="text-theme-text-main font-medium leading-relaxed">
              اضغط على زر <strong className="text-theme-primary">أظهر الجواب النموذجي</strong> للمقارنة الدقيقة مع الأجوبة الرسمية.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-theme-accent text-theme-primary font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm mt-0.5">
              ٣
            </span>
            <span className="text-theme-text-main font-medium leading-relaxed">
              قيّم جوابك يا بطل بموضوعية واختر الدرجة الأكاديمية المناسبة من (0 إلى 10).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="bg-theme-accent text-theme-primary font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm mt-0.5">
              ٤
            </span>
            <span className="text-theme-text-main font-medium leading-relaxed">
              حدّد مستوى تمكنك من مهارة السؤال لمراجعة نقاط ضعفك لاحقاً بكل سهولة.
            </span>
          </li>
        </ul>
      </motion.div>

      {/* Stats and Info Preview */}
      <motion.div
        variants={itemVariants}
        className="text-theme-text-muted font-bold text-sm md:text-base space-y-1"
      >
        <div>عدد الأسئلة الكلي في هذا التدريب الأكاديمي: {totalQuestions} سؤالاً وزارياً.</div>
        {hasHistory && (
          <div className="text-theme-primary">
            لقد أجبت على {answeredCount} من أصل {totalQuestions} سؤالاً سابقاً.
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="w-full max-w-sm flex flex-col gap-3">
        {hasHistory ? (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 bg-theme-primary hover:bg-theme-primary-hover active:bg-theme-primary-active text-white font-bold py-3 px-6 rounded-full shadow-md cursor-pointer transition-colors w-full"
              onClick={() => onNavigate("practice")}
            >
              <Play size={18} fill="currentColor" />
              متابعة التدريب الحالي
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 bg-theme-card border border-theme-border text-theme-text-main hover:bg-theme-bg font-bold py-3 px-6 rounded-full shadow-sm cursor-pointer transition-colors w-full"
              onClick={onResetPrompt}
            >
              <RotateCcw size={18} />
              بدء محاولة جديدة تماماً
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 bg-theme-primary hover:bg-theme-primary-hover active:bg-theme-primary-active text-white font-extrabold py-4 px-8 rounded-full shadow-lg cursor-pointer transition-colors w-full text-lg"
            onClick={() => onNavigate("practice")}
          >
            <GraduationCap size={22} />
            ابدأ التدريب الآن
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
