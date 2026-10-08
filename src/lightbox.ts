/**
 * Full-screen, browsable gallery lightbox. Every content photo becomes
 * clickable (prev/next, arrow keys, swipe, Esc, counter). Nav thumbnails
 * (inside #work), the client logo and the QR code are excluded.
 */
export function initLightbox(): void {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img')).filter((im) => {
    if (im.hasAttribute('data-qr')) return false; // QR code
    if (/logo35/.test(im.getAttribute('src') || '')) return false; // client logo
    if (im.closest('#work')) return false; // nav thumbnails jump to a project
    if (im.closest('#lb')) return false; // the lightbox itself
    return true;
  });
  if (!imgs.length) return;

  const lb = document.getElementById('lb');
  if (!lb) return;
  const pic = lb.querySelector<HTMLImageElement>('.lb-pic')!;
  const cap = lb.querySelector<HTMLElement>('.lb-cap')!;
  const count = lb.querySelector<HTMLElement>('.lb-count')!;

  let idx = 0;
  let lastFocus: HTMLElement | null = null;
  const srcOf = (im: HTMLImageElement): string => im.currentSrc || im.src;
  const preload = (i: number): void => {
    const im = imgs[(i + imgs.length) % imgs.length];
    const p = new Image();
    p.src = srcOf(im);
  };

  const show = (i: number): void => {
    idx = (i + imgs.length) % imgs.length;
    const s = imgs[idx];
    pic.classList.remove('show');
    const full = new Image();
    full.onload = () => {
      pic.src = full.src;
      pic.classList.add('show');
    };
    full.src = srcOf(s);
    if (full.complete) {
      pic.src = full.src;
      pic.classList.add('show');
    }
    pic.alt = s.alt || '';
    cap.textContent = s.alt || '';
    count.textContent = `${idx + 1} / ${imgs.length}`;
    preload(idx + 1);
    preload(idx - 1);
  };

  const open = (i: number): void => {
    lastFocus = document.activeElement as HTMLElement;
    show(i);
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lb.querySelector<HTMLElement>('.lb-close')!.focus();
  };

  const close = (): void => {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus?.focus();
  };

  imgs.forEach((im, i) => {
    im.classList.add('gx');
    im.setAttribute('role', 'button');
    im.setAttribute('tabindex', '0');
    im.addEventListener('click', () => open(i));
    im.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  lb.querySelector('.lb-close')!.addEventListener('click', close);
  lb.querySelector('.lb-prev')!.addEventListener('click', () => show(idx - 1));
  lb.querySelector('.lb-next')!.addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === lb || t.classList.contains('lb-stage')) close();
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });

  let sx = 0;
  let sy = 0;
  lb.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
    },
    { passive: true },
  );
  lb.addEventListener(
    'touchend',
    (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(idx + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );
}
