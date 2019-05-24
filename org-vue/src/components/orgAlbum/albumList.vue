<template>
    <div id="album">
        <nav class="searchNav" :class="{'is-fixed':isFixed}">
          <div class="type">
            <div class="typeFilter">
              <swiper :options="swiperOption" ref="mySwiper" >
                <swiper-slide v-for="item in albumType" :key="item.value" >
                   <span :class="{active:item.value === selected.value}" class="typeName" @click="chooseType(item.value,item.url)">{{item.name}}</span>
                </swiper-slide>
              </swiper>
            </div>
            <img src="./../../assets/img/search-red.png" alt="filter" @click="$router.push('/search'+'?orgid='+$store.state.orgId)">
          </div>
        </nav>
        <div v-infinite-scroll="loadMore"
             :infinite-scroll-disabled="loading"
             :infinite-scroll-distance="bottomHei">
            <article class="album" v-if="selected.value==''"
                     v-for="item in album"
                     @click="$router.push('albumDetail?eventid='+item.id+'&orgid='+$store.state.orgId)"
                     :key="item.id">
                <div class="album-left">
                    <div class="img-three">
                        <img :src="item.img"
                             :onerror="defaultAlbum"
                             alt="相册封面">
                        <img :src="item.img"
                             :onerror="defaultAlbum"
                             alt="相册封面">
                        <img :src="item.img"
                             :onerror="defaultAlbum"
                             alt="相册封面">
                    </div>
                    <div class="img-three">
                        <img v-if="!item.img"
                             src="./../../assets/img/album_default.jpg"
                             alt="无图片">
                        <img v-if="!item.img"
                             src="./../../assets/img/album_default.jpg"
                             alt="无图片">
                        <img v-if="!item.img"
                             src="./../../assets/img/album_default.jpg"
                             alt="无图片">
                    </div>
                </div>
                <div class="album-right">
                    <p class="title">
                        {{item.title}}
                    </p>
                    <p class="number">
                        共 {{item.imgNum}} 张照片
                    </p>
                    <p class="time" v-if=" item.time !== '' ">
                        {{item.time}}
                    </p>
                </div>
            </article>
            <article class="photo"
                v-else

                :key="item.index">
                <img :src="item.img"
                   @click="watchImg(item)"
                   :onerror="defaultAlbum"
                   alt="没找到图片">
            </article>
        </div>
        <div class="text-center no-more-show"
             v-if="totalPage <= currentPage">
            <img src="./../../assets/img/no_more.png" alt="no-more">
            <p>没有更多了</p>
        </div>
        <div class="photo-watcher text-center"
          @click="isWatch = false"
          v-show="isWatch">
          <mt-swipe v-if="isWatch"
                    :show-indicators="false"
                    :continuous="false"
                    :defaultIndex="currentIndex"
                    :auto="0">
              <mt-swipe-item class="img-container text-center"
                             v-for="item in album" :key="item.index">
                  <img class="photo-watcher-img"
                       :src="item.img"
                       :onerror="defaultAlbum"
                       @click.prevent.stop=""
                       alt="图片预览">
                  <p class="photo-watcher-remark">{{item.remark}}</p>
              </mt-swipe-item>
          </mt-swipe>
        </div>
    </div>
</template>
<script>
  export default {
    data: function () {
      return {
        currentIndex : 1,
        currentPage  : 1,
        pageSize     : 6,
        totalPage    : 1,
        isFixed      : false,
        isWatch      : false,
        album        : [],
        loading      : false,
        bottomHei    :  0,
        // defaultAlbum :'this.src="' + require('./../../assets/img/news_default.jpg') + '"' ,
        defaultAlbum:'this.src=\'' + require('./../../assets/img/album_default.jpg') + '\'' ,
        selected:{value:1,url:'request/Org/OrgImg'},
        albumType:[
          {name:'机构环境',value:1,url:'request/Org/OrgImg'},
          {name:'荣誉榜',value:2,url:'request/Org/OrgImg'},
          {name:'赛场图集',value:'',url:'request/Org/EventAlbum'},
        ],
        swiperOption: {
           // paginationClickable :false,
           slidesPerView : 3,
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
      // 加载数据
      loadMore(){
        const that = this;
        if(that.currentPage < that.totalPage){
          that.loading = false;
          const rootSize = parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0])['font-size']);
          that.bottomHei = rootSize * 1.1
          that.currentPage ++;
          that.getAlbumList();
        }
      },
      chooseType(value,url){
        const that = this;
        that.selected.value = value;
        that.selected.url = url;

        that.currentPage = 1;
        that.filter = false;
        that.album = [];
        that.getAlbumList();
      },
      // 查看图片
      watchImg(item){
        this.isWatch = true;
        this.currentIndex = item.index;
      },
      getAlbumList(){
        const that = this;
        that.$axios({
          url:that.selected.url,
          // url:'request/Org/EventAlbum',
          params:{
            page:that.currentPage,
            PageSize:that.pageSize,
            orgid:that.$store.state.orgId,
            imgtype:that.selected.value
          }
        }).then( res => {
          const data = res.data;
          if( (data.error >> 0 ) === 0 ){
            const _data = data.datArr.rows;
            if( _data.length > 0 ){
              _data.forEach( (e,i) => {
                that.album.push({
                  index  : that.album.length,
                  title  : e.title,
                  img    : e.img_src === null ? '' : that.$store.state.base_uri_prefix+'api.yunbisai.com' + e.img_src,
                  id     : e.event_id,
                  imgNum : e.imgnum === null ? 0 : e.imgnum,
                  time   : e.addtime === null ? '' : e.addtime.substring(0,10),
                });
              });
            }
            that.totalPage = ( (data.datArr.TotalRecord / that.pageSize) >> 0 ) + 1;
          }else{
            console.log('网络出问题了');
          }
        },res => {
          console.log('网络出问题了')
        });
      }
    },
    mounted(){
      const that = this;
      if(that.$store.state.orgId==that.$store.state.guangdongID){
        that.albumType=[
          {name:'机构环境',value:1,url:'request/Org/OrgImg'},
          {name:'培训图集',value:'',url:'request/Org/EventAlbum'},
        ]
      }
      that.getAlbumList();
    }
  }
</script>
<style>
    #album .searchNav.is-fixed{
        position:fixed;
        top:1rem;
        z-index: 50;
    }
    #album .mint-cell-wrapper{
      background-image:none;
    }
    #album .searchNav{
      background:#fff;
      width:100%;
      height:0.8rem;
      overflow:hidden;
      top:1rem;
    }
    #album .type{
        position:relative;
        width:100%;
        height:0.8rem;
        line-height:0.8rem;
        margin-left:0.3rem;
        font-size:0.3rem;
        color:#c90909;
    }
    #album .type .typeFilter{
      width: 6rem;
      overflow: hidden;
      color: #333;
    }
    #album .type .typeFilter .active{
      color: #c90909;
    }
    #album .type .typeFilter .typeName{
      display: inline-block;
      width: 100%;
    }
    #album .type span img{
        width:0.3rem;
        position:relative;
        top:0.04rem;
        left:0.03rem;
    }
    #album .type > img{
        position:absolute;
        top:0.16rem;
        width:0.4rem;
        right:0.6rem;
    }
    #album .searchNav{
      background:#fff;
      width:100%;
      height:0.8rem;
      overflow:hidden;
      top:1rem;
    }
    #album{
        font-size:0.3rem;
        margin-bottom:1.1rem;
    }
    #album .album{
        overflow:hidden;
        background:#fff;
        /*border-bottom:1px solid #ddd;*/
        border-top:1px solid #ddd;
        position:relative;
    }
    #album .album .album-left{
        float:left;
        width:2.5rem;
    }
    #album .album .album-left .img-three{
        position:relative;
    }
    #album .album .album-left .img-three img{
        width:2.1rem;
        height:2.1rem;
        margin:0.2rem;
        position:relative;
        z-index:10;
    }
    #album .album .album-left .img-three img:nth-child(2){
        width:1.9rem;
        height:1.9rem;
        position:absolute;
        top:0.25rem;
        left:0.1rem;
        opacity:0.6;
        z-index:9;
    }
    #album .album .album-left .img-three img:nth-child(3){
        width:1.7rem;
        height:1.7rem;
        position:absolute;
        top:0.52rem;
        left:0.2rem;
        opacity:0.4;
        z-index:8;
    }
    #album .album .album-right{
        float:left;
    }
    #album .album .album-right .title{
        margin:0.5rem 0 0 0;
        width:5rem;
    }
    #album .album .album-right .time{
        margin:0.2rem 0 0 0;
        color:#999;
    }
    #album .album .album-right .number{
        margin:0.2rem 0 0 0;
        color:#999;
    }
    #album .no-more-show img{
        width:2rem;
    }
    #album .no-more-show p{
        font-size:0.28rem;
        margin:0 0 0.1rem 0;
        color:#999;
    }
    #album .photo-view{
        width:19.2rem;
        height:3rem;
        margin-bottom: 0.2rem;
    }
    #album .photo{
        float:left;
        width:100%;
        height:4rem;
        font-size:0.24rem;
        margin:0 0.2rem;
    }
    #album .photo img{
        width:100%;
        height:100%;
    }
    #album .photo-watcher{
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.88);
        position:fixed;
        top:0;
        z-index:99999;
    }
    #album .photo-watcher .photo-watcher-img{
        width:95%;
        margin:1rem auto;
    }
    #album .photo-watcher .photo-watcher-remark{
        color:#fff;
        font-size:0.3rem;
        text-align:left;
        margin-left:0.2rem;
    }
</style>
