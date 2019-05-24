<template>
    <div id="teachersDetail">
        <header>
            <img class="head-bg" src="./../../assets/img/bg_teacher_detail.png" alt="教师背景">
            <div class="head-img">
                <img :src="teacher.img"
                     :onerror="defaultTeacher"
                     alt="头像">
            </div>
        </header>
        <div class="teacher-name text-center">
            <span>{{teacher.name}}</span>
            <span class="teacher-title">{{teacher.title}}</span>
            <p>
                教授类型：{{teacher.type}}
            </p>
            <p>
                性别：{{teacher.gender}}
            </p>
        </div>
        <div class="teacher-intro">
            <p>简介</p>
            <p class="intro-content" v-html="teacher.intro">
                {{teacher.intro}}
            </p>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      teacher: {},
      imgURL: "",
      defaultTeacher:
        'this.src="' + require("./../../assets/img/default_head.png") + '"'
    };
  },
  methods: {
    // 处理数据
    format(data) {
      if (data === null || data === "" || typeof data === "undefined") {
        return "暂无";
      } else {
        return data;
      }
    },
    // 围棋段位转为中文
    changeTitle(stage) {
      stage = stage >> 0;
      switch (stage) {
        case 143:
          return "28级";
          break;
        case 142:
          return "27级";
          break;
        case 141:
          return "26级";
          break;
        case 99:
          return "25级";
          break;
        case 103:
          return "24级";
          break;
        case 104:
          return "23级";
          break;
        case 106:
          return "22级";
          break;
        case 107:
          return "21级";
          break;
        case 108:
          return "20级";
          break;
        case 109:
          return "19级";
          break;
        case 110:
          return "18级";
          break;
        case 111:
          return "17级";
          break;
        case 112:
          return "16级";
          break;
        case 113:
          return "15级";
          break;
        case 114:
          return "14级";
          break;
        case 115:
          return "13级";
          break;
        case 116:
          return "12级";
          break;
        case 117:
          return "11级";
          break;
        case 118:
          return "10级";
          break;
        case 119:
          return "9级";
          break;
        case 120:
          return "8级";
          break;
        case 121:
          return "7级";
          break;
        case 122:
          return "6级";
          break;
        case 123:
          return "5级";
          break;
        case 124:
          return "4级";
          break;
        case 125:
          return "3级";
          break;
        case 126:
          return "2级";
          break;
        case 127:
          return "1级";
          break;
        case 128:
          return "1段";
          break;
        case 129:
          return "2段";
          break;
        case 130:
          return "3段";
          break;
        case 131:
          return "4段";
          break;
        case 132:
          return "5段";
          break;
        case 133:
          return "6段";
          break;
      }
      return "";
    },
    // 类型
    getType(type) {
      type = type >> 0;
      let arr = {
        "1": "象棋",
        "2": "围棋",
        "4": "国际象棋",
        "8": "国际跳棋",
        "16": "五子棋",
        "32": "扑克"
      };
      let $type = type;
      type = "";
      let i=0;
      for(let i in arr){
        if ($type & (i-0)) {
          type += "  " + arr[i];
        }
      }
    //   switch (type) {
    //     case 1:
    //       return "象棋";
    //       break;
    //     case 2:
    //       return "围棋";
    //       break;
    //     case 4:
    //       return "国际象棋";
    //       break;
    //     case 8:
    //       return "国际跳棋";
    //       break;
    //     case 16:
    //       return "五子棋";
    //       break;
    //     case 32:
    //       return "扑克";
    //       break;
    //   }
      return type;
    },
    // 获取详情数据
    getTeacherDetail() {
      const that = this;
      that
        .$axios({
          method: "post",
          url: "/request/Org/TeacherDetail",
          params: {
            id: that.teacherId
          }
        })
        .then(
          res => {
            const data = res.data;
            if (data.error >> 0 === 0) {
              const _data = data.datArr;
              that.teacher = {
                name: that.format(_data.teachername),
                title: that.changeTitle(that.format(_data.stage)),
                img: that.format(_data.logo),
                intro: that.format(_data.remark),
                gender: that.format(_data.sex === "1" ? "女" : "男"),
                type: that.getType(that.format(_data.type))
              };
            }
          },
          res => {
            console.log("网络出了点问题");
          }
        );
    }
  },
  mounted() {
    const that = this;

    const teacherId = that.$route.query.teacherid;
    that.teacherId =
      teacherId === null || typeof teacherId === "undefined" ? "" : teacherId;

    that.getTeacherDetail();
  }
};
</script>
<style scoped>
#teachersDetail {
  margin-top: 1rem;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
}
#teachersDetail header {
  overflow: hidden;
  height: 2.36rem;
}
#teachersDetail .head-bg {
  width: 7.5rem;
}
#teachersDetail .head-img {
  margin: 0 auto;
  width: 1.98rem;
  height: 1.98rem;
  background: #fff;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  overflow: hidden;
  z-index: 10;
  position: absolute;
  top: 0.7rem;
  left: 0;
  right: 0;
  font-size: 0.28rem;
  border: 0.18rem solid #fff;
}
#teachersDetail .head-img img {
  width: 100%;
}
#teachersDetail .teacher-name {
  padding: 0.7rem 0 0.2rem 0;
  background: #fff;
  font-size: 0.36rem;
  border-bottom: 1px solid #eee;
}
#teachersDetail .teacher-name p {
  margin: 0.1rem;
  font-size: 0.28rem;
}
#teachersDetail .teacher-title {
  color: #cc0000;
  font-size: 0.36rem;
}
#teachersDetail .teacher-intro {
  background: #fff;
  overflow: hidden;
  padding: 0 0.2rem;
  margin-top: 0.1rem;
}
#teachersDetail .teacher-intro p:first-child {
  margin: 0.4rem 0 0.2rem 0;
  font-size: 0.36rem;
  color: #333;
}
#teachersDetail .teacher-intro .intro-content {
  margin: 0 0 0.3rem 0;
  font-size: 0.32rem;
  color: #666;
}
</style>
