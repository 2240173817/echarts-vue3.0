<template>
  <p>ssss</p>
  <div id="mycharts" ref="myRef" class="com-page" />
</template>

<script lang="js">
  import { defineComponent, getCurrentInstance, ref, onMounted } from 'vue';
  import * as echarts from "echarts";
  import '/public/static/theme/chalk.js'
  import { useStore } from "vuex";

  export default defineComponent({
    name: 'echarts',
    setup() {
      let store = useStore()
      let myChart = null
      const { proxy } = getCurrentInstance()
      const myRef = ref(null)
      let allData = []     //服务器获取的数据


    /* 获取数据 */
   function getData(){
    proxy.$axios.get('seller').then(res => {

    })

  }

    // 更新数据 显示图标
    function updateChart() {
      myChart.setOption({

    })
  }

  //屏幕适配
  function screenAdapter(){
    /* const titleFontSize = myRef.value.offsetWidth / 100 * 3.6 */
     const adapterOption = {

      }
      myChart.setOption(adapterOption)
      myChart.resize()
  }

  const initT = function(){
      myChart = echarts.init(document.getElementById('mycharts'), 'chalk');

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

<style>
</style>

