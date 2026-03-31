import { motion } from 'framer-motion';
import { Menu, X, BookOpen, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation, PartId } from '@/contexts/NavigationContext';

interface NavItem {
  id: PartId;
  label: string;
  arabicLabel: string;
  icon: string;
}

const parts: NavItem[] = [
  { id: 'zero', label: 'Cosmic Courtroom', arabicLabel: 'غرفة المحاكمة الكونية', icon: '⚖️' },
  { id: 'one', label: 'The First Crime', arabicLabel: 'الجريمة الأولى', icon: '🔴' },
  { id: 'two', label: 'Pharaoh', arabicLabel: 'فرعون', icon: '👑' },
  { id: 'three', label: 'Nicaea', arabicLabel: 'نيقية', icon: '✝️' },
  { id: 'four', label: 'Andalusia', arabicLabel: 'الأندلس', icon: '🕌' },
  { id: 'five', label: '20th Century', arabicLabel: 'القرن العشرون', icon: '⚡' },
  { id: 'six', label: 'Digital Age', arabicLabel: 'العصر الرقمي', icon: '💻' },
  { id: 'seven', label: 'Defense Witnesses', arabicLabel: 'شهود الدفاع', icon: '🕊️' },
];

export const MainNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentPart, goToPart, getProgress } = useNavigation();
  const progress = getProgress();

  return (
    <>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20"
      >
        <div className="container flex items-center justify-between py-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 border-2 border-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary">Ø</span>
            </div>
            <span className="font-bold text-primary hidden sm:inline">OSIRIS</span>
          </motion.div>

          {/* Progress Bar */}
          <div className="hidden md:flex items-center gap-4 flex-1 mx-8">
            <div className="flex-1 h-1 bg-card rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs">Progress</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Navigation Menu */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-16 left-0 right-0 z-40 bg-background border-b border-primary/20 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="container py-6 space-y-2">
          {parts.map((part, index) => (
            <motion.button
              key={part.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                goToPart(part.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentPart === part.id
                  ? 'bg-primary/20 text-primary border-l-2 border-primary'
                  : 'text-foreground hover:bg-card'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{part.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{part.label}</p>
                  <p className="text-xs text-muted-foreground">{part.arabicLabel}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Spacer */}
      <div className={`h-${isOpen ? '96' : '16'}`} />
    </>
  );
};
