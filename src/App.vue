<template>
  <div id="app">
    <VueRecyclelist :items="items" :item-height="81">
      <template v-slot="{ item }">
        <div class="item">
          <img :src="item.avatar" class="item-avatar" />
          <div class="item-username">{{ item.name }}</div>
        </div>
      </template>
    </VueRecyclelist>
  </div>
</template>

<script>
import faker from "faker";
import VueRecyclelist from "@/components/RecycleList.vue";

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
  components: {
    VueRecyclelist,
  },
  data() {
    return {
      items: buildData(),
    };
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
