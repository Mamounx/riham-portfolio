import './styles.css';
import { initHover, initScroll } from './animations';
import { initLightbox } from './lightbox';
import { renderQR } from './qr';

initHover();
initScroll();
initLightbox();

const qrEl = document.getElementById('qrimg') as HTMLImageElement | null;
if (qrEl) renderQR(qrEl, 8);
