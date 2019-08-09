<template>
  <el-card>
    <my-bread style="margin-bottom: 15px" level1="权限管理" level2="权限列表"></my-bread>
    <el-table height="600px" border stripe :data="tableList" style="width: 100%">
      <el-table-column type="index" label="#" width="80">
      </el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180">
      </el-table-column>
      <el-table-column prop="path" label="路径" width="180">
      </el-table-column>
      <el-table-column label="层级">
        <template slot-scope="tableList">
          {{tableList.row.level | levelChange}}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      tableList: []
    }
  },
  created() {
    this.getUserRights()
  },
  methods: {
    async getUserRights() {
      const res = await this.$http.get(`rights/list`)
      console.log(res)
      const {meta:{msg,status},data} = res.data
      if(status === 200){
        this.$message.success(msg)
        this.tableList = data
      }else{
         this.$message.error(msg)       
      }
    }
  }
}

</script>
<style>
</style>
