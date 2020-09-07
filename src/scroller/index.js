import { getEl, bindEvent } from './helper';
import EventEmitter from './emitter';
import ScrollFrame from './scroll-frame';

const defaultOptions = {
  scrollY: true,
  enable: true,
  startY: 0
};

export default class Scroller extends EventEmitter {

  constructor(wrapper, options) {
    super();
    this.wrapper = getEl(wrapper);
    this.scroller = this.wrapper.children[0];
    this.scrollerStyle = this.scroller.style;
    this.options = Object.assign(
      {},
      defaultOptions,
      options
    );

    this.y = 0;
    this.maxScrollY = 0;
    this.minScrollY = -this.scroller.offsetHeight + this.wrapper.offsetHeight;
    
    this._initEvent();
  }
  
  _initEvent() {
    if (!(this.scroller instanceof HTMLElement)) {
      console.error('Scroller Element is not a HTMLElement');
      return;
    }
    
    const _ = bindEvent.bind(null, this.scroller);
    ['touchstart'].forEach(event => _(event, this._start.bind(this)));
    ['touchmove'].forEach(event => _(event, this._move.bind(this)));
    ['touchend'].forEach(event => _(event, this._end.bind(this)));
    _('transitionend', this._transitionEnd.bind(this));
  }

  _start(e) {
    if (!this.options.enable) {
      return;
    }

    e.preventDefault();

    this._stopTransition();

    const point = e.touches[0];
    this.pointY = point.pageY;
    this.startY = this.y;
    this.distY = 0;
    this.startTime = Date.now();
  }

  _move(e) {
    if (!this.options.enable) {
      return;
    }

    e.preventDefault();

    const point = e.touches[0];
    this.distY = point.pageY - this.pointY;
    const newY = this._getNewY(this.startY + this.distY);

    this.$emit('scroll', {
      y: newY
    });

    this._translate(newY);
  }

  _end(e) {
    if (!this.options.enable) {
      return;
    }

    e.preventDefault();

    const endTime = Date.now();
    let newY = this._getNewY(this.startY + this.distY);

    if (endTime - this.startTime < 300 && Math.abs(this.distY) > 10) {
      console.log('flick');
      const mo = this.distY * 3;
      newY += mo;
      newY = this._getNewY(newY);
      this._translate(newY, true);

      const self = this;
      // const rafCallback = function() {
      //   const pos = self.getComputedPosition();
      //   self.$emit('scroll', pos);
      //   self.rafTimer = rAF(rafCallback);
      // };
      // this.rafTimer = rAF(rafCallback);

      const rafCallback = function() {
        const pos = self.getComputedPosition();
        self.$emit('scroll', pos);
      };
      ScrollFrame.$watch(rafCallback);
    }
    this.y = newY;
    // this._translate(this.y);
  }

  _stopTransition() {
    if (this.isInTransition) {
      ScrollFrame.$unwatch();
      this.isInTransition = false;
      const pos = this.getComputedPosition();
      console.log('genComputed:', pos.y);
      this._translate(pos.y);
      this.y = pos.y;
    }
  }

  _translate(y, useMo = false) {
    if (useMo) {
      this.scrollerStyle['transition'] = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      this.isInTransition = true;
    } else {
      this.scrollerStyle['transition'] = '';
    }
    this.scrollerStyle['transform'] = `translate3d(0, ${y}px, 0)`;
  }

  _transitionEnd() {
    this.isInTransition = false;
    // window.cancelAnimationFrame(this.rafTimer);
    ScrollFrame.$unwatch();
  }

  getComputedPosition() {
		let matrix = window.getComputedStyle(this.scroller, null);

		matrix = matrix['transform'].split(')')[0].split(', ');
		const x = +(matrix[12] || matrix[4]);
		const y = +(matrix[13] || matrix[5]);

		return { x: x, y: y };
  }

  _getNewY(newY) {
    if (newY < this.minScrollY) {
      return this.minScrollY;
    }
    if (newY > this.maxScrollY) {
      return this.maxScrollY;
    }
    return newY;
  }

}