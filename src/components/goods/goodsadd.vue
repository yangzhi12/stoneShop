<template>
  <el-card style="font-size: 10px">
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-alert style="margin-top: 15px" title="添加商品信息" type="success"></el-alert>
    <el-steps style="margin-top: 15px" :active="1*active" simple finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form :model="formLabelAlign" style="height:auto;overflow:auto">
      <el-tabs @tab-click="tabChange" v-model="active" tabPosition="left" style="margin-top: 15px">
        <el-tab-pane label="基本信息" name="1">
          <el-form-item label="商品名称">
            <el-input v-model="formLabelAlign.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="formLabelAlign.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="formLabelAlign.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="formLabelAlign.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader v-model="value" :props="defaultProps" :options="options" @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="2">
          <el-form-item :label="item1.attr_name" v-for="(item1,index) in dynamicsParams" :key="index">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox v-for="(item2,index) in item1.attr_vals" :key="index" :label="item2">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <el-form-item :label="item1.attr_name" v-for="(item1,index) in arrStaticparams" :key="index">
            <el-input v-model="item1.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-form-item>
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :headers="headers" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <el-button @click="addGoods()">添加内容</el-button>
            <quill-editor v-model="formLabelAlign.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      checkList: [],
      active: "1",
      formLabelAlign: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      value: [1, 3, 6],
      options: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      dynamicsParams: [],
      arrStaticparams: [],

      headers: {
        Authorization: localStorage.getItem('token')
      },
    };
  },
  created() {
    this.getCategories()
  },
  methods: {
  	async addGoods(){
  		let arr1 = this.dynamicsParams.map((item => {
  			return {'attr_id':item.attr_id,'attr_value':item.attr_vals}
  		}))

  		let arr2 = this.arrStaticparams.map((item) => {
  			return {'attr_id':item.attr_id,'attr_value':item.attr_vals}
  		})

  		this.formLabelAlign.attrs = [...arr1,...arr2]
  		this.formLabelAlign.goods_cat = this.value.join(',')

  		const res = await this.$http.post(`goods`,this.formLabelAlign) 
  		//console.log(res)
  		this.$router.push({name:'goods'})
  	},
    handleRemove(file, fileList) {
      console.log(file, fileList)
      // file.response.data.tmp_path
      let Index = this.formLabelAlign.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path
      })
      this.formLabelAlign.pics.splice(Index, 1)
      //console.log(this.formLabelAlign.pics)
    },
    handlePreview(file) {
      console.log(file);
    },
    handleSuccess(file) {
      this.formLabelAlign.pics.push({
        pic: file.data.tmp_path
      })
    },
    checkboxChange() {
      console.log(this.checkList)
    },
    async tabChange() {
      if (this.value.length !== 3) {
        this.$message.warning('商品只能添加到三级分类')
      }
      if (this.active === '2') {
        const res = await this.$http.get(`categories/${this.value[2]}/attributes?sel=many`)
        this.dynamicsParams = res.data.data
        //console.log(res.data.data)
        this.dynamicsParams.forEach((item) => {
          item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',')
        })
      } else if (this.active === '3') {
        const res = await this.$http.get(`categories/${this.value[2]}/attributes?sel=only`)
        this.arrStaticparams = res.data.data
        console.log(this.arrStaticparams)
      }
    },
    //获取三级联动表单数据
    async getCategories() {
      const res = await this.$http.get(`categories?type=3`)
      console.log(res)
      this.options = res.data.data
    },
    handleChange(value) {
      console.log(value)
      //this.formLabelAlign.goods_cat = this.value
    }
  }
}

</script>
<style>
.ql-editor{
	min-height: 240px;
}
</style>
