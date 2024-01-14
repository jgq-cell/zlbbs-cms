<template>
  <div id="home">
    <h1>首页</h1>
    <div id="loadPostCountChat" class="post-count-chat"></div>
    <div id="load7DayPostCountChat" class="day7-post-count-chat"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
export default {
  name: 'Home',
  mounted() {
    this.loadPostCountChat()
    this.load7DayPostCountChat()
  },
  methods: {
    loadPostCountChat() {
      this.$http.getBoardPostCount().then((resp) => {
        if (resp.code != 200) {
          ElMessage.error(resp.message)
          return
        }
        let data = resp.data
        var board_names = data['board_names']
        var board_counts = data['board_counts']

        var chartDom = document.getElementById('loadPostCountChat')
        var myChart = echarts.init(chartDom)
        var option

        option = {
          xAxis: {
            type: 'category',
            data: board_names
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: board_counts,
              type: 'bar'
            }
          ],
          tooltip: {
            trigger: 'axis'
          },
          title: {
            text: '板块帖子数量统计',
            x: 'center',
            y: 'bottom'
          }
        }

        option && myChart.setOption(option)
      })
    },
    load7DayPostCountChat() {
      this.$http.get7dayPostCount().then((resp) => {
        if (resp.code != 200) {
          ElMessage.error(resp.message)
          return
        }
        let data = resp.data
        var day7_names = data['day7_names']
        var day7_counts = data['day7_counts']
        var chartDom = document.getElementById('load7DayPostCountChat')
        var myChart = echarts.init(chartDom)
        var option

        option = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: day7_names
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: day7_counts,
              type: 'line',
              areaStyle: {}
            }
          ],
          tooltip: {
            trigger: 'axis'
          },
          title: {
            text: '7天前帖子数量统计',
            x: 'center',
            y: 'bottom'
          }
        }

        option && myChart.setOption(option)
      })
    }
  }
}
</script>

<style scoped>
.post-count-chat {
  height: 300px;
  width: 100%;
}
.day7-post-count-chat {
  height: 300px;
  width: 100%;
}
</style>
