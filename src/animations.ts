/**
 * Faithful :hover replacement for the design's `style-hover` attributes,
 * plus the scroll parallax / reveal / back-to-top behaviour ported from the
 * original design runtime. Respects prefers-reduced-motion.
 */

export function initHover(): void {
  const parse = (s: string): Array<[string, string]> =>
    s
      .split(';')
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => {
        const i = r.indexOf(':');
        return [r.slice(0, i).trim(), r.slice(i + 1).trim()] as [string, string];
      });

  document.querySelectorAll<HTMLElement>('[style-hover]').forEach((el) => {
    const props = parse(el.getAttribute('style-hover') || '');
    const saved: Record<string, string> = {};
    el.addEventListener('mouseenter', () => {
      props.forEach(([k, v]) => {
        saved[k] = el.style.getPropertyValue(k);
        el.style.setProperty(k, v);
      });
    });
    el.addEventListener('mouseleave', () => {
      props.forEach(([k]) => el.style.setProperty(k, saved[k] || ''));
    });
  });
}

interface AnimItem {
  el: HTMLElement;
  spec: Record<string, number[]>;
  r0: number;
  r1: number;
  track: HTMLElement;
}

export function initScroll(): void {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const items: AnimItem[] = Array.from(document.querySelectorAll<HTMLElement>('[data-anim]')).map((el) => {
    const spec: Record<string, number[]> = {};
    (el.dataset.anim || '').split(';').forEach((p) => {
      const [k, val] = p.split(':');
      spec[k.trim()] = val.split(',').map(Number);
    });
    const [r0, r1] = (el.dataset.range || '0,1').split(',').map(Number);
    return { el, spec, r0, r1, track: (el.closest('[data-track]') as HTMLElement) || el };
  });

  const apply = (it: AnimItem, t: number): void => {
    const v = (k: string): number | null =>
      it.spec[k] ? it.spec[k][0] + (it.spec[k][1] - it.spec[k][0]) * t : null;
    const tx = v('tx') ?? 0;
    const ty = v('ty') ?? 0;
    const r = v('r') ?? 0;
    const s = v('s') ?? 1;
    const o = v('o');
    it.el.style.transform = `translate(${tx}%, ${ty}%) rotate(${r}deg) scale(${s})`;
    if (o !== null) it.el.style.opacity = String(o);
  };

  const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  const topBtn = document.querySelector<HTMLElement>('[data-totop]');

  if (reduce) {
    items.forEach((it) => apply(it, 1));
    if (topBtn) {
      topBtn.style.opacity = '0';
      topBtn.style.pointerEvents = 'none';
    }
    return;
  }

  const vh0 = window.innerHeight;
  reveals.forEach((el) => {
    if (el.getBoundingClientRect().top < vh0 * 0.9) {
      el.dataset.shown = '1';
      return;
    }
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    const d = el.dataset.reveal || '0';
    el.style.transition = `opacity 1.1s cubic-bezier(.2,.7,.2,1) ${d}ms, transform 1.1s cubic-bezier(.2,.7,.2,1) ${d}ms`;
  });

  const ease = (t: number): number => t * t * (3 - 2 * t);

  const tick = (): void => {
    const vh = window.innerHeight;
    items.forEach((it) => {
      const b = it.track.getBoundingClientRect();
      if (b.bottom < -200 || b.top > vh + 200) return;
      const p = Math.min(1, Math.max(0, (vh - b.top) / (b.height + vh)));
      const t = Math.min(1, Math.max(0, (p - it.r0) / (it.r1 - it.r0)));
      apply(it, ease(t));
    });
    if (topBtn) {
      const se = document.scrollingElement;
      const show = window.scrollY > vh * 0.8 || (se ? se.scrollTop > vh * 0.8 : false);
      topBtn.style.opacity = show ? '1' : '0';
      topBtn.style.pointerEvents = show ? 'auto' : 'none';
      topBtn.style.transform = show ? 'none' : 'translateY(12px)';
    }
    reveals.forEach((el) => {
      if (el.dataset.shown) return;
      if (el.getBoundingClientRect().top < vh * 0.9) {
        el.dataset.shown = '1';
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  };

  let pending = false;
  const onScroll = (): void => {
    if (pending) return;
    pending = true;
    const run = (): void => {
      if (!pending) return;
      pending = false;
      tick();
    };
    requestAnimationFrame(run);
    setTimeout(run, 50);
  };

  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onScroll);
  tick();
}
