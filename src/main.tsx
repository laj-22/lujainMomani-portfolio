import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if (import.meta.env.PROD) {
  // Disable context menu and certain key combos
  window.addEventListener('contextmenu', (e) => e.preventDefault());
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (
      e.ctrlKey && ['s', 'u', 'p'].includes(k) ||
      (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) ||
      (e.key === 'F12')
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
  // Prevent image drag and selection
  window.addEventListener('load', () => {
    document.querySelectorAll('img').forEach((img) => {
      img.setAttribute('draggable', 'false');
      img.addEventListener('dragstart', (e) => e.preventDefault());
      img.addEventListener('contextmenu', (e) => e.preventDefault());
    });
    document.body.style.userSelect = 'none';
  });
  // Silence console
  for (const m of ['log','debug','info','warn','error'] as const) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (console as any)[m] = () => {};
  }
}

createRoot(document.getElementById("root")!).render(<App />);
