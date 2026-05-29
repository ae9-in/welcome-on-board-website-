// hooks/useContextCards.ts
'use client';
import { useState, useCallback } from 'react';
import type { ContextCardId } from '@/types/modern-bee';

interface UseContextCardsReturn {
  openCard: ContextCardId | null;
  toggle: (id: ContextCardId) => void;
  closeAll: () => void;
  isOpen: (id: ContextCardId) => boolean;
  openedCards: Set<ContextCardId>; // Cards that have EVER been opened (for tracking)
}

export function useContextCards(): UseContextCardsReturn {
  const [openCard, setOpenCard] = useState<ContextCardId | null>(null);
  const [openedCards, setOpenedCards] = useState<Set<ContextCardId>>(new Set());

  const toggle = useCallback((id: ContextCardId) => {
    setOpenCard(prev => {
      const next = prev === id ? null : id;
      return next;
    });
    setOpenedCards(prev => new Set([...prev, id]));
  }, []);

  const closeAll = useCallback(() => {
    setOpenCard(null);
  }, []);

  const isOpen = useCallback((id: ContextCardId) => {
    return openCard === id;
  }, [openCard]);

  // Reset when word changes (called externally by passing wordId as dep)
  const reset = useCallback(() => {
    setOpenCard(null);
    setOpenedCards(new Set());
  }, []);

  return { openCard, toggle, closeAll, isOpen, openedCards };
}
