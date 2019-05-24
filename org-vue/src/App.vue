<template>
  <div id="app">
    <router-view></router-view>
    <mt-tabbar v-model="active"
               id="bottom"
               fixed
               v-if="!isSearch">
      <mt-tab-item id="home"
                   @click.native="goTo('home?orgid='+orgId)">
        <img slot="icon"
             src="./assets/img/index-red.png"
             alt="首页红"
             v-show="active==='home'">
        <img slot="icon"
             src="./assets/img/index-gray.png"
             alt="首页灰"
             v-show="active!=='home'">
        <span :class="{'is-active':active==='home'}">首页</span>
      </mt-tab-item>
      <mt-tab-item id="cert"
                   @click.native="linkTo('cert_no')">
        <img slot="icon" src="./assets/img/cert-red.png"  alt="查询红" v-show="active==='cert'">
        <img slot="icon" src="./assets/img/cert-gray.png" alt="查询灰" v-show="active!=='cert'">
        <span>查询</span>
      </mt-tab-item>
      <mt-tab-item id="my" @click.native="linkTo('myyunbisai')">
        <img slot="icon"
             src="./assets/img/my-red.png"
             alt="我的红"
             v-show="active==='my'">
        <img slot="icon"
             src="./assets/img/my-gray.png"
             alt="我的灰"
             v-show="active!=='my'">
          <span>我的</span>
      </mt-tab-item>
    </mt-tabbar>
      <!--<div id="no-org" v-if="!orgId">-->
          <!--<img src="./assets/img/no_more.png" alt="没有更多了">-->
          <!--<p>您访问的机构不存在。</p>-->
          <!--<a href="http://m.yunbisai.com/org/organization.html">返回机构列表</a>-->
      <!--</div>-->
  </div>
</template>
<script>
export default {
  data(){
    return {
      active:'',
      orgId:'',
      isSearch:false,
      webURL:''
    }
  },
  name: 'app',
  methods:{
    goTo(path){
       this.$router.push( '/' + path );
       this.active = path.split('?')[0];
    },
    linkTo(path){
      if(path=='cert_no'){
        window.location.href = this.$store.state.base_uri_prefix+'www.yunbisai.com/'+path;
      }else{
        window.location.href = this.$store.state.hostname+'/'+path;
      }
    },
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
          document.title=data.datArr.cname;
          !data.datArr.province_name?data.datArr.province_name='':0;
          !data.datArr.city_name?data.datArr.city_name='':0;
          !data.datArr.county_name?data.datArr.county_name='':0;
          !data.datArr.address?data.datArr.address='':0;
          that.$wxShare({title:data.datArr.cname,desc:data.datArr.province_name+data.datArr.city_name+data.datArr.county_name+data.datArr.address,img:data.datArr.logoimg});

          // that.$store.commit('setOrg',data.datArr);
          // that.$store.commit('setOrgId',data.datArr.orgid);
          that.$store.commit('setloginId',data.datArr.loginid);
        }
      },res => {
        console.log('网络出了点问题');
      });
    },
    // goToSwitch(path){
    //   const that = this;
    //   //var url=location.hash.slice(1)+'/'
    //   this.$router.push('/index/'+path);
    //   switch(path){
    //     case 'event':that.pass='event';break
    //   }
    // }
  },
  beforeMount() {
      this.$store.commit('setOrgId', this.$route.query.orgid);
      this.orgId= this.$route.query.orgid

      this.getOrgDetail();
  },
  mounted(){
    const that = this;

    that.active = window.location.href.indexOf('home') !== -1 ? 'home' : '';

    // that.webURL = window.location.href.indexOf('dev') === -1 ? '//m.yunbisai.com' : '//dev-m.yunbisai.com';
    that.webURL = that.$store.state.hostname;

    if( window.location.hash === '#/'  ){this.$router.push('/home');}
  }
}
</script>

<style>
    #app{
        font-family:'微软雅黑',sans-serif;
        overflow:hidden;
        max-width:750px;
        margin:0 auto;
    }
    #app a{
      color:#333;
      text-decoration:none;
    }
    #app .header{
      background-color: #fff;
      color: #000;
    }
    #no-org{
        position:fixed;
        width:100%;
        top:0;
        max-width:7.5rem;
        height:100%;
        background:#fff;
        font-size:0.36rem;
        z-index:999999;
        text-align:center;
        color:#666;
    }
    #no-org img{
        margin-top:3rem;
    }
    #bottom .is-selected,.is-active{
      color:#cc0000;
    }
    #bottom .mint-tab-item .mint-tab-item-label{
      font-size: 0.24rem;
    }
    #bottom.mint-tabbar.is-fixed{
        height:1.1rem;
        z-index:88888;
        margin:0 auto;
        width:7.5rem;
    }
    #bottom .mint-tab-item{
      padding:0.14rem 0;
    }
    #bottom .mint-tab-item-icon{
      width:0.48rem;
      height:0.48rem;
    }
    #bottom .mint-tab-item:nth-of-type(2) .mint-tab-item-icon{
        width:0.54rem;
    }
    #bottom .mint-tab-item:last-of-type .mint-tab-item-icon{
        width:0.42rem;
    }
    .nav{
      margin-bottom: 5px;
    }
    body{
      background-color: #F0F0F0;
      margin: 0;
    }
    .text-center{
        text-align:center;
    }
    .col-1,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-10,.col-11{
        float:left;
    }
    .col-1{
        width:8%;
    }
    .col-2{
        width:16%;
    }
    .col-3{
        width:33%;
    }
    .col-4{
        width:25%;
    }
    .col-5{
        width:41%;
    }
    .col-6{
        width:50%;
    }
    .col-7{
        width:58%;
    }
    .col-8{
        width:66%;
    }
    .float-left{
        float:left;
    }
</style>
