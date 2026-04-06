import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Menu, X, Home, BookOpen, Zap } from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const PARTS = [
  { id: 'zero', name: 'غرفة المحاكمة', nameEn: 'The Cosmic Trial', path: '/part-zero' },
  { id: 'one', name: 'الجريمة الأولى', nameEn: 'The First Crime', path: '/part-one' },
  { id: 'two', name: 'فرعون', nameEn: 'Pharaoh', path: '/part-two' },
  { id: 'three', name: 'نيقية', nameEn: 'Nicaea', path: '/part-three' },
  { id: 'four', name: 'الأندلس', nameEn: 'Andalusia', path: '/part-four' },
  { id: 'five', name: 'القرن العشرون', nameEn: 'The 20th Century', path: '/part-five' },
  { id: 'six', name: 'الكبر الرقمي', nameEn: 'Digital Pride', path: '/part-six' },
];

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const currentPart = PARTS.find(p => p.path === location);

  return (
    <div className="flex h-dvh bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -288 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed md:relative w-72 h-dvh bg-gradient-to-b from-primary/20 via-background to-background border-r border-primary/20 overflow-y-auto z-50 md:z-auto"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-primary/20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              OSIRIS
            </h1>
            <p className="text-xs text-muted-foreground mt-1 font-arabic">
              المفسدون في الأرض
            </p>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location === '/'
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </motion.a>

          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              الأجزاء السبعة
            </p>
          </div>

          {PARTS.map((part, idx) => (
            <motion.a
              key={part.id}
              href={part.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                location === part.path
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <BookOpen className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{part.name}</p>
                <p className="text-xs text-muted-foreground/70 truncate">{part.nameEn}</p>
              </div>
            </motion.a>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary/20 bg-gradient-to-t from-background to-transparent">
          <p className="text-xs text-muted-foreground text-center">
            ستة آلاف سنة من القضية الواحدة
          </p>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-primary/20 bg-background/80 backdrop-blur-sm p-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>

          <div className="flex-1 text-center">
            {currentPart && (
              <motion.div
                key={currentPart.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-muted-foreground">الجزء: {currentPart.name}</p>
                <p className="text-xs text-primary/70">{currentPart.nameEn}</p>
              </motion.div>
            )}
          </div>

          <div className="w-10" />
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
