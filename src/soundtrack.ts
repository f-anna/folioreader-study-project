import { createFoliateAdapter } from 'adapter-foliate';
import { reportLocation } from 'tauri-plugin-soundtrack-api';

// This adapter is used to integrate the Book Soundtrack feature into the Folioreader application.
export const soundtrackAdapter = createFoliateAdapter();

soundtrackAdapter.onLocationChanged(e => {
  reportLocation(e).catch(err => console.warn('[soundtrack] report_location failed', err));
});

if (import.meta.env.DEV) {
  soundtrackAdapter.onBookOpened(e => console.debug('[soundtrack] book opened', e.bookId));
  soundtrackAdapter.onBookClosed(() => console.debug('[soundtrack] book closed'));
}
