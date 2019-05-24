// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import fa from 'font-awesome-webpack'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(fa)
Vue.use(Vuex)
Vue.use(Mint)
Vue.config.productionTip = false

import { Swipe, SwipeItem } from 'mint-ui';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { InfiniteScroll } from 'mint-ui';
import { Lazyload } from 'mint-ui';

import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
Vue.use(VueAwesomeSwiper);

import wx from 'weixin-js-sdk';   //微信分享

Vue.use(Lazyload);
Vue.use(InfiniteScroll);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

/*photoswipe plugin*/
// import VuePreview from 'vue-preview'
// Vue.use(VuePreview)

/*axios*/
Vue.prototype.$axios = axios;
// axios.defaults.headers={Referer:'http://www.yunbisai.com/'};


let _baseURL='//api.yunbisai.com/';
let hostname='//m.yunbisai.com';
const myIp='192.168.2.7';
const host=window.location.host;

let base_uri_prefix = "//";
const LOCAHOST = window.location.hostname;
if(LOCAHOST.indexOf("dev")!=-1){
  base_uri_prefix+='dev-';
}else if(LOCAHOST.indexOf("test")!=-1){
  base_uri_prefix+='test-';
}else if(LOCAHOST.indexOf("localhost")!=-1 || LOCAHOST.indexOf(myIp)!=-1){
  base_uri_prefix+='dev-';
}

_baseURL = base_uri_prefix + "api.yunbisai.com/";
hostname = base_uri_prefix + "m.yunbisai.com/";
axios.defaults.baseURL = _baseURL;

const store = new Vuex.Store({
  state:{
    orgId:'',
    loginId:'',
    hostname:hostname,     //页面地址
    base_uri_prefix:base_uri_prefix,       //请求地址
    orgDetail:{},
    guangdongID:32
  },
  mutations: {
    setOrgId (state, orgId) {
      state.orgId = orgId;
    },
    setloginId (state, loginId) {
      state.loginId = loginId;
    },
    setOrg (state, obj) {
      state.orgDetail=obj
    }
  }
})

/*微信分享*/
Vue.prototype.$wxShare = function (object) {
  const url=window.location.href
  let wxdata={     //微信数据
    title:'',
    desc:'',
    img:'',
    // link:link
  }
  if(isweixin()){
    "object" == typeof object && Object.assign(wxdata,object);
    if(object.title ==='' || object.title == void 0 || object.title.length ===0 ){object.title='云比赛机构专题'}
    if(object.desc ==='' || object.desc == void 0 || object.desc.length ===0 ){object.desc='云比赛-围棋比赛-象棋比赛-国际象棋比赛-五子棋比赛-比赛报名-棋谱-棋闻棋事-云比赛网'}
    if(object.img ==='' || object.img == void 0 || object.img.length ===0 ){object.img='https://g.yunbisai.com/img/wxLogo.jpg'}
    else if(object.img.indexOf('http')===-1){object.img="http://" + window.location.host + object.img}
    axios.get('//m.yunbisai.com/wechat/jssdk', {//请求配置
      params: {
        url: url.split('#')[0]
      }
    }).then(res => {// 获得签名配置
      let Data = res.data;
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作
      wx.config({
        debug: false, // 开启调试模式,开发时可以开启
        appId: Data.appId,   // 必填，公众号的唯一标识   由接口返回
        timestamp: Data.timestamp, // 必填，生成签名的时间戳 由接口返回
        nonceStr: Data.nonceStr,    // 必填，生成签名的随机串 由接口返回
        signature: Data.signature,   // 必填，签名 由接口返回
        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"] // 此处填你所用到的方法
      });

    })

    wx.ready(function() {
      wx.onMenuShareTimeline({
          title: object.title,
          link: object.link,
          imgUrl: object.img,
          success: () => {
              shareCount()
          },
          cancel: () => {}
      }),
      wx.onMenuShareAppMessage({
          title: object.title,
          desc: object.desc,
          link: object.link,
          imgUrl: object.img,
          type: "",
          dataUrl: "",
          success: () => {
              shareCount()
          },
          cancel: () => {}
      }),
      wx.onMenuShareQQ({
          title: object.title,
          desc: object.desc,
          link: object.link,
          imgUrl: object.img,
          success: () => {
              shareCount()
          },
          cancel: () => {}
      }),
      wx.onMenuShareWeibo({
          title: object.title,
          desc: object.desc,
          link: object.link,
          imgUrl: object.img,
          success: () => {
              shareCount()
          },
          cancel: () => {}
      }),
      wx.onMenuShareWeibo({
          title: object.title,
          desc: object.desc,
          link: object.link,
          imgUrl: object.img,
          success: () => {
              shareCount()
          },
          cancel: () => {}
      })
    }),
    wx.error(res => {})
  };

  function isweixin() {
    const ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    } else {
        return false;
    }
  }
  function shareCount() {
      axios({
        method:'get',
        url:'request/Share/addusershare',
        params:{
          type : 16,
          url:url
        }
      }).then(res => {})
  }
}


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
