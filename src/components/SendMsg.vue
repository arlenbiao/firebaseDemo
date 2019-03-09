<template>
  <div class="send-msg">
    <div>
      <el-radio v-model="type" label="data">数据消息</el-radio>
      <el-radio v-model="type" label="notification">通知消息</el-radio>
    </div>
    <div style="margin-top: 20px">
      <el-radio v-model="guard" label="pc">商家pc</el-radio>
      <el-radio v-model="guard" label="platform">平台</el-radio>
      <el-radio v-model="guard" label="rider">骑手端</el-radio>
      <el-radio v-model="guard" label="rider">POS端</el-radio>
      <el-radio v-model="guard" label="rider">PAD端</el-radio>
    </div>
    <div class="input-g">
      <el-input v-model="title" placeholder="消息头"></el-input>
      <el-input v-model="body" placeholder="消息主体"></el-input>
      <el-input v-model="data_type" placeholder="数据消息类型，根据后端提供输入"></el-input>
      <el-input v-model="token" placeholder="token"></el-input>
    </div>
    <el-button type="primary" style="margin-top: 100px" @click="push">推送</el-button>
  </div>
</template>

<script>
export default {
  name: 'send-msg',
  data () {
    return {
      type: 'data',
      guard: 'pc',    //应用方向
      title: '',
      body: '',
      data_type: '',
      token: ''
    }
  },
  methods: {
    push () {
      let _this = this;
      this.$axios.post('/fcm/push', this.$data)
        .then(function (res) {
          const h = _this.$createElement;
          _this.$message({
            message: h('p', null, [
              h('span', null, res.data.message),
              h('i', { style: 'color: teal' }, '')
            ])
          });
        }).catch(function (err) {
          console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.input-g .el-input{
  margin-top: 15px;
}
</style>
