<template>
  <div class="com-container">
    <div id="mycharts" ref="myRef" class="com-page" />
    <span class="iconfont arr_left" @click="toLeft" :style="state.comStyle">&#xe6ef;</span>
    <span class="iconfont arr_right" @click="toRight" :style="state.comStyle">&#xe6ed;</span>
    <span class="cat_name" :style="state.comStyle">{{state.catTitle}}</span>
  </div>
</template>

<script lang="js">
  import { defineComponent, getCurrentInstance, ref, onMounted, reactive, computed } from 'vue';
  import * as echarts from "echarts";
  import '/public/static/theme/chalk.js'

  export default defineComponent({
    name: 'echarts',
    setup() {
      let myChart = null
      const { proxy } = getCurrentInstance()
      const myRef = ref(null)
      let allData = []     //服务器获取的数据
      let currentIndex = 0  //当前显示的索引
      let state = reactive({})
      let titleFontSize = reactive({
            a : 0
        })

 /* 获取数据 */
    async function getData(){
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await proxy.$axios.get('hotproduct')
      allData = ret
      updateChart()
  }

    // 更新数据 显示图标
    function updateChart() {
      state.catTitle = computed({
        get(){
          if (!allData) {
            return ''
          }
            return allData[currentIndex].name
        }
      })

      state.comStyle = computed({
        get(){
          return {fontSize: titleFontSize.a + 'px'}
        }
      })
      // 处理图表需要的数据
      // 饼图数据
      const seriesData = allData[currentIndex].children.map(item => {
        return {
            value: item.value,
            name: item.name,
            children: item.children
          }
        })
      // 图例数据
      const legendData = allData[currentIndex].children.map(item => {
          return item.name
        })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }

      myChart.setOption(dataOption)
  }

  function toLeft () {
    currentIndex--
    if (currentIndex < 0) {
      currentIndex = allData.length - 1
    }
    updateChart()
  }

  function toRight () {
    currentIndex++
    if (currentIndex > allData.length - 1) {
      currentIndex = 0
    }
    updateChart()
  }


  //屏幕适配
  function screenAdapter(){
    titleFontSize.a = myRef.value.offsetWidth / 100 * 3.6
     const adapterOption = {
      title: {
        textStyle: {
          fontSize: titleFontSize.a
        }
      },
      series: [
          {
            radius: titleFontSize.a * 4.5,
            center: ['50%', '60%'],
          }
        ],
      legend: {
        itemWidth: titleFontSize.a / 2,
        itemHeight: titleFontSize.a / 2,
        itemGap: titleFontSize.a / 2,
        textStyle: {
          fontSize: titleFontSize.a / 2
        }
      }
    }
      myChart.setOption(adapterOption)
      myChart.resize()
  }

  const initT = function(){
      myChart = echarts.init(myRef.value, 'chalk');
      const initOption = {
        title: {
          text: '▎ 热销商品销售金额占比统计',
          left: 20,
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            let tipArray = []
            params.data.children.forEach(function(item) {
              let childStr = `${item.name}&nbsp;&nbsp;&nbsp;${parseInt((item.value / params.value) * 100) + '%'}`
              tipArray.push(childStr)
            })
            return tipArray.join('<br/>')
          }
        },

        legend: {
          top: '15%',
          icon: 'circle'
        },
        series: [
          {
            type: 'pie',
            label: { // 隐藏文字
              show: false
            },
            labelLine: { // 隐藏线
              show: false
            },
            emphasis: {
              label: { // 高亮显示文字
                show: true
              }
            }
          }
        ]

      }
      myChart.setOption(initOption)
    }

  onMounted(() => {
    initT();
    getData();
    screenAdapter()
    window.addEventListener('resize', screenAdapter)
  });
  return {
    myRef,
    toLeft,
    toRight,
    state
  };
    }
  });
</script>

<style lang='less' scoped>
.arr_left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr_right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat_name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  font-weight: bold;
  color: white;
}
</style>

