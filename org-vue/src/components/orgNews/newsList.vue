<template>
    <div id="news-list">
        <nav :class="{'is-fixed':isFixed}">
            <div class="type-nav">
                <div class="typeFilter">
                  <swiper :options="swiperOption" ref="mySwiper" >
                    <swiper-slide v-for="item in newsType" :key="item.value" >
                      <span :class="{active:item.value === selected.value}" class="typeName" @click="chooseType(item.value)">{{item.name}}</span>
                    </swiper-slide>
                  </swiper>
                </div>
                <img src="./../../assets/img/search-red.png"
                     alt="filter"
                     @click="$router.push('/search?orgid='+orgId)">
            </div>
        </nav>

        <div v-infinite-scroll="loadMore"
             :infinite-scroll-disabled="loading"
             :infinite-scroll-distance="bottomHei">
            <article class="news"
                     v-if="news.length"
                     v-for="item in news"
                     @click="goToDetail(item.id)">
                <div class="news-left"
                     v-if="item.img!==''">
                    <img :src="item.img"
                         :onerror="defaultNews"
                         alt="图片未找到">
                </div>
                <div class="news-right"
                     :class="{'news-right-no-img':item.img===''}">
                    <p class="news-title">
                        <span class="type">{{item.type}}</span>
                        <span>{{item.title}}</span>
                    </p>
                    <p class="news-brief">{{setContent(item.brief)}}</p>
                    <p>
                        <img src="./../../assets/img/time.png" alt="time">
                        <span>{{item.time}}</span>
                        <img src="./../../assets/img/net.png" alt="time">
                        <span>{{item.from}}</span>
                    </p>
                </div>
            </article>
            <div class="text-center no-more-show"
                 v-if="totalPage <= currentPage">
                <img src="./../../assets/img/no_more.png" alt="no-more">
                <p>没有更多了</p>
            </div>
        </div>
        <!-- <div class="my-slide">
            <div class="slide-wrap"
                 :class="{'slide-wrap-moving':filter}">
                <div class="slide-container">
                    <div class="filterDiv">
                      <div @click="resetFilter">
                            <span>重置</span>
                      </div>
                      <div @click="confirmFilter">
                            <span>确定</span>
                      </div>
                    </div>
                    <div class="options">
                        <p class="text-center slide-title">排序方式</p>
                        <ul>
                            <li v-for="item in orderType"
                                class="text-center"
                                :class="{active:item.value === select_tem.order.value}"
                                @click="chooseOrder(item.name,item.value)">
                                <span>{{item.name}}</span>
                            </li>
                        </ul>
                        <p class="text-center slide-title">类型筛选</p>
                        <ul>
                            <li v-for="item in newsType"
                                class="text-center"
                                :class="{active:item.value === select_tem.news.value}"
                                @click="chooseType(item.name,item.value)">
                                <span>{{item.name}}</span>
                            </li>
                        </ul>
                        <p class="text-center slide-title">时间范围</p>
                        <ul>
                            <li v-for="item in timeType"
                                class="text-center"
                                :class="{active:item.value === select_tem.time.value}"
                                @click="chooseTime(item.name,item.value)">
                                <span>{{item.name}}</span>
                            </li>
                        </ul>
                    </div>
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
  import defaultNews from './../../assets/img/news_default.jpg'


  export default {
    data(){
      return {
        news        : [],
        loading     : false,
        bottomHei   : 0,

        orgId       : 0,
        currentPage : 1,
        pageSize    : 6,

        totalPage   : 0,
        defaultNews:'this.src="' + require('./../../assets/img/news_default.jpg') + '"' ,
        isFixed     : false,
        filter      : false,
        imgURL      : '',
        // select_tem  : {
        //   news:{name:'所有类型',value:63},
        //   order:{name:'综合排序',value:63},
        //   time:{name:'所有时间',value:''},
        // },
        selected    : { value:''},
        // orderType   : [
        //   {name:'综合排序',value:63},
        //   {name:'关注热度',value:1},
        //   {name:'发布时间',value:2},
        // ],
        newsType    : [
          {name:'所有',value:''},
          {name:'赛讯',value:1},
          {name:'技术',value:2},
          {name:'器材',value:4},
          {name:'人物',value:8},
          {name:'观点',value:16},
          {name:'花边',value:32},
        ],
        // timeType    : [
        //   {name:'所有时间',value:''},
        //   {name:'近一个月',value:1},
        //   {name:'近三个月',value:3},
        //   {name:'近半年',value:6},
        //   {name:'近一年',value:12},
        // ],
        swiperOption: {
           // paginationClickable :false,
           slidesPerView : 4.3,
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
      // confirmFilter(){
      //   const that = this;
      //   that.selected.news.name   = that.select_tem.news.name;
      //   that.selected.news.value  = that.select_tem.news.value;
      //   that.selected.order.name  = that.select_tem.order.name;
      //   that.selected.order.value = that.select_tem.order.value;
      //   that.selected.time.name   = that.select_tem.time.name;
      //   that.selected.time.value  = that.select_tem.time.value;

      //   that.filter = false;
      //   that.news = [];
      //   that.getNews();
      // },
      // resetFilter(){
      //   const that = this;
      //   that.select_tem = {
      //     news:{name:'所有类型',value:63},
      //     order:{name:'综合排序',value:63},
      //     time:{name:'所有时间',value:''},
      //   };
      // },
      // 筛选
      chooseType(value){
        const that = this;
        // that.select_tem.news.name = name;
        that.selected.value = value;
        that.type = value;
        that.currentPage=1;
        that.news = [];
        that.getNews();
        //console.log(that.news)
      },
      // chooseOrder(name,value){
      //   const that = this;
      //   that.select_tem.order.name = name;
      //   that.select_tem.order.value = value;
      // },
      // chooseTime(name,value){
      //   const that = this;
      //   that.select_tem.time.name = name;
      //   that.select_tem.time.value = value;
      // },
      // 筛选
      // filterType(){
      //   const that = this;
      //   that.filter = true;
      //   that.select_tem.news.name   = that.selected.news.name;
      //   that.select_tem.news.value  = that.selected.news.value;
      //   that.select_tem.order.name  = that.selected.order.name;
      //   that.select_tem.order.value = that.selected.order.value;
      //   that.select_tem.time.name   = that.selected.time.name;
      //   that.select_tem.time.value  = that.selected.time.value;
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
      goToDetail(id){

        window.location.href = this.$store.state.base_uri_prefix + 'm.yunbisai.com/news/' + id + '.html';
      },
      getNewsType(type){
        type = type >>0;
        switch(type){
          case 1 : return '赛讯'; break;
          case 2 : return '技术'; break;
          case 4 : return '器材'; break;
          case 8 : return '人物'; break;
          case 16: return '观点'; break;
          case 32: return '花边'; break;
        }
      },
      getNewsImg(src){
        if(!src) return '';
        if( src.indexOf(',') !== -1 ){
          return src.split(',')[0];
        }
        return src;
      },
      // 限制长度
      setContent(data){
        if(typeof data !== 'string') return '暂无';
        const max = 36;
        const _data = data.replace(/<[^>]+>/g,"");
        return _data.substring(0,max) + ( _data.length < max ? '' : '...' );
      },
      // 处理数据
      format(data){
        if( data === null || data === '' || typeof data === 'undefined' ){
          return '暂无';
        }else{
          return data;
        }
      },
      // 加载数据
      loadMore(){
        const that = this;
        if(that.currentPage < that.totalPage){
          that.loading = false;
          that.currentPage ++;
          that.getNews();
        }
      },
      // 最新资讯
      getNews(){
        const that = this;
        that.$axios({
          method:'post',
          url:'request/Org/OrgNews',
          params:{
            page        : that.currentPage,
            PageSize    : that.pageSize,
            orgID       : that.orgId,
            commentType : that.selected.value,
            // order       : that.selected.order.value,
            // month       : that.selected.time.value,
          }
        }).then(res => {
          const data = res.data;
          if( (data.error>>0) === 0 ){
            const _data = data.datArr.rows;
            if( _data.length > 0 ){
              _data.forEach( (e,i) => {
                that.news.push({
                  id    : that.format(e.comment_id),
                  type  : that.getNewsType(e.commenttype),
                  img   : that.getNewsImg(e.img_src) === '' ? defaultNews :  that.getNewsImg(e.img_src),
                  title : that.format(e.comment_title),
                  brief : that.format(e.content),
                  time  : that.format(e.addtime.substring(0,10).replace(/[-]/g,'/')),
                  from  : that.format(e.source) === '暂无' ? '未知' : that.format(e.source),
                });
              });
            }
            that.totalPage = ( (data.datArr.TotalRecord / that.pageSize) >> 0 ) + 1;
            that.loading = true;
          }
        },res => {
          that.loading = true;
          console.log('网络出了点问题');
        });
      },
    },
    mounted(){
      const that = this;
      const orgId = that.$route.query.orgid;
      that.orgId = orgId === null || typeof orgId === 'undefined' ? '' : orgId;
      if(that.$store.state.orgId==that.$store.state.guangdongID){
        that.newsType=[
          {name:'所有',value:''},
          {name:'赛讯',value:1},
          {name:'活动',value:5},
          {name:'政策',value:16},
        ]
      }
      that.getNews();

      const rootSize = parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0])['font-size']);
      that.bottomHei = rootSize * 1.1;

      window.addEventListener('scroll',this.scrollFilterFix);
    }
  }
</script>
<style>
    #news-list{
        margin-bottom:1.2rem;
    }
    #news-list nav{
        background:#fff;
        width:100%;
        height:0.8rem;
        overflow:hidden;
        top:1rem;
        margin-bottom:0.1rem;
    }
    #news-list nav.is-fixed{
        position:fixed;
        top:1rem;
        width:7.5rem;
        z-index:1;
    }
    #news-list .type-nav{
        position:relative;
        width:100%;
        height:0.8rem;
        line-height:0.8rem;
        margin-left:0.3rem;
        font-size:0.3rem;
        color:#c90909;
    }
    #news-list .type-nav .typeFilter{
      width: 6rem;
      overflow: hidden;
      color: #333;
    }
    #news-list .type-nav .typeFilter .active{
      color: #c90909;
    }
    #news-list .type-nav .typeFilter .typeName{
      display: inline-block;
      width: 100%;
    }
    #news-list .type-nav span img{
        width:0.3rem;
        position:relative;
        top:0.04rem;
        left:0.03rem;
    }
    #news-list .type-nav > img{
        position:absolute;
        top:0.16rem;
        width:0.4rem;
        right:0.6rem;
    }
    #news-list .news{
        background:#fff;
        font-size:0.24rem;
        overflow:hidden;
        margin-bottom:0.08rem;
        /*border-bottom:0.04rem solid #ddd;*/
    }
    #news-list .news .news-left,#news-list .news .news-right{
        float:left;
    }
    #news-list .news .news-left{
        width:2.2rem;
        height:2.2rem;
        overflow:hidden;
    }
    #news-list .news .news-left img{
        display:block;
        margin:0.2rem auto;
        width:1.8rem;
        height:1.8rem;
        -webkit-border-radius:0.16rem;
        -moz-border-radius:0.16rem;
        border-radius:0.16rem;
    }
    #news-list .news .news-right{
        width:4.9rem;
        padding-right:0.4rem;
    }
    #news-list .news .news-right .news-title{
        padding:0.5rem 0 0.2rem 0;
        font-size:0.3rem;
        border-bottom:0.02rem solid #ddd;
        font-weight:bold;
        display:block;
        position:relative;
    }
    #news-list .news .news-right .news-title span{
        position:absolute;
        top:0.2rem;
    }
    #news-list .news .news-right-no-img{
        margin-left:0.2rem;
        width:6.9rem;
    }
    #news-list .news .news-right .news-title span:last-child{
        width:4.2rem;
        left:0.7rem;
        display:inline-block;
        overflow:hidden;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space:nowrap;
    }
    #news-list .news .news-right .news-title .type{
        background:#c90909;
        color:#fff;
        font-size:0.24rem;
        padding:0.02rem 0.06rem;
    }
    #news-list .news .news-right img{
        width:0.6rem;
    }
    #news-list .news p{
        margin:0;
        position:relative;
    }
    #news-list .news p span{
        position:relative;
        top:-0.3rem;
        color:#666;
    }
    #news-list .news .news-brief{
        margin:0.1rem 0;
        height:0.7rem;
        color:#666;
    }
    #news-list .filter-type{
        margin-right:0.08rem;
    }
    #news-list .no-more-show img{
        width:2rem;
    }
    #news-list .no-more-show p{
        font-size:0.28rem;
        margin:0 0 0.1rem 0;
        color:#999;
    }
    #news-list .filter-container{
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
    #news-list .slide-mask{
        width:7.5rem;
        background:rgba(0,0,0,0.5);
        height:100%;
        position:fixed;
        z-index:99990;
        top:0;
    }
    #news-list .slide-wrap {
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
    #news-list .slide-wrap.slide-wrap-moving{
        right:0;
        overflow:auto;
    }
    #news-list .slide-wrap .slide-container{
        font-size:0.3rem;
        /*margin-bottom:1rem;*/
    }
    #news-list .slide-wrap .slide-container ul{
        text-decoration:none;
        list-style:none;
        text-align:center;
        padding:0;
        margin:0.2rem;
    }
    #news-list .slide-wrap .slide-container ul li{
        padding:0.02rem 0;
        height:0.5rem;
    }
    #news-list .slide-wrap .slide-container ul li span{
        line-height:0.5rem;
        padding:0.04rem 0.3rem;
        -webkit-border-radius:0.3rem;
        -moz-border-radius:0.3rem;
        border-radius:0.3rem;
        margin:0 auto;
        width:1.6rem;
        display:block;
        color:#666;
    }
    #news-list .slide-wrap .slide-container ul li.active span{
        background:#c90909;
        color:#fff;
    }
    #news-list .slide-wrap .slide-container .slide-title{
        margin:0;
        height:0.7rem;
        line-height:0.7rem;
        font-size:0.34rem;
        color:#000;
        background:#dcdcdc;
    }
    #news-list .slide-wrap .slide-container footer{
        position:fixed;
        bottom:0;
        z-index:100;
        width:5.5rem;
    }
    #news-list .slide-wrap .slide-container .filterDiv{
      height: 0.8rem;
    }
    #news-list .slide-wrap .slide-container .filterDiv div{
        width:50%;
        float:left;
        text-align:center;
        /*position:fixed;*/
        bottom:0;
        background:#efefef;
        height:0.8rem;
        line-height:0.8rem;
    }
    #news-list .slide-wrap .slide-container .options{
        /*margin-bottom:1rem;*/
    }
    #news-list .slide-wrap .slide-container .filterDiv div:last-child{
        left:50%;
        color:#fff;
        background:#c90909;
    }
</style>
