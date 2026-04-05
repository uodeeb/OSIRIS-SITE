import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export interface Choice {
  id: string;
  text: string;
  arabicText?: string;
  consequence?: string | { text?: string; arabicText?: string; impact?: string };
  locked?: boolean;
}

interface InteractiveChoiceProps {
  choices: Choice[];
  onChoose: (choiceId: string) => void;
  title?: string;
  disabled?: boolean;
}

/**
 * InteractiveChoice: Component for rendering player choices with consequences
 * Supports locked choices and animated transitions
 */
export const InteractiveChoice = ({
  choices,
  onChoose,
  title,
  disabled = false,
}: InteractiveChoiceProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-4"
    >
      {title && (
        <h3 className="text-lg font-semibold text-primary mb-6">{title}</h3>
      )}

      <div className="space-y-3">
        {choices.map((choice) => (
          <motion.div
            key={choice.id}
            variants={itemVariants}
            whileHover={!disabled && !choice.locked ? { scale: 1.02 } : {}}
            whileTap={!disabled && !choice.locked ? { scale: 0.98 } : {}}
          >
            <Button
              onClick={() => !disabled && !choice.locked && onChoose(choice.id)}
              disabled={disabled || choice.locked}
              variant={choice.locked ? 'outline' : 'default'}
              className="w-full justify-start text-left h-auto py-4 px-6 hover:bg-primary/20 transition-colors"
            >
              <div className="flex flex-col items-start gap-2 w-full">
                <span className="font-medium">{choice.text}</span>
                {choice.arabicText && (
                  <span className="text-sm font-arabic text-muted-foreground">
                    {choice.arabicText}
                  </span>
                )}
                {choice.consequence && (
                  <span className="text-xs text-muted-foreground italic">
                    ✦ {typeof choice.consequence === 'string' ? choice.consequence : choice.consequence.text || 'Choice made'}
                  </span>
                )}
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
