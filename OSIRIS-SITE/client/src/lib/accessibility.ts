/**
 * OSIRIS Accessibility Utilities
 * ARIA labels, screen reader support, and focus management
 */

import { useEffect, useRef, useCallback } from 'react';

// ARIA labels for components
export const ariaLabels = {
  // Navigation
  nextButton: {
    en: 'Continue to next dialogue',
    ar: 'الانتقال إلى الحوار التالي'
  },
  backButton: {
    en: 'Go back to previous dialogue',
    ar: 'العودة إلى الحوار السابق'
  },
  homeButton: {
    en: 'Return to home page',
    ar: 'العودة إلى الصفحة الرئيسية'
  },
  
  // Audio
  muteToggle: {
    en: 'Toggle mute',
    ar: 'تبديل كتم الصوت'
  },
  volumeSlider: {
    en: 'Adjust volume',
    ar: 'تعديل مستوى الصوت'
  },
  
  // Choices
  choicePanel: {
    en: 'Select your choice',
    ar: 'اختر قرارك'
  },
  timer: {
    en: 'Time remaining to make a choice',
    ar: 'الوقت المتبقي لاتخاذ القرار'
  },
  
  // Scene
  sceneContainer: {
    en: 'Interactive narrative scene',
    ar: 'مشهد روائي تفاعلي'
  },
  dialogueBox: {
    en: 'Dialogue text',
    ar: 'نص الحوار'
  },
  characterPortrait: {
    en: 'Character portrait',
    ar: 'صورة الشخصية'
  },
  
  // Language
  languageToggle: {
    en: 'Switch language',
    ar: 'تبديل اللغة'
  }
};

// Get ARIA label based on current language
export function getAriaLabel(key: keyof typeof ariaLabels, lang: 'en' | 'ar'): string {
  return ariaLabels[key][lang];
}

// Announce to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Focus trap for modals/dialogs
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus first focusable element
      const container = containerRef.current;
      if (container) {
        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }
      
      return () => {
        // Restore previous focus
        previousFocusRef.current?.focus();
      };
    }
  }, [isActive]);
  
  return containerRef;
}

// Handle reduced motion preference
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
}

import { useState } from 'react';

// High contrast mode detection
export function useHighContrast(): boolean {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);
    
    const handler = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersHighContrast;
}

// Keyboard navigation hook
export function useKeyboardNavigation(
  onNext: () => void,
  onBack: () => void,
  onHome: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
        case 'Backspace':
          e.preventDefault();
          onBack();
          break;
        case 'Escape':
          e.preventDefault();
          onHome();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onBack, onHome]);
}

// Focus visible utility
export function useFocusVisible() {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = () => setIsKeyboardUser(true);
    const handleMouseDown = () => setIsKeyboardUser(false);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  return isKeyboardUser;
}

// Announce scene changes to screen readers
export function announceSceneChange(
  sceneTitle: string,
  characterName: string,
  lang: 'en' | 'ar'
) {
  const message = lang === 'ar' 
    ? `مشهد جديد: ${sceneTitle}، الشخصية: ${characterName}`
    : `New scene: ${sceneTitle}, Character: ${characterName}`;
  
  announceToScreenReader(message, 'polite');
}

// Announce dialogue to screen readers
export function announceDialogue(
  characterName: string,
  lang: 'en' | 'ar'
) {
  const message = lang === 'ar'
    ? `${characterName} يتحدث`
    : `${characterName} is speaking`;
  
  announceToScreenReader(message, 'polite');
}
