<template>
    <div id="recruitDetail">
		<div class="recruit-top">
			<h5>{{recruit.title}}</h5>
			<ul>
				<li><span class="salary-text">薪资:</span><span class="salary">{{recruit.salary}}</span></li>
				<li><span class="fa fa-clock-o"></span><span class="time">{{recruit.time}}</span>发布</li>
			</ul>
		</div>
		<div class="recruit-middle">
			<p ><span>地点 :</span><span>{{recruit.province}} {{recruit.city}} {{recruit.county}}</span></p>
			<p>{{recruit.address}}</p>
		</div>
		<div class="recruit-aside">
			<p ><span>联系人 :</span><span>{{recruit.link_name}}</span></p>
			<p><span>联系电话 :</span><span>{{recruit.link_phone}}</span></p>
			<a class="btn" :href="'tel:'+recruit.link_phone" type="button">拨打电话</a>
		</div>
		<div class="recruit-bottom">
			<h5>职位描述</h5>
			<div>{{recruit.position}}</div>
			<h5>职位要求</h5>
			<div>{{recruit.require}}</div>
		</div>
    </div>
</template>
<script>
  export default {
    data: function () {
      return {
      	id:'',
      	orgId:'',
      	recruit:{},
      }
    },
    methods:{
    	// 处理数据
	    format(data){
	        if( data === null || data === '' || typeof data === 'undefined' ){
	          return '暂无';
	        }else{
	          return data;
	        }
	    },
    	getRecruit(){
    		const that = this;
    		that.$axios({
    			methods:'post',
    			url:'request/org/OrgRecruitList',
    			params:{
    				org_id : that.orgId,
          			id     : that.id
    			}
    		}).then(res => {
    			const data = res.data;
      			if( (data.error>>0) === 0 ){
      				const _data = data.datArr.rows;
					that.recruit={
						id         : that.format(_data.id),
						title      : that.format(_data.title),
						salary     : that.format(_data.salary),
						time       : that.format(_data.createtime).slice(0,10),
						province   : that.format(_data.province_name),
						city       : that.format(_data.city_name),
						county     : that.format(_data.county_name),
						address    : that.format(_data.address),
						link_name  : that.format(_data.link_name),
						link_phone : that.format(_data.link_phone),
						position   : that.format(_data.position),
						require    : that.format(_data.require),
					}

      			}
    		},res => {
	          that.loading = true;
	          console.log('Maid is praying');
	        })
    	}
    },
    mounted(){
    	const that=this;
    	const id = that.$route.query.id; console.log(id)
    	const orgid = that.$route.query.orgid;
      	that.id = id === null || typeof id === 'undefined' ? '' : id;
      	that.orgId = orgid === null || typeof orgid === 'undefined' ? '' : orgid;

        that.getRecruit()
    }
  }
</script>
<style>
	#recruitDetail{
        margin-top:1rem;
        overflow:hidden;
        position:relative;
        margin-bottom: 1rem;
    }
    .recruit-top{
    	padding: 0.4rem;
    	background-color: #fff;
    	margin-top: 0.2rem;
    }
	.recruit-top h5{
		font-size: 0.4rem;
		margin: 0;
		padding-bottom: 0.4rem;
	}
	.recruit-top ul{
		font-size:0.32rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.recruit-top ul:after{
		content: '';
		display: table;
		clear:both;
	}
	.recruit-top ul li{
		float: left;
		width: 50%;
	}
	.recruit-top ul li:first-child{
		font-size: 0.36rem;
	}
	.recruit-top ul li:last-child{
		font-size: 0.28rem;
		text-align: right;
		color:rgb(153,153,153);
	}
	.recruit-top ul li .fa-clock-o{
		padding-right: 0.1rem;
	}
	.recruit-top ul li .salary-text{
		padding-right:0.2rem;
	}
	.recruit-top .salary{
		color:rgb(196,0,0);
	}
	.recruit-top .time{
		padding-right: 0.1rem;
	}
	.recruit-middle{
		padding: 0.4rem;
		font-size: 0.28rem;
		background-color: #fff;
		border-top:1px solid rgba(204,204,204,0.4);
	}
	/*.recruit-middle p{
		margin: 0;
	}*/
	.recruit-middle p:first-child{
		margin-bottom: 0.2rem;
	}
	p{
		margin: 0;
	}
	.recruit-aside{
		font-size: 0.28rem;
		padding: 0.4rem;
		margin-top: 0.2rem;
		background-color: #fff;
		position: relative;
	}
	.recruit-aside P:first-child{
		padding-bottom: 0.2rem;
	}
	.recruit-middle p span:first-child{
		padding-right: 0.2rem;
	}
	.recruit-aside p span:first-child{
		padding-right: 0.2rem;
	}
	#recruitDetail .recruit-aside .btn{
		position: absolute;
		right: 0.4rem;
		top: 0.4rem;
		width:2.4rem;
		height: 0.66rem;
		color:#fff;
		text-align: center;
		vertical-align: middle;
		background-color:rgb(20,211,0);
		border:1px solid transparent;
		border-radius: 5px;
		line-height: 0.66rem;
	}
	.recruit-bottom{
		font-size: 0.28rem;
		padding: 0.4rem;
		/*padding-top: 0;*/
		margin-top: 0.2rem;
		padding-bottom: 1.2rem;
		background-color: #fff;
	}
	.recruit-bottom h5{
		margin: 0;
		margin-top: 0.6rem;
		font-size: 0.32rem;
		padding-bottom: 0.4rem;
		position: relative;
		text-indent: 0.1rem;
	}
	.recruit-bottom h5:before{
		content: '';
		width: 2px;
		position: absolute;
		height:0.35rem;
		/*border:1px solid rgb(196,0,0);*/
		top: 3px;
    	left: 0;
    	background-color: rgb(196,0,0);
	}
	.recruit-bottom h5:first-child{
		margin-top: 0.2rem;
	}
</style>
