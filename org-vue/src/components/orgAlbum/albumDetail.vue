<template>
    <div id="album-detail">
        <div class="album-img"
             v-infinite-scroll="loadMore"
             :infinite-scroll-disabled="loading"
             :infinite-scroll-distance="bottomHei"
             v-for="item in allImg">
            <img :src="item.src"
                 :onerror="defaultAlbum"
                 @click="watchImg(item.index)"
                 :alt="'图片'+item.index">
        </div>
        <div v-show="watcher"
             class="watcher"
             @click="watcher = false">
            <mt-swipe v-if="watcher"
                      :show-indicators="false"
                      :continuous="false"
                      :defaultIndex="currentIndex"
                      :auto="0">
                <mt-swipe-item class="img-container"
                               v-for="item in allImg" :key="item.index">
                    <img :src="item.src"
                         :onerror="defaultAlbum"
                         @click.prevent.stop=""
                         alt="当前图片">
                    <div class="img-remark">
                        <p>
                            <span class="img-index">{{ ( item.index + 1 ) + '/' + allImg.length + ' ' }}</span>
                            <span>{{item.remark}}</span>
                        </p>
                    </div>
                </mt-swipe-item>
            </mt-swipe>
        </div>
    </div>
</template>
<script>
  export default{
    data(){
      return {
        allImg       : [],
        loading      : false,
        bottomHei    : 0,
        eventId      : 0,
        currentPage  : 1,
        pageSize     : 50,
        totalNum     : 0,
        totalPage    : 0,
        defaultAlbum : 'this.src="' + require('./../../assets/img/news_default.jpg') + '"' ,
        watcher      : false,

        currentIndex : 0,
        screenWidth  : window.innerWidth || window.screen.width,
      }
    },
    methods:{
      // 加载数据
      loadMore(){
        const that = this;
        if(that.currentPage < that.totalPage){
          that.loading = false;
          const rootSize = parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0])['font-size']);
          that.bottomHei = rootSize * 1.1;
          that.currentPage ++;
          that.getAlbumList();
        }
      },
      getAlbumDetail(){
        const that = this;
        that.$axios({
          url:'request/Org/OrgEventImg',
          params:{
            orgid    : that.$store.state.orgId,
            eventid  : that.eventId,
            page     : that.currentPage,
            PageSize : that.pageSize
          }
        }).then( res => {
            const data = res.data;
            if( ( data.error >> 0 ) === 0 ){
              that.totalNum = data.datArr.TotalRecord;
              const _data = data.datArr.rows;
              if( _data.length > 0 ){
                that.allImg = [];
                _data.forEach( (e,i) => {
                  that.allImg.push({
                    src    : that.$store.state.base_uri_prefix+'api.yunbisai.com/' + e.src,
                    remark : e.remark,
                    index  : that.allImg.length,
                  });
                });
              }
            }else{
              console.log('网络出问题了');
            }
        },res => {
            console.log('网络出问题了');
        });
      },
      watchImg(index){
        const that = this;
        that.currentIndex = index;
        that.watcher = true;
      }
    },
    mounted(){
      const that = this;

      const eventId = that.$route.query.eventid;
      that.eventId = eventId === null || typeof eventId === 'undefined' ? '' : eventId;

      that.getAlbumDetail();
    }
  }
</script>
<style>
    #album-detail{
        margin:1.1rem 0;
        overflow:hidden;
    }
    #album-detail .album-img{
        float:left;
        width:1.75rem;
        height:1.71rem;
        margin-bottom:0.1rem;
    }
    #album-detail .album-img{
        margin-left:0.1rem;
    }
    #album-detail .album-img:nth-child(4n){
        margin-right:0.1rem;
    }
    #album-detail .album-img img{
        width:100%;
        height:100%;
    }
    #album-detail .watcher{
        position:fixed;
        top:0;
        width:100%;
        height:100%;
        background:#333;
        z-index:99999;
    }
    #album-detail .img-container{
        margin-top:1.6rem;
        width:100%;
        position:absolute;
    }
    #album-detail .img-container img{
        width:100%;
    }
    #album-detail .img-remark{
        font-size:0.32rem;
        color:#fff;
        position:absolute;
        bottom:3rem;
        margin:0 0.4rem;
    }
    #album-detail .img-remark p{
        margin:0;
    }
    #album-detail .img-remark p .img-index{
        font-size:0.28rem;
        color:#f2f2f2;
    }
</style>
