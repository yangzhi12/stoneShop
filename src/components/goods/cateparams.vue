<template>
  <el-card>
    <el-form>
      <el-form-item>
        <my-bread level1="商品管理" level2="分类参数"></my-bread>
      </el-form-item>
      <el-form-item>
        <el-alert title="只允许为第三级分类设置参数" type="error"></el-alert>
      </el-form-item>
      <el-form-item label="商品分类">
        <el-cascader v-model="value" clearable @change="handleChange" :props="defaultProps" :options="options" :show-all-levels="false">
        </el-cascader>
      </el-form-item>
      <el-form-item>
        <el-tabs v-model="active" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="1">
            <el-button type="danger">设置动态参数</el-button>
            <el-table :data="dynamicParams" style="width: 100%">
              <el-table-column type="expand" label="#">
                <template slot-scope="scope">
                  <el-tag v-for="tag in scope.row.attr_vals" :key="tag" closable @close="handleClose(scope.row,tag)">
                    {{tag}}
                  </el-tag>
                  <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="attr_name" label="属性名称" width="180">
              </el-table-column>
              <el-table-column label="操作">
                <template>
                  <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                  <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态参数" name="2">
            <el-button type="danger">设置静态参数</el-button>
            <el-table :data="staticParams" style="width: 100%">
              <el-table-column type="index" label="#">
              </el-table-column>
              <el-table-column prop="attr_name" label="属性名称" width="180">
              </el-table-column>
              <el-table-column prop="attr_vals" label="属性名称" width="180">
              </el-table-column>
              <el-table-column label="操作">
                <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      // 级联参数
      value: [],
      options: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      // 动态参数
      dynamicParams: [],
      inputValue: '',
      inputVisible: false,
      active: "1",

      staticParams: [],
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    async handleClick() {
      if (this.active === "2") {
        if (this.value.length === 3) {
          //获取静态资源
          const res = await this.$http.get(`categories/${this.value[2]}/attributes?sel=only`)
          this.staticParams = res.data.data
          console.log(res)
        }
      }
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleInputConfirm(attr) {
      let inputValue = this.inputValue;
      if (inputValue) {
        attr.attr_vals.push(inputValue);
      }
      const res = await 
      this.$http.post(`categories/${this.value[2]}/attributes`, {
        attr_name: attr.attr_name,
        attr_sel: 'many',
        attr_vals: attr.attr_vals.join(",")
      })
     // console.log(res)

      this.inputVisible = false;
      this.inputValue = '';
    },
    async handleClose(attr, tag) {
      attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1)
      const res = await 
      this.$http.delete(`categories/${this.value[2]}/attributes/${attr.attr_id}`)
    },
    async handleChange() {
      if (this.value.length === 3) {
        const res = await this.$http.get(`categories/${this.value[2]}/attributes?sel=many`)
        this.dynamicParams = res.data.data
        this.dynamicParams.forEach(item => {
          item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(",")
        })
        console.log(this.dynamicParams)
      }
    },
    async getCategories() {
      const res = await this.$http.get(`categories?type=3`)
      //console.log(res)
      this.options = res.data.data
    },
  }
}

</script>
<style>
</style>
