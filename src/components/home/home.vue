<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span=6 class="">
          <h3>make a great stone</h3>
        </el-col>
        <el-col :span="16">
          <h3>电商管理系统</h3>
        </el-col>
        <el-col :span="2">
          <a class="logout" @click="handleOut()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <el-menu 
         :default-active="$route.path" 
         class="el-menu-vertical-demo" 
         :router="true"
         :unique-opened="true">
          <el-submenu index="'' + item1.order" v-for="(item1,index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" 
            v-for="(item2,index) in item1.children" 
            :key="index">
              <i class="el-icon-location"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menus: []
    }
  },

  // beforeCreate() {
  //   const token = localStorage.getItem('token')
  //   console.log(token)
  //   if (!token) {
  //     this.$router.push({ name: 'Login' })
  //   }
  // },

  created() {
    this.getMenus()
  },

  methods: {
    // 获取菜单栏
    async getMenus() {
      const res = await this.$http.get('menus')
      console.log(res)
      this.menus = res.data.data
    },

    handleOut() {
      localStorage.clear()
      this.$message.success('退出成功')
      this.$router.push({ name: 'Login' })
    }
  }
}

</script>
<style>
.container {
  height: 100%;
}

.header {
  background-color: #b3c0d1;
}

.aside {
  background-color: #d3dce6;
}

.main {
  background-color: #e9eef3;
}

/* 头部样式 */
.logout {
  text-decoration: none;
  line-height: 60px;
}

</style>
