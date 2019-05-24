<template>
  <div id="detail-header">
    <mt-header :title="partTitle" class="header" fixed>
      <router-link class="head-back" :to="list" slot="left">
          <img src="./../assets/img/back.png" alt="head">
      </router-link>
    </mt-header>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data(){
    return {
      teacherId:'',
      partTitle:'',
      list:'',
      obj:[
        { name:'师资力量' , parent:'teachers' , path:'teachersDetail' },
        { name:'课程详情' , parent:'course'   , path:'courseDetail'   },
        { name:'赛事详情' , parent:'event'    , path:'eventDetail'    },
        { name:'资讯详情' , parent:'news'     , path:'newsDetail'     },
        { name:'棋谱详情' , parent:'chessbook', path:'chessbookDetail'},
        { name:'相册详情' , parent:'album'    , path:'albumDetail'    },
        { name:'招聘详情' , parent:'recruit'    , path:'recruitDetail'    },
      ]
    }
  },
  methods:{
    getPartNameAndParent(){
      const that = this;
      that.obj.forEach( (e,i) => {
        if(window.location.hash.indexOf(e.path) !== -1){
          that.partTitle = e.name;
          that.list = e.parent+'?orgid='+that.$store.state.orgId;
          return false;
        }
      });
    },
  },
  mounted(){
    const that = this;

    that.getPartNameAndParent();
  }
}
</script>

<style scoped>
  #detail-header .head-back{
       width:0.44rem;
       display:inline-block;
    }
   .head-back img{
       width:100%;
   }
    .nav{
      max-width:750px;
      margin:1rem auto 0.1rem auto;
      border-bottom:0.02rem solid #eee;
      border-top:0.02rem solid #eee;
    }
    .header{
        height:1rem;
        font-size:0.32rem;
      max-width:750px;
      margin:0 auto;
    }
    .mint-navbar.nav.is-fixed .mint-tab-item{
        font-size:0.3rem !important;
        padding:0.34rem 0;
    }
   .mint-navbar .mint-tab-item.is-selected{
       color:#cc0000;
       border-bottom:0.05rem solid #cc0000;
   }
</style>
