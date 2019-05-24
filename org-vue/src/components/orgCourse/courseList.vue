<template>
    <div id="courseList">
      <nav class="searchNav" :class="{'is-fixed':isFixed}">
          <div class="type">
            <div class="typeFilter">
              <swiper :options="swiperOption" ref="mySwiper" >
                <swiper-slide v-for="item in courseType" :key="item.value" >
                   <span :class="{active:item.value === selected.value}" class="typeName" @click="chooseType(item.value)">{{item.name}}</span>
                </swiper-slide>
              </swiper>
            </div>
            <img src="./../../assets/img/search-red.png" alt="filter" @click="$router.push('/search'+'?orgid='+$store.state.orgId)">
          </div>
      </nav>
      <div class="container" v-infinite-scroll="loadMore"
             :infinite-scroll-disabled="loading"
             :infinite-scroll-distance="bottomHei">
          <!-- <router-link v-for="item of items" :key="item.training_id" :to="item.url"> -->
          <a v-for="item of items" :key="item.training_id" :href="item.url">
              <div class="itemCourse">
                  <div class="imgCourse">
                      <!-- <img src="../../assets/img/heigg.jpg" alt=""> -->
                      <img :src="item.logo" :onerror="defaultImg" alt="">
                  </div>
                  <mt-cell :title="item.training_name" class="group-name groupF">
                      <span>RMB  </span><span class="group-prize">{{item.training_cost}}</span>
                  </mt-cell>
                  <mt-cell :title="item.training_address" class="groupF">
                      <span class="fa fa-map-marker"  slot='icon'></span>
                  </mt-cell>
                  <mt-cell :title="item.training_datetime" class="groupF group-time">
                      <span class="fa fa-clock-o"  slot='icon'></span>
                      <span class="pnum-p"><span class="pnum text-center">{{item.pnum}}</span>已报人数</span>
                  </mt-cell>
              </div>
          </a>
      </div>
      <div class="text-center no-more-show"
           v-if="totalPage <= currentPage">
          <img src="./../../assets/img/no_more.png" alt="no-more">
          <p>没有更多了</p>
      </div>
      <!-- <div class="my-slide">
          <div class="slide-wrap"
               :class="{'slide-wrap-moving':filter}">
              <div class="slide-container">
                  <p class="text-center slide-title">类型筛选</p>
                  <ul>
                      <li v-for="item in courseType"
                          class="text-center"
                          :class="{active:item.value === selected.value}"
                          @click="chooseType(item.name,item.value)">{{item.name}}</li>
                  </ul>
              </div>
          </div>
          <div class="slide-mask"
               v-show="filter"
               @click="filterHide">

          </div>
      </div> -->
    </div>
</template>
<script>
  import course_img from '../../assets/img/heigg.jpg'

  export default {
    data: function () {
      return {
        id:'',
        item:{
          // event_id:'2584',
          logoImg:'//m.yunbisai.com/uploadfiles/event/event_2584/eventAdv1505646660.jpg',
          showImg:''
        },
        defaultImg:"this.src='//g.yunbisai.com/img/ad/detailAd_01.jpg'",
        selected:{value:''},
        courseType:[
          {name:'全部',value:''},
          {name:'象棋',value:1},
          {name:'围棋',value:2},
          {name:'国际象棋',value:4},
          {name:'国际跳棋',value:8},
          {name:'五子棋',value:16},
          {name:'扑克',value:32},
        ],
        items:[],
        isFixed:false,
        loading:false,
        bottomHei:0,
        currentPage:1,
        totalPage:1,
        pageSize:9,
        // filterType:'',
        filter:false,
        type:'',
        //swiper 参数
        swiperOption: {
           // paginationClickable :false,
           slidesPerView : 3.2,
           // spaceBetween : 10,
        },
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    methods:{
      chooseType(value){
        const that = this;
        that.selected.value = value;
        that.type = value;
        that.currentPage = 1;
        that.filter = false;
        that.items = [];
        that.getList();
      },
      // filterType(){
      //   this.filter = true;
      // },
      // filterHide(){
      //   this.filter = false;
      // },
      // 滚动筛选区域
      scrollFilterFix(){
        const that = this;
        const rootSize = parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0])['font-size']);
        const navHeight = rootSize * 1;
        that.isFixed =  document.documentElement.scrollTop >= navHeight || document.body.scrollTop >= navHeight;
        that.bottomHei = rootSize * 1.1;
      },
      // 加载数据
      loadMore(){
        const that = this;
        if(that.currentPage < that.totalPage){
          that.loading = true;
          that.currentPage ++;
          that.getList();
        }
      },
      getList(){
        const that = this;
        that.$axios({
          method:"get",
          url:'/request/Train/TrainList',
          params:{
            orgID: that.$store.state.orgId,   
            type:that.type,
            PageSize:that.pageSize,
            page:that.currentPage,
          },
        }).then(response => {
          if(response.data.error===0){
            for (let v of response.data.datArr.rows){
              if(v.logo){
                v.logo=that.$store.state.base_uri_prefix+'api.yunbisai.com/'+v.logo
              }else{
                v.logo=course_img;
              }
              !v.pnum?v.pnum=0:0
              v.url='/signUp/course?guid='+v.training_guid+'&trainid='+v.training_id+'&orgid='+that.$store.state.orgId
              // v.time=that.eventTime(v.min_time,v.max_time)
              Object.assign(v,that.item);
              that.items.push(v);
            }
            that.totalPage = ( (response.data.datArr.TotalRecord / that.pageSize) >> 0 ) + 1;
            that.loading = true;
          }
          //console.log(response.data.datArr.rows);
        })
        

      }
    },
    mounted(){
      const that = this;
      if(that.$store.state.orgId==that.$store.state.guangdongID){
        that.courseType=[
            {name:'围棋教师培训',value:33},
            {name:'围棋裁判员培训',value:34},
        ]
      }
      that.getList();
      window.addEventListener('scroll',that.scrollFilterFix);
    }
  }
</script>
<style>
    #courseList .searchNav.is-fixed{
        position:fixed;
        top:1rem;
        z-index: 50;
    }
    #courseList .mint-cell-wrapper{
      background-image:none;
    }
    #courseList .searchNav{
      background:#fff;
      width:100%;
      height:0.8rem;
      overflow:hidden;
      top:1rem;
    }
    #courseList{
        /*margin-top: 2.1rem;*/
        margin-bottom:1.3rem;
    }
    .imgCourse img{
        width: 100%
    }
    .itemCourse .mint-cell .mint-cell-wrapper {
        font-size: 0.28rem;
        color: #333;
    }
    a{
        text-decoration: none;
    }
    .group-name .mint-cell-text{
        font-size: 0.3rem;
        font-weight: bold;
    }
    .group-prize{
        font-size:0.4rem;
        font-style: italic;
        color:#cc0000;
        font-weight: bold;
    }
    .mint-cell{
        min-height: 0.6rem;
    }
    .groupF .fa{
        color:#CA0909;
    }
    .pnum-p{
        position: relative;
    }
    #courseList .type{
        position:relative;
        width:100%;
        height:0.8rem;
        line-height:0.8rem;
        margin-left:0.3rem;
        font-size:0.3rem;
        color:#c90909;
    }
    #courseList .type .typeFilter{
      width: 6rem;
      overflow: hidden;
      color: #333;
    }
    #courseList .type .typeFilter .active{
      color: #c90909;
    }
    #courseList .type .typeFilter .typeName{
      display: inline-block;
      width: 100%;
    }
    #courseList .type span img{
        width:0.3rem;
        position:relative;
        top:0.04rem;
        left:0.03rem;
    }
    #courseList .type > img{
        position:absolute;
        top:0.16rem;
        width:0.4rem;
        right:0.6rem;
    }
    .pnum{
        background: #c90909;
        display: inline-block;
        width: 0.4rem;
        line-height: 0.4rem;
        color: #fff;
        padding: 0.1rem;
        margin-right: 0.12rem;
        border-radius: 50%;
    }
    .pnum:after,.pnum:before{

    }
    .itemCourse{
        background-color: #fff;
    }
    .itemCourse:after,.itemCourse:before{
        clear: both;
        content: '';
        display: table;
    }
    .group-time{
        padding-bottom: 15px;
    }
     #courseList .no-more-show img{
        width:2rem;
    }
    #courseList .no-more-show p{
        font-size:0.28rem;
        margin:0 0 0.1rem 0;
        color:#999;
    }
    #courseList .filter-container{
        width:100%;
        height:100%;
        position:fixed;
        top:0;
        z-index:99999;
        display:none;
        background:#fff;
        -webkit-box-shadow: 0 0 4px 0 #ddd;
        -moz-box-shadow: 0 0 4px 0 #ddd;
        box-shadow: 0 0 4px 0 #ddd;
    }
    #courseList  .slide-mask{
        width:7.5rem;
        background:rgba(0,0,0,0.5);
        height:100%;
        position:fixed;
        z-index:99990;
        top:0;
    }
    #courseList  .slide-wrap {
        width:5.5rem;
        z-index:99999;
        height:100%;
        position:fixed;
        top:0;
        background:#fff;
        right:-5.5rem;
        -webkit-transition: right 200ms ease-in;
        -moz-transition: right 200ms ease-in;
        -ms-transition: right 200ms ease-in;
        -o-transition: right 200ms ease-in;
        transition: right 200ms ease-in;
    }
    #courseList  .slide-wrap.slide-wrap-moving{
        right:0;
    }
    #courseList  .slide-wrap .slide-container{
        font-size:0.3rem;
    }
    #courseList  .slide-wrap .slide-container ul{
        text-decoration:none;
        list-style:none;
        text-align:center;
        padding:0;
        margin:0.2rem 0;
    }
    #courseList  .slide-wrap .slide-container ul li {
        width:2rem;
        height:0.6rem;
        line-height:0.6rem;
        margin:0.2rem auto;
        -webkit-border-radius:0.3rem;
        -moz-border-radius:0.3rem;
        border-radius:0.3rem;
        color:#666;
    }
    #courseList  .slide-wrap .slide-container ul li.active{
        background:#c90909;
        color:#fff;
    }
    #courseList  .slide-wrap .slide-container .slide-title{
        margin:0;
        height:0.8rem;
        line-height:0.8rem;
        font-size:0.36rem;
        color:#000;
        background:#dcdcdc;
    }
    #courseList .swiper-container .swiper-slide{
      margin-right: 0.45rem;
    }
</style> 
