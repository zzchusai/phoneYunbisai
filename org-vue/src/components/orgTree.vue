<template>
  <div id="orgTree">
    <mt-header :title="whiteName" class="header">
      <div class="orgImg" slot="left">
          <img :src="orgImg" :onerror="defaultUser" alt="head">
      </div>
      <div class="orgName" slot="right">{{orgName}}</div>
    </mt-header>

    <mt-navbar v-model="selected"
               class="nav"
               :class="{'is-fixed':isFixed}">
      <mt-tab-item v-for="item in items"
                   :key="item.value"
                   :id="item.value"
                   @click.native="goTo(selected + '?orgid=' +　$store.state.orgId)">
        <span style="font-size:0.28rem;">{{item.text}}</span>
      </mt-tab-item>
    </mt-navbar>

    <router-view></router-view>

  </div>
</template>
<script>
export default {
  data(){
    return {
      orgName:'',
      whiteName:'',
      orgImg:'',
      orgId:'',
      webURL:this.$parent.webURL,
      defaultUser:'this.src="//m.yunbisai.com/Public/images/houtai_icon/default-avatar.png"',
      selected:'event',
      items:[
        {value:'event',text:'赛事'},
        {value:'course',text:'课程'},
        {value:'teachers',text:'师资'},
//      {value:'rankList',text:'排行榜'},
        {value:'news',text:'资讯'},
        {value:'album',text:'相册'},
        {value:'chessbook',text:'棋谱'},
        {value:'recruit',text:'招聘'},
      ],
      isFixed:false,
      zhejiangID:'321'
    }
  },
  methods:{
    goTo(path){
      const that = this;
      this.$router.push(path);
    },
    // 机构详情
    getOrgDetail(){
      const that = this;
      that.$axios({
        method:'post',
        url:'request/Org/OrgDetail',
        params:{
          orgid : that.$store.state.orgId
        }
      }).then(res => {
        const data = res.data;
        if( (data.error>>0) === 0 ){
          const _data = data.datArr;
          that.orgName = _data.cname;
          that.orgImg = that.$store.state.base_uri_prefix +'api.yunbisai.com/'+ _data.logoimg;
          that.$store.commit('setOrgId',_data.orgid);
        }
      },res => {
        console.log('网络出了点问题');
      });
    },
    // 判断当前活跃项
    checkActive(){
      const url = window.location.hash;
      const that = this;

      that.items.forEach( (e,i) => {
        if( url.indexOf(e.value) !== -1 ){
          that.selected = e.value;
          return false;
        }
      });
    },
    // 滚动固定头部
    scrollFix(){
      const that = this;
      const navHeight = parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0])['font-size']);
      that.isFixed =  document.documentElement.scrollTop >= navHeight || document.body.scrollTop >= navHeight;
    },
  },
  mounted(){
    const that = this;
    const orgId = that.$route.query.orgid;
    that.orgId = orgId === null || typeof orgId === 'undefined' ? '' : orgId;
    
    if(that.orgId==that.zhejiangID){        
        that.items=[
        {value:'event',text:'赛事'},
        // {value:'course',text:'课程'},
        // {value:'teachers',text:'师资'},
        {value:'news',text:'资讯'},
        {value:'album',text:'相册'},
        // {value:'chessbook',text:'棋谱'},
        {value:'recruit',text:'招聘'},
      ]     
    }else if(that.orgId==that.$store.state.guangdongID){        
        that.items=[
        {value:'event',text:'赛事'},
        {value:'course',text:'培训'},
        // {value:'teachers',text:'师资'},
        {value:'news',text:'资讯'},
        {value:'album',text:'相册'},
        // {value:'chessbook',text:'棋谱'},
        {value:'recruit',text:'关于我们'},
      ]     
    }

    that.getOrgDetail();
    that.checkActive();

    window.addEventListener('scroll',this.scrollFix);
  }
}
</script>

<style scoped>
   #orgTree .orgName{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: inherit;
    font-weight: 400;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    min-width: 4rem;
    text-align: left;
    position: relative;
    right: 1.2rem;
   }
   #orgTree .mt-header .mint-header-title{
     min-width: 5rem;
   }
   #orgTree .mt-header{
     min-width: 5rem;
   }
   .orgImg{
      width:0.8rem;
      display:inline-block;
      height:0.8rem;
      -webkit-border-radius:50%;
      -moz-border-radius:50%;
      border-radius:50%;
      border:0.04rem solid #c90909;
      overflow:hidden;
    }
   .orgImg img{
       width:100%;
   }
   #orgTree .is-fixed{
     position:fixed;
     top:0;
     left:0;
     right:0;
     margin:0 auto;
     z-index:100;
   }
    .nav{
      max-width:750px;
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
