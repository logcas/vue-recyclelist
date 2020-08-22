<template>
  <div class="vue-recyclelist">
    <div class="vue-recyclelist_before">
      <slot name="before"></slot>
    </div>
    <div class="vue-recyclelist_content">
      <div :style="tombStyle" class="vue-recyclelist_tomb"></div>
      <div :style="virtualListStyle" class="vue-recyclelist_item_wrapper">
        <div
          v-for="(item, index) in visibleItems"
          :key="index"
          class="vue-recyclelist_item"
        >
          <slot :item="item"></slot>
        </div>
      </div>
    </div>
    <div class="vue-recyclelist_after">
      <slot name="after"></slot>
    </div>
  </div>
</template>

<script>
function getWrapperHeight(el) {
  if (el === window) {
    return window.innerHeight;
  }
  return el.clientHeight;
}

function getScrollTop(el) {
  if (el === window) {
    return (
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop
    );
  }
  return el.scrollTop;
}

export default {
  props: {
    // 列表数据
    items: {
      type: Array,
      default: () => [],
    },
    // 列表项高度
    itemHeight: {
      type: Number,
      require: true,
    },
    // 上下延伸的buffer区域，单位为px
    buffer: {
      type: Number,
      default: 1000,
    },
    // 虚拟列表父元素，默认为window
    wrapper: {
      type: Object,
    },
  },
  data() {
    return {
      // 目前显示的列表
      visibleItems: [],
      // 上次的 firstIndex
      preFirstIndex: -1,
      // 上次的 lastIndex
      preLastIndex: 0,
      // 虚拟列表偏移量
      offsetTop: 0,
    };
  },
  computed: {
    tombHeight() {
      return this.items.length * this.itemHeight;
    },
    tombStyle() {
      return {
        height: this.tombHeight + "px",
      };
    },
    virtualListStyle() {
      return {
        transform: `translate3d(0, ${this.offsetTop}px, 0)`,
      };
    },
    el() {
      return this.wrapper || window;
    },
  },
  mounted() {
    this.initLayout();
    this.initScrollEvent();
  },
  methods: {
    initLayout() {
      // 页面高度
      this.$_viewHeight = getWrapperHeight(this.el);
      // 页面可显示的item数
      this.$_viewItemSize = Math.ceil(this.$_viewHeight / this.itemHeight);
      // buffer区域可显示的item数
      this.$_bufferItemSize = Math.ceil(this.buffer / this.itemHeight);
      this._handleScroll();
    },
    initScrollEvent() {
      this.el.addEventListener("scroll", this._handleScroll);
      this.$on('hook:beforeDestroy', () => {
        this.el.removeEventListener('scroll', this._handleScroll);
      });
    },
    _handleScroll() {
      const scrollTop = getScrollTop(this.el);
      const firstIndex = Math.floor(scrollTop / this.itemHeight);
      const lastIndex = Math.min(firstIndex + this.$_viewItemSize, this.items.length);
      this._updateVisibleItems(firstIndex, lastIndex, scrollTop);
    },
    _updateVisibleItems(firstIndex, lastIndex) {
      if (
        firstIndex !== this.preFirstIndex ||
        lastIndex !== this.preLastIndex
      ) {
        const renderStartIndex = Math.max(0, firstIndex - this.$_bufferItemSize);
        const renderEndIndex = Math.min(this.items.length, lastIndex + this.$_bufferItemSize);
        this.preFirstIndex = firstIndex;
        this.preLastIndex = lastIndex;
        this.visibleItems = this.items.slice(renderStartIndex, renderEndIndex);
        console.log(`[${firstIndex}, ${lastIndex}] [${renderStartIndex}, ${renderEndIndex}]`);
        const bufferTopOffset = Math.abs(renderStartIndex - firstIndex) * this.itemHeight;
        this.offsetTop = firstIndex * this.itemHeight - bufferTopOffset;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.vue-recyclelist {
  &_content {
    position: relative;
  }

  &_tomb {
    position: relative;
  }

  &_item_wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
