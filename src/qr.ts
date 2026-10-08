import qrcode from 'qrcode-generator';

const SITE = 'https://riham-portfolio.netlify.app';

/**
 * vCard 3.0 for Riham Elmakki. The avatar is referenced by URL so phones can
 * fetch it when the contact is saved (keeps the QR small and scannable — an
 * embedded photo would bloat the code beyond a reliable scan).
 */
const VCARD = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'N:Elmakki;Riham;;;',
  'FN:Riham Elmakki',
  'TITLE:Interior Designer',
  'TEL;TYPE=CELL:+96893890160',
  'TEL;TYPE=CELL:+905415608690',
  'EMAIL:riham_almucki@hotmail.com',
  `PHOTO;VALUE=URI:${SITE}/assets/portrait.jpg`,
  `URL:${SITE}`,
  'END:VCARD',
].join('\r\n');

interface QROpts {
  bg: string; // background / finder-gap colour (match the tile it sits on)
  fg?: string; // data-module colour
  accent?: string; // finder "eye" colour
}

/** Build a brand-styled QR as an SVG string: rounded modules + accent eyes. */
function qrSVG(data: string, ecc: 'L' | 'M' | 'Q' | 'H', opts: QROpts): string {
  const fg = opts.fg ?? '#2B211B';
  const accent = opts.accent ?? '#A4472A';
  const bg = opts.bg;

  const qr = qrcode(0, ecc);
  qr.addData(data);
  qr.make();
  const n = qr.getModuleCount();
  const m = 4; // quiet zone (modules)
  const s = n + m * 2;

  // The three position-detection patterns (7×7) get a custom "eye" treatment.
  const isFinder = (r: number, c: number): boolean =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);

  // Full-size rounded-square modules keep high coverage (reliably scannable)
  // while still reading as a soft, branded shape.
  let cells = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!qr.isDark(r, c) || isFinder(r, c)) continue;
      cells += `<rect x="${c + m}" y="${r + m}" width="1" height="1" rx="0.3"/>`;
    }
  }

  // Finder "eyes": rounded accent frame with a rounded centre.
  const eyes = ([[0, 0], [0, n - 7], [n - 7, 0]] as const)
    .map(([fr, fc]) => {
      const x = fc + m;
      const y = fr + m;
      return (
        `<rect x="${x}" y="${y}" width="7" height="7" rx="1.5" fill="${accent}"/>` +
        `<rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx="0.8" fill="${bg}"/>` +
        `<rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="0.4" fill="${accent}"/>`
      );
    })
    .join('');

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" shape-rendering="geometricPrecision">` +
    `<rect width="${s}" height="${s}" fill="${bg}"/>` +
    `<g fill="${fg}">${cells}</g>${eyes}</svg>`
  );
}

/** Replace the placeholder <img> with an inline SVG QR that fills its box. */
function mount(el: Element, svg: string): void {
  const wrap = document.createElement('div');
  wrap.innerHTML = svg;
  const node = wrap.firstElementChild;
  if (!node) return;
  node.setAttribute('width', '100%');
  node.setAttribute('height', '100%');
  node.setAttribute('style', 'display:block');
  el.replaceWith(node);
}

/** Footer QR — saves a new phone contact (vCard) with the avatar attached. */
export function renderContactQR(el: Element, bg = '#FBF8F3'): void {
  mount(el, qrSVG(VCARD, 'M', { bg }));
}

/** Contact-card QR — opens the live portfolio website. */
export function renderLinkQR(el: Element, bg = '#F4EEE4'): void {
  mount(el, qrSVG(SITE, 'H', { bg }));
}
