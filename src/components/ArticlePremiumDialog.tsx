import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ExternalLink, X } from 'lucide-react';
import { DetailItem } from '../types';
import { getBusinessPath } from '../routing/routeHelpers';

interface ArticlePremiumDialogProps {
  item: DetailItem | null;
  onClose: () => void;
}

export function ArticlePremiumDialog({ item, onClose }: ArticlePremiumDialogProps) {
  const cancelButtonRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (!item) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from<HTMLElement>(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-premium-dialog-title"
            aria-describedby="article-premium-dialog-description"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.stopPropagation();
                onClose();
              }
            }}
            initial={shouldReduceMotion ? false : { scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl text-center border border-gray-100 relative cursor-default"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-50 cursor-pointer border-none bg-transparent"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-penedo-mint/40 text-penedo-emerald rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
              <ExternalLink size={28} />
            </div>

            <h3 id="article-premium-dialog-title" className="text-xl md:text-2xl font-black text-penedo-forest mb-3 leading-snug">
              Você será direcionado para uma página exclusiva
            </h3>
            <p id="article-premium-dialog-description" className="text-gray-500 text-sm leading-relaxed mb-8">
              Deseja conhecer mais detalhes sobre <span className="font-bold text-gray-800">{item.title}</span>?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={onClose}
                className="py-3 px-6 bg-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-200 transition-colors text-xs uppercase tracking-wider cursor-pointer flex-1 border-none"
              >
                Permanecer no roteiro
              </button>
              <Link
                to={getBusinessPath(item.slug || item.id)}
                onClick={onClose}
                className="py-3 px-6 bg-penedo-emerald text-white font-black rounded-2xl hover:bg-penedo-forest transition-colors text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-penedo-emerald/20 flex-1 border-none"
              >
                Conhecer estabelecimento
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
