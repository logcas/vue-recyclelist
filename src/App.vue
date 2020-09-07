<template>
  <div id="app">
    <div ref="scroll" id="wrapper">
      <div>
        <div v-for="item in items" :key="item.uid" class="item">
          <img :src="item.avatar" class="item-avatar" />
          <div class="item-username">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import faker from "faker";
import Scroller from "./scroller";

function buildData() {
  const res = [];
  for (let i = 0; i < 500; ++i) {
    res.push({
      avatar: faker.image.avatar(),
      name: faker.internet.userName(),
      uid: faker.random.uuid(),
    });
  }
  return res;
}

export default {
  name: "App",
  data() {
    return {
      items: buildData(),
    };
  },
  mounted() {
    const scroller = new Scroller(this.$refs.scroll);
    scroller.$on('scroll', pos => {
      console.log(pos);
    });
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
}

#wrapper {
  height: 100vh;
  overflow: hidden;
}

.item {
  display: flex;
  height: 80px;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #e8e8e8;

  &-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  &-username {
    margin-left: 20px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 60px;
  }
}
</style>
