<template>
    <div class="seller" ref="seller">
      <div class="seller-content">
        <div class="overview">
          <!--收藏-->
          <div class="favorite-wrapper">
            <div class="favorite" @click="toggleFavorite">
              <span class="icon-favorite" :class="{'active': favorite}"></span>
              <span class="text">{{favoriteText}}</span>
            </div>
          </div>

          <h1 class="title">{{seller.name}}</h1>
          <div class="desc">
            <stars :size="36" :score="seller.score"></stars>
            <span class="text">{{seller.ratingCount}}</span>
            <span class="text">月售{{seller.sellCount}}单</span>
          </div>
          <ul class="remark">
            <li class="block">
              <h2>起送价</h2>
              <div class="content">
                <span class="stress">{{seller.minPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>商家配送</h2>
              <div class="content">
                <span class="stress">{{seller.deliveryPrice}}</span>元
              </div>
            </li>
            <li class="block">
              <h2>平均配送时间</h2>
              <div class="content">
                <span class="stress">{{seller.deliveryTime}}</span>分钟
              </div>
            </li>
          </ul>

        </div>
        <split-line></split-line>
        <!--公告-->
        <div class="bulletin">
          <h1 class="title">公告与活动</h1>
          <div class="content-wrapper">
            <p class="content">{{seller.bulletin}}</p>
            <ul class="supports" v-if="seller.supports">
              <li
                class="support-item"
                v-for="(item,index) in seller.supports"
                :key="index"
              >
               <span class="icon" :class="classMap[seller.supports[index].type]">
                 </span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
          </div>
        </div>
        <split-line></split-line>
        <!--商家实景-->
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <div class="pic-wrapper" ref="picWrapper">
            <ul class="pic-list">
              <li
                class="pic-item"
                v-for="(pic, index) in seller.pics"
                :key="index"
              >
                <img :src="pic" alt="">
              </li>
            </ul>
          </div>

        </div>
        <split-line></split-line>
        <!--商家信息-->
        <div class="info">
          <h1 class="title">商家信息</h1>
          <ul>
            <li
              class="info-item"
              v-for="(info, index) in seller.infos"
              :key="index"
            >
              {{info}}
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
  import stars from '@components/stars/stars';
  import splitLine from '@components/splitLine/splitLine';
  import BScroll from 'better-scroll';
  import { saveToLocal, loadFromLocal} from '@/utils/store';

    export default {
      name: "seller",
      props: {
          seller: {
            type: Object,
            default: () => ({})
          }
      },

      data () {
        return {
          classMap: [],
          favorite: (() => {
            // 默认是 false
            return loadFromLocal(this.seller.id, 'favorite', false);
          })()
        }
      },
      computed: {
        favoriteText () {
          return this.favorite ? '已收藏' : '收藏';
        }
      },
      created () {
        this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      },
      mounted () {
        this.$nextTick( () => {
          // 垂直方向的
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });

          // 水平方向的
          if(!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              // 忽略垂直方向滚动
              eventPassthrough: 'vertical'
            });
          } else {
            this.picScroll.refresh();
          }

        });

      },
      methods: {
        toggleFavorite () {
          this.favorite = !this.favorite;
          // 存储在 localStorage，方便刷新的时候，从本地获取状态
          saveToLocal(this.seller.id, 'favorite', this.favorite);
        }
      },
      components: {
        stars,
        splitLine
      }
    }
</script>

<style lang="scss" scoped>
  .seller {
    position: absolute;
    top: 348px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      padding: 36px;
      .favorite-wrapper {
        position: relative;
        .favorite {
          position: absolute;
          right: 0;
          top: 0;
          width: 100px;
          text-align: center;
          .icon-favorite {
            display: block;
            margin-bottom: 8px;
            font-size: 48px;
            color: #d4d6d9;
            &.active {
              color: rgb(240,20,20);
            }
            .text {
              line-height: 20px;
              font-size: 20px;
              color: rgb(7,17,27);
            }
          }
        }
      }
      .title {
        margin-bottom: 16px;
        font-size: 28px;
        color: rgb(7, 17, 27);
      }
      .desc {
        display: flex;
        align-items: center;
        padding-bottom: 36px;

        @include _1px('bottom', rgba(7, 17, 27, 0.1));
        .stars {
          margin-right: 16px;
        }
        .text {
          margin-right: 24px;
          line-height: 36px;
          font-size: 20px;
          color: rgb(77,85,93);
        }
      }
      .remark {
        display: flex;
        padding-top: 36px;
        .block {
          flex: 1;
          text-align: center;
          border-right: 2px solid rgba(7,17,27,0.1);
          &:last-child {
            border: none;
          }
          h2 {
            margin-bottom: 8px;
            line-height: 20px;
            font-size: 20px;
            color: rgb(147,153, 159);
          }
          .content {
            line-height: 48px;
            font-size: 20px;
            color: rgb(7, 17, 27);
            .stress {
              font-size: 48px;
            }
          }
        }
      }

    }
    .bulletin {
      padding: 36px 36px 0 36px;
      white-space: normal;
      .title {
        margin-bottom: 16px;
        line-height: 28px;
        color: rgb(7,17, 27);
        font-size: 28px;
      }
      .content-wrapper {
        padding: 0 24px 32px;
        @include _1px('bottom', rgba(7,17,27,0.1));
        .content {
          line-height: 48px;
          font-size: 20px;
          color: red;
        }
      }
      .supports {
        .support-item {
          display: flex;
          align-items: center;
          padding: 32px 24px;
          &:last-child {
            border: none;
          }
          .icon {
            display: inline-block;
            margin-right: 12px;
            width: 32px;
            height: 32px;
            line-height: 32px;
            &.decrease {
              @include bg_image('decrease_4');
            }
            &.discount {
              @include bg_image('discount_4');
            }
            &.special {
              @include bg_image('special_4');
            }
            &.guarantee {
              @include bg_image('guarantee_4');
            }
            &.invoice {
              @include bg_image('invoice_4');
            }
          }
          .text {
            line-height: 32px;
            font-size: 20px;
            color: rgb(7,17, 27);
          }
        }
      }
    }
    .pics {
      padding: 36px;
      .title {
        margin-bottom: 24px;
        line-height: 28px;
        color: rgb(7,17,27);
        font-size: 28px;
      }
      .pic-wrapper {
        overflow: hidden;
        .pic-list {
          display: inline-flex;
          align-items: center;
          .pic-item {
            margin-right: 12px;
            width: 240px;
            height: 180px;
            &:last-child {
              margin: 0;
            }
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    .info {
      padding: 36px 36px 0 36px;
      color: rgb(7,17, 27);

      .title {
        padding-bottom: 24px;
        line-height: 28px;
        font-size: 28px;
      }
      .info-item {
        padding: 32px 24px;
        line-height: 32px;
        font-size: 20px;
        @include _1px('bottom', rgba(7,17,27,0.1));
        &:last-child {
          border: none;
        }
      }
    }
  }
</style>
