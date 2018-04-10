<template>
  <div id="app">
    <v-backtotop  transitionName="fade" :customStyle="myBackToTopStyle" :visibilityHeight="300" :backPosition="50"></v-backtotop>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      myBackToTopStyle: {
        right: '120px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中
        background: '#e7eaf1', // 按钮的背景颜色
        'z-index': 1001
      }
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
body{
  padding:0;
  margin:0;
  background-color: #F5F5F5;
}
a{
  text-decoration: none
}
.fl{
  float: left;    
}
.clearfix, .search-box .result-right li {
    zoom: 1;
}
.clearfix:after {
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}
ul{
  list-style: none;
}
</style>
