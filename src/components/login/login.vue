<template>
    <div class="login-wrap">
      <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
        <h2>用户登陆</h2>
        <el-form-item label="用户名">
          <el-input clearable v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input clearable show-password v-model="formdata.password"></el-input>
        </el-form-item>
        <el-button @click.prevent="handleLogin()" type="primary" class="login-btn">提交</el-button>
      </el-form>
    </div>
</template>
<script>
export default {
  data() {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // handleLogin() {
    //   this.$http.post('login', this.formdata)
    //     .then(res => {
    //       console.log(res.data)
    //       const {data,meta: { msg, status }} = res.data
    //       if(status === 200){
    //         this.$router.push({name:'Home'})
    //         this.$message.success('登陆成功')
    //       }else{
    //         this.$message.error(msg)
    //       }
    //     })
    // }
    async handleLogin() {
      const res = await
      this.$http.post('login', this.formdata)
      const {
        data,
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        // 登陆成功，返回token
        // 目的：用户没有登录，URL直接来到home组件
        localStorage.setItem('token', data.token)
        this.$router.push({ name: 'Home' })
        this.$message.success('登陆成功')
      } else {
        this.$message.error(msg)
      }
    }
  }
}

</script>
<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  /* 居中 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  border-radius: 5px;
  padding: 30px;
}

.login-wrap .login-btn {
  width: 100%;
}

</style>
