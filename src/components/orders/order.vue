<template>
  <el-card>
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <el-table :data="tableData" style="width: 100%;margin-top: 10px">
      <el-table-column type="index" label="#" width="50px">
      </el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="200px">
      </el-table-column>
      <el-table-column prop="order_price" label="订单价格">
      </el-table-column>
      <el-table-column prop="order_pay" label="是否付款">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_pay==='0'">已付款</el-tag>
          <el-tag v-if="scope.row.order_pay==='1'">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货">
      </el-table-column>
      <el-table-column label="下单时间">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtdate}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="handleOrder()"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form>
      	<el-form-item label="省市区">
      		<el-cascader
    			v-model="form.value"
    			closable
    			:options="options"
    			@change="handleChange">
    		</el-cascader>
      	</el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </el-card>
</template>
<script>
import options from '@/assets/city_data2017_element.js'
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: -1,

      dialogFormVisible:false,
      form:{
      	value:[],
      	name:''
      },

      // 省市区级联选择器
      options:[],
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
  	handleChange(value){
  		console.log(value)
  	},
  	handleOrder(){
  		this.dialogFormVisible = true
  		this.options = options
  	},
    handleSizeChange(val) {
      this.pagesize = val
      this.pagenum = 1
      this.getOrders()
      //console.log('sizeCahnge' + val)
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.getOrders()
      //console.log(val)
    },
    async getOrders() {
      const res = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      console.log(res)
      this.total = res.data.data.total
      this.tableData = res.data.data.goods
    },
  }
}

</script>
<style>
</style>
