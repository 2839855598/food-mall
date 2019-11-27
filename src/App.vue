<template>
  <div  id="app">
    <!--头部-->
    <v-header :seller="seller" ></v-header>
    <!--导航栏-->
    <div  class="tab">
        <div  class="tab-item">
          <router-link  :to="{path: 'goods'}">商品</router-link>
        </div>
        <div class="tab-item">
          <router-link :to="{path: 'ratings'}">评论</router-link>
        </div>
        <div class="tab-item">
          <router-link :to="{path: 'seller'}">商家</router-link>
        </div>
    </div>
    <!--缓存组件状态-->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>
<script>
import vHeader from '@components/v-header/v-header'
import { urlParse } from '@/utils/utils';

const ERR_OK = 0;

export default {
  name: 'home',
  components: {
    vHeader
  },
  data () {
    return {
      seller: {
        // 表明某个商家的唯一id
        id: (() => {
          let queryPara = urlParse();
          return queryPara.id;
        })()
      }
    }
  },

  created () {
    this.$api.mall.seller({
      id: this.seller.id
    })
      .then(({ data: { data, errno } }) => {
        // response.data才是 整体返回的json对象，具体数据
        // 还在json对象的data中

        // 没错误的话
        if (errno === ERR_OK) {

          this.seller = {...this.seller, ...data};
          console.log(this.seller)
        }
      })
  }
}
</script>
<style lang="scss">
  @import "~@/assets/css/reset.scss";
  #app {
    .box {
      @include _1px(bottom, rgba(7, 17, 27, .1));
    }
    .tab {
      display: flex;

      @include _1px(bottom, rgba(0,0,0,.5));
      .tab-item {
        flex: 1;
        text-align: center;
        & > a {
          display: block;
          height: 80px;
          line-height: 80px;
          font-size: 28px;
          color: rgb(77,85,93);
          &.active {
            color: rgb(240, 20, 20);
          }
        }
      }
    }
  }

</style>
