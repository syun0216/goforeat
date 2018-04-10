<template>
  <div class="list-container" v-loading.fullscreen.lock="isLoading">
    <div class="list-inner-container" v-if="rawData.length > 0">
      <el-row style="margin-bottom:15px;" type="flex" :gutter="15" v-for="(item,index) in canteenData" :key="index">
        <el-col :span="6" v-for="(citem, index) in item" :key="index">
          <a :href="citem.url" target="_blank">
          <el-card class="list-card-container" :body-style="{ padding: '0px' }">
            <img :src="citem.image" class="image">
            <div style="padding: 14px;text-align:left">
              <span>{{citem.name}}</span>
              <div>{{citem.dealAddress}}</div>
              <el-rate 
              v-model="citem.rate" 
              disabled
              text-color="#ff9900">{{citem.rate}}</el-rate>
              <!-- <span>{{citem.price}}</span>
              <span>{{citem.address}}</span> -->
              <div class="bottom clearfix">
                <p class="price">人均<span style="color:#ff5858;font-size:15px;">${{citem.price}}</span> </p>
                <!-- <p class="time">{{citem.address}}</p> -->
                <!-- <el-button type="text" class="button">操作按钮</el-button> -->
              </div>
            </div>
          </el-card>
          </a>
        </el-col>
      </el-row>
      <div style="height:1px;background:#ddd;width:100%;margin-bottom:5px;"></div>
       <el-button v-if="rawData.length < total" class="loading-btn" type="text" @click="loadMore()">點擊加載更多商家</el-button>
       <p v-else style="color:#959595">沒有更多數據了</p>
    </div>
    <p v-else> 沒有數據哦~</p>
  </div>
</template>
<script>
import api from "../../api";
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      currentDate: new Date(),
      canteenData:[],
      rawData:[],
      currentPage:1,
      nextPage:1,
      isLoading:false,
      total:null
    };
  },
  methods: {
    init(){
      this.rawData = []
      this.canteenData = []
    },
    getCanteen(page) {
      const params = {
        area:this.area,
        seat:this.seat,
        categories:this.categories
      }
      api.getQueryCanteen("default", page, 12,params).then(data => {
        this.isLoading = false
        if(data.status === 200){
          // console.log(data);
          this.total = data.data.totalCount
          // console.log(this.total)
        // var data = ['法国','澳大利亚','智利','新西兰','西班牙','加拿大','阿根廷','美国','0','国产','波多黎各','英国','比利时','德国','意大利','意大利',];
        data.data.data.forEach((val,idx) => {
          val.dealAddress = val.address.length > 12 ? val.address.substr(0,11) +'...' : val.address
        })
        const result = [];
        for(let i=0,len=data.data.data.length;i<len;i+=4){
          result.push(data.data.data.slice(i,i+4));
        }
        // console.log(result)
        this.rawData = this.rawData.concat(data.data.data)
        this.canteenData = this.canteenData.concat(result)
        }else{
          currentPage-=1
        }
      });
    },
    loadMore(){
      this.isLoading= true
      this.currentPage+=1
      this.getCanteen(this.currentPage)
    }
  },
  created() {
    this.getCanteen(this.currentPage);
  },
  computed:{
    ...mapGetters([
      'area','seat','categories'
    ])
  },
  watch:{
    area(){
      // console.log(11111)
      this.init()
      this.getCanteen(this.currentPage)
    },
    seat(){
      // console.log(2222)
      this.init()
      this.getCanteen(this.currentPage)
    },
    categories(){
      // console.log(3333)
      this.init()
      this.getCanteen(this.currentPage)
    }
  }
};
</script>
<style lang="scss" scoped>
.list-container {
  width: 100%;
  min-height:600px;
  margin-bottom:50px;
  .list-inner-container {
    width: 960px;
    background: #fff;
    margin: 0 auto;
    padding: 10px;
    .list-card-container{
      cursor: pointer;
      &:hover{
        transition:all .5s;
        transform: scale(1.03);
        box-shadow: 0 0 10px #959595;
      }
    }
  }
}
@mixin font($size){
  font-size: $size;
  color: #999;
  padding:0;
  margin:0;
  text-align: right;
}
.price {
  @include font('13px');
}
.time {
  @include font('13px');
  
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 90%;
  display: block;
  height: 156px;
  padding:5%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.loading-btn{
  width:100%;
  margin:0 auto;
  // border-top:1px solid #ddd
}
</style>
