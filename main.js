window.addEventListener('load', () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);
});

// Envelope open/close behavior
document.addEventListener('DOMContentLoaded', () => {
  const envelope = document.getElementById('envelope');
  if (!envelope) return;

  let isAnimating = false;

  function setOpen(open) {
    if (isAnimating) return;
    isAnimating = true;
    if (open) {
      envelope.classList.add('open');
      envelope.setAttribute('aria-pressed', 'true');
      envelope.setAttribute('aria-hidden', 'false');
    } else {
      envelope.classList.remove('open');
      envelope.setAttribute('aria-pressed', 'false');
      envelope.setAttribute('aria-hidden', 'true');
    }
    // Wait for CSS transition to finish (match ~600ms used in CSS)
    setTimeout(() => { isAnimating = false; }, 700);
  }

  // Toggle on any click (anywhere on the document)
  document.addEventListener('click', (e) => {
    // If click was on an interactive form element, ignore
    const tag = e.target.tagName.toLowerCase();
    if (['a','button','input','textarea','select','label'].includes(tag)) return;
    // If click is inside the dialog, ignore
    if (dialog && dialog.contains(e.target)) return;
    // If click is inside the letter, ignore (handled by letter click)
    if (letter && letter.contains(e.target)) return;
    const isOpen = envelope.classList.contains('open');
    setOpen(!isOpen);
  });

  // ----- Modal / Letter dialog behavior -----
  const letter = envelope.querySelector('.letter');
  const dialog = document.getElementById('letterDialog');
  const dialogPanel = dialog && dialog.querySelector('.modal__panel');
  const dialogBackdrop = dialog && dialog.querySelector('.modal__backdrop');
  const dialogClose = dialog && dialog.querySelector('.modal__close');
  let lastFocused = null;

  function openDialog() {
    if (!dialog) return;
    lastFocused = document.activeElement;
    dialog.setAttribute('aria-hidden', 'false');
    // set focus into dialog for accessibility
    dialogPanel.setAttribute('tabindex', '-1');
    dialogPanel.focus();
  }

  function closeDialog() {
    if (!dialog) return;
    dialog.setAttribute('aria-hidden', 'true');
    // restore focus
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  if (letter) {
    // clicking the letter should open the dialog and not toggle the envelope
    letter.addEventListener('click', (ev) => {
      ev.stopPropagation();
      openDialog();
    });
    // also allow keyboard activation on letter when it's focused
    letter.setAttribute('tabindex', '0');
    letter.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        ev.stopPropagation();
        openDialog();
      }
    });
  }

  if (dialogBackdrop) {
    dialogBackdrop.addEventListener('click', () => closeDialog());
  }
  if (dialogClose) {
    dialogClose.addEventListener('click', () => closeDialog());
  }
  // close on Escape
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeDialog();
  });

  // Allow keyboard activation when envelope is focused
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(!envelope.classList.contains('open'));
    }
  });

});