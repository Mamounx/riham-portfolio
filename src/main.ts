import './styles.css';
import { initHover, initScroll } from './animations';
import { initLightbox } from './lightbox';
import { renderContactQR } from './qr';

initHover();
initScroll();
initLightbox();

// Footer QR → save a new phone contact (vCard, with avatar).
const qrEl = document.getElementById('qrimg') as HTMLImageElement | null;
if (qrEl) renderContactQR(qrEl);
