<template>
    <div class="header">
      <!--主要内容-->
      <div class="content-wrapper">
        <div class="avatar">
          <!--动态数据要动态属性-->
          <img class="avatar_img"  :src="seller.avatar" alt="">
        </div>
        <div class="content">
          <!--标题-->
          <div class="title">
            <i class="brand"></i>
            <span class="name">{{seller.name}}</span>
          </div>
          <!--描述-->
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <!--优惠-->
          <div v-if="seller.supports" class="support">
            <i class="icon" :class="classMap[seller.supports[0].type]"></i>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div v-if="seller.supports" @click="showDetail" class="count_wrapper">
          <div class="count_main">
            <span class="count">{{seller.supports.length}}个</span>
            <span class="icon-keyboard_arrow_right"></span>
          </div>
        </div>
      </div>
      <!--公告部分-->
      <div class="bulletin-wrapper">
        <span class="bulletin-title"></span>
        <span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <!--背景层-->
      <div class="background">
        <img :src="seller.avatar" alt="">
      </div>
      <!--详情弹出层-->
      <transition name="my-fade" >
        <div v-show="isDetailShow" class="detail" >
          <div class="detail-wrapper">
            <div class="main">
              <h1 class="name">{{seller.name}}</h1>
              <!--星星组件-->
              <div class="star-wrapper">
                <stars :size="48" :score="seller.score"></stars>
              </div>
              <!--标题-->
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <!--优惠内容-->
              <ul v-if="seller.supports" class="supports">
                <li class="support-item" v-for="(item, index) in seller.supports" :key="item.type">
                 <span class="icon" :class="classMap[seller.supports[index].type]">
                 </span>
                  <span class="text">{{seller.supports[index].description}}</span>
                </li>
              </ul>
              <!--公告标题-->
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <!--公告内容-->
              <div class="bulletin">
                <p class="content">
                  {{seller.bulletin}}
                </p>
              </div>
            </div>
            <div @click="hideDetail" class="close">
              <i class="icon-close"></i>
            </div>
          </div>
        </div>
      </transition>

    </div>
</template>

<script>
  import stars from '@components/stars/stars';
    export default {
      name: 'v-header',
      data () {
        return {
          classMap: [],
          isDetailShow: false
        }
      },
      methods: {
        showDetail () {
          this.isDetailShow = true
        },
        hideDetail () {
          this.isDetailShow = false
        }
      },
      props: {
        seller: {
          type: Object,
          default: () => ({})
        }
      },
      created () {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      },
      components: {
        stars
      }

    }

</script>

<style lang="scss" scoped>
  .header {
    color: #fff;
    background: rgba(7, 17, 27, .5);
    position: relative;
    overflow: hidden;
    .content-wrapper {
      padding: 48px 24px 36px 48px;
      /*计算 float元素高度*/
      overflow: hidden;
      .avatar {
        float: left;
        width: 128px;
        height: 128px;
        margin-right: 32px;
        .avatar_img {
          width: 100%;

          border-radius: 4px;
        }
      }
      .content {
        overflow: hidden;
        .title {
          margin: 4px 0 16px 0;
          .brand {
            display: inline-block;
            /*让文字顶部对齐，影响的是兄弟元素不是本身*/
            vertical-align: top;
            width: 60px;
            height: 36px;
            @include bg_image('brand');

          }
          .name {
            margin-left: 12px;
            font-size: 32px;
            line-height: 36px;
            font-weight: bold;
          }
        }
        .description {
          font-size: 24px;
          font-weight: 200;
          margin-bottom: 20px;
        }
        .support {
          .icon {
            display: inline-block;
            vertical-align: top;
            width: 24px;
            height: 24px;
            margin-bottom: 4px;
            margin-right: 8px;
            &.decrease {
              @include bg_image('decrease_1');
            }
            &.discount {
              @include bg_image('discount_1');
            }
            &.guarantee {
              @include bg_image('guarantee_1');
            }
            &.invoice {
              @include bg_image('invoice_1');
            }
          }
          .text {
            font-size: 20px;
            line-height: 24px;
          }
        }
      }
      .count_wrapper {
        position: relative;
        .count_main {
          position: absolute;
          right: 0;
          bottom: 0;
          padding: 0 16px;
          height: 48px;
          border-radius: 14px;
          background: rgba(0, 0, 0, .2);
          font-size: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-keyboard_arrow_right {
            margin-left: 2px;

          }
        }
      }
    }
  }
  .bulletin-wrapper {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 24px;
    background: rgba(7, 17, 27, 0.2);
    .bulletin-title {
      display: inline-block;
      width: 44px;
      height: 24px;
      @include bg_image('bulletin');
    }
    .bulletin-text {
      flex: 1;
      margin: 0 8px;
      font-size: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

    }

  }
  .background {
    position: absolute;
    z-index: -1;
    left: 0; right: 0;
    top: 0; bottom: 0;
    filter: blur(10px);
    img {
      width: 100%;
      height: 100%;
    }
  }
  /* 过渡动画 */
  .my-fade-enter-active, .my-fade-leave-active {
    transition: all .5s;

  }
  .my-fade-enter, .my-fade-leave-to {
    opacity: 0;

  }

  .detail {
    position: fixed;
    z-index: 2;
    width: 100%;
    height: 100%;
    left: 0; top: 0;
    background: rgba(7, 17, 27, 0.8);
    // 超出出现滚动条
    overflow: auto;
    .detail-wrapper {
      display: flex;
      min-height: 100%;
      flex-direction: column;
      .main {
        margin-top: 128px;
        flex: 1;
        .name {
          text-align: center;
          font-size: 32px;
          font-weight: 700;
        }
        .star-wrapper {
          margin-top: 36px;
          padding: 4px 0;
          text-align: center;
        }
        .title {
          display: flex;
          margin: 56px 0 48px 0;
          padding: 0 72px;
          align-items: center;
          .line {
            flex: 1;
            width: 224px;
            border-bottom: 1px solid rgba(255, 255, 255, .2);
          }
          .text {
            /*flex: 1;*/
            margin: 0 24px;
            font-size: 28px;
            font-weight: 700;
          }
        }
        .supports {
          width: 80%;
          margin: 0 auto;
          .support-item {
            display: flex;
            align-items: center;
            padding: 0 24px;
            margin-bottom: 24px;
            &:last-child {
              margin-bottom: 0;
            }
            .icon {
              display: inline-block;
              margin-right: 12px;
              width: 32px;
              height: 32px;
              line-height: 32px;
              &.decrease {
                @include bg_image('decrease_2');
              }
              &.discount {
                @include bg_image('discount_2');
              }
              &.special {
                @include bg_image('special_2');
              }
              &.guarantee {
                @include bg_image('guarantee_2');
              }
              &.invoice {
                @include bg_image('invoice_2');
              }
            }
            .text {
              font-size: 24px;
            }
          }
        }
        .bulletin {
          width: 80%;
          margin: 0 auto;
          .content {
            padding: 0 24px;
            margin-top: 48px;
            font-size: 24px;
            line-height: 48px;
          }
        }
      }
      .close {
        line-height: 64px;
        text-align: center;
      }
    }
  }
</style>
