<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" id="mycharts" ref="myRef"></div>
  </div>
</template>

<script lang="js">
  import { defineComponent, getCurrentInstance, ref, onMounted } from 'vue';
  import * as echarts from "echarts";
  import '/public/static/theme/chalk.js'
  import axios from 'axios'
  import { getProvinceMapInfo } from '@/utils/map_utils'


  export default defineComponent({
    name: 'echarts',
    setup() {
      let myChart = null
      const { proxy } = getCurrentInstance()
      const myRef = ref(null)
      let allData = []     //服务器获取的数据


    /* 获取数据 */
   function getData(){
    proxy.$axios.get('map').then(res => {
          console.log(res.data)
          allData = res.data
          updateChart()
      })
   }

    // 更新数据 显示图标
    function updateChart() {
      const legendArr = allData.map(item =>{
        return item.name
      })
      const seriesArr = allData.map( item =>{
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption  = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      myChart.setOption(dataOption)
    }

  //屏幕适配
  function screenAdapter(){
    const titleFontSize = myRef.value.offsetWidth / 100 * 3.6
    const adapterOption = {
      title:{
        textStyle: {
          fontSize: titleFontSize
        }
      },
      legend:{
        itemWidth: titleFontSize / 2,
        itemHeight: titleFontSize / 2,
        itemGap: titleFontSize / 2,
        textStyle:{
          fontSize: titleFontSize /2
        }
      }
    }
      myChart.setOption(adapterOption)
      myChart.resize()
  }

  //回到中国
  function revertMap() {
    myChart.setOption({
      geo: {
        map: 'china'
      }
    })
  }

   const initT = async function(){
      myChart = echarts.init(document.getElementById('mycharts'), 'chalk');
      const res = await axios.get('http://localhost:8999/static/map/china.json')
      echarts.registerMap('china', res.data)
      const initOption = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        legend:{
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        },
        geo:{
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle:{
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        }
      }
      myChart.on('click', async arg => {
        // arg.name 就是所点击的省份名称, 是中文
        const provinceInfo = getProvinceMapInfo(arg.name)
        const { data: ret } = await axios.get('http://localhost:8999' + provinceInfo.path)
          echarts.registerMap(provinceInfo.key, ret)
          myChart.setOption({
            geo: {
              map: provinceInfo.key
            }
          })
            getData()
          })

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
    revertMap
  };
    }
  });
</script>

<style>
</style>

