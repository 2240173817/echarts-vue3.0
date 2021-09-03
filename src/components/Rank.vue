<template>
  <div class="com-container">
    <div id="mycharts" ref="myRef" class="com-page" />
  </div>
</template>

<script lang="js">
  import { defineComponent, getCurrentInstance, ref, onMounted } from 'vue';
  import * as echarts from "echarts";
  import '/public/static/theme/chalk.js'

  export default defineComponent({
    name: 'echarts',
    setup() {
      let myChart = null
      const { proxy } = getCurrentInstance()
      const myRef = ref(null)
      let allData = []     //服务器获取的数据
      let startValue = 0  //动画移动的起点
      let endValue = 9    //动画移动的终点
      let timerId = null

    /* 获取数据 */
    async function getData(){
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await proxy.$axios.get('rank')
      allData = ret
      // 对数据进行排序, 从大到小排序
      allData.sort((a, b) => {
        return b.value - a.value
      })
      updateChart()
      startInterval()
  }

    // 更新数据 显示图标
    function updateChart() {
      // 处理图表需要的数据
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      const provinceArr = allData.map(item => {
        return item.name
      })
      const valueArr = allData.map(item => {
          return item.value
        })
        const dataOption = {
          xAxis: {
            data: provinceArr
         },
         dataZoom: {
          show: false,
          startValue: startValue,
          endValue: endValue
         },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: arg => {
                let targetColorArr = colorArr[0]
                if (arg.vaule >= 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value >= 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: targetColorArr[0]
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])

              }
            }
          }
        ]
      }
      myChart.setOption(dataOption)
  }

  function startInterval () {
    if (timerId) {
      clearInterval(timerId)
    }
    timerId = setInterval(() => {
      startValue++
      endValue++
      if (endValue > allData.length - 1) {
        startValue = 0
        endValue = 9
      }
      updateChart()
    }, 3000)
  }


  //屏幕适配
  function screenAdapter(){
    const titleFontSize = myRef.value.offsetWidth / 100 * 3.6
    const adapterOption = {
      title: {
        textStyle: {
          fontSize: titleFontSize
        }
      },
      series: [
        {
          barWidth: titleFontSize,
          itemStyle: {
            barBorderRadius: [0.5 * titleFontSize, 0.5 * titleFontSize, 0, 0]
          }
        }
      ]
    }
    myChart.setOption(adapterOption)
    myChart.resize()
  }

  const initT = function(){
      myChart = echarts.init(myRef.value, 'chalk');
      const initOption = {
        title: {
          text: '▎ 地区销售排行',
          left: 20,
          top: 20
        },
        tooltip: {
          show: true
        },
        grid: {
          top: '40%',
          left: '5%',
          bottom: '5%',
          right: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
             itemStyle: {
              barBorderRadius: [20,20,0,0],
            }
          }
        ]
      }
      myChart.setOption(initOption)
      myChart.on('mouseover', () => {
          clearInterval(timerId)
        })
      myChart.on('mouseout', () => {
        startInterval()
      })
    }

  onMounted(() => {
    initT();
    getData();
    /* window.addEventListener('resize', screenAdapter) */
  });
  return {
    myRef
  };
    }
  });
</script>

<style lang='less' scoped>
</style>

