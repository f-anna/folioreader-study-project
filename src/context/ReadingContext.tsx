import { createContext, useContext, useEffect, useRef, useState } from 'react';

export interface ReadingChapter {
  href: string;
  label: string;
}

export interface ReadingLocation {
  bookId: string;
  chapter: ReadingChapter | null;
  href: string | null;
  cfi: string | null;
  fraction: number;
  sectionIndex: number;
  page: number;
  pages: number;
  visibleText: string;
  changedAt: number;
}

export interface ReadingLocationUpdate {
  chapter?: ReadingChapter | null;
  href?: string | null;
  cfi?: string | null;
  fraction: number;
  sectionIndex: number;
  page: number;
  pages: number;
  visibleText?: string;
}

export const READING_PAGE_CHANGE_EVENT = 'folio:reading-page-change';

interface ReadingContextValue {
  location: ReadingLocation | null;
  updateLocation: (update: ReadingLocationUpdate) => void;
  clearLocation: () => void;
}

const ReadingContext = createContext<ReadingContextValue | undefined>(undefined);

interface ReadingContextProviderProps {
  bookId: string;
  children: React.ReactNode;
}

export function ReadingContextProvider({ bookId, children }: ReadingContextProviderProps) {
  const [location, setLocation] = useState<ReadingLocation | null>(null);
  const locationRef = useRef<ReadingLocation | null>(null);

  useEffect(() => {
    locationRef.current = null;
    setLocation(null);
  }, [bookId]);

  const updateLocation = (update: ReadingLocationUpdate) => {
    const nextLocation: ReadingLocation = {
      bookId,
      chapter: update.chapter ?? null,
      href: update.href ?? null,
      cfi: update.cfi ?? null,
      fraction: update.fraction,
      sectionIndex: update.sectionIndex,
      page: update.page,
      pages: update.pages,
      visibleText: update.visibleText ?? '',
      changedAt: Date.now(),
    };
    const previousLocation = locationRef.current;
    const hasPageChanged = previousLocation && (
      previousLocation.cfi !== nextLocation.cfi ||
      previousLocation.sectionIndex !== nextLocation.sectionIndex ||
      previousLocation.page !== nextLocation.page
    );

    locationRef.current = nextLocation;
    setLocation(nextLocation);
    if (import.meta.env.DEV) {
      console.debug('[Folio] ReadingContext updated', nextLocation);
    }

    if (hasPageChanged) {
      window.dispatchEvent(new CustomEvent<ReadingLocation>(READING_PAGE_CHANGE_EVENT, {
        detail: nextLocation,
      }));
    }
  };

  const clearLocation = () => {
    setLocation(null);
  };

  return (
    <ReadingContext.Provider value={{ location, updateLocation, clearLocation }}>
      {children}
    </ReadingContext.Provider>
  );
}

export function useReadingContext(): ReadingContextValue {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReadingContext must be used within a ReadingContextProvider');
  }
  return context;
}
