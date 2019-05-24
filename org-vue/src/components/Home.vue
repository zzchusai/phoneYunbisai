<template>
  <div id="org-home">
      <!-- header -->
      <header :style="{
                    background:'rgba(255,255,255,'+op+')',
                    'box-shadow': '0 0 10px 0 rgba(221,221,221,'+op+')'
               }">
          <div class="float-left header-icon">
              <div class="header-img">
                  <a :href="$store.state.base_uri_prefix + 'm.yunbisai.com/org/organization.html'">
                    <img src="./../assets/img/back.png"
                         alt="back" >
                  </a>
              </div>
          </div>
          <div class="float-left search-item" @click="$router.push('/search'+'?orgid='+$store.state.orgId)">
              <img class="search-img" src="./../assets/img/search-white.png" alt="search">
              <div :style="{opacity:op+0.5}"
                   class="header-search"></div>
          </div>
          <div class="float-left header-icon">
              <div class="header-img">
                  <img src="./../assets/img/message.png"
                       alt="message">
              </div>
          </div>
      </header>

      <!-- swipe -->
      <mt-swipe :auto="4000"
                class="head-swipe"
                v-show="swipeData.length!==0"
                :show-indicators="false">
          <mt-swipe-item v-for="item in swipeData"
                         :key="item.title">
              <img :src="item.img"
                   :onerror="defaultSwipe"
                   @click="goToSwipeDetail(item.url)"
                   alt="轮播图">
              <p class="swipe-title" v-if="item.title">{{item.title}}</p>
          </mt-swipe-item>
      </mt-swipe>
      <!--swipe 代替-->
      <mt-swipe class="head-swipe" v-show="swipeData.length===0">
          <mt-swipe-item>
          <img
               style="width:100%"
               src="./../assets/img/swipe_default.jpg"
               alt="轮播默认图">
          </mt-swipe-item>
      </mt-swipe>
      <nav>
          <div class="org-head-img">
              <img :src="orgImg" alt="头像" :onerror="defaultHead">
          </div>
          <p class="org-name">{{orgName}}</p>
          <div class="org-nav-img scroll-part"
               :style="">
              <div class="org-nav-img-item text-center" v-if="item.floor==1"
                   v-for="item in navImg">
                  <img :src="item.src"
                       @click="goToPart( '/' + item.path + '?orgid=' +　$store.state.orgId)"
                       alt="item">
                  <p class="text-center" >{{item.name}}</p>
              </div>
          </div>
          <div class="org-nav-img scroll-part"
               @touchstart="touchStart($event,0)"
               @touchmove="touchMove($event,0)"
               @touchend="touchEnd($event,0)"
               :style="{left:moveDis0+'px'}"
               v-if="zjFlag">
              <div class="org-nav-img-item text-center" v-if="item.floor==2"
                   v-for="item in navImg">
                  <img :src="item.src"
                       @click="goToPart( '/' + item.path + '?orgid=' +　$store.state.orgId)"
                       alt="item">
                  <p class="text-center" >{{item.name}}</p>
              </div>
          </div>
      </nav>

      <!-- notice -->
      <nav class="notice" v-if="0">
          <p class="notice-title text-center">
              公告
              <span class="more-text">
                  更多
                  <img class="more-img" src="./../assets/img/back.png" alt="more">
              </span>
          </p>
          <ul class="notice-content">
              <li v-for="item in notice">
                  <span>{{item}}</span>
              </li>
              <li v-if="notice.length === 0 ">暂无公告</li>
          </ul>
      </nav>

      <!-- signing event -->
      <nav class="event"
           v-if="events.length">
          <p class="event-title">
              最新赛事
              <span @click="learnMore('event')">
                  <span class="more-text more-text-big">
                    更多
                  <img class="more-img more-img-big" src="./../assets/img/back.png" alt="more">
              </span>
              </span>
          </p>
          <img class="bg-ship" src="./../assets/img/bg_ship.png" alt="shipBg">
      </nav>
      <article class="event-content"
               v-for="item in events"
               v-if="events.length">
          <!-- <a :href="$store.state.base_uri_prefix + 'm.yunbisai.com/signUp?eventid='+item.id"> -->
          <a :href="item.href">
              <div class="event-content-img">
                  <img :src="item.img"
                       :onerror="defaultRecentEvent"
                       alt="赛事图">
                  <p>{{item.title}}</p>
              </div>
              <div class="event-content-info">
                   <div class="event-detail-p">
                       <img src="./../assets/img/time.png" alt="time">
                       <span class="event-detail">{{item.startTime +'-' + item.endTime}}</span>
                   </div>
                  <div>
                      <span v-if="item.isentry" class="rmb">RMB</span>
                      <span v-if="item.isentry" class="rmb-detail">{{item.money}}</span>
                  </div>
                  <div >
                      <img src="./../assets/img/address.png" alt="time">
                      <span class="event-detail address-detail">{{item.address}}</span>
                  </div>
                  <div v-if='item.isentry'>
                      <span class="num-detail text-center">{{item.pay_num>999?999:item.pay_num}}</span>已报
                  </div>
                  <div v-else>
                    <span class="num-detail text-center">{{item.play_num>999?999:item.play_num}}</span>参赛
                  </div>
              </div>
          </a>
      </article>

      <!-- 课程 -->
      <nav class="event latest"
           v-if="courseEvents.length">
          <p class="event-title">
              课程报名
              <span @click="learnMore('course')">
                  <span class="more-text more-text-big">
                      更多
                      <img class="more-img more-img-big"
                           src="./../assets/img/back.png"
                           alt="more">
                  </span>
              </span>
          </p>
          <img class="bg-ship" src="./../assets/img/bg_tree.png" alt="shipBg">
      </nav>
      <swiper :options="swiperOption" ref="mySwiper" >
        <swiper-slide v-for="item in courseEvents" :key="item.id">
          <div class="latest-event scroll-part">
          <article >
              <!-- <a :href="$store.state.base_uri_prefix + 'm.yunbisai.com/eventFeatures/eventDetail-' + item.id + '.html'"> -->
              <a :href="$store.state.base_uri_prefix + 'm.yunbisai.com/signUp/course?trainid=' + item.training_id + '&guid='+item.training_guid">
                  <div class="latest-event-content-img">
                      <span class="event-state event-state-gray"
                            v-if="item.state==='未开始'||item.state==='已结束'">{{item.state}}</span>
                      <span class="event-state event-state-blue"
                            v-if="item.state==='报名中'">{{item.state}}</span>
                      <span class="event-state event-state-red" v-if="item.state==='比赛中'">{{item.state}}</span>
                      <img :src="item.img"
                           :onerror="defaultRecentEvent"
                           alt="赛事图">
                  </div>
                  <div class="event-content-info">
                      <p>{{item.title}}</p>
                      <p class="info">
                          <img src="./../assets/img/time.png" alt="time">
                          <span class="event-detail">{{item.training_datetime}}</span>
                      </p>
                      <p class="info">
                          <img src="./../assets/img/address.png" alt="time">
                          <span class="event-detail address-detail">{{item.address}}</span>
                      </p>
                  </div>
              </a>
          </article>
          </div>
        </swiper-slide>
      </swiper>

      <!-- 最新资讯 -->
      <nav class="event"
           v-if="news.length">
          <p class="event-title">
              最新资讯
              <span @click="learnMore('news')">
                  <span class="more-text more-text-big">
                      更多
                      <img class="more-img more-img-big"
                           src="./../assets/img/back.png"
                           alt="more">
                  </span>
              </span>
          </p>
          <img class="bg-ship" src="./../assets/img/bg_sun.png" alt="shipBg">
      </nav>
      <article class="news"
               v-if="news.length"
               v-for="item in news">
          <a :href=" $store.state.base_uri_prefix + 'm.yunbisai.com/news/' + item.id + '.html'">
              <div class="news-left" v-if="item.img!==''">
                  <img :src="item.img"
                       :onerror="defaultNews"
                       alt="new-img">
              </div>
              <div class="news-right"
                   :class="{'news-right-no-img':item.img===''}">
                  <p class="news-title">
                      <span class="type">{{item.type}}</span>
                      <span>{{item.title}}</span>
                  </p>
                  <p class="news-brief">{{setContent(item.brief)}}</p>
                  <p>
                      <img src="./../assets/img/time.png" alt="time">
                      <span>{{item.time}}</span>
                      <img src="./../assets/img/net.png" alt="time">
                      <span>{{item.from}}</span>
                  </p>
              </div>
          </a>
      </article>
      <div class="more-news text-center" v-if="news.length">
          <span @click="learnMore('news')">
              <span>点击查看更多</span>
              <img class="more-img more-img-big" src="./../assets/img/back.png" alt="more">
          </span>
      </div>
      <!-- 师资 -->
      <nav class="event"
           v-if="teachers.length">
          <p class="event-title">
              师资力量
              <span @click="learnMore('teachers')">
                  <span class="more-text more-text-big">
                      更多
                      <img class="more-img more-img-big"
                           src="./../assets/img/back.png"
                           alt="more">
                  </span>
              </span>
          </p>
          <img class="bg-ship" src="./../assets/img/bg_mount.png" alt="shipBg">
      </nav>
      <!-- <div class="teacher-view scroll-part"
           v-if="teachers.length"
           @touchstart="touchStart($event,2)"
           @touchmove="touchMove($event,2)"
           @touchend="touchEnd($event,2)"
           :style="{left:moveDis2+'px'}">
          <article class="teacher"
                   v-for="item in teachers" @click="toTeacherDetail(item.id)">
              <img class="head"
                   :onerror="defaultTeacher"
                   :src="item.img"
                   alt="">
              <img class="bg" src="./../assets/img/bg_teacher.png" alt="teacher">
              <p class="name text-center">
                  {{item.name}}
                  <label v-if="item.title">/</label>
                  <span>{{item.title}}</span>
              </p>
          </article>
      </div> -->
      <swiper :options="swiperOption" ref="mySwiper" >
        <swiper-slide v-for="item in teachers" :key="item.id">
          <div class="teacher-view scroll-part">
            <article class="teacher"
                      @click="toTeacherDetail(item.id)">
                <img class="head"
                     :onerror="defaultTeacher"
                     :src="item.img"
                     alt="">
                <img class="bg" src="./../assets/img/bg_teacher.png" alt="teacher">
                <p class="name text-center">
                    {{item.name}}
                    <label v-if="item.title">/</label>
                    <span>{{item.title}}</span>
                </p>
            </article>
        </div>
        </swiper-slide>
      </swiper>
      <!-- 相册 -->
      <nav class="event" v-if="photo.length">
          <p class="event-title">
              相册
              <span @click="learnMore('album')">
                  <span class="more-text more-text-big">
                      更多
                      <img class="more-img more-img-big"
                           src="./../assets/img/back.png"
                           alt="more">
                  </span>
              </span>
          </p>
          <img class="bg-ship" src="./../assets/img/bg_mount.png" alt="shipBg">
      </nav>
      <!-- <div class="photo-view scroll-part"
           v-if="photo.length"
           @touchstart="touchStart($event,3)"
           @touchmove="touchMove($event,3)"
           @touchend="touchEnd($event,3)"
           :style="{left:moveDis3+'px'}">
          <article class="photo"
                   v-for="item in photo"
                   v-if="item.src">
              <img :src="item.src"
                   @click="watchImg(item)"
                   :onerror="defaultAlbum"
                   alt="没找到图片">
          </article>
      </div> -->
      <swiper :options="swiperOption" ref="mySwiper" v-if="photo.length">
        <swiper-slide v-for="item in photo" :key="item.id">
          <div class="photo-view scroll-part" >
              <article class="photo" v-if="item.src">
                  <img :src="item.src"
                       @click="watchImg(item)"
                       :onerror="defaultAlbum"
                       alt="没找到图片">
              </article>
          </div>
        </swiper-slide>
      </swiper>
      <!-- 联系我们 -->
      <nav class="event" style="margin-bottom:0.06rem">
            <p class="link">联系我们</p>
      </nav>
      <article class="home-bottom">
          <p>
              <img class="icon" src="./../assets/img/address.png" alt="address">
              <span>{{org.address}}</span>
          </p>
          <p>
              <img class="icon" src="./../assets/img/tel.png" alt="tel">
              <span>{{org.tel}}</span>
          </p>
          <p>
              <img class="icon" src="./../assets/img/person.png" alt="person">
              <span>{{org.person}}</span>
          </p>
          <p>
              <img class="icon" src="./../assets/img/net.png" alt="net">
              <span>{{org.net}}</span>
          </p>
          <p>
              <img class="icon" src="./../assets/img/email.png" alt="email">
              <span>{{org.email}}</span>
          </p>
          <img class="bg-bottom" src="./../assets/img/bg_flower.png" alt="bg_flower">
      </article>
      <div class="photo-watcher text-center"
           @click="isWatch = false"
           v-show="isWatch">
          <mt-swipe v-if="isWatch"
                    :show-indicators="false"
                    :continuous="false"
                    :defaultIndex="currentIndex"
                    :auto="0">
              <mt-swipe-item class="img-container text-center"
                             v-for="item in photo" :key="item.index">
                  <img class="photo-watcher-img"
                       :src="item.src"
                       :onerror="defaultAlbum"
                       @click.prevent.stop=""
                       alt="图片预览">
                  <p class="photo-watcher-remark">{{item.remark}}</p>
              </mt-swipe-item>
          </mt-swipe>
      </div>
      <!-- <div><vue-preview :slides="photo" @close="handleClose"></vue-preview></div> -->
  </div>
</template>
<script>
  import event_img from './../assets/img/nav-event.png'
  import class_img from './../assets/img/nav-class.png'
  import teacher_img from './../assets/img/nav-teacher.png'
  import ranking_img from './../assets/img/nav-ranking.png'
  import news_img from './../assets/img/nav-news.png'
  import chess_img from './../assets/img/nav-chess.png'
  import photo_img from './../assets/img/nav-photo.png'
  import recruit_img from './../assets/img/nav-recruit.png'

  import defaultSwipe from './../assets/img/swipe_default.jpg'
  import defaultRecentEvent from './../assets/img/recent_event_default.jpg'
  import defaultSignEvent from './../assets/img/sign_event_default.jpg'
  import defaultNews from './../assets/img/news_default.jpg'

  export default{
      data(){
        return {
          isWatch:false,
          currentIndex:0,

          base:'',
          imgURL:'',

          requestURL:{
            org:'request/Org/OrgDetail',
            event:'request/Event/Eventlist',
            recentEvent:'request/Event/Eventlist',
            courseEvent:'request/Train/TrainList',
            news:'request/Org/OrgNews',
            photo:'request/Org/OrgImg',
            teacher:'request/Org/TeacherList',
            zhejiangEvent:'request/Org/OrgMsEventList',
          },
          loadState:0,
          message:1,

          defaultHead:'this.src=\"//g.yunbisai.com/img/public/default-avatar.png\"',
          defaultSwipe:'this.src="' + require('./../assets/img/swipe_default.jpg') + '"' ,
          defaultNews:'this.src="' + require('./../assets/img/news_default.jpg') + '"' ,
          defaultTeacher:'this.src="' + require('./../assets/img/default_head.png') + '"' ,
          defaultSignEvent:'this.src="' + require('./../assets/img/sign_event_default.jpg') + '"' ,
          defaultRecentEvent:'this.src="' + require('./../assets/img/recent_event_default.jpg') + '"' ,
          defaultAlbum:'this.src="' + require('./../assets/img/album_default.jpg') + '"' ,

          org:{
            address:'暂无',
            tel:'暂无',
            person:'暂无',
            net:'暂无',
            email:'暂无'
          },
          swipeData:[],
          orgId:'',
          orgName:'读取中',
          orgImg:'',
          navImg:[
            {src:event_img,name:'赛事',path:'event',floor:1},
            {src:class_img,name:'课程',path:'course',floor:1},
            {src:teacher_img,name:'师资',path:'teachers',floor:1},
//          {src:ranking_img,name:'排行榜',path:'event'},
            {src:news_img,name:'资讯',path:'news',floor:1},
            {src:chess_img,name:'棋谱',path:'chessbook',floor:2},
            {src:photo_img,name:'相册',path:'album',floor:2},
            {src:recruit_img,name:'招聘',path:'recruit',floor:2},
          ],

          startPos:[0,0,0,0],
          endPos:[0,0,0,0],
          moveDis0:0,
          moveDis1:0,
          moveDis2:0,
          moveDis3:0,
          startStamp:0,
          lastDis:[0,0,0,0],
          navWidth:[0,0,0,0],

          //swiper 参数
          swiperOption: {
             paginationClickable :true,
             slidesPerView : 2.2,
             // spaceBetween : 10,
             spaceBetween : 0,
          },
          op:0,
          clientWidth:document.body.clientWidth || document.documentElement.clientWidth,
          notice:[''],
          events:[],
          recentEvents:[],
          courseEvents:[],
          news:[],
          teachers:[],
          photo:[],
          randImg:[
              '//g.yunbisai.com/img/default/e_2_1.jpg',
              '//g.yunbisai.com/img/default/e_2_2.jpg',
              '//g.yunbisai.com/img/default/e_2_3.jpg',
              '//g.yunbisai.com/img/default/e_2_4.jpg',
              '//g.yunbisai.com/img/default/e_2_5.jpg',
          ],
          zjFlag:true,
          zhejiangID:'321',
        }
      },
      computed: {
        swiper() {
          return this.$refs.mySwiper.swiper
        }
      },
      methods:{
        // 查看更多
        handleClose () {
          console.log('close event')
        },
        learnMore(type){
          this.$router.push( '/' + type +'?orgid='+ this.$store.state.orgId);
          this.$parent.$parent.active = '';
        },
        goToSwipeDetail(url){
          window.location.href = url;
        },
        toTeacherDetail(id){
          this.$router.push('/teachersDetail?teacherid=' + id);
          this.$parent.$parent.active = '';
        },
        // 开始触摸滑动
        touchStart(event,i){
          // 数据长度控制滚动距离
          let percent = 0;
          if( i === 0 ) percent = this.swipeData.length / 6;
          else if( i === 1 ) percent = this.recentEvents.length / 6;
          else if( i === 2 ) percent = this.teachers.length / 6;
          else if( i === 3 ) percent = this.photo.length / 6;
          // 设定滚动宽度
          if( this.navWidth[i] === 0 ) this.navWidth[i] = parseInt(window.getComputedStyle(document.getElementsByClassName('scroll-part')[i]).width) * percent;
          this.startPos[i] = event.touches[0].screenX;

          this.startStamp = event.timeStamp;

        },
        // 滑动中
        touchMove(event,i){
          const $nav = document.getElementsByClassName('scroll-part')[i];
          this.endPos[i] = event.touches[0].screenX;
          let _dis = this.endPos[i] - this.startPos[i] + this.lastDis[i];
          if( _dis >= 0 ) _dis = 0;
          else if( _dis <= this.clientWidth - this.navWidth[i] ) _dis = this.clientWidth - this.navWidth[i];
          switch (i){
            case 0:
              //this.moveDis0 = _dis;
              break;
            case 1:
              this.moveDis1 = _dis;
              break;
            case 2:
              this.moveDis2 = _dis;
              break;
            case 3:
              this.moveDis3 = _dis;
              break;
          }
        },
        // 滑动结束
        touchEnd(event,i){
          const movingTime = this.startStamp - event.timeStamp;
          let speed = 0;
          switch (i){
            case 0:
              //this.lastDis[i] = this.moveDis0;
              speed = ( this.endPos[i] - this.startPos[i] ) / movingTime;
              break;
            case 1:
              this.lastDis[i] = this.moveDis1;
              speed = this.moveDis1/movingTime;
              break;
            case 2:
              this.lastDis[i] = this.moveDis2;
              speed = this.moveDis2/movingTime;
              break;
            case 3:
              this.lastDis[i] = this.moveDis3;
              speed = this.moveDis3/movingTime;
              break;
          }
        },
        // 查看图片
        watchImg(item){
          this.isWatch = true;
          this.currentIndex = item.index;
        },
        // 限制长度
        setContent(data){
          if(typeof data !== 'string') return '暂无';
          const max = 36;
          const _data = data.replace(/<[^>]+>/g,"");
          return _data.substring(0,max) + ( _data.length < max ? '' : '...' );
        },
        // 页面滚动
        getPageScroll() {
          let xScroll, yScroll;
          if (self.pageYOffset) {
            yScroll = self.pageYOffset;
            xScroll = self.pageXOffset;
          } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
            yScroll = document.documentElement.scrollTop;
            xScroll = document.documentElement.scrollLeft;
          } else if (document.body) {// all other Explorers
            yScroll = document.body.scrollTop;
            xScroll = document.body.scrollLeft;
          }
          return [xScroll,yScroll];
        },
        // 改变头透明度
        getHeaderOpacity(){
          const that = this,
                $header = document.getElementsByTagName('header')[0],
                $car = document.getElementsByClassName('head-swipe')[0],
                $carHei = parseInt(window.getComputedStyle($car).height),
                $headerHei = parseInt(window.getComputedStyle($header).height),
                _dis = $carHei;
          window.addEventListener('scroll',() => {
              that.op = that.getPageScroll()[1] / _dis >= 1 ? 1 : that.getPageScroll()[1] / _dis;
          },false);
        },
        // 围棋段位转为中文
        changeTitle(stage){
          stage = stage >> 0;
          switch(stage){
            case 143:return "28级";break;
            case 142:return "27级";break;
            case 141:return "26级";break;
            case 99 :return "25级";break;
            case 103:return "24级";break;
            case 104:return "23级";break;
            case 106:return "22级";break;
            case 107:return "21级";break;
            case 108:return "20级";break;
            case 109:return "19级";break;
            case 110:return "18级";break;
            case 111:return "17级";break;
            case 112:return "16级";break;
            case 113:return "15级";break;
            case 114:return "14级";break;
            case 115:return "13级";break;
            case 116:return "12级";break;
            case 117:return "11级";break;
            case 118:return "10级";break;
            case 119:return "9级";break;
            case 120:return "8级";break;
            case 121:return "7级";break;
            case 122:return "6级";break;
            case 123:return "5级";break;
            case 124:return "4级";break;
            case 125:return "3级";break;
            case 126:return "2级";break;
            case 127:return "1级";break;
            case 128:return "1段";break;
            case 129:return "2段";break;
            case 130:return "3段";break;
            case 131:return "4段";break;
            case 132:return "5段";break;
            case 133:return "6段";break;
          }
          return '';
        },
        // 处理数据
        format(data){
          if( data === null || data === '' || typeof data === 'undefined' ){
             return '暂无';
          }else{
            return data;
          }
        },
        formatMoney(data){
          if( data === null || data === '' || typeof data === 'undefined' ){
             return '';
          }else{
            let num=data-0;
            return num.toFixed(2);
          }
        },
        goToPart(path){
          const that = this;
          that.$parent.$parent.active='';
          that.$router.push(path);
        },
        // 机构详情
        getOrgDetail(){
          const that = this;
          that.$axios({
            method:'post',
            url:that.requestURL.org,
            params:{
              orgid : that.$store.state.orgId
            }
          }).then(res => {
            const data = res.data;
            if( (data.error>>0) === 0 ){
              const _data = data.datArr;
              that.org = {
                address : that.format(_data.address),
                person  : that.format(_data.linkman),
                email   : that.format(_data.email),
                tel     : that.format(_data.tel),
                net     : that.format(_data.website),
              };
              that.orgName = _data.cname;
              that.orgImg = _data.logoimg? _data.logoimg:'//g.yunbisai.com/img/public/default-avatar.png';
              that.$store.commit('setOrgId',_data.orgid);
              that.$store.commit('setloginId',_data.loginid);

            }
          },res => {
            console.log('网络出了点问题');
          });

          // const _data = that.$store.state.orgDetail;
          // that.org = {
          //   address : that.format(_data.address),
          //   person  : that.format(_data.linkman),
          //   email   : that.format(_data.email),
          //   tel     : that.format(_data.tel),
          //   net     : that.format(_data.website),
          // };
          // that.orgName = _data.cname;
          // that.orgImg = _data.logoimg? _data.logoimg:'//g.yunbisai.com/img/public/default-avatar.png';
        },
        // 报名中赛事
        getSignEvent () {
          const that = this;
          that.$axios({
            method:'post',
            url:that.requestURL.event,
            params:{
              // eventStatus : 2,
              PageSize    : 3,
              // sort        : 1,
              // order       : 1,
              orgID       : that.$store.state.orgId
            }
          }).then(res => {
            const data = res.data;
            if( (data.error>>0) === 0 ){
              const _data = data.datArr.rows;
              if( _data.length > 0 ){
                _data.forEach( (e,i) => {
                  that.events.push({
                    id        : that.format(e.event_id),
                    // img       : that.format(e.eventlogo) === '暂无' ? defaultSignEvent : that.format(e.eventlogo),
                    img       : that.format(e.eventlogo) === '暂无' ? that.randpic() : that.format(e.eventlogo),
                    title     : that.format(e.title),
                    startTime : that.format(e.min_time).substring(0,10).replace(/[-]/g,'/'),
                    endTime   : that.format(e.max_time).substring(0,10).replace(/[-]/g,'/'),
                    money     : that.formatMoney(e.min_sumcost),
                    address   : that.format(e.provincename+' '+e.city_name+' '+e.county_name+' '+e.address),
                    play_num  : that.format(e.play_num) === '暂无' ? 0 : that.format(e.play_num),
                    pay_num   : that.format(e.pay_num) === '暂无' ? 0 : that.format(e.pay_num),
                    href      : that.checkEventType(e.isentry,e.event_id),
                    isentry   : e.isentry-0 ==1
                  });
                });
              }
            }
          },res => {
            console.log('网络出了点问题');
          });
        },
        checkEventType(isentry,id){
          const that=this
          if(isentry-0){
            return that.$store.state.base_uri_prefix + 'm.yunbisai.com/signUp?eventid='+id
          }else{
            return that.$store.state.base_uri_prefix + 'm.yunbisai.com/eventFeatures/eventDetail-'+id+'.html'
          }
        },
        checkEventTime(rmax,min,id){
          const that = this;
          const rmaxObj = {
            yy:rmax.substring(0,4),
            MM:rmax.substring(5,7),
            dd:rmax.substring(8,10)
          },
          minObj = {
            yy:min.substring(0,4),
            MM:min.substring(5,7),
            dd:min.substring(8,10)
          };
          rmax = new Date(rmaxObj.yy,rmaxObj.MM-1,rmaxObj.dd);
          min = new Date(minObj.yy,minObj.MM-1,minObj.dd);
          const now = new Date();
          if((rmax > min && rmax > now) || (rmax < min && min > now)){
            return that.$store.state.base_uri_prefix + 'm.yunbisai.com/signUp?eventid='+id
          }else{
            return that.$store.state.base_uri_prefix + 'm.yunbisai.com/eventFeatures/eventDetail-'+id+'.html'
          }
        },
        checkEventState(rmin,rmax,min,max){
          const rminObj = {
            yy:rmin.substring(0,4),
            MM:rmin.substring(5,7),
            dd:rmin.substring(8,10)
          },
            rmaxObj = {
              yy:rmax.substring(0,4),
              MM:rmax.substring(5,7),
              dd:rmax.substring(8,10)
            },
            minObj = {
              yy:min.substring(0,4),
              MM:min.substring(5,7),
              dd:min.substring(8,10)
            },
            maxObj = {
              yy:max.substring(0,4),
              MM:max.substring(5,7),
              dd:max.substring(8,10)
            };
          rmin = new Date(rminObj.yy,rminObj.MM-1,rminObj.dd);
          rmax = new Date(rmaxObj.yy,rmaxObj.MM-1,rmaxObj.dd);
          min = new Date(minObj.yy,minObj.MM-1,minObj.dd);
          max = new Date(maxObj.yy,maxObj.MM-1,maxObj.dd);
          const now = new Date();

          if( now < rmin ){
            return '未开始';
          }else if(now > rmin && now < rmax){
            return '报名中';
          }else if( now < min ){
            return '未开始';
          }else if( now > min && now < max ){
            return '比赛中';
          }else{
            return '已结束';
          }
        },
        // 最新赛事
        getRecentEvent(){
          const that = this;
          that.$axios({
            method:'post',
            url:that.requestURL.recentEvent,
            params:{
              PageSize : 6,
              sort     : 1,
              order    : 1,
              orgID    : that.$store.state.orgId
            }
          }).then(res => {
            const data = res.data;
            if( (data.error>>0) === 0 ){
              const _data = data.datArr.rows;
              if( _data.length > 0 ){
                _data.forEach( (e,i) => {
                  that.recentEvents.push({
                    id        : that.format(e.event_id),
                    img       : that.format(e.eventlogo) === '暂无' ? defaultRecentEvent : that.format(e.eventlogo),
                    title     : that.format(e.title),
                    startTime : that.format(e.r_min_time).substring(0,10).replace(/[-]/g,'/'),
                    endTime   : that.format(e.max_time).substring(0,10).replace(/[-]/g,'/'),
                    address   : that.format(e.provincename),
                    state     : that.checkEventState(e.r_min_time,e.r_max_time,e.min_time,e.max_time)
                  });
                });
              }
            }
          },res => {
            console.log('网络出了点问题');
          });
        },
        getCoureseEvent(){
          const that = this;
          that.$axios({
            method:'post',
            url:that.requestURL.courseEvent,
            params:{
              PageSize : 6,
              page     : 1,
              orgID    : that.$store.state.orgId
            }
          }).then(res => {
            const data = res.data;
            if( (data.error>>0) === 0 ){
              const _data = data.datArr.rows;
              if( _data.length > 0 ){
                _data.forEach( (e,i) => {
                  that.courseEvents.push({
                    id        : that.format(e.event_id),
                    training_id:that.format(e.training_id),
                    training_guid:that.format(e.training_guid),
                    img       : that.format(e.logo) === '暂无' ? defaultRecentEvent : that.format(e.logo),
                    title     : that.format(e.training_name),
                    // startTime : that.format(e.r_min_time).substring(0,10).replace(/[-]/g,'/'),
                    // endTime   : that.format(e.max_time).substring(0,10).replace(/[-]/g,'/'),
                    training_datetime:that.format(e.training_datetime),
                    address   : that.format(e.training_address),
                    // state     : that.checkEventState(e.r_min_time,e.r_max_time,e.min_time,e.max_time)
                  });
                });
              }
            }
          },res => {
            console.log('网络出了点问题');
          });
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
        // 最新资讯
        getNews(){
          const that = this;
          that.$axios({
            method:'post',
            url:that.requestURL.news,
            params:{
              PageSize : 6,
              orgID    : that.$store.state.orgId
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
                    img   : that.getNewsImg(e.img_src) === '' ? '' : that.getNewsImg(e.img_src),
                    title : that.format(e.comment_title),
                    brief : that.format(e.content),
                    time  : that.format(e.addtime.substring(0,10).replace(/[-]/g,'/')),
                    from  : that.format(e.source) === '暂无' ? '未知' : that.format(e.source),
                  });
                });
              }
            }
          },res => {
            console.log('网络出了点问题');
          });
        },
        // 师资
        getTeacher(){
          const that = this;
          that.$axios({
            method:'post',
            url:that.requestURL.teacher,
            params:{
              type     : 63,
              page     : 1,
              PageSize : 6,
              orgid    : that.$store.state.orgId
            }
          }).then(res => {
            const data = res.data;
            if( (data.error>>0) === 0 ){
              const _data = data.datArr.rows;
              if( _data.length > 0 ){
                _data.forEach( (e,i) => {
                  that.teachers.push({
                    id    : that.format(e.id),
                    name  : that.format(e.teachername),
                    title : that.changeTitle(that.format(e.stage)),
                    img   : that.format(e.logo) === '暂无' ? '' :  that.format(e.logo)
                  });
                });
              }
            }
          },res => {
            console.log('网络出了点问题');
          });
        },
        // 轮播图
        getSwipe(){
          const that = this;
          that.$axios({
            method:'post',
            url:that.requestURL.photo,
            params:{
              page     : 1,
              PageSize : 6,
              orgid    : that.$store.state.orgId,
              imgtype     : 8,
            }
          }).then(res => {
            const data = res.data;
            if( (data.error>>0) === 0 ){
              const _data = data.datArr.rows;
              if( _data.length > 0 ){
                _data.forEach( (e,i) => {
                  that.swipeData.push({
                    img   : that.format(e.img_src) === '暂无' ? defaultSwipe : that.format(e.img_src),
                    title : e.subtitle,
                    url   : e.m_url
                  });
                });
              }
            }
          },res => {
            console.log('网络出了点问题');
          });
        },
        // 相册
        getPhoto(){
          const that = this;
          that.$axios({
            method:'post',
            url:that.requestURL.photo,
            params:{
              page     : 1,
              PageSize : 6,
              orgid    : that.$store.state.orgId,
              imgtype  : 7                    //除了轮播图以外的所以图片
            }
          }).then(res => {
            const data = res.data;
            if( (data.error>>0) === 0 ){
              const _data = data.datArr.rows;
              if( _data.length > 0 ){
                _data.forEach( (e,i) => {
                  // let imgReturn=that.picRealSize(window.location.origin+e.img_src);
                  that.photo.push({
                    index  : that.photo.length,
                    src    : e.img_src === null || e.img_src === '' ? '' : e.img_src,
                    msrc   : e.img_src === null || e.img_src === '' ? '' : e.img_src,
                    alt    : e.remark,
                    // width  : imgReturn.w,
                    // height : imgReturn.h
                  });
                });
              }
            }
          },res => {
            console.log('网络出了点问题');
          });
        },
        picRealSize(_imgSrc){  //_img地址
          let real_width,
              real_height,
              img  = document.createElement('img');
          img.src = _imgSrc;
          real_width  = img.width;
          real_height = img.height;
          return {w:real_width,h:real_height,src:_imgSrc}
        },
        randpic(){            
            let num=Math.round(Math.random()*4);
            return this.randImg[num]
        }
      },
      mounted(){
        const that = this;

        
        if(that.$store.state.orgId==that.zhejiangID){
            that.requestURL.event=that.requestURL.zhejiangEvent;
            that.navImg=[
                {src:event_img,name:'赛事',path:'event',floor:1},
                {src:news_img,name:'资讯',path:'news',floor:1},            
                {src:photo_img,name:'相册',path:'album',floor:1},
                {src:recruit_img,name:'招聘',path:'recruit',floor:1},
            ]
            that.zjFlag=false;
        }else if(that.$store.state.orgId==that.$store.state.guangdongID){
            that.requestURL.event=that.requestURL.guangongEvent;
            that.navImg=[
                {src:event_img,name:'赛事',path:'event',floor:1},
                {src:class_img,name:'培训',path:'course',floor:1},
                {src:news_img,name:'资讯',path:'news',floor:1},            
                {src:photo_img,name:'相册',path:'album',floor:1},
                {src:recruit_img,name:'关于我们',path:'recruit',floor:1},
            ]
            //console.log(that.$store.state.guangdongID)
        }

        that.getSwipe();
        that.getHeaderOpacity();
        that.getOrgDetail();
        that.getSignEvent();
        // that.getRecentEvent();
        that.getCoureseEvent();
        that.getNews();
        that.getTeacher();
        that.getPhoto();

      }
    }
</script>
<style scoped>
    #org-home .scroll-part{
        position: relative;
    }
    #org-home{
        position:relative;
        margin-bottom:1.1rem;
    }
    #org-home > header{
        line-height:0;
        overflow: hidden;
        z-index:100;
        width:100%;
        max-width:7.5rem;
        height:1.1rem;
        text-align:center;
        position:fixed;
    }
    #org-home > header .header-img{
        background:#fff;
        width:0.6rem;
        height:0.6rem;
        margin:0 auto;
        -webkit-border-radius:50%;
        -moz-border-radius:50%;
        border-radius:50%;
    }
    #org-home .head-swipe.mint-swipe{
        height:3.84rem;
    }
    #org-home .head-swipe.mint-swipe img{
        width:100%;
        height:100%;
    }
    #org-home .header-icon{
        width:1.32rem;
    }
    #org-home .header-icon{
        margin-top:0.25rem;
    }
    #org-home .header-icon img{
        margin-top:0.08rem;
        width:0.4rem;
    }
    #org-home .search-item{
        position:relative;
    }
    #org-home .search-img{
        width:0.4rem;
        position:absolute;
        top:0.32rem;
        right:0.3rem;
        z-index:1;
    }
    #org-home .header-search{
        background:#c90909;
        border:none;
        height:0.6rem;
        -webkit-border-radius:0.3rem;
        -moz-border-radius:0.3rem;
        border-radius:0.3rem;
        width:4.44rem;
        display:block;
        margin-top:0.24rem;
        outline:none;
        color:#fff;
        padding-left:0.4rem;
    }
    /* 轮播 */
    #org-home .head-swipe .mint-swipe-item .swipe-title{
        font-size:0.28rem;
        position:absolute;
        bottom:0.1rem;
        width:5.65rem;
        padding:0 1.55rem;
        -ms-text-overflow: ellipsis;
        text-shadow: 1px 0 1px #000;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin: 0 auto;
        color:#fff;
        background:rgba(0,0,0,0.1);
    }
    /* nav 信息 */
    #org-home  > nav{
        position:relative;
        background:#fff;
        padding-bottom:0.48rem;
        margin-bottom:0.1rem;
    }
    #org-home  > nav .org-head-img{
        width:1.2rem;
        height:1.2rem;
        -webkit-border-radius:50%;
        -moz-border-radius:50%;
        border-radius:50%;
        border:0.04rem solid #c90909;
        background:#bababa;
        position:absolute;
        top:-0.6rem;
        left:0.3rem;
        overflow:hidden;
    }
    #org-home  > nav .org-head-img img{
        font-size:0.24rem;
        width:100%;
    }
    #org-home  > nav .org-name{
        font-size:0.32rem;
        font-weight: bold;
        color:#333;
        padding:0.3rem 0 0.3rem 2rem;
        border-bottom:0.02rem solid #ccc;
        margin:0;
    }
    #org-home  > nav .org-nav-img{
        height:2rem;
        width:7.5rem;
        position:relative;
    }
    #org-home  > nav .org-nav-img .org-nav-img-item{
        float:left;
        width:1.875rem;
        margin-top:0.48rem;
    }
    #org-home  > nav .org-nav-img .org-nav-img-item p{
        font-size:0.24rem;
        margin:0;
    }
    #org-home  > nav .org-nav-img .org-nav-img-item img{
        width:1.2rem;
        display:block;
        margin:0 auto;
    }
    /* 公告 */
    #org-home .notice{
        margin:0 auto 0.2rem auto;
        width:7.2rem;
        padding-bottom:0.1rem;
        overflow:hidden;
    }
    #org-home .notice .notice-title{
        font-size:0.42rem;
        font-weight:bold;
        position:relative;
        padding:0.1rem;
        margin:0 0.1rem;
        border-bottom:0.02rem solid #ccc;
    }
    #org-home .more-text{
        font-size:0.36rem;
        font-weight:normal;
        position:absolute;
        right:0.2rem;
        bottom:0;
    }
    #org-home .more-text-big{
        right:0.4rem;
    }
    #org-home .more-img{
        width:0.3rem;
        transform:rotate(-180deg);
        -ms-transform:rotate(-180deg); 	/* IE 9 */
        -moz-transform:rotate(-180deg); 	/* Firefox */
        -webkit-transform:rotate(-180deg); /* Safari 和 Chrome */
        -o-transform:rotate(-180deg); 	/* Opera */
    }
    #org-home .more-img-big{
        width:0.38rem;
    }
    #org-home .notice .notice-content{
        font-size:0.4rem;
        color:#c90909;
        margin:0.1rem 0;
    }
    #org-home .notice .notice-content span{
        font-size:0.3rem;
        color:#333;
    }
    #org-home .event{
        height:0.8rem;
        padding:0;
        width:100%;
        overflow:hidden;
    }
    /* 赛事 */
    #org-home .event.latest{
        margin-bottom:0;
        padding-bottom:0.2rem;
    }
    #org-home .event .event-title{
        font-size:0.42rem;
        font-weight:bold;
        position:relative;
        padding:0 0 0 0.4rem;
        margin:0;
        z-index:2;
        line-height:0.8rem;
    }
    #org-home .event .bg-ship{
        width:7.5rem;
        position:absolute;
        top:0;
        z-index:1;
    }
    #org-home .event-content{
        width:7.02rem;
        background:#fff;
        margin:0 auto 0.2rem auto;
        border:0.02rem solid #ddd;
        font-size:0.24rem;
        padding-bottom:0.2rem;
        overflow:hidden;
    }
    #org-home .event-content .event-content-img{
        height:2.68rem;
        overflow:hidden;
        position:relative;
    }
    #org-home .event-content .event-content-img p{
        position:absolute;
        width:100%;
        top:1.76rem;
        font-size:0.3rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding:0.1rem 0 0.1rem 0.1rem;
        color:#fff;
        background:rgba(33,33,33,0.4);
    }
    #org-home .event-content .event-content-img img{
        width:100%;
        height:100%;
    }
    #org-home .event-content .event-content-info{
        padding:0.2rem 0.2rem 0 0;
    }
    #org-home .event-content .event-content-info img{
        width:0.6rem;
    }
    #org-home .event-content .event-content-info div:nth-child(2n+1){
        float:left;
    }
    #org-home .event-content .event-content-info div:nth-child(2n){
        float:right;
    }
    #org-home .event-content .event-detail{
        position:relative;
        color:#666;
        top:-0.32rem;
    }
    #org-home .event-content .rmb{
        font-weight:bold;
        color: #9a9a9a;
    }
    #org-home .event-content .rmb-detail{
        font-size:0.36rem;
        color:#c90909;
        font-weight:bold;
    }
    #org-home .event-content .num-detail{
        background:#c90909;
        display:inline-block;
        width:0.4rem;
        line-height:0.4rem;
        color:#fff;
        padding:0.1rem;
        margin-right:0.12rem;
        -webkit-border-radius:50%;
        -moz-border-radius:50%;
        border-radius:50%;
    }
    #org-home .event-content .address-detail{
        display:inline-block;
        width:4.28rem;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow:hidden;
        white-space:nowrap;
        top:-0.26rem;
    }
    /* 最新赛事 */
    #org-home .latest-event{
        width:21.36rem;
        overflow:hidden;
        background:#fff;
        margin-bottom:0.2rem;
    }
    #org-home .latest-event .event-state{
        position:absolute;
        font-size:0.24rem;
        color:#fff;
        width:0.24rem;
        display:block;
        right:0.3rem;
        padding:0.04rem 0.1rem;
    }
    #org-home .latest-event .event-state.event-state-gray {
        background:#999;
    }
    #org-home .latest-event .event-state.event-state-blue {
        background:#0585e4;
    }
    #org-home .latest-event .event-state.event-state-red {
        background:#c90909;
    }
    #org-home .latest-event article{
        width:3.36rem;
        height:4rem;
        float:left;
        margin:0 0.2rem;
    }
    #org-home .latest-event article .event-content-info p{
        font-size:0.28rem;
        margin:0.1rem 0 0 0.1rem;
        overflow:hidden;
        -ms-text-overflow:ellipsis;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    #org-home .latest-event article .event-content-info img{
        width:0.6rem;
        position:absolute;
        left:-0.12rem;
    }
    #org-home .latest-event article .event-content-info .event-detail{
        font-size:0.24rem;
        overflow:hidden;
        -ms-text-overflow:ellipsis;
        text-overflow:ellipsis;
        white-space:nowrap;
        width:3rem;
        color:#666;
    }
    #org-home .latest-event article .event-content-info .info{
        position:relative;
        height:0.6rem;
    }
    #org-home .latest-event article .event-content-info .info .event-detail{
        position:absolute;
        top:0.04rem;
        color:#666;
        left:0.5rem;
    }
    #org-home .latest-event .latest-event-content-img{
        height:2rem;
        position:relative;
        margin-bottom:0.2rem;
    }
    #org-home .latest-event .latest-event-content-img img{
        width:100%;
        height:100%;
    }
    #org-home .news{
        background:#fff;
        font-size:0.24rem;
        overflow:hidden;
        margin-bottom:0.08rem;
        /*border-bottom:0.04rem solid #ddd;*/
    }
    #org-home .news .news-left,#org-home .news .news-right{
        float:left;
    }
    #org-home .news .news-left{
        width:2.2rem;
        height:2.2rem;
        overflow:hidden;
    }
    #org-home .news .news-left img{
        display:block;
        margin:0.2rem auto;
        width:1.8rem;
        height:1.8rem;
        -webkit-border-radius:0.16rem;
        -moz-border-radius:0.16rem;
        border-radius:0.16rem;
    }
    #org-home .news .news-right{
        width:4.9rem;
        padding-right:0.4rem;
    }
    #org-home .news .news-right-no-img{
        margin-left:0.2rem;
        width:6.9rem;
    }
    #org-home .news .news-right .news-title{
        padding:0.5rem 0 0.2rem 0;
        font-size:0.3rem;
        border-bottom:0.02rem solid #ddd;
        font-weight:bold;
        display:block;
        position:relative;
    }
    #org-home .news .news-right .news-title span{
        position:absolute;
        top:0.2rem;
    }
    #org-home .news .news-right .news-title span:last-child{
        width:4.2rem;
        left:0.7rem;
        display:inline-block;
        overflow:hidden;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space:nowrap;
    }
    #org-home .news .news-right .news-title .type{
        background:#c90909;
        color:#fff;
        font-size:0.24rem;
        padding:0.02rem 0.06rem;
    }
    #org-home .news .news-right img{
        width:0.6rem;
    }
    #org-home .news p{
        margin:0;
        position:relative;
    }
    #org-home .news p span{
        position:relative;
        top:-0.3rem;
        color:#666;
    }
    #org-home .news .news-brief{
        margin:0.1rem 0;
        height:0.7rem;
        color:#666;
    }
    #org-home .more-news{
        background:#fff;
        font-size:0.3rem;
        color:#c90909;
        padding:0.2rem 0;
        margin-bottom:0.2rem;
    }
    #org-home .teacher-view{
        background:#fff;
        width:20.16rem;
        overflow:hidden;
        margin-bottom:0.2rem;
    }
    #org-home .teacher{
        /*width:3.36rem;*/
        width:3.5rem;
        height:3.6rem;
        position:relative;
        margin-bottom:0.2rem;
        margin-left: 0.05rem;
        /*margin-right: 0.2rem;*/
        float:left;
        color:#333;
    }
    #org-home .teacher .head{
        margin: 0.4rem auto;
        display:block;
        width:1.8rem;
        height:1.8rem;
        border:0.02rem solid #c90909;
        -webkit-border-radius:50%;
        -moz-border-radius:50%;
        border-radius:50%;
        position:relative;
        z-index:2;
    }
    #org-home .teacher .bg{
        width:100%;
        position:absolute;
        top:0;
        left:0;
    }
    #org-home .teacher .name{
        position:relative;
        z-index:2;
        font-size:0.32rem;
    }
    #org-home .teacher .name span{
        color:#c90909;
        font-size:0.3rem;
    }
    .photo-view{
        width:19.2rem;
        height:3rem;
        margin-bottom: 0.2rem;
    }
    #org-home .photo{
        float:left;
        width:3.3rem;
        height:3rem;
        font-size:0.24rem;
        margin:0 0.2rem;
    }
    #org-home .photo img{
        width:100%;
        height:100%;
    }
    #org-home .link{
        font-size:0.42rem;
        margin:0;
        font-weight:bold;
        padding: 0 0 0 0.4rem;
        line-height:0.8rem;
    }
    #org-home .home-bottom{
        font-size:0.28rem;
        position:relative;
        overflow:hidden;
    }
    #org-home .icon{
        width:0.6rem;
    }
    #org-home .home-bottom .bg-bottom{
        width:100%;
        position:absolute;
        top:0;
        z-index:-1;
    }
    #org-home .home-bottom p{
        margin:0;
        overflow:hidden;
        height:0.6rem;
        position:relative;
        margin-left: 0.08rem;
    }
    #org-home .home-bottom p:first-child{
        margin-top:0.12rem;
    }
    #org-home .home-bottom p span{
        position:absolute;
        overflow:hidden;
        -ms-text-overflow:ellipsis;
        text-overflow:ellipsis;
        white-space:nowrap;
        width:6.6rem;
    }
    #org-home .photo-watcher{
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.88);
        position:fixed;
        top:0;
        z-index:99999;
    }
    #org-home .photo-watcher .photo-watcher-img{
        width:95%;
        margin:1rem auto;
    }
    #org-home .photo-watcher .photo-watcher-remark{
        color:#fff;
        font-size:0.3rem;
        text-align:left;
        margin-left:0.2rem;
    }
    #org-home .event-detail-p{
        min-width: 180px;
    }
</style>
