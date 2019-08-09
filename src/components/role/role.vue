<template>
  <el-card>
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-button style="margin-top: 15px">添加角色</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand" label="#" width="30">
        <template slot-scope="scope">
          <el-row v-for="(item1,index) in scope.row.children" :key="index">
            <el-col :span="4">
              <el-tag @close="deleteRight(scope.row,scope.row.id,item1.id)" type="success" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,index) in item1.children" :key="index">
                <el-col :span="4">
                  <el-tag @close="deleteRight(scope.row,scope.row.id,item2.id)" type="info" closable>{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag @close="deleteRight(scope.row,scope.row.id,item3.id)" type="warning" closable v-for="(item3,index) in item2.children" :key="index">
                    {{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length === 0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain icon="el-icon-edit" circle></el-button>
          <el-button type="danger" size="mini" plain icon="el-icon-delete" circle></el-button>
          <el-button @click="showSetRightDia(scope.row)" type="success" size="mini" plain icon="el-icon-check" circle></el-button>
          <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
            <el-tree ref="tree" :data="treelist" show-checkbox node-key="id" :default-expanded-keys="arrexpand" :default-checked-keys="arrcheck" :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
              <el-button type="primary" @click="setRoleRight()">确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisibleRight: false,

      // 树形结构数据
      treelist: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      arrexpand: [],
      arrcheck: [],
      currRoleId: -1
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async setRoleRight() {
      // 获取全选的id的数组 getCheckedKeys()
      let arr1 = this.$refs.tree.getCheckedKeys()
      //console.log(arr1)
      // 获取半选的id的数组 getHalfCheckedKeys()
      let arr2 = this.$refs.tree.getHalfCheckedKeys()
      let arr = [...arr1, ...arr2]
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      })
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.getRoleList()
        this.dialogFormVisibleRight = false
      }else{
        this.$message.error(res.data.meta.msg)
      }
    },

    async showSetRightDia(role) {
      this.currRoleId = role.id
      const res = await this.$http.get('rights/tree')
      console.log(res)
      this.treelist = res.data.data

      var arrtemp1 = []
      this.treelist.forEach(item1 => {
        arrtemp1.push(item1.id)
        item1.children.forEach(item2 => {
          arrtemp1.push(item2.id)
          item2.children.forEach(item3 => {
            arrtemp1.push(item3.id)
          })
        })
      })
      console.log(arrtemp1)

      // 获取当前角色权限
      let arrtemp2 = []
      role.children.forEach(item1 => {
        //arrtemp2.push(item1.id)
        item1.children.forEach(item2 => {
          //arrtemp2.push(item2.id)
          item2.children.forEach(item3 => {
            arrtemp2.push(item3.id)
          })
        })
      })

      console.log(arrtemp2)

      this.arrcheck = arrtemp2

      this.arrexpand = arrtemp1
      this.dialogFormVisibleRight = true
    },
    // 删除权限
    async deleteRight(role, roleId, rightId) {
      const res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
      const { meta: { msg, status } } = res.data
      if (status === 200) {
        //this.getRoleList()
        this.$message.success(msg)
        //不需要将视图全部更新
        role.children = res.data.data
      } else {
        this.$message.success(msg)
      }
    },

    async getRoleList() {
      const res = await this.$http.get(`roles`)
      //console.log(res.data.data)
      this.tableData = res.data.data
    }
  }
}

</script>
<style>
</style>
