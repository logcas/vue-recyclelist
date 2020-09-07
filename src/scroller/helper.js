export function getEl(el){
  if (typeof el === 'string') {
    return document.querySelector(el);
  }
  return el;
}

export function bindEvent(el, event, fn, options = {}) {
  el.addEventListener(event, fn, options);
}

export function rAF(...args) {
  return window.requestAnimationFrame(...args);
}
