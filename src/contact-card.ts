import './card.css';
import { renderLinkQR } from './qr';

// Contact-card QR → open the live portfolio website.
const qrEl = document.getElementById('qrimg') as HTMLImageElement | null;
if (qrEl) renderLinkQR(qrEl);
