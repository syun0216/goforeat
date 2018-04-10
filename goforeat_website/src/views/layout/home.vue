<template>
  <div class="app-main">
    <topheader></topheader>
    <sort></sort>
    <list></list>
  </div>
</template>
<script>
  import topheader from './topheader.vue'
  import sort from './sort.vue'
  import list from './list.vue'
  export default {
    components:{
      topheader,
      sort,
      list
    }
  }
</script>
<style lang="scss" scoped>
  .app-main{
    width:100%;
    min-width: 980px;
    min-height:100vh;
  }
</style>
