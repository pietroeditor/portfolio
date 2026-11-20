/**
 * Page scroll lock, counted.
 *
 * Two things on this site can want the page held still at once: the intro
 * while the tube is still covering the screen, and a video opened from a card
 * that was clicked to skip that intro — the click skips it and opens the
 * modal in the same gesture.
 *
 * If each holder saves whatever value it happens to find and writes that back
 * on release, the one that releases last decides, and the one that started
 * second found `hidden`. It writes `hidden` back and the page never scrolls
 * again. So the original value is read once, by the first holder, and put
 * back once, by the last.
 *
 * `html` is locked as well as `body`: with `overflow: visible` on `html` the
 * viewport keeps its own scroll and only wheel input is blocked, which is a
 * worse failure than not locking at all — the page still moves when anything
 * scrolls it programmatically. The stylesheet reserves the scrollbar gutter,
 * so taking the bar away shifts nothing.
 */

let holders = 0;
let saved = { html: '', body: '' };

/** Holds the page still. Call the returned function to release this hold. */
export function lockScroll(): () => void {
  const { documentElement: html, body } = document;

  if (holders === 0) {
    saved = { html: html.style.overflow, body: body.style.overflow };
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
  }
  holders += 1;

  let released = false;

  return () => {
    // StrictMode runs cleanups twice; a second call must not drop someone
    // else's hold and unlock the page out from under them.
    if (released) return;
    released = true;

    holders -= 1;
    if (holders > 0) return;

    html.style.overflow = saved.html;
    body.style.overflow = saved.body;
  };
}
