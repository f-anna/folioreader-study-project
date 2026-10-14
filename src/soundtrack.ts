import { createFoliateAdapter } from 'adapter-foliate';

// This adapter is used to integrate the Book Soundtrack feature into the Folioreader application.
export const soundtrackAdapter = createFoliateAdapter();

if (import.meta.env.DEV) {
  soundtrackAdapter.onBookOpened(e => console.debug('[soundtrack] book opened', e.bookId));
  soundtrackAdapter.onLocationChanged(({ locator, chapterTitle, isJump }) =>
    console.debug('[soundtrack] location', JSON.stringify({ ...locator, chapterTitle, isJump })),
  );
  soundtrackAdapter.onBookClosed(() => console.debug('[soundtrack] book closed'));
}
