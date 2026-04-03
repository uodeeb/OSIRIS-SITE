import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation, PartId } from '@/contexts/NavigationContext';

interface Chapter {
  id: string;
  title: string;
  arabicTitle: string;
  scenes: number;
}

interface Part {
  id: PartId;
  title: string;
  arabicTitle: string;
  chapters: Chapter[];
}

const parts: Part[] = [
  {
    id: 'zero',
    title: 'Part Zero: Cosmic Courtroom',
    arabicTitle: 'الجزء الصفر: غرفة المحاكمة الكونية',
    chapters: [
      { id: 'intro', title: 'The Trial Begins', arabicTitle: 'بدء المحاكمة', scenes: 3 },
      { id: 'case-file', title: 'Case File #001', arabicTitle: 'الملف رقم 001', scenes: 2 },
    ],
  },
  {
    id: 'one',
    title: 'Part One: The First Crime',
    arabicTitle: 'الجزء الأول: الجريمة الأولى',
    chapters: [
      { id: 'qabil-habil', title: 'Qabil & Habil', arabicTitle: 'قابيل وهابيل', scenes: 5 },
      { id: 'iblis-plan', title: 'Iblis Plan', arabicTitle: 'خطة إبليس', scenes: 4 },
    ],
  },
  {
    id: 'two',
    title: 'Part Two: Pharaoh',
    arabicTitle: 'الجزء الثاني: فرعون',
    chapters: [
      { id: 'ramses-mirror', title: 'Ramses Mirror', arabicTitle: 'مرآة رمسيس', scenes: 4 },
      { id: 'divine-claim', title: 'Divine Claim', arabicTitle: 'الدعوى الإلهية', scenes: 5 },
    ],
  },
  {
    id: 'three',
    title: 'Part Three: Nicaea',
    arabicTitle: 'الجزء الثالث: نيقية',
    chapters: [
      { id: 'council', title: 'The Council', arabicTitle: 'المجمع', scenes: 5 },
      { id: 'decree', title: 'The Decree', arabicTitle: 'المرسوم', scenes: 4 },
    ],
  },
  {
    id: 'four',
    title: 'Part Four: Andalusia',
    arabicTitle: 'الجزء الرابع: الأندلس',
    chapters: [
      { id: 'cordoba', title: 'Cordoba Glory', arabicTitle: 'مجد قرطبة', scenes: 4 },
      { id: 'fall', title: 'The Fall', arabicTitle: 'السقوط', scenes: 5 },
    ],
  },
  {
    id: 'five',
    title: 'Part Five: 20th Century',
    arabicTitle: 'الجزء الخامس: القرن العشرون',
    chapters: [
      { id: 'berlin', title: 'Berlin 1933', arabicTitle: 'برلين 1933', scenes: 4 },
      { id: 'moscow', title: 'Moscow 1937', arabicTitle: 'موسكو 1937', scenes: 4 },
      { id: 'cambodia', title: 'Cambodia 1975', arabicTitle: 'كمبوديا 1975', scenes: 4 },
    ],
  },
  {
    id: 'six',
    title: 'Part Six: Digital Age',
    arabicTitle: 'الجزء السادس: العصر الرقمي',
    chapters: [
      { id: 'algorithm', title: 'Algorithm', arabicTitle: 'الخوارزمية', scenes: 4 },
      { id: 'echo-chamber', title: 'Echo Chamber', arabicTitle: 'حجرة الصدى', scenes: 3 },
    ],
  },
  {
    id: 'seven',
    title: 'Part Seven: Defense Witnesses',
    arabicTitle: 'الجزء السابع: شهود الدفاع',
    chapters: [
      { id: 'abraham', title: 'Abraham', arabicTitle: 'إبراهيم', scenes: 3 },
      { id: 'bilal', title: 'Bilal', arabicTitle: 'بلال', scenes: 3 },
      { id: 'saladin', title: 'Saladin', arabicTitle: 'صلاح الدين', scenes: 4 },
      { id: 'scholars', title: 'Scholars', arabicTitle: 'العلماء', scenes: 3 },
    ],
  },
];

export const TableOfContents = () => {
  const [expandedParts, setExpandedParts] = useState<Set<PartId>>(new Set<PartId>(['zero'] as PartId[]));
  const { currentPart, goToPart } = useNavigation();

  const togglePart = (partId: PartId) => {
    const newExpanded = new Set<PartId>(expandedParts);
    if (newExpanded.has(partId)) {
      newExpanded.delete(partId);
    } else {
      newExpanded.add(partId);
    }
    setExpandedParts(newExpanded);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {parts.map((part) => (
        <motion.div key={part.id} variants={itemVariants}>
          {/* Part Header */}
          <Button
            variant={currentPart === part.id ? 'default' : 'outline'}
            className="w-full justify-between"
            onClick={() => togglePart(part.id)}
          >
            <div className="text-left">
              <p className="font-semibold text-sm">{part.title}</p>
              <p className="text-xs text-muted-foreground">{part.arabicTitle}</p>
            </div>
            {expandedParts.has(part.id) ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          {/* Chapters */}
          {expandedParts.has(part.id) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-4 space-y-1 mt-2"
            >
              {part.chapters.map((chapter) => (
                <Button
                  key={chapter.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => goToPart(part.id, chapter.id)}
                >
                  <div className="flex-1">
                    <p className="text-xs font-medium">{chapter.title}</p>
                    <p className="text-xs text-muted-foreground">{chapter.arabicTitle}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{chapter.scenes}s</span>
                </Button>
              ))}
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};
