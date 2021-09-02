<template>
  <div id="mycharts" ref="myRef" class="com-page" />
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
      let currentPage = 1   //当前页数
      let totalPage = 0       //当前页 每页5条
      let timerId = null //定时器标识
      
    /* 获取数据 */  
   function getData(){
    proxy.$axios.get('seller').then(res => {
      console.log(res.data)
      allData = res.data
          // 对allData进行从大到小的排序
      allData.sort((a, b) => {
        return a.name - b.name
    })
    totalPage = allData.length % 5 === 0 ? parseInt(allData.length / 5 ) : parseInt(allData.length /5) + 1
    updateChart()
    startInterval()
    })
    
    }

    //动画函数
    function startInterval(){
      if(timerId){
        clearInterval(timerId)
      }
      timerId = setInterval(() => {
        currentPage ++
        if(currentPage >totalPage){
          currentPage = 1
        }
        updateChart()
      }, 3000)
    }

    // 更新数据 显示图标
    function updateChart() {
      
      const start = (currentPage -1) * 5
      const end = currentPage * 5
      const showData = allData.slice(start, end)
    // 处理数据并且更新界面图表
    const sellerNames = showData.map((item) => {
      return item.name
    })
    const sellerValues = showData.map((item) => {
      return item.value
    })  

    myChart.setOption({ 
      title:{
        text: "▎商家销售统计",
        textStyle:{
          fontSize: 66,
          color: "#fff"
        },
        left: 20,
        top: 20
      },
      grid:{
        top: '20%',
        left: '3%',
        right: '6%',
        bottom: '3%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          z: 0,
          lineStyle: {
            width: 66,
            color: '#2D3443'
          }
        }
      },
      xAxis: {
        type: 'value',
        /* max: allData[allData.length - 1].value */
        },
      yAxis: {
        type: 'category',
        data: sellerNames
      },
      series: [
        {
          label: {
            show: true,
            position: 'right',
            textStyle: {
              color: '#fff'
            }
          },
          barWidth: 66,
          itemStyle: {
            barBorderRadius: [0, 33, 33, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: '#5052EE'
              },
              {
                offset: 1,
                color: '#AB6EE5'
              }
            ])
          },
          type: 'bar',
          data: sellerValues
        }
      ]
    })
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
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      myChart.setOption(adapterOption)
      myChart.resize()
  }

  const initT = function(){
      myChart = echarts.init(document.getElementById('mycharts'), 'chalk');
      //鼠标事件
      myChart.on('mouseover', ()=>{
        clearInterval(timerId)
      })
      myChart.on("mouseout", ()=>{
        startInterval()
      })
    }
   

  onMounted(() => {
    initT();
    getData();
    window.addEventListener('resize', screenAdapter)
  });
  return {
    myRef
  };
    }
  });
</script>

<style>
</style>

