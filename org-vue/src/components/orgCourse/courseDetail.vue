<template>
    <div id="courseDetail">
        <header>
            <img class="head-bg" :src="course.logo" :onerror="defaultImg" alt="教师背景">

        </header>
        <div class="course-name ">
            <mt-cell :title="course.training_name" class="group-name">
            	<span>RMB  </span><span class="group-prize">{{course.training_cost}}</span>
            </mt-cell>
            <mt-cell :title="course.training_address" class="groupF">
			  <span class="fa fa-map-marker"  slot='icon'></span>
			  <!-- <img class="iconImg" src="../../assets/img/address.png" slot='icon' alt=""> -->
			</mt-cell>
			<mt-cell :title="course.training_datetime" class="groupF">
			  <span class="fa fa-clock-o"  slot='icon'></span>
			</mt-cell>
			<mt-cell :title="course.tel" class="groupF ">
			  <span class="fa fa-volume-control-phone"  slot='icon'></span>
			</mt-cell>
        </div>
        <div class="course-intro">
            <p class="text-center course-content-p">{{course.training_name}}</p>
            <div class="course-content">
				<h4>培训简介</h4>
                <p class="course-content-p" v-html="course.training_profile"></p>
                <h4>培训特色</h4>
				<p class="course-content-p" v-html="course.training_features"></p>
                <h4>培训地点</h4>
                <p class="course-content-p" v-html="course.training_address"></p>
                <h4>报名条件</h4>
                <p class="course-content-p" >性别 : {{con.sex}} 、剩余可报名人数 : {{con.pnum}} 、年龄 : {{con.age}}</p>
				<h4>培训要求</h4>
                <p class="course-content-p" v-html="course.training_require"></p>
                <h4>培训安排</h4>
				<p class="course-content-p" v-html="course.training_timetable"></p>

            </div>
        </div>
    </div>
</template>
<script>
  import course_img from '../../assets/img/heigg.jpg'

  export default {
    data: function () {
      return {
      	course:{},
      	defaultCourse:'this.src="'+ require('../../assets/img/heigg.jpg')+'"',
        defaultImg:"this.src='//g.yunbisai.com/img/ad/detailAd_01.jpg'",
      	course:{
      		// training_name:"桥牌课程开课了1",
      		img:'',
      		title:'',
      		type:'',
      		gender:'',
      		intro:'',
      		training_cost:220,
      		// training_address:'培训具体地址',
      		// training_datetime:'2017.07.12-07.18',
      		// tel:'13575374939',
      		// training_features:'特色好的嘞',
      		training_timetable:'',
      	},
        con:{
            age:'不限',
            pnum:'',
            sex:'不限'
        },
      	guid  :'',
      	training_id:''
      }
    },
    methods:{
    	getCourseDetail:function(){
    		const that=this;
    		that.$axios({
		  		method:"get",
		  		url:'/request/Train/TrainDetail',
		  		params:{
		      		trainid: that.training_id,
		   	  		guid:that.guid,
		      	},
		    }).then(response => {
			    if(response.data.error===0){
			    	//console.log(response.data)
			    	let v=response.data.datArr.info
			      // for (let v of response.data.datArr.info){
			        if(v.logo){
			          v.logo=that.$store.state.base_uri_prefix+'api.yunbisai.com/'+v.logo
			        }else{
			          v.logo=course_img
			        }
			        // Object.assign(v,that.course);
			        that.course=v
			      // }
			        // that.course=
			      // that.totalPage = ( (response.data.datArr.TotalRecord / that.pageSize) >> 0 ) + 1;
			      // that.loading = true;
			    }
		  	})
    	},
        getCourseRequire(){
            const that=this;
            that.$axios({
                method:"post",
                url:'/request/Train/GetTrainCon',
                params:{
                    trainid: that.training_id,
                    guid:that.guid,
                },
            }).then(response => {
                if(response.data.error===0){
                    let v=response.data.datArr
                    that.con.age=v.age
                    that.con.pnum=v.pnum
                    that.con.sex=v.sex
                }
            })
        }
    },
    mounted(){
    	const that=this;
    	const guid = that.$route.query.guid;
    	const training_id = that.$route.query.training_id;
      	that.guid = guid === null || typeof guid === 'undefined' ? '' : guid;
      	that.training_id = training_id === null || typeof training_id === 'undefined' ? '' : training_id;

        that.getCourseDetail()
      	that.getCourseRequire()
    }
  }
</script>
<style>
	 #courseDetail{
        margin-top:1rem;
        overflow:hidden;
        position:relative;
    }
    #courseDetail header{
        overflow:hidden;
        height:2.36rem;
    }
    #courseDetail .head-bg{
        width:7.5rem;
    }
    #courseDetail .head-img{
        margin:0 auto;
        width:1.98rem;
        height:1.98rem;
        background:#fff;
        -webkit-border-radius:50%;
        -moz-border-radius:50%;
        border-radius:50%;
        overflow:hidden;
        z-index:10;
        position:absolute;
        top:0.7rem;
        left:0;
        right:0;
        font-size:0.28rem;
        border:0.18rem solid #fff;
    }
    #courseDetail .head-img img{
        width:100%;
    }
    #courseDetail .course-name{
        padding:0rem 0.2rem 0rem 0.2rem;
        background:#fff;
        font-size:0.36rem;
        border-bottom:1px solid #eee;
    }
    #courseDetail .course-name p{
        margin:0.1rem;
        font-size:0.28rem;
    }
    #courseDetail .course-title{
        color:#cc0000;
        font-size:0.36rem;
    }
    #courseDetail .course-intro{
        background:#fff;
        overflow:hidden;
        /*padding:0 0.2rem;*/
        margin-top:0.1rem;
        margin: 0;
        min-height:6rem;
    }
    #courseDetail .course-intro .course-content-p:first-child{
        padding:0.5rem 0 0.5rem 0;
        font-size:0.36rem;
        color:#333;
        margin: 0;
        border-bottom: 1px solid #ccc;
    }
    #courseDetail .course-intro p{
     	margin:0;
    }
    #courseDetail .course-intro .course-content h4{
        margin:0.2rem  0.4rem ;
        font-size:0.32rem;
    }
    #courseDetail .course-intro .course-content .course-content-p{
    	margin: 0.2rem 0.4rem;
 		font-size:0.28rem;
 		padding-bottom: 0.2rem;
 		border-bottom: 1px dotted #ccc;
    }
    #courseDetail .course-intro .course-content .course-content-p:last-child{
		border-bottom: none;
    }
    #courseDetail .course-name .groupF{
    	/*padding: 0;*/
    	min-height: 30px;
    }
    .group-prize{
        font-size:0.4rem;
        font-style: italic;
        color:#cc0000;
        font-weight: bold;
    }
    .group-name .mint-cell-text{
        font-size: 0.3rem;
        font-weight: bold;
    }
    .groupF .fa{
        color:#CA0909;
    }
    #courseDetail .course-name .iconImg{
		width: 0.6rem;
		line-height: 0.6rem;
    }
    #courseDetail .course-intro{
        margin-bottom: 55px;
    }
</style>
