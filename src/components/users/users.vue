<template>
  <!-- 面包屑 -->
  <el-card>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row style="margin-top: 15px" :gutter="6">
      <el-col :span="10">
        <div>
          <el-input @clear="loadUserList()" clearable v-model="query" placeholder="请输入内容">
            <el-button @click="searchValue()" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button @click="dialogFormVisible = true" type="success">添加用户</el-button>
        <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input @clear="clearAdduser()" clearable v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
              <el-input @clear="clearAdduser()" clearable v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
              <el-input @clear="clearAdduser()" clearable v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input @clear="clearAdduser()" clearable v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="#" width="30">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column label="创建日期" width="180">
        <!-- 如果单元格内显示的内容不是字符串，需在外层包裹一个template -->
        <!-- template内部使用数据 设置slot-scope属性 -->
        <!-- tableDate.row为数组中的每个对象 -->
        <!-- slot-scope找到源头标签的数据 -->
        <template slot-scope="tableData">
          {{tableData.row.create_time | fmtdate}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态" width="180">
        <template slot-scope="some">
          <el-switch @change="stateChange(some.row)" v-model="some.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="usersEditStart(scope.row.id)" type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
          <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
            <el-form :model="form">
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input disabled @clear="clearAdduser()" clearable v-model="form.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input @clear="clearAdduser()" clearable v-model="form.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input @clear="clearAdduser()" clearable v-model="form.mobile" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
              <el-button type="primary" @click="usersEditSubmit(scope.row.id)">确 定</el-button>
            </div>
          </el-dialog>
          <el-button @click="dialogVisibleDelete(scope.row.id)" type="danger" size="mini" plain icon="el-icon-delete" circle></el-button>
          <el-button @click="usersCheck(scope.row)" type="success" size="mini" plain icon="el-icon-check" circle></el-button>
          <el-dialog title="分配角色" :visible.sync="dialogFormVisibleCheck">
            <el-form :model="form">
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <!-- <el-input disabled v-model="form.username" autocomplete="off"></el-input> -->
                {{checkUsername}}
              </el-form-item>
              <el-form-item label="角色" :label-width="formLabelWidth">
                <!-- 注意：下拉框中，el-select中currRoleId的值和el-option中的value的值若相等，则显示label -->
                <el-select v-model="currRoleId" placeholder="请选择角色">
                  <el-option label="请选择" :value="-1"></el-option>
                  <el-option v-for="(item,index) in roles" :label="item.roleName" :value="item.id" :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibleCheck = false">取 消</el-button>
              <el-button type="primary" @click="roleChange()">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部显示页码 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      total: -1,
      pagenum: 1,
      query: '',
      pagesize: 2,

      // 添加用户的弹出框
      dialogFormVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '100px',

      dialogFormVisibleEdit: false,

      dialogFormVisibleCheck: false,

      roles: [],

      checkUsername: '',

      currRoleId: -1,

      currUserId: -1
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      //const AUTH_TOKEN = localStorage.getItem('token')
      //this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN;
      const res = await this.$http
        .get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log(res)
      const { meta: { msg, status }, data: { users, total } } = res.data
      if (status === 200) {
        this.tableData = users
        this.total = total
        //this.mg_state = users.mg_state
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
      //console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.getUserList()
      //console.log(`当前页: ${val}`);
    },
    searchValue() {
      this.getUserList()
    },
    loadUserList() {
      this.getUserList()
    },
    clearAdduser() {
      this.form = {}
    },
    // 添加用户
    async addUser() {
      const res = await this.$http.post(`users`, this.form)
      console.log(res)

      const { meta: { status, msg }, data } = res.data
      if (status === 201) {
        // 1 提示成功
        this.$message.success(msg)
        // 2 关闭对话框
        this.dialogFormVisible = false;
        // 3 更新视图
        this.getUserList()
        // 4 清空文本框 
        this.clearAdduser()
      } else {
        this.$message.error(msg)
      }
    },

    // 删除用户
    dialogVisibleDelete(userId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${userId}`)
        const { meta: { msg, status } } = res.data
        if (status === 200) {
          this.$message({
            type: 'success',
            message: msg
          });
          this.getUserList()
          this.pagenum = 1
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 修改用户信息
    async usersEditStart(userId) {
      const res = await this.$http.get(`users/${userId}`)
      console.log(res)
      if (res.status === 200) {
        this.form = res.data.data
        this.dialogFormVisibleEdit = true
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },

    async usersEditSubmit(userId) {
      const res = await this.$http.put(`users/${userId}`, this.form)
      console.log(res)
      const { meta: { msg, status } } = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.getUserList()
        this.dialogFormVisibleEdit = false
      } else {
        this.$message.error(msg)
      }
    },

    // 状态改变
    async stateChange(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      const { meta: { msg, status }, data: { mg_state } } = res.data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },

    // 角色分配
    async usersCheck(user) {
      this.checkUsername = user.username
      this.currUserId = user.id
      const res = await this.$http.get(`roles`)
      this.roles = res.data.data

      const res1 = await this.$http.get(`users/${user.id}`)
      this.currRoleId = res1.data.data.rid
      this.dialogFormVisibleCheck = true

    },

    async roleChange() {
      console.log()
      const res = await this.$http.put(`users/${this.currUserId}/role`, { rid: this.currRoleId })
      this.dialogFormVisibleCheck = false

    }
  }
}

</script>
<style>
</style>
