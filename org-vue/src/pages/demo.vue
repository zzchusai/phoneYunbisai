<template>
  <div>
    <mt-button @click="popupVisible = !popupVisible">点击</mt-button>
    <mt-popup
      v-model="popupVisible"
      position="bottom">
      <mt-cell title="标题文字" v-model="aa"></mt-cell>
    <mt-cell title="标题文字" value="说明文字"></mt-cell>
    </mt-popup>

  </div>
</template>
<script>
export default {
  data: function () {
    return {
      aa:'false121212',
      popupVisible:false,
      bb:false
    }
  },
  methods:{
    clickFun(){
        this.bb = !this.bb;
    }
  }
}
</script>
