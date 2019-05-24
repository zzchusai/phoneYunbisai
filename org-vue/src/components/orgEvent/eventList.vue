<template>
  <div id="orgEvent">
    <nav :class="{'is-fixed':isFixed}">
        <div class="type-nav">
            <div class="typeFilter">
              <swiper :options="swiperOption" ref="mySwiper" >
                <swiper-slide v-for="item in eventStatus" :key="item.value" >
                   <span :class="{active:item.value === selected.value}" class="typeName" @click="chooseType(item.value)">{{item.name}}</span>
                </swiper-slide>
              </swiper>
            </div>
            <img src="./../../assets/img/search-red.png"
                 alt="filter"
                 @click="$router.push('/search'+'?orgid='+$store.state.orgId)">
        </div>
    </nav>
    <div class="container" v-infinite-scroll="loadMore"
             :infinite-scroll-disabled="loading"
             :infinite-scroll-distance="bottomHei">
         <!-- <mt-cell v-for="redata of redatas" :key="redata.event_id" :to="'//m.yunbisai.com/eventFeatures/eventDetail-'+redata.event_id+'.html'" is-link class="thumbnail" > -->
         <mt-cell v-for="redata of redatas" :key="redata.event_id" :to="'//m.yunbisai.com/eventFeatures/eventDetail-'+redata.event_id+'.html'" class="thumbnail" >
          <div class="row eventPart">
            <img class="eventLogo" :src="redata.eventlogo" :onerror="defaultPic" alt="赛事logo" v-show="redata.eventlogo" style="">
            <div class="col-xs-9 eventProfile" style="padding: 0.2rem 0.28rem 0.16rem 0.28rem;">
              <h4 class="eventTitle">{{redata.title}}</h4>
              <p class="eventPublisher" style="">发布方：{{redata.cname}}</p>
              <p class="eventTime">比赛时间：{{redata.time}}</p>
              <ul class="eventIcons list-inline">
                <li><img src="//g.yunbisai.com/img/event/follow.png" alt="关注数量"><span style="">{{redata.hit}}</span></li>
                <!-- <li><img src="//g.yunbisai.com/img/event/comment.png" alt="评论数量"><span id="sourceId::event_2584" class="cy_cmt_count"></span></li> -->
                <li v-if="redata.isentry"><img src="//g.yunbisai.com/img/event/eventreg.png" alt="赛事人数"><span>{{redata.pay_num}}</span></li>
                <li v-else><img src="//g.yunbisai.com/img/event/eventreg.png" alt="赛事人数"><span>{{redata.play_num}}</span></li>
              </ul>
            </div>
            <div class="eventPlace">
              <p class="eventProvince">{{redata.provincename}}</p>
              <p class="provincialLevel">{{redata.city_name}}</p>
            </div>
            <img class="eventState" :src="redata.stateImg" alt="赛事状态">
          </div>
        </mt-cell>
    </div>
    <div class="text-center no-more-show"
           v-if="totalPage <= currentPage">
          <img src="./../../assets/img/no_more.png" alt="no-more">
          <p>没有更多了</p>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      defaultPic:"this.src='"+this.$store.state.base_uri_prefix+"g.yunbisai.com/img/event/def_event.png'",
      popupVisible:false,
      cdata:{
        //event_id:'2584',
        //eventlogo:'//m.yunbisai.com/uploadfiles/event/event_2584/eventAdv1505646660.jpg',
        showImg:'',
        //title:'2017年秋季南通市围棋级位赛',
      },
      redatas:[],
      selected:{value:''},
      eventType : [
          {name:'全部',value:''},
          {name:'围棋',value:2},
          {name:'象棋',value:1},
          {name:'国际象棋',value:4},
          {name:'国际跳棋',value:8},
          {name:'五子棋',value:16},
          {name:'扑克',value:32},
      ],
      eventOrder:[
          {name:'发布日期',value:1},
          {name:'参与人数',value:2},
          {name:'浏览量',value:4},
          {name:'报名费',value:16},
      ],
      eventStatus:[
          {name:'全部',value:''},
          {name:'筹备中',value:1},
          {name:'报名中',value:2},
          {name:'比赛中',value:4},
          {name:'已结束',value:8},
      ],
      month:[
          {name:'近一个月',value:1},
          {name:'近三个月',value:3},
          {name:'近半年',value:6},
          {name:'近一年',value:12},
      ],
      nameNumberType:[
          {name:'50人以下',value:32},
          {name:'50-100人',value:16},
          {name:'100-300人',value:8},
          {name:'300-500人',value:4},
          {name:'500-1000人',value:2},
          {name:'1000人以上',value:1},
      ],
      eventScale:[
          {name:'国际',value:1},
          {name:'全国',value:2},
          {name:'省级',value:4},
          {name:'县市级',value:8},
          {name:'地市级',value:32},
      ],
      select_term:{
        eventType:{name:'全部',value:''},
        eventOrder:{name:'全部',value:''},
        eventStatus:{name:'全部',value:''},
        month:{name:'全部',value:''},
        nameNumberType:{name:'全部',value:''},
        eventScale:{name:'全部',value:''},
      },
      isFixed: false,
      loading: false,
      bottomHei: 0,
      type: 63,
      currentPage: 1,
      totalPage: 0,
      pageSize: 6,
      filter: false,
      swiperOption: {
         // paginationClickable :false,
         slidesPerView : 5,
         // spaceBetween : 10,
      },
      zhejiangID:'321',
      eventUrl:'/request/Event/Eventlist',
      zhejiangEvent:'request/Org/OrgMsEventList',
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
          that.loading = true;
          that.currentPage ++;
          that.eventList();
        }
    },
    confirmFilter(){
        const that = this;
        // that.selected.news.name   = that.select_term.news.name;
        // console.log(that.select_term)
        that.filter = false;
        that.redatas = [];
        that.eventList();
    },
    resetFilter(){
        const that = this;
        that.select_term = {
            eventType:{name:'全部',value:''},
            eventOrder:{name:'全部',value:''},
            eventStatus:{name:'全部',value:''},
            month:{name:'全部',value:''},
            nameNumberType:{name:'全部',value:''},
            eventScale:{name:'全部',value:''}
        };
        that.selected = {name:'全部',value:''};
    },   
    chooseType(value){
        const that = this;
        // if(type==='eventType'){
            // that.selected.name = name;
            that.selected.value = value;
        // }
        // that.select_term[type].value = value;
        // that.select_term[type].name = name;
        that.currentPage = 1;
        // that.filter = false;
        that.redatas = [];
        that.eventList();
    },
    // 滚动筛选区域
    scrollFilterFix(){
        const that = this;
        const rootSize = parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0])['font-size']);
        const navHeight = rootSize * 1;
        that.isFixed =  document.documentElement.scrollTop >= navHeight || document.body.scrollTop >= navHeight;
        that.bottomHei = rootSize * 1.1;
    },
    eventStatueArr(max_time,min_time,r_max_time,r_min_time){
        //返回赛事状态
        if(!max_time || !max_time || !r_max_time || !r_min_time) return '//g.yunbisai.com/img/event/prepareing.png';

        Date.prototype.format = function(format) {
            let o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                S: this.getMilliseconds()
            };
            /(y+)/.test(format) && (format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let k in o)
                new RegExp("(" + k + ")").test(format) && (format = format.replace(RegExp.$1, 1 == RegExp.$1.length ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)));
            return format
        }

        max_time = new Date(...max_time.split(','));
        min_time = new Date(...min_time.split(','));
        r_max_time = new Date(...r_max_time.split(','));
        r_min_time = new Date(...r_min_time.split(','));
        let nowtime =  new Date(new Date().format('yyyy/MM/dd'));
        let stateImg='';
        switch (true){
            case nowtime>=min_time && nowtime<=max_time:
                // sTxt='比赛中';
                // color='#27AE60';
                stateImg='//g.yunbisai.com/img/event/gameing.png';
                break;
            case nowtime>max_time:
                // sTxt='已结束';
                // color='#c4c4c4';
                stateImg='//g.yunbisai.com/img/event/gameover.png';
                break;
            case nowtime>=r_min_time  && nowtime<=r_max_time:
                // sTxt='报名中';
                // color='#f0ad4e';
                stateImg='//g.yunbisai.com/img/event/enrolling.png';
                break;
            default:
                // sTxt='未进行';
                // color='#2980B9';
                stateImg='//g.yunbisai.com/img/event/prepareing.png';
                break;
        }
        // return {"Txt":sTxt,"color":color,"stateImg":stateImg};
        return stateImg
    },    
    eventTime(min_time,max_time,type){
        Date.prototype.dateDiff = function(interval, objDate2) {
            let d = this
              , i = {}
              , t = d.getTime()
              , t2 = objDate2.getTime();
            return i.y = objDate2.getFullYear() - d.getFullYear(),
            i.q = 4 * i.y + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4),
            i.m = 12 * i.y + objDate2.getMonth() - d.getMonth(),
            i.ms = objDate2.getTime() - d.getTime(),
            i.w = Math.floor((t2 + 3456e5) / 6048e5) - Math.floor((t + 3456e5) / 6048e5),
            i.d = Math.floor(t2 / 864e5) - Math.floor(t / 864e5),
            i.h = Math.floor(t2 / 36e5) - Math.floor(t / 36e5),
            i.n = Math.floor(t2 / 6e4) - Math.floor(t / 6e4),
            i.s = Math.floor(t2 / 1e3) - Math.floor(t / 1e3),
            i[interval]
        }

        if(!max_time || !min_time) return '';
        max_time = new Date(...max_time.split(','));
        min_time = new Date(...min_time.split(','));
        let dataTime='',residualTime='',nowtime = new Date();
        // console.log(min_time)
        switch (true){
            case min_time.dateDiff('y',max_time)>0:
                dataTime = min_time.format("yyyy年MM月dd日") + "-" + max_time.format("yyyy年MM月dd日");
                break;
            case min_time.dateDiff('m',max_time)>0:
                dataTime = min_time.format("yyyy年MM月dd日") + "-" + max_time.format("MM月dd日");
                break;
            case min_time.dateDiff('d',max_time)>0:
                dataTime = min_time.format("yyyy年MM月dd日") + "-" + max_time.format("dd日");
                break;
            default:
                dataTime = min_time.format("yyyy年MM月dd日");
                break;
        }
        let _arr = {y:'年',m:'月',w:'周'},_tempTime = nowtime.dateDiff('d',type?max_time:min_time);
        // let _arr = {y:'年',m:'月',w:'周'},_tempTime = nowtime.dateDiff('d',min_time);
        if(_tempTime>0){
            if(_tempTime<7){
                residualTime ='剩'+(_tempTime+1) + '天';
            }else if (_tempTime<30){
                residualTime ='剩'+parseInt(_tempTime/7) + '周';
            }else{
                for (let key in _arr){
                    _tempTime = nowtime.dateDiff(key,type?max_time:min_time);
                    // _tempTime = nowtime.dateDiff(key,min_time);
                    if (_tempTime>0){
                        residualTime ='剩'+_tempTime +_arr[key];
                        break;
                    }
                }
            }
        }
        return dataTime + " " + residualTime;
    },
    timeFormat(str){
      if(str && str.length){
        str=str.slice(0,10).replace(/-|:| /g,',');
        let arr=str.split(',')
        str=arr[0]+','+(arr[1]-0-1)+','+arr[2];
        return str
      }
    },
    eventList(){
        const that = this;
        that.$axios({
            method:"get",
            url:that.eventUrl,
            params:{
                page:that.currentPage,
                PageSize:that.pageSize,
                // eventOrder:that.select_term.eventOrder.value,
                eventStatus:that.selected.value,
                // eventType:that.select_term.eventType.value,
                // eventScale:that.select_term.eventScale.value,
                // month:that.select_term.month.value,
                // nameNumberType:that.select_term.nameNumberType.value,
                orgid:that.$store.state.orgId
            },
        }).then(response => {
            if(response.data.error==0){
                for (let v of response.data.datArr.rows){
                    if(v.eventlogo){
                        v.eventlogo=v.eventlogo
                    }
                    !v.play_num?v.play_num=0:0;
                    !v.pay_num?v.pay_num=0:0;
                    v.isentry= (v.isentry-0 == true)
                    v.stateImg=that.eventStatueArr(that.timeFormat(v.max_time),that.timeFormat(v.min_time),that.timeFormat(v.r_max_time),that.timeFormat(v.r_min_time));
                    v.time=that.eventTime(that.timeFormat(v.min_time),that.timeFormat(v.max_time))
                    // v.time=that.eventTime(v.min_time,v.max_time)
                    Object.assign(v,that.cdata);
                    that.redatas.push(v)
                }

                that.totalPage = response.data.datArr.total;
                that.loading = true;
            }
        })
    }
  },
  mounted(){
    const that = this;
    if(that.$store.state.orgId==that.zhejiangID){
        that.eventUrl=that.zhejiangEvent;
    }
    let type=that.$route.query.type
    if(type){
        that.selected.value=type-0
    }

    that.eventList();
    window.addEventListener('scroll',that.scrollFilterFix);
  }
}
</script>
<style>
    ul, li {
        margin: 0;
        padding: 0;
    }
    #orgEvent{
        /*margin-top: 2.1rem;*/
        margin-bottom:1.3rem;
    }
    .list-inline {
        padding-left: 0;
        margin-left: -5px;
        list-style: none;
    }
    .list-inline>li {
        display: inline-block;
    }
    #orgEvent .btn{
      margin-top: 10px;
    }
    #orgEvent .thumbnail{
        border-color: #ddd;
        padding: 0px;
        border-radius: 12px;
        margin: 0.1rem 0.28rem 0 0.28rem;
    }
    #orgEvent .eventLogo {
        width: 100%;
        height: 2.34rem;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }
    #orgEvent .eventProfile{
        width: 75%;
        overflow-x: hidden;
        box-sizing: border-box;
    }
    #orgEvent .eventPart {
        position: relative;
        overflow-x: hidden;
        width: 100%;
    }
    #orgEvent .eventTitle {
        font-size: 0.26rem;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0 0 0.15rem 0;
    }
    #orgEvent .eventPublisher {
        margin: 0 0 0.15rem 0;
        font-size: 0.24rem;
        color: #797979;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    #orgEvent .eventTime {
        font-size: 0.24rem;
        color: #797979;
        margin: 0 0 0.15rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 90%;
    }
    #orgEvent .eventIcons {
        margin-left: 0;
    }
    #orgEvent .eventIcons img {
        width: 0.3rem;
    }
    #orgEvent .eventIcons span {
        padding-left: 3px;
        color: #999;
        font-size: 0.22rem;
        vertical-align: middle;
    }
    #orgEvent .eventPlace {
        border: 1px solid #99C8FF;
        border-radius: 8px;
        background-color: #fff;
        position: absolute;
        bottom: 0.16rem;
        right: 0.28rem;
    }
    #orgEvent .eventProvince {
        background-color: #DAEBFF;
        text-align: center;
        color: #666;
        margin: 0;
        padding: 0.05rem 0.18rem;
        font-size: 0.24rem;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    #orgEvent .provincialLevel {
        color: #999;
        text-align: center;
        margin: 0;
        padding: 0.03rem 0.18rem;
        font-size: 0.18rem;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    #orgEvent .eventState {
        position: absolute;
        top: 0.1rem;
        right: 0.18rem;
        width: 1.33rem;
        height: 0.78rem;
    }
    #orgEvent .eventIcons li {
        width: 30%;
        text-align: left;
        padding: 0;
    }
    .thumbnail {
        display: block;
        padding: 4px;
        margin-bottom: 20px;
        line-height: 1.42857143;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        -webkit-transition: border .2s ease-in-out;
        -o-transition: border .2s ease-in-out;
        transition: border .2s ease-in-out;
    }
    #orgEvent .mint-cell-wrapper{
        padding: 0;
    }
    #orgEvent .mint-cell-wrapper .mint-cell-title{
        display: none;
    }
    #orgEvent .mint-cell-value{
       overflow-x: hidden;
       width: 100%;
    }
    #orgEvent .no-more-show img{
        width:2rem;
    }
    #orgEvent .no-more-show p{
        font-size:0.28rem;
        margin:0 0 0.1rem 0;
        color:#999;
    }
    #orgEvent .filter-container{
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
    #orgEvent .slide-mask{
        width:7.5rem;
        background:rgba(0,0,0,0.5);
        height:100%;
        position:fixed;
        z-index:99990;
        top:0;
    }
    #orgEvent .slide-wrap {
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
    #orgEvent .slide-wrap.slide-wrap-moving{
        right:0;
    }
    #orgEvent .slide-wrap .slide-container{
        font-size:0.3rem;
    }
    #orgEvent .slide-wrap .slide-container ul{
        text-decoration:none;
        list-style:none;
        text-align:center;
        padding:0;
        margin:0.2rem 0;
    }
    #orgEvent .slide-wrap .slide-container ul li {
        width:2rem;
        height:0.6rem;
        line-height:0.6rem;
        margin:0.2rem auto;
        -webkit-border-radius:0.3rem;
        -moz-border-radius:0.3rem;
        border-radius:0.3rem;
        color:#666;
    }
    #orgEvent .slide-wrap .slide-container ul li.active{
        background:#c90909;
        color:#fff;
    }
    #orgEvent .slide-wrap .slide-container .slide-title{
        margin:0;
        height:0.8rem;
        line-height:0.8rem;
        font-size:0.36rem;
        color:#000;
        background:#dcdcdc;
    }
    #orgEvent nav.is-fixed{
        position:fixed;
        top:1rem;
        width:7.5rem;
    }
    #orgEvent .nav.mint-navbar{
        margin:0;
    }
    #orgEvent nav{
        background:#fff;
        width:100%;
        height:0.8rem;
        overflow:hidden;
        top:1rem;
        z-index:50;
    }
    #orgEvent .container{
        overflow:hidden;
    }
    #orgEvent .type-nav{
        position:relative;
        width:100%;
        height:0.8rem;
        line-height:0.8rem;
        margin-left:0.3rem;
        font-size:0.3rem;
        color:#c90909;
    }
    #orgEvent .type-nav span img{
        width:0.3rem;
        position:relative;
        top:0.04rem;
        left:0.03rem;
    }
    #orgEvent .type-nav > img{
        position:absolute;
        top:0.16rem;
        width:0.4rem;
        right:0.6rem;
    }
    #orgEvent .slide-wrap.slide-wrap-moving {
        right: 0;
        overflow: auto;
    }
    #orgEvent .slide-wrap .slide-container footer{
        position:fixed;
        bottom:0;
        z-index:100;
        width:5.5rem;
    }
    #orgEvent .slide-wrap .slide-container .filterDiv{
      height: 0.8rem;
    }
    #orgEvent .slide-wrap .slide-container .filterDiv div{
        width:50%;
        float:left;
        text-align:center;
        /*position:fixed;*/
        bottom:0;
        background:#efefef;
        height:0.8rem;
        line-height:0.8rem;
    }
    #orgEvent .slide-wrap .slide-container .options{
        /*margin-bottom:1rem;*/
    }
    #orgEvent .slide-wrap .slide-container .filterDiv div:last-child{
        left:50%;
        color:#fff;
        background:#c90909;
    }
    #orgEvent .type-nav .typeFilter{
      width: 6rem;
      overflow: hidden;
      color: #333;
    }
    #orgEvent .type-nav .typeFilter .active{
      color: #c90909;
    }
    #orgEvent .type-nav .typeFilter .typeName{
      display: inline-block;
      width: 100%;
    }
</style>
