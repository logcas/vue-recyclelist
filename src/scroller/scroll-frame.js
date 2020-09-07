import { rAF } from './helper';

const INTERVAL = 50; // 300ms

let lastExcute;
let rAFTimer;

function onScroll (callback = () => {}, ...args) {
  const rAFHandler = () => {
    const now = Date.now();
    if (!lastExcute || (lastExcute && now - lastExcute >= INTERVAL)) {
      callback(...args);
      lastExcute = now;
    }
    rAFTimer = rAF(rAFHandler);
  };

  rAFTimer = rAF(rAFHandler);
}

export default {
  $watch(fn, ...args) {
    onScroll(fn, ...args);
  },
  $unwatch() {
    cancelAnimationFrame(rAFTimer);
  }
}

