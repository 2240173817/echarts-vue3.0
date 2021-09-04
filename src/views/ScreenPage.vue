<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img src="/static/img/header_border_dark.png" alt />
      </div>
      <span class="logo">
        <img src="/static/img/logo_dark.png" alt />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img src="/static/img/qiehuan_dark.png" class="qiehuan" />
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('trend')"
              :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"
            ></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('seller')"
              :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('map')"
              :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"
            ></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('rank')"
              :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('hot')"
              :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"
            ></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <!-- icon-compress-alt -->
            <span
              @click="changeSize('stock')"
              :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"
            ></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from "@/components/Hot.vue";
import Map from "@/components/Map.vue";
import Rank from "@/components/Rank.vue";
import Seller from "@/components/Seller.vue";
import Stock from "@/components/Stock.vue";
import Trend from "@/components/Trend.vue";

import { mapState } from "vuex";
import {
  defineComponent,
  getCurrentInstance,
  ref,
  onMounted,
  computed,
  nextTick,
  reactive,
} from "vue";

export default defineComponent({
  name: "ScreenPage",
  components: {
    Trend,
    Rank,
    Stock,
    Hot,
    Map,
    Seller,
  },
  setup() {
    let trend = ref(null);
    let map = ref(null);
    let rank = ref(null);
    let stock = ref(null);
    let seller = ref(null);
    let hot = ref(null);
    let fullScreenStatus = reactive({
      trend: false,
      seller: false,
      map: false,
      rank: false,
      hot: false,
      stock: false,
    });

    function changeSize(chartName) {
      // 先得到目标状态
      const targetValue = !fullScreenStatus[chartName];
      // 将所有的图表设置为非全屏
      Object.keys(fullScreenStatus).forEach((item) => {
        fullScreenStatus[item] = false;
      });
      console.log("lll", chartName);
      // 将目标图表设置为目标状态
      fullScreenStatus[chartName] = targetValue;
      if (chartName == "map") {
        nextTick(() => {
          map.value.screenAdapter();
        });
      }
      if (chartName == "trend") {
        nextTick(() => {
          trend.value.screenAdapter();
        });
      }
      if (chartName == "hot") {
        nextTick(() => {
          hot.value.screenAdapter();
        });
      }
      if (chartName == "stock") {
        nextTick(() => {
          stock.value.screenAdapter();
        });
      }
      if (chartName == "seller") {
        nextTick(() => {
          seller.value.screenAdapter();
        });
      }
      if (chartName == "rank") {
        nextTick(() => {
          rank.value.screenAdapter();
        });
      }
    }

    return {
      fullScreenStatus,
      changeSize,
      trend,
      map,
      hot,
      seller,
      stock,
      rank,
    };
  },
});
</script>
<style lang="less" scoped>
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      position: relative;
      height: 53%;
    }
    #left-bottom {
      position: relative;
      height: 31%;
      margin-top: 25px;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      position: relative;
      width: 100%;
      height: 56%;
    }
    #middle-bottom {
      position: relative;
      margin-top: 25px;
      width: 100%;
      height: 28%;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      position: relative;
      height: 46%;
    }
    #right-bottom {
      position: relative;
      height: 38%;
      margin-top: 25px;
    }
  }
}
.resize {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}
</style>