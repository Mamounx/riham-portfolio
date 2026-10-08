import qrcode from 'qrcode-generator';

/** vCard 3.0 for Riham Elmakki — same contact data used across the site. */
const VCARD = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  'N:Elmakki;Riham;;;',
  'FN:Riham Elmakki',
  'TITLE:Interior Designer',
  'TEL;TYPE=CELL:+96893890160',
  'TEL;TYPE=CELL:+905415608690',
  'EMAIL:riham_almucki@hotmail.com',
  'END:VCARD',
].join('\r\n');

/** Render the contact vCard as a QR code into the given <img>. */
export function renderQR(el: HTMLImageElement, cellSize = 8): void {
  const q = qrcode(0, 'M');
  q.addData(VCARD);
  q.make();
  el.src = q.createDataURL(cellSize, 0);
}
