<template>
  <div class="com-container">
    <div id="mycharts" ref="myRef" class="com-chart" />
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
      let currentIndex = 0  // 当前显示的数据
      let timerId = null // 定时器的标识


     /* 获取数据 */
    async function getData(){
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await proxy.$axios.get('stock')
      allData = ret
      updateChart()
  }

    // 更新数据 显示图标
    function updateChart() {
      // 处理图表需要的数据
      // 增加5个圆环的渐变颜色范围
      const colorArrs = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      // 处理图表需要的数据
      const start = currentIndex * 5
      const end = (currentIndex + 1) * 5
      // 先显示前5条数据
      const showData = allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          label: {
            color: colorArrs[index][0],
            formatter: function(){
              return item.name + '\n\n' + item.sales
          }
          },
          data: [
            {
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0,[
                  {
                    offset: 0,
                    color: colorArrs[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArrs[index][1]
                  }
                ])
              }

            },
            {
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }

      myChart.setOption(dataOption)
  }

  //屏幕适配
  function screenAdapter(){
    const titleFontSize = myRef.value.offsetWidth / 100 * 3.6
    const innerRadius = titleFontSize * 2.5
    const outterRadius = innerRadius * 1.125
    const adapterOption = {
      title: {
        textStyle: {
          fontSize: titleFontSize
        }
      },
      series: [
        {
          type: 'pie',
          radius: [outterRadius, innerRadius],
          label: {
            fontSize: titleFontSize / 2
          }
        },
        {
          type: 'pie',
          radius: [outterRadius, innerRadius],
          label: {
            fontSize: titleFontSize / 2
          }
        },
        {
          type: 'pie',
          radius: [outterRadius, innerRadius],
          label: {
            fontSize: titleFontSize / 2
          }
        },
        {
          type: 'pie',
          radius: [outterRadius, innerRadius],
          label: {
            fontSize: titleFontSize / 2
          }
        },
        {
          type: 'pie',
          radius: [outterRadius, innerRadius],
          label: {
            fontSize: titleFontSize / 2
          }
        }
      ]
    }
    myChart.setOption(adapterOption)
    myChart.resize()
  }

  function  startInterval () {
      if (timerId) {
        clearInterval(timerId)
      }
      timerId = setInterval(() => {
        currentIndex++
        if (currentIndex > 1) {
          currentIndex = 0
        }
        updateChart() // 在更改完currentIndex之后 , 需要更新界面
      }, 5000)
    }

  const initT = function(){
    myChart = echarts.init(myRef.value, 'chalk');
    const centerPointers = [
      ['18%', '40%'],
      ['50%', '40%'],
      ['82%', '40%'],
      ['34%', '75%'],
      ['66%', '75%']
    ]
    const initOption = {
      title: {
        text: '▎ 库存销售量',
        left: 20,
        top: 20
      },
      series: [
      {
        type: 'pie',
        center: centerPointers[0],
        hoverAnimation: false,
        label: {
          show: true,
          position: 'center',
        }, 
        labelLine: {
          show: false
        }
      },
      {
        type: 'pie',
        center: centerPointers[1],
        hoverAnimation: false,
        label: {
          show: true,
          position: 'center'
        },
        labelLine: {
          show: false
        }
      },
      {
        type: 'pie',
        center: centerPointers[2],
        hoverAnimation: false,
        label: {
          show: true,
          position: 'center'
        },
        labelLine: {
          show: false
        }
      },
      {
        type: 'pie',
        center: centerPointers[3],
        hoverAnimation: false,
        label: {
          show: true,
          position: 'center'
        },
        labelLine: {
          show: false
        }
      },
      {
        type: 'pie',
        center: centerPointers[4],
        hoverAnimation: false,
        label: {
          show: true,
          position: 'center'
        },
        labelLine: {
          show: false
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
    screenAdapter()
    window.addEventListener('resize', screenAdapter)
  });
  return {
    myRef,
    screenAdapter
  };
    }
  });
</script>

<style lang='less' scoped>
</style>

