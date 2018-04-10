<template>
  <div class="top-header-container">
    <div class="top-header-content">
      <h1 class="logo fl">
          <a href="/" title="美团外卖"><img src="../../assets/1513159482.png" alt="美团外卖"></a>
      </h1>
      <div class="desire fl">
        <a href="/" class="ca-lightgrey"><span>首頁</span></a>
        <a href="http://aboutus.goforeat.hk" target="_blank" class="ca-lightgrey" rel="nofollow"><span>公司介紹</span></a>
        <a href="javascript:;" class="ca-lightgrey"><span>入駐加盟 97926095</span></a>
      </div>
      <div class=" search-box">
        <el-input placeholder="請輸入內容" v-model="searchContent" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        searchContent:''
      }
    },
    methods:{
      search(){
        this.$message({
          type:'warning',
          message:'該功能暫未開放'
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .top-header-container{
    width:100%;
    background:#fff;
    .top-header-content{
      width: 980px;
      margin: 0 auto;
      color: #898989;
      line-height: 80px;
      height: 80px;
      .logo {
          margin-top: 25px;
          height: 67px;
          width: 178px;
          float: left;
          a{
            text-decoration: none;
            img{
              width:163px;
            }
          }
      }
      .desire{
        position: relative;
        margin-left: 90px;
        float: left;
        a {
            font-size: 16px;
            color: #333;
            span{
              margin-left: 56px;
              &:hover{
                color:#f07341
              }
            }
        }
      }
      .search-box{
        float: right;
      }
    }
  }
</style>
