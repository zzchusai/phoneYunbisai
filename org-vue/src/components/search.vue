<template>
  <div id="search">
      <header>
          <input class="search-input"
                 placeholder=""
                 v-model="keyword"
                 @keyup.enter="search">
          <img class="search-img"
               src="./../assets/img/search-white.png"
               @click="search"
               alt="search">
          <span class="cancel" @click="back">取消</span>
      </header>
      <div class="search-result">
          <div class="event" v-show="event.length">
              <p class="title">赛事</p>
              <a v-for="item in event" :href=" $store.state.base_uri_prefix + 'm.yunbisai.com/eventFeatures/eventDetail-' + item.id + '.html' ">{{item.text}}</a>
          </div>
          <div class="news" v-show="news.length">
              <p class="title">资讯</p>
              <a v-for="item in news"
                 :href=" $store.state.base_uri_prefix + 'm.yunbisai.com/news/' + item.id + '.html' ">{{item.text}}</a>
          </div>
          <div class="chessBook" v-show="chessBook.length">
              <p class="title">棋谱</p>
              <a v-for="item in chessBook" :href=" $store.state.base_uri_prefix + 'm.yunbisai.com/chessBook/'+ item.type +'/' + item.id + '.html' ">{{item.text}}</a>
          </div>
          <div class="train" v-show="train.length">
              <p class="title">课程</p>
              <a v-for="item in train" :href=" $store.state.base_uri_prefix + 'm.yunbisai.com/signUp/course?trainid=' + item.id + '&guid=' + item.guid ">{{item.text}}</a>
          </div>

          <div class="history">
              <p class="title">
                  <span>搜索历史</span>
                  <span class="clear"
                        v-show="history.length"
                        @click="clear">清空记录</span>
              </p>
              <p class="history-item"
                 v-show="!history.length"
                 style="border:none;">暂无搜索记录</p>
              <div class="history-item"
                   @click="searchHistory(decodeURIComponent(item))"
                   v-for="item in history" v-text="decodeURIComponent(item)"></div>
          </div>

          <div class="text-center no-more-show"
               v-show=" !( event.length || news.length || chessBook.length || train.length ) ">
              <img src="./../assets/img/no_more.png" alt="no-more">
              <p>没有更多了</p>
          </div>
      </div>
  </div>
</template>
<script>
	export default{
		data(){
			return {
              orgId     : 0,
              keyword   : '',
              event     : [],
              news      : [],
              chessBook : [],
              train     : [],
              base      : '',
              history   : [],
			}
		},
		methods:{
          encodeUnicode(str) {
            for (var res = [], i = 0; i < str.length; i++){
                res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
            }
            return "\\u" + res.join("\\u")
          },
          searchHistory(item){
            this.keyword = item + '';
            this.search();
          },
          search(){
            const that = this;

            // 记录搜索
            let searchHas = true;
            if(that.keyword==''){
              return ;
            }
            that.history.forEach( (e,i) =>{
              if( e === that.keyword.replace(/\s/g,'') || e === encodeURIComponent(that.keyword.replace(/\s/g,'')) ){
                searchHas = false;
              }
            });
            if( searchHas ) that.history.push( encodeURIComponent(that.keyword.replace(/\s/g,'')) );
            document.cookie = 'search=' + that.history;

            // 查询
            that.$axios({
              url:'request/Org/Search',
              params:{
                type:31,
                limit:5,
                keywords:that.keyword.toLowerCase().replace(/\s/g,''),
                orgid:that.$store.state.orgId
              }
            }).then( res => {
              const data = res.data;
              if( ( data.error>>0 ) === 0 ){

                const _data = data.datArr;
                that.event = [];
                that.news = [];
                that.chessBook = [];
                that.train = [];
                _data.event.forEach( (e,i) => {
                    that.event.push({
                      id   : e.id,
                      text : e.result
                    });
                });
                _data.comment.forEach( (e,i) => {
                  that.news.push({
                    id   : e.id,
                    text : e.result
                  });
                });
                _data.chessbook.forEach( (e,i) => {
                  that.chessBook.push({
                    id   : e.id,
                    text : e.result,
                    type : ( e.gtype >> 0 ) === 2 ? 'Go' : 'ChineseChess',
                  });
                });
                _data.train.forEach( (e,i) => {
                  that.train.push({
                    id   : e.id,
                    text : e.result,
                    guid : e.guid,
                  });
                });
              }else{
                console.log('网络出问题了');
              }
            }, res => {
              console.log('网络出问题了');
            });
          },
          back(){
              const that = this;
              that.$parent.isSearch = window.location.href.indexOf('search') === -1;
              that.$router.go(-1);
          },
          goToDetail(type,id){
            let base = '';
            const that = this;

            if( type === 1 ){
              // 新闻
              window.location.href = that.$store.base_uri_prefix + 'm.yunbisai.com/news/' + id + '.html';
            }else if( type === 2 ){
              // 赛事
              window.location.href = that.$store.base_uri_prefix+ 'm.yunbisai.com/news/' + id + '.html';
            }else if( type === 3 ){
              //
              window.location.href = that.$store.base_uri_prefix + 'm.yunbisai.com/news/' + id + '.html';
            }
          },
          clear(){
            let date = new Date();
            date.setTime( date.getTime() - 10000 );
            document.cookie="search=1;expires=" + date.toGMTString();

            this.history = [];
          },
		},
		mounted(){
		  const that = this;

		  const orgId = that.$route.query.orgid;
  		  that.orgId = orgId === null || typeof orgId === 'undefined' ? '' : orgId;

		  that.$parent.isSearch = window.location.href.indexOf('search') !== -1;

          // cookie记录
          const arr = document.cookie.replace(/\s/g,'').split(';');
          arr.forEach( (e,i) => {
            if(e.indexOf('search=')!==-1 && e.indexOf('keywords:')!==-1){
              that.history = e.split('=')[1].split(',');
            }
          });

		}
	}
</script>
<style>
    #search header{
        position:relative;
        font-size:0.3rem;
        padding:0.2rem;
        color:#c90909;
        background:#fff;
    }
	#search header .search-input{
        background:#c90909;
        -webkit-border-radius:1rem;
        -moz-border-radius:1rem;
        border-radius:1rem;
        outline:none;
        border:none;
        color:#fff;
        width:4.88rem;
        height:0.6rem;
        padding:0 0.8rem 0 0.4rem;
        font-size:0.3rem;
    }
    #search header .search-img{
        width:0.4rem;
        position:absolute;
        top:0.3rem;
        right:1.48rem;
    }
    #search header .cancel{
        margin-left:0.1rem;
    }
    #search .search-result a{
        font-size:0.3rem;
        color:#666;
        display:block;
        margin:0.16rem 0;
    }
    #search .history,#search .search-result .news,#search .search-result .event,#search .search-result .chessBook,#search .search-result .train{
        margin-top:0.08rem;
        padding:0.1rem 0.2rem;
        background:#fff;
        border-bottom:0.02rem solid #ccc;
        overflow:hidden;
    }
    #search .history{
        margin-bottom:0.1rem;
    }
    #search .history .clear{
        font-size:0.28rem;
        border:0.02rem solid #999;
        color:#999;
        text-align:right;
        padding:0.02rem 0.08rem;
        position:absolute;
        right:0.6rem;
    }
    #search .history .history-item{
        font-size:0.3rem;
        float:left;
        border:0.02rem solid #ddd;
        padding:0.04rem 0.2rem;
        margin:0.2rem 0.2rem 0.2rem 0;
        -webkit-border-radius:0.1rem;
        -moz-border-radius:0.1rem;
        border-radius:0.1rem;
        color:#666;
    }
    #search .search-result .title{
        margin:0.04rem 0;
        font-size:0.36rem;
        color:#c90909;
        position:relative;
    }
    #search .no-more-show img{
        width:2rem;
    }
    #search .no-more-show p{
        font-size: 0.28rem;
        margin: 0 0 0.1rem 0;
        color: #999;
    }
</style>
