import './card.css';
import { renderQR } from './qr';

const qrEl = document.getElementById('qrimg') as HTMLImageElement | null;
if (qrEl) renderQR(qrEl, 10);
