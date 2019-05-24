<template>
    <div id="teacherList">
        <nav :class="{'is-fixed':isFixed}">
            <div class="type-nav">
                <div class="typeFilter">
                  <swiper :options="swiperOption" ref="mySwiper" >
                    <swiper-slide v-for="item in teacherType" :key="item.value" >
                       <span :class="{active:item.value === selected.value}" class="typeName" @click="chooseType(item.value)">{{item.name}}</span>
                    </swiper-slide>
                  </swiper>
                </div>
                <img src="./../../assets/img/search-red.png"
                     alt="filter"
                     @click="$router.push('/search'+'?orgid='+$store.state.orgId)">
            </div>
        </nav>
        <div class="container"
             v-infinite-scroll="loadMore"
             :infinite-scroll-disabled="loading"
             :infinite-scroll-distance="bottomHei">
            <article class="teachers"
                     v-for="item in teachers"
                     @click="toTeacherDetail(item.id)">
                <div class="left">
                    <div class="img">
                        <img :src="item.img"
                             :onerror="defaultTeacher"
                             alt="头像">
                    </div>
                </div>
                <div class="right">
                    <p>
                        <span class="name">{{item.name}}</span>
                        <span class="title" v-if="item.type">{{item.type}}</span>
                        <span class="title" v-if="item.title">{{item.title}}</span>
                    </p>
                    <p class="intro">
                        {{item.intro}}
                    </p>
                </div>
            </article>
            <div class="text-center no-more-show"
                 v-if="totalPage <= currentPage || teachers.length === 0">
                <img src="./../../assets/img/no_more.png" alt="no-more">
                <p>没有更多了</p>
            </div>
        </div>
        <!-- <div class="my-slide">
            <div class="slide-wrap"
                 :class="{'slide-wrap-moving':filter}">
                <div class="slide-container">
                    <p class="text-center slide-title">类型筛选</p>
                    <ul>
                        <li v-for="item in teacherType"
                            class="text-center"
                            :class="{active:item.value === selected.value}"
                            @click="chooseType(item.name,item.value)">{{item.name}}</li>
                    </ul>
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
        teachers    : [],
        defaultTeacher:'this.src="' + require('./../../assets/img/default_head.png') + '"' ,
        isFixed     : false,
        loading     : false,
        bottomHei   : 0,
        type        : 63,
        currentPage : 1,
        totalPage   : 0,
        pageSize    : 6,
        filter      : false,
        teacherType : [
          {name:'全部',value:''},
          {name:'围棋',value:2},
          {name:'象棋',value:1},
          {name:'国际象棋',value:4},
          {name:'国际跳棋',value:8},
          {name:'五子棋',value:16},
          {name:'扑克',value:32},
        ],
        selected:{value:''},
        imgURL:'',
        swiperOption: {
           // paginationClickable :false,
           slidesPerView : 4.3,
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
      chooseType(value){
        const that = this;
        // that.selected.name = name;
        that.selected.value = value;
        that.type = value;
        that.currentPage = 1;
        that.filter = false;
        that.teachers = [];
        that.getTeacherList();
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
          that.loading = true;
          that.currentPage ++;
          that.getTeacherList();
        }
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
      // 类型
      getType(type){
        type = type >> 0;
        let name = '';
        this.teacherType.forEach( (e,i) => {
          if( e.value === type ){
            name = e.name;
            return false;
          }
        });
        return name;
      },
      // 筛选
      filterType(){
        this.filter = true;
      },
      filterHide(){
        this.filter = false;
      },
      // 限制长度
      setContent(data){
        if(typeof data !== 'string') return '暂无';
        const max = 30;
        const _data = data.replace(/<[^>]+>/g,"");
        return _data.substring(0,max) + ( _data.length < max ? '' : '...' );
      },
      // 滚动筛选区域
      scrollFilterFix(){
        const that = this;
        const rootSize = parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0])['font-size']);
        const navHeight = rootSize * 1;
        that.isFixed =  document.documentElement.scrollTop >= navHeight || document.body.scrollTop >= navHeight;
        that.bottomHei = rootSize * 1.1;
      },
      // 获取列表
      getTeacherList(){
        const that = this;
        that.$axios({
          method:'post',
          url:'request/Org/TeacherList',
          params:{
            type     : that.type,
            page     : that.currentPage,
            PageSize : that.pageSize,
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
                  img   : that.format(e.logo) === '暂无' ? '' :  that.format(e.logo),
                  intro : that.format(that.setContent(e.remark)),
                  type  : that.getType(that.format(e.type)),
                });
              });
              that.totalPage = ( (data.datArr.TotalRecord / that.pageSize) >> 0 ) + 1;
              that.loading = true;
            }
          }
        },res => {
          console.log('网络出了点问题');
          that.loading = true;
        });
      },
      // 进入 师资详情
      toTeacherDetail(teacherId){
        this.$router.push( '/teachersDetail?teacherid=' + teacherId +'&orgid='+this.$store.state.orgId);
      },
    },
    mounted(){
      const that = this;
      that.getTeacherList();
      window.addEventListener('scroll',this.scrollFilterFix);
    },
    
  }
</script>
<style scoped>
    #teacherList{
        margin-bottom:1.1rem;
    }
    #teacherList nav.is-fixed{
        position:fixed;
        top:1rem;
        width:7.5rem;
    }
    #teacherList .nav.mint-navbar{
        margin:0;
    }
    #teacherList nav{
        background:#fff;
        width:100%;
        height:0.8rem;
        overflow:hidden;
        top:1rem;
    }
    #teacherList .container{
        overflow:hidden;
    }
    #teacherList .type-nav{
        position:relative;
        width:100%;
        height:0.8rem;
        line-height:0.8rem;
        margin-left:0.3rem;
        font-size:0.3rem;
        color:#c90909;
    }
    #teacherList .type-nav span img{
        width:0.3rem;
        position:relative;
        top:0.04rem;
        left:0.03rem;
    }
    #teacherList .type-nav > img{
        position:absolute;
        top:0.16rem;
        width:0.4rem;
        right:0.6rem;
    }
    #teacherList .teachers{
        overflow:hidden;
        background:#fff;
        height:2rem;
        margin:0.16rem 0.2rem 0.06rem 0.2rem;
        border:0.02rem solid #ddd;
    }
    #teacherList .teachers .left{
         float:left;
         width:2rem;
     }
    #teacherList .teachers .right{
        float:left;
        width:5rem;
        font-size:0.28rem;
    }
    #teacherList .teachers .left .img{
        margin:0.2rem auto;
        width:1.38rem;
        height:1.38rem;
        border:1px solid #c90909;
        -webkit-border-radius:50%;
        -moz-border-radius:50%;
        border-radius:50%;
        font-size:0.24rem;
        overflow:hidden;
    }
    #teacherList .teachers .left .img img{
        width:100%;
    }
    #teacherList .teachers .right p{
        margin:0.2rem 0 0 0;
    }
    #teacherList .teachers .right .name{
        font-size:0.36rem;
        color:#333;
        font-weight:bold;
    }
    #teacherList .teachers .right .title{
        font-size:0.3rem;
        color:#c90909;
        font-weight:bold;
        margin-left:0.1rem;
    }
    #teacherList .no-more-show img{
        width:2rem;
    }
    #teacherList .no-more-show p{
        font-size:0.28rem;
        margin:0 0 0.1rem 0;
        color:#999;
    }
    #teacherList .filter-container{
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
    #teacherList  .slide-mask{
        width:7.5rem;
        background:rgba(0,0,0,0.5);
        height:100%;
        position:fixed;
        z-index:99990;
        top:0;
    }
    #teacherList  .slide-wrap {
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
    #teacherList  .slide-wrap.slide-wrap-moving{
        right:0;
    }
    #teacherList  .slide-wrap .slide-container{
        font-size:0.3rem;
    }
    #teacherList  .slide-wrap .slide-container ul{
        text-decoration:none;
        list-style:none;
        text-align:center;
        padding:0;
        margin:0.2rem 0;
    }
    #teacherList  .slide-wrap .slide-container ul li {
        width:2rem;
        height:0.6rem;
        line-height:0.6rem;
        margin:0.2rem auto;
        -webkit-border-radius:0.3rem;
        -moz-border-radius:0.3rem;
        border-radius:0.3rem;
        color:#666;
    }
    #teacherList  .slide-wrap .slide-container ul li.active{
        background:#c90909;
        color:#fff;
    }
    #teacherList  .slide-wrap .slide-container .slide-title{
        margin:0;
        height:0.8rem;
        line-height:0.8rem;
        font-size:0.36rem;
        color:#000;
        background:#dcdcdc;
    }
    #teacherList .type-nav .typeFilter{
      width: 6rem;
      overflow: hidden;
      color: #333;
    }
    #teacherList .type-nav .typeFilter .active{
      color: #c90909;
    }
    #teacherList .type-nav .typeFilter .typeName{
      display: inline-block;
      width: 100%;
    }
</style>
