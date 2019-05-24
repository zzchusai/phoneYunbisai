<template>
	<div id="recruit-list">
		<div v-infinite-scroll="loadMore"
             :infinite-scroll-disabled="loading"
             :infinite-scroll-distance="bottomHei">
            <article class="recruit" v-if="recruit.length" v-for="item in recruit" @click="goToDetail(item.id)">
            	<h5>{{item.title}}</h5>
				<ul>
					<li><span class="salary-text">薪资:</span><span class="salary">{{item.salary}}</span></li>
					<li><span class="fa fa-clock-o"></span><span class="time">{{item.time}}</span>发布</li>
				</ul>
            </article>
        </div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				recruit 	: [],
				loading 	: false,
				isFixed		: false,
				bottomHei   : 0,
				orgId       : '',
		        currentPage : 1,
		        pageSize    : 6,
		        totalPage   : 0,
		        state       : 0,
			}
		},
		methods:{
			scrollFilterFix(){
		        const that = this;
		        const rootSize = parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0])['font-size']);
		        const navHeight = rootSize * 1;
		        that.isFixed =  document.documentElement.scrollTop >= navHeight || document.body.scrollTop >= navHeight;
		        that.bottomHei = rootSize * 1.1;
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
		          that.loading = false;
		          that.currentPage ++;
		          that.getRecruit();
		        }
		    },
		    goToDetail(id){
		    	this.$router.push('/recruitDetail?orgid='+this.orgId+'&id=' + id);
		    },
			getRecruit(){
				const that = this;
				that.$axios({
					method:'post',
          			url:'request/org/OrgRecruitList',
          			params:{
          				org_id	   :that.orgId,
          				state 	   :that.state,
          				PageSize   :that.pageSize,
          				PageIndex  :that.currentPage
          			},
				}).then(res => {
					const data = res.data;
          			if( (data.error>>0) === 0 ){
          				const _data = data.datArr.rows;
            			if( _data.length > 0 ){
            				_data.forEach( (e,i) => {
            					that.recruit.push({
            						id    : that.format(e.id),
            						title : that.format(e.title),
            						salary: that.format(e.salary),
            						time: that.format(e.createtime).slice(0,10),
            					})
            				})
            				that.totalPage = ( (data.datArr.total / that.pageSize) >> 0 ) + 1;
            				that.loading = true;
            			}
          			}
				},res => {
		          that.loading = true;
		          console.log('Maid is praying');
		        })
			}
		},
		mounted(){
			const that = this;
		    const orgId = that.$route.query.orgid;
		    that.orgId = orgId === null || typeof orgId === 'undefined' ? '' : orgId;

		    that.getRecruit()

		    const rootSize = parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0])['font-size']);
      		that.bottomHei = rootSize * 1.1;

      		window.addEventListener('scroll',this.scrollFilterFix);
		}
	}
</script>
<style>
	#recruit-list{
		margin-bottom: 1rem;
	}
	#recruit-list .recruit{
		background-color: #fff;
		padding: 0.4rem;
		margin-bottom:0.1rem;
	}
	#recruit-list .recruit h5{
		font-size: 0.4rem;
		margin: 0;
		padding-bottom: 0.4rem;
	}
	#recruit-list .recruit ul{
		list-style: none;
		margin:0;
		padding: 0;
	}
	#recruit-list .recruit ul:after{
		content: '';
		display: table;
		clear:both;
	}
	#recruit-list .recruit ul li{
		float: left;
		width: 50%;
	}
	#recruit-list .recruit ul li:first-child{
		font-size: 0.36rem;
	}
	#recruit-list .recruit ul li:last-child{
		font-size: 0.28rem;
		text-align: right;
		color:rgb(153,153,153);
	}
	#recruit-list .recruit ul li .fa-clock-o{
		padding-right: 0.1rem;
	}
	#recruit-list .recruit ul li .salary-text{
		padding-right:0.2rem;
	}
	#recruit-list .salary{
		color:rgb(196,0,0);
	}
	#recruit-list .time{
		padding-right: 0.1rem;
	}
</style>
