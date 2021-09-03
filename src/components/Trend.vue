<template>
  <div class="com-container">
      <div class="title" :style="state.comStyle">
      <span>{{ '▎ ' +  state.showTitle}}</span>
      <span class="iconfont title-icon" :style="state.comStyle"  @click="showChoice.b = !showChoice.b">&#xe6eb;</span>
      <div class="select-con" v-if="showChoice.b" :style="state.marginStyle">
        <div class="select-item" v-for="item in state.selectTypes" :key="item.key" @click="handleSelect(item.key)">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="myRef" id="trend_ref"></div>
  </div>
</template>

<script lang="js">
  import { defineComponent, getCurrentInstance, ref, onMounted, computed, reactive} from 'vue';
  import * as echarts from "echarts";
  import '/public/static/theme/chalk.js'

  export default defineComponent({
      setup(){
        let myChart = null
        let allData = null
        const { proxy } = getCurrentInstance()
        const myRef = ref(null)
        let titleFontSize =reactive({
            a : 0
        })  // 指明标题的字体大小
        let showChoice = reactive({
            b : false
        })//是否显示可选项
        let choiceType = 'map'    //显示数据的类型
        let state = reactive({
            name: "gyz"
        })
        
        
        const initT = function(){
            myChart = echarts.init(myRef.value, 'chalk');
            const initOption = {
                grid:{
                    left: '3%',
                    top: '35%',
                    right: '4%',
                    bottom: '1%',
                    containLabel: true
                },
                tooltip:{
                    trigger: 'axis'
                },
                legend:{
                    top: '15%',
                    left: 20,
                    icon: 'circle'
                },
                xAxis:{
                    type: 'category',
                    boundaryGap:false
                },
                yAxis:{
                    type: 'value'
                },
            }
            myChart.setOption(initOption)

            //鼠标事件
            myChart.on('mouseover', ()=>{
                clearInterval(timerId)
            })
            myChart.on("mouseout", ()=>{
                startInterval()
            })
        }

        function updateChart(){
            state.selectTypes = computed({
                get(){
                    if(!allData){
                        return []
                    }else{
                        return allData.type.filter(item => {
                            return item.key !== choiceType
                        })
                    }
                }
            })

            // 设置给标题的样式
        state.comStyle = computed({
            get(){
                return {
                    fontSize: titleFontSize.a + 'px'
                }
            }
        })

        state.marginStyle = computed({
            get(){
                return {
                    marginLeft: titleFontSize + 'px'
                }
            }

        })

        state.showTitle = computed({
            get(){
                if(!allData){
                    return ''
                }
                else{
                    return allData[choiceType].title
                }
            }

            })
             // 半透明的颜色值
            const colorArr1 = [
                'rgba(11, 168, 44, 0.5)',
                'rgba(44, 110, 255, 0.5)',
                'rgba(22, 242, 217, 0.5)',
                'rgba(254, 33, 30, 0.5)',
                'rgba(250, 105, 0, 0.5)'
            ]
            // 全透明的颜色值
            const colorArr2 = [
                'rgba(11, 168, 44, 0)',
                'rgba(44, 110, 255, 0)',
                'rgba(22, 242, 217, 0)',
                'rgba(254, 33, 30, 0)',
                'rgba(250, 105, 0, 0)'
            ]
            // x轴的数据
            const timeArrs = allData.common.month
            // y轴的数据, 暂时先取出map这个节点的数据
            // map代表地区销量趋势
            // seller代表商家销量趋势
            // commodity代表商品销量趋势
            const valueArr = allData[choiceType].data
            const seriesArr = valueArr.map((item,index) => {
                return{
                    type: 'line',
                    name: item.name,
                    data: item.data,
                    stack: choiceType,
                    areaStyle:{
                        color: new echarts.graphic.LinearGradient(0,0,0,1,[
                            {
                                color: colorArr1[index],
                                offset: 0
                            },
                            {
                                color: colorArr2[index],
                                offset: 1
                            }
                        ])
                    }
                }
            })

            //图例数据
            const legendArr = valueArr.map((item) => {
                return item.name
            })
            const dataOption ={
                xAxis:{
                    data: timeArrs
                },
                legend: {
                   data: legendArr
                },
                series:seriesArr

            }

            myChart.setOption(dataOption)
        }

        async function getData(){
            await proxy.$axios.get('trend').then(res => {
                allData = res.data
            })
            updateChart()
            
        }

        function handleSelect(currentType){
            choiceType = currentType
            updateChart()
            showChoice.b = false
        }
   
        function showChoiceMethed(){
            showChoice.b = !showChoice
        }

          //屏幕适配
        function screenAdapter(){
            titleFontSize.a = myRef.value.offsetWidth / 100 * 3.6
            const adapterOption = {
                legend: {
                    itemWidth: titleFontSize.a,
                    itemHeight: titleFontSize.a,
                    itemGap: titleFontSize.a,
                    textStyle: {
                        fontSize: titleFontSize.a / 2
                    }
                }
            }
            myChart.setOption(adapterOption)
            myChart.resize()
        }

    onMounted(() => {
        initT();
        getData();
        window.addEventListener('resize', screenAdapter)
        screenAdapter()
    });
        return{
            state,
            showChoice,
            myRef,
            handleSelect,
            showChoiceMethed,
        }
      }
  })
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-con {
    background-color: #222733;
  }
}
</style>