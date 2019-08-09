<template>
  <el-card>
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <!-- 2 为echarts准备一个具备宽高的DOM -->
    <div id="main" style="width: 600px;height:400px;margin-top: 15px"></div>
  </el-card>
</template>
<script>
//1 引入echarts文件
var echarts = require('echarts');
export default {
  data() {
    return {};
  },
  mounted() {
    this.useEcharts();
  },
  methods: {
    // 3 基于准备好的dom,初始化echarts实例
    async useEcharts() {
      var myChart = echarts.init(document.getElementById("main"));
      let option1 = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
      };

      const res = await this.$http.get(`reports/type/1`)
      console.log(res)
      let option2 = res.data.data
      let option = {...option1,...option2}
      // 4 使用刚指定的配置项和数据显示图表
      myChart.setOption(option)
    }
  }
}

</script>
<style>
</style>
