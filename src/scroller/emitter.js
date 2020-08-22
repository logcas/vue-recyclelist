export default class EventEmitter {
  constructor() {
    this._events = {};
  }

  $on(event, fn) {
    const events = this._events[event] || (this._events[event] = []);
    events.push(fn);
    return this;
  }

  $once(event, fn) {
    const instance = this;
    const wrap = function(...args) {
      instance.$un(event, wrap);
      return fn.call(this, ...args);
    };
    this.$on(event, wrap);
    return function remove() {
      instance.$un(event, wrap);
    };
  }

  $un(event, fn) {
    if (!fn) {
      this._events[event] = [];
      return this;
    }
    const events = this._events[event] || (this._events[event] = []);
    let index = -1;
    for (let i = 0;i < events.length; ++i) {
      if (events[i] === fn) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      events.splice(index, 1);
    }
    return this;
  }

  $emit(event, ...args) {
    const events = this._events[event];
    if (Array.isArray(events)) {
      events.forEach(fn => {
        fn(...args);
      });
    }
  }
}