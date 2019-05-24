<template>
    <div id="chessbook">
        <nav :class="{'is-fixed':isFixed}">
            <div class="type-nav">
                <div class="typeFilter">
                  <swiper :options="swiperOption" ref="mySwiper" >
                    <swiper-slide v-for="item in chessbookType" :key="item.value" >
                       <span :class="{active:item.value === selected.value}" class="typeName" @click="chooseType(item.value)">{{item.name}}</span>
                    </swiper-slide>
                  </swiper>
                </div>
                <img src="./../../assets/img/search-red.png"
                     alt="filter"
                     @click="$router.push('/search'+'?orgid='+$store.state.orgId)">
            </div>
        </nav>

        <div v-infinite-scroll="loadMore"
             :infinite-scroll-disabled="loading"
             :infinite-scroll-distance="bottomHei">
            <article class="chessbook"
                     v-if="chessbook.length"
                     v-for="item in chessbook"
                     @click="goToDetail(item.type,item.id)">
                <p class="title text-center">{{ item.title }}</p>
                <p class="state live" v-if="item.online">直播</p>
                <div class="basic-info">
                    <div class="player">
                        <p>{{ item.player[0].name }}</p>
                        <p>{{ item.player[0].label }}</p>
                    </div>
                    <div class="type-img">
                        <img v-if="item.type>>0===2" src="./../../assets/img/go_black.png" alt="go-1">
                        <img v-if="item.type>>0===2" src="./../../assets/img/go_white.png" alt="go-2">
                        <img v-if="item.type>>0===1" src="./../../assets/img/chess_black.png" alt="chess-1">
                        <img v-if="item.type>>0===1" src="./../../assets/img/chess_red.png" alt="chess-2">
                    </div>
                    <div class="player">
                        <p>{{ item.player[1].name }}</p>
                        <p>{{ item.player[1].label }}</p>
                    </div>
                </div>
                <div class="support">
                    <div class="info">
                        <img src="./../../assets/img/support.png" alt="点赞">
                        <span>{{ item.player[0].support >= 10000 ? '9999+' : item.player[0].support }}</span>
                    </div>
                    <div class="result">
                        <p>
                            {{ item.result }}
                        </p>
                    </div>
                    <div class="info">
                        <img src="./../../assets/img/support.png" alt="点赞">
                        <span>{{ item.player[1].support >= 10000 ? '9999+' : item.player[1].support }}</span>
                    </div>
                </div>
                <div class="chessbook-bottom">
                    <div class="info">
                        <img src="./../../assets/img/watch.png" alt="浏览">
                        {{ item.watch >= 1000000 ? '999999+' : item.watch }}
                    </div>
                    <div class="info">
                        <img src="./../../assets/img/comment.png" alt="评论">
                        {{ item.comment >= 1000000 ? '999999+' : item.comment }}
                    </div>
                    <div class="info">
                        <img src="./../../assets/img/time_chess.png" alt="评论">
                        {{item.time}}
                    </div>
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
                        <p class="text-center slide-title">对阵选手</p>
                        <p class="player-key">
                            <input placeholder="请输入选手名字" v-model="player1">
                            <span>对阵</span>
                            <input placeholder="请输入选手名字" v-model="player2">
                        </p>
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
                            <li v-for="item in chessbookType"
                                class="text-center"
                                :class="{active:item.value === select_tem.type.value}"
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
  export default {
    data: function () {
      return {
        chessbook    : [],
        isFixed      : false,
        loading      : false,
        filter       : false,
        bottomHei    : 0,
        selected     : {value:''},
        // select_tem   : {
        //   order : {name:'综合排序',value:''},
        //   type  : {name:'所有类型',value:''},
        //   time  : {name:'所有时间',value:''},
        // },
        // orderType    : [
        //   {name:'综合排序',value:''},
        //   {name:'关注热度',value:1},
        //   {name:'发布时间',value:2},
        // ],
        chessbookType: [
          {name:'所有',value:''},
          {name:'围棋',value:2},
          {name:'象棋',value:1},
        ],
        // timeType     : [
        //   {name:'所有时间',value:''},
        //   {name:'近一个月',value:1},
        //   {name:'近三个月',value:3},
        //   {name:'近半年',value:6},
        //   {name:'近一年',value:12},
        // ],

        player1      : '',
        player2      : '',
        currentPage  : 1,
        totalPage    : 0,
        pageSize     : 6,
        swiperOption: {
           // paginationClickable :false,
           slidesPerView : 4,
           spaceBetween : 10,
        },
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    methods:{
      goToDetail(type,id){
        let base = '';
        let typeURL = '';
        type = type >> 0;

        switch(type){
          case 1:
            typeURL = 'ChineseChess';
            break;
          case 2:
            typeURL = 'Go';
            break;
        }

        window.location.href = this.$store.state.base_uri_prefix+ 'm.yunbisai.com/chessBook/'+ typeURL +'/'+ id + '.html';
      },
      // 滚动筛选区域
      scrollFilterFix(){
        const that = this;
        const rootSize = parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0])['font-size']);
        const navHeight = rootSize * 1;
        that.isFixed =  document.documentElement.scrollTop >= navHeight || document.body.scrollTop >= navHeight;
        that.bottomHei = rootSize * 1.1;
      },
      // 筛选
      chooseType(value){
        const that = this;
        that.selected.value = value;

        that.currentPage = 1;
        that.chessbook = [];
        that.getChessBookList();
      },
      // chooseOrder(name,value){
      //   const that = this;
      //   that.select_tem.order.name = name;
      //   that.select_tem.order.value = value;
      // },
      // chooseTime(value){
      //   const that = this;
      //   // that.select_tem.time.name = name;
      //   that.select_tem.time.value = value;
      //   that.filter = false;
      //   that.chessbook = [];
      //   that.getChessBookList();
      // },
      // filterHide(){
      //   this.filter = false;
      // },
      // confirmFilter(){
      //   const that = this;
      //   that.selected.type.name  = that.select_tem.type.name;
      //   that.selected.type.value = that.select_tem.type.value;
      //   that.selected.order.name  = that.select_tem.order.name;
      //   that.selected.order.value = that.select_tem.order.value;
      //   that.selected.time.name  = that.select_tem.time.name;
      //   that.selected.time.value = that.select_tem.time.value;

      //   that.filter = false;
      //   that.chessbook = [];
      //   that.getChessBookList();
      // },
      // resetFilter(){
      //   const that = this;
      //   that.select_tem = {
      //     type:{name:'所有类型',value:''},
      //     order:{name:'综合排序',value:''},
      //     time:{name:'所有时间',value:''},
      //   };
      //   that.player1 = '';
      //   that.player2 = '';
      // },
      // 棋谱数据
      getChessBookList(){
        const that = this;
        that.$axios({
          url:'/request/Chessbook/ChessBookList',
          params:{
            GType:that.selected.value,
            keywords:'',
            online:'',
            sort:'',
            // order:that.selected.order.value,
            loginID:that.$store.state.loginId,
            self:'',
            // name1:that.player1,
            // name2:that.player2,
            // month:that.selected.time.value,
            PageSize:that.pageSize,
            page:that.currentPage
          }
        }).then( res => {
          const data = res.data;
          if( ( data.error >> 0 ) === 0 ){
            const _data = data.datArr.rows;
            if( _data.length > 0){
              that.totalPage=data.datArr.TotalPage
              _data.forEach( (e,i) => {
                that.chessbook.push({
                  type    : e.gtype>>0,
                  id      : e.id,
                  title   : e.gname,
                  player  : [
                    {name:e.black,label:e.bgrade,support:e.supportb},
                    {name:e.white,label:e.wgrade,support:e.supportw}
                  ],
                  watch   : e.hit,
                  comment : 432,
                  result  : e.gamer,
                  time    : e.gdate === null ? '' : e.gdate.substring(0,10),
                  online  : e.online >> 0,
                });
              });
            }
          }
        },res => {

        });
      },
      // 筛选
      // filterType(){
      //   const that = this;
      //   that.filter = true;
      //   that.select_tem.type.name   = that.selected.type.name;
      //   that.select_tem.type.value  = that.selected.type.value;
      //   that.select_tem.order.name  = that.selected.order.name;
      //   that.select_tem.order.value = that.selected.order.value;
      //   that.select_tem.time.name   = that.selected.time.name;
      //   that.select_tem.time.value  = that.selected.time.value;
      // },
      // 加载数据
      loadMore(){
        const that = this;
        if(that.currentPage < that.totalPage){
          that.loading = false;
          that.currentPage ++;
          that.getChessBookList();
        }
      },
    },
    mounted(){
      const that = this;

      that.getChessBookList();
      window.addEventListener('scroll',that.scrollFilterFix);
  }
  }
</script>
<style>
    #chessbook{
        margin-bottom:1.1rem;
    }
    #chessbook nav.is-fixed{
        position:fixed;
        top:1rem;
        width:7.5rem;
        z-index:1;
    }
    #chessbook .nav.mint-navbar{
        margin:0;
    }
    #chessbook nav{
        background:#fff;
        width:100%;
        height:0.8rem;
        overflow:hidden;
        top:1rem;
    }
    #chessbook .type-nav{
        position:relative;
        width:100%;
        height:0.8rem;
        line-height:0.8rem;
        margin-left:0.3rem;
        font-size:0.3rem;
        color:#c90909;
    }
    #chessbook .type-nav .typeFilter{
      width: 6rem;
      overflow: hidden;
      color: #333;
    }
    #chessbook .type-nav .typeFilter .active{
      color: #c90909;
    }
    #chessbook .type-nav .typeFilter .typeName{
      display: inline-block;
      width: 100%;
    }
    #chessbook .type-nav span img{
        width:0.3rem;
        position:relative;
        top:0.04rem;
        left:0.03rem;
    }
    #chessbook .type-nav > img{
        position:absolute;
        top:0.16rem;
        width:0.4rem;
        right:0.6rem;
    }
    #chessbook article.chessbook{
        background:#fff;
        font-size:0.3rem;
        margin:0.1rem 0.2rem;
        border:0.02rem solid #ddd;
        position:relative;
        padding-top:0.3rem;
    }
    #chessbook article.chessbook .title{
        font-size:0.32rem;
        padding:0 0.8rem;
        margin:0;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow:hidden;
        white-space:nowrap;
    }
    #chessbook article.chessbook .state{
        margin:0;
        width:0.48rem;
        height:0.9rem;
        text-align:center;
        position:absolute;
        top:0;
        right:0.2rem;
        color:#fff;
    }
    #chessbook article.chessbook .state.live{
        background:#c90909;
    }
    #chessbook article.chessbook .basic-info,#chessbook article.chessbook .support{
        overflow:hidden;
    }
    #chessbook article.chessbook .basic-info .player{
        float:left;
        width:2rem;
        text-align:center;
    }
    #chessbook article.chessbook .basic-info .player p{
        margin:0.4rem 0 0.1rem 0;
    }
    #chessbook article.chessbook .basic-info .player p:last-child{
        margin:0 auto;
        width:1.2rem;
        color:#c90909;
        border:0.04rem solid #c90909;
        -webkit-border-radius:0.3rem;
        -moz-border-radius:0.3rem;
        border-radius:0.3rem;
    }
    #chessbook article.chessbook .basic-info .type-img{
        float:left;
        width:3rem;
    }
    #chessbook article.chessbook .basic-info .type-img img{
        width:0.9rem;
        margin-top:0.4rem;
    }
    #chessbook article.chessbook img{
        width:0.34rem;
    }
    #chessbook article.chessbook .basic-info .type-img img:last-child{
        float:right;
    }
    #chessbook article.chessbook .support{
        overflow:hidden;
        padding:0.3rem 0 0.2rem 0;
        margin:0 0.3rem;
        color: #999;
        font-weight:bold;
        border-bottom:0.02rem solid #999;
    }
    #chessbook article.chessbook .support .info{
        width:1.8rem;
        float:left;
    }
    #chessbook article.chessbook .support .info img{
        margin-left:0.4rem;
    }
    #chessbook article.chessbook .support .result{
        float:left;
        width:2.8rem;
        text-align:center;
        color:#fff;
    }
    #chessbook article.chessbook .support .result p{
        background:#c90909;
        padding:0 0.2rem;
        max-width:2.4rem;
        margin:0 auto;
        display:inline-block;
        overflow:hidden;
        -ms-text-overflow:ellipsis;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    #chessbook article.chessbook .chessbook-bottom{
        overflow:hidden;
        margin:0.14rem 0.3rem;
    }
    #chessbook article.chessbook .chessbook-bottom .info{
        float:left;
        width:1.8rem;
        color:#999;
        font-weight:bold;
    }
    #chessbook .player-key{
        width:5rem;
        margin:0.4rem auto;
    }
    #chessbook .player-key span{
        margin:0 0.1rem;
    }
    #chessbook .player-key input{
        width:2rem;
        height:0.4rem;
        border:none;
        border-bottom:0.02rem solid #ddd;
        outline:none;
    }
    #chessbook article.chessbook .chessbook-bottom .info:last-child{
        width:2.8rem;
        text-align:right;
    }
    #chessbook .no-more-show img{
        width:2rem;
    }
    #chessbook .no-more-show p{
        font-size:0.28rem;
        margin:0 0 0.1rem 0;
        color:#999;
    }
    #chessbook .filter-container{
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
    #chessbook .slide-mask{
        width:7.5rem;
        background:rgba(0,0,0,0.5);
        height:100%;
        position:fixed;
        z-index:99990;
        top:0;
    }
    #chessbook .slide-wrap {
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
    #chessbook .slide-wrap.slide-wrap-moving{
        right:0;
        overflow:auto;
    }
    #chessbook .slide-wrap .slide-container{
        font-size:0.3rem;
        /*margin-bottom:1rem;*/
    }
    #chessbook .slide-wrap .slide-container ul{
        text-decoration:none;
        list-style:none;
        text-align:center;
        padding:0;
        margin:0.2rem;
    }
    #chessbook .slide-wrap .slide-container ul li{
        padding:0.02rem 0;
        height:0.5rem;
    }
    #chessbook .slide-wrap .slide-container ul li span{
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
    #chessbook .slide-wrap .slide-container ul li.active span{
        background:#c90909;
        color:#fff;
    }
    #chessbook .slide-wrap .slide-container .slide-title{
        margin:0;
        height:0.7rem;
        line-height:0.7rem;
        font-size:0.34rem;
        color:#000;
        background:#dcdcdc;
    }
    #chessbook .slide-wrap .slide-container footer{
        position:fixed;
        bottom:0;
        z-index:100;
        width:5.5rem;
    }
    #chessbook .slide-wrap .slide-container .filterDiv{
        height:0.8rem;
    }
    #chessbook .slide-wrap .slide-container .filterDiv div{
        width:50%;
        float:left;
        text-align:center;
        /*position:fixed;*/
        bottom:0;
        background:#efefef;
        height:0.8rem;
        line-height:0.8rem;
    }
    #chessbook .slide-wrap .slide-container .options{
        /*margin-bottom:1rem;*/
    }
    #chessbook .slide-wrap .slide-container .filterDiv div:last-child{
        left:50%;
        color:#fff;
        background:#c90909;
    }
</style>
