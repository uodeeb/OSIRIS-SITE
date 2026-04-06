/**
 * Hook: useFocusTrap
 * 
 * Traps focus within a container (modals, dialogs).
 * Critical accessibility requirement for keyboard navigation.
 * 
 * @see project_history/03_ux_ui_review.md — Issue B4 (High)
 * @example
 * const containerRef = useFocusTrap(isOpen);
 * 
 * <div ref={containerRef} role="dialog">
 *   <button>First focusable</button>
 *   <button>Last focusable</button>
 * </div>
 */

import { useEffect, useRef } from 'react';

export interface UseFocusTrapOptions {
  /** Whether focus trap is active */
  isActive: boolean;
  /** Element to focus when trap activates (default: first focusable) */
  initialFocus?: HTMLElement | null;
  /** Callback when escape key pressed */
  onEscape?: () => void;
}

export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  options: UseFocusTrapOptions
) {
  const { isActive, initialFocus, onEscape } = options;
  const containerRef = useRef<T>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Store previously focused element to restore later
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Get all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Set initial focus
    if (initialFocus) {
      initialFocus.focus();
    } else if (firstElement) {
      firstElement.focus();
    }

    // Handle tab key to trap focus
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      // If no focusable elements, do nothing
      if (focusableElements.length === 0) return;

      // Shift + Tab (backwards)
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (forwards)
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    container.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);

    return () => {
      container.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEscape);
      
      // Restore focus when trap deactivates
      previouslyFocusedElement.current?.focus();
    };
  }, [isActive, initialFocus, onEscape]);

  return containerRef;
}

export default useFocusTrap;
