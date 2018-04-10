<template>
  <div class="sort-banner-container">
    <div class="rest-banner">
      <div class="imgsort-wrapper" v-for="(item,idx) in filterData" :key="idx">
        <!-- <div > -->
          <span class="imgsort-filter-title"><i style="color:#f07341;font-size: 18px;
    vertical-align: -2px;" :class="item.icon"></i>  {{item.name}}</span>
          <ul class="clearfix imgsort-content">
            <!-- <li v-for="(citem,index) in item.data" :key="index"  class="fl">
              <a href="/" data-cate="cate_all" class="imgsort-list" title="全部">
                <span class="imgsort-info">{{citem[1]}}</span>
              </a>
            </li> -->
            <li v-for="(citem,index) in item.data" :key="index" class="fl" :class="{marginLeft:idx===0 && index === 0}">
                  <a class="imgsort-list" title="美食" href="javascript:;" data-cate="910">
                  <span class="imgsort-info" :class="{selected:filterChoose[item.oriName] == citem[0]}" @click="filterStore(citem,item.oriName)">{{citem[1]}}</span>
                </a>
              </li>
              <!-- <li class="fl">
                  <a class="imgsort-list" title="美食" href="/" data-cate="910">
                  <span class="imgsort-info">美食</span>
                </a>
              </li>
              <li class="fl">
                  <a class="imgsort-list" title="正餐优选" href="/" data-cate="950">
                  <span class="imgsort-info">正餐优选</span>
                </a>
              </li>
              <li class="fl ">
                  <a class="imgsort-list" title="超市" href="/" data-cate="20">
                  <span class="imgsort-info">超市</span>
                </a>
              </li>
              <li class="fl">
                  <a class="imgsort-list" title="精选小吃" href="/" data-cate="100180">
                  <span class="imgsort-info">精选小吃</span>
                </a>
              </li>
              <li class="fl">
                  <a class="imgsort-list" title="鲜果购" href="/" data-cate="21">
                  <span class="imgsort-info">鲜果购</span>
                </a>
              </li>
              <li class="fl">
                  <a class="imgsort-list" title="下午茶" href="/" data-cate="940">
                  <span class="imgsort-info">下午茶</span>
                </a>
              </li> -->
          </ul>
        <!-- </div> -->
      </div>
      <!-- <div class="rest-filter clearfix" style="border: none;"></div> -->
    </div>
  </div>
</template>
<script>
import api from '../../api'
  export default{
    data(){
      return {
        filterData:null,
        filterChoose:{
          area:'all',
          seat:'all',
          categories:'all'
        }
      }
    },
    methods:{
      getFilterData(){
        api.getCanteenOption().then(data => {
          // console.log(data)
          if(data.status == 200) {
            const result = []
            for(let i in data.data){
              // console.log(i)
              if(i == 'areas'){
                data.data[i].unshift(['all','全部'])
                // result.push({name:'地区',icon:'el-icon-location',data:['all','全部']})
                result.push({name:'地區',oriName:'area',icon:'el-icon-location',data:data.data[i]})
              }else if(i == 'categories'){
                data.data[i].unshift(['all','全部'])
                result.push({name:'分類',oriName:'categories',icon:'el-icon-tickets',data:data.data[i]})
              }else if(i == 'seats'){
                data.data[i].unshift(['all','全部'])
                result.push({name:'人數',oriName:'seat',icon:'el-icon-view',data:data.data[i]})
              }
            }
            this.filterData = result
            // console.log('filter',this.filterData)
          }
        })
      },
      filterStore(item,name){
        this.filterChoose[name] = item[0]
        this.$store.dispatch('changeFilter',this.filterChoose)
        // console.log(item,name)
      }
    },
    created(){
      this.getFilterData()
    }
  }
</script>
<style lang="scss" scoped>
  .imgsort-filter-title, .rest-filter-title {
    position: absolute;
    left: 0;
    padding-left: 32px;
    font-size: 14px;
}
.imgsort-content {
    width: 822px;
    padding-left: 130px;
    margin-top: -1px;
}
  .sort-banner-container{
    width:100%;
    .rest-banner {
        width: 980px;
        margin: 15px auto 10px;
        background:#fff;
        .imgsort-wrapper {
            // padding: 18px 0 9px;
            margin: 0 10px;
            position: relative;
            li.fl {
                margin: 8px 20px 8px 0;
            }
            .imgsort-info {
                text-align: center;
                display: block;
                color: #898989;
                padding:1px 2px;
                &:hover{
                  background-color: #f07341;
                  // padding:0 2px;
                  color:#fff;
                }
            }
            .imgsort-list {
                display: block;
                color: #000;
                font-size: 14px;
            }
            .imgsort-filter-title {
                top: 9px;
                // background: url(http://xs01.meituan.net/waimai_web/img/home/icon_sort2.png) no-repeat;
                left: 10px;
                .imgsort-content {
                    width: 822px;
                    padding-left: 130px;
                }
            }
        }
        .rest-filter {
            position: relative;
            padding: 0 0 18px 128px;
            margin: 0 12px;
            border-top: 1px solid #e9e9e9;
        }
    }
  }
  .selected{
  background:#f07341 !important;
  color:#fff !important;
}
.marginLeft{
  margin: 8px 20px 8px -38px !important;
}
</style>
