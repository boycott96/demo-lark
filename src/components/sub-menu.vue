<template functional>
  <a-sub-menu :key="props.menuInfo.key">
    <span slot="title">
      <a-icon type="mail" /><span>{{ props.menuInfo.name }}</span>
    </span>
    <template v-for="item in props.menuInfo.children">
      <a-menu-item v-if="item.children == null || item.children == undefined || item.children.length === 0" :key="item.departmentId">
        <a-icon type="pie-chart" />
        <span>{{ item.name }}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.departmentId" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>
<script>
export default {
  props: ["menuInfo"],
};
</script>
<style scoped>
.menu-item {
    width: 256px;
}
</style>
