<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>

        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="shop-control">
            <div class="cartcontrol-wrapper">
              <cart-control :food="food" @cart-add="cartAdd"></cart-control>
            </div>
            <!--加动画原因，防止div立马消失，小球的位置获取不正确-->
            <transition name="fade">
              <div @click="addFirst(food, $event)" class="buy" v-show="!food.count">加入购物车</div>
            </transition>
          </div>
        </div>
        <!--分割线-->
        <split-line v-show="food.info"></split-line>
        <div class="info" >
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <rating-select
            :selectType="selectType"
            :onlyContent="onlyContent"
            :desc="desc"
            :ratings="food.ratings"
            @changeType="changeSelectType"
            @toggle-on="toggle"
          ></rating-select>
          <div class="rating-wrapper">
            <ul v-if="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="rating-item" >
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0,
                  'icon-thumb_down': rating.rateType ===1}"></span>
                </p>
              </li>
            </ul>
            <div class="no-rating" v-else>暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
  import BScroll from 'better-scroll';
  import ratingSelect from '@components/ratingSelect/ratingSelect';
  // 商品增加减少按钮
  import cartControl from '@components/cartcontrol/cartcontrol';
  import splitLine from '@components/splitLine/splitLine';
  // 格式化日期函数
  import {formatDate as newFormatDate} from '@/utils/date';
  // 正向
  const POSITIVE = 0;
  // 负向
  const NEGATIVE = 1;
  // 所有
  const ALL = 2;

    export default {
      name: "food",
      props: {
        food: {
          type: Object,
          default: () => ({})
        }
      },
      data () {
        return {
          showFlag: false,
          selectType: ALL,
          onlyContent: true,
          desc: {
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          }
        }
      },

      methods: {
        // 可以提供给父元素调用的方法
        show () {
          this.showFlag = true;
          // 每次打开保持初始化状态
          this.selectType = ALL;
          this.onlyContent = true;
          // 不需要每次都重新初始化
          this.$nextTick(() => {
            // 单例模式
            if(!this.scroll) {
              this.scroll = new BScroll(this.$refs.food, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          })
        },
        // 隐藏食物详情页
        hide() {
          this.showFlag = false;
        },
        // 第一次加入购物车
        addFirst(food, event) {
          // 第一次没有count属性，设置一下，以便可以监听属性变化
          this.$set(this.food, 'count', 1);
          this.$emit('cart-add', event.target);
        },
        // 第一次之后小球组件cartcontrol的增加
        cartAdd () {
          // 点击的 el
          this.$emit('cart-add', event.target);
        },
        // 点击时候改变类型
        changeSelectType (selectType) {
          this.selectType = selectType;
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        },
        toggle () {
          this.onlyContent = !this.onlyContent;
        },
        // 不同类型评价展示
        needShow (type, text) {
          if(this.onlyContent && !text) {
            return false;
          } else if(this.selectType === ALL) {
            return true;
          } else {
            return type === this.selectType;
          }
        },

      },
      filters: {
        formatDate (time) {
          const date = new Date(time);
          return newFormatDate(date, 'yyyy-MM-dd hh:mm');
        }
      },
      components: {
        cartControl,
        splitLine,
        ratingSelect
      }

    }
</script>

<style lang="scss" scoped>
  // 在购物车展开栏和遮罩层的 底部
  .food {
    position: fixed;
    left: 0;
    // 底部是购物车栏，会被购物车栏 后来者居上覆盖
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    transform: translate3d(0, 0, 0);
    &.move-enter-active, &.move-leave-active {
      transition: all .3s;
    }
    &.move-enter, &.move-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .image-header {
      position: relative;
      // 宽高比最好按照默认图片的宽高比，高度随宽度变化而变化
      width: 100%;
      // 默认内联元素也有高度
      height: 0;
      // 高度跟宽度一样，padding和margin百分比都是基于width
      padding-top: 100%;
      img {
        position: absolute;
        // 默认图片宽高比
        width: 100%;
        top: 0;
      }
      .back {
        position: absolute;
        left: 0;
        top: 20px;
        .icon-arrow_lift {
          padding: 20px;
          font-size: 40px;
          color: #fff;
        }
      }
    }
    .content {
      padding: 36px;
      .title {
        font-size: 28px;
        margin-bottom: 16px;
        font-weight: 700;
        color: rgb(7, 17, 27);
      }
      .detail {
        margin-bottom: 36px;
        font-size:0;
        line-height: 30px;
        .sell-count, .rating {
          font-size: 20px;
          color: rgb(147,153, 159);
        }
        .sell-count {
          margin-right: 24px;
        }
      }
      .price {
        font-weight: 700;
        line-height: 48px;
        .now {
          margin-right: 16px;
          font-size: 28px;
          color: rgb(240,20,20);
        }
        .old {
          text-decoration: line-through;
          font-size: 20px;
          color: rgb(147, 153, 159);
        }
      }
      .shop-control {
        position: relative;
        .cartcontrol-wrapper {
          position: absolute;
          right: 24px;
          top: -26px;
        }
        .buy {
          position: absolute;
          right: 36px;
          top: -20px;
          line-height: 48px;
          padding: 0 24px;
          -webkit-border-radius: 24px;
          -moz-border-radius: 24px;
          border-radius: 24px;
          font-size: 20px;
          color: #fff;
          background: rgb(0, 160, 220);
          &.fade-enter-active, &.fade-leave-active {
            transition: all .2s;
          }
          &.fade-enter, &.fade-leave-to {
            opacity: 0;
          }
        }
      }
    }
    .info {
      padding: 36px;
      .title {
        line-height: 28px;
        margin-bottom: 12px;
        font-size: 28px;
        color: rgb(7, 17, 27);
      }
      .text {
        line-height: 48px;
        padding: 0 16px;
        font-size: 24px;
        color: rgb(77, 85, 93);
      }
    }
    .rating {
      padding-top: 36px;
      .title {
        line-height: 28px;
        margin-bottom: 12px;
        font-size: 28px;
        color: rgb(7, 17, 27);
      }
      .rating-wrapper {
        padding: 0 36px;
        .rating-item {
          position: relative;
          padding: 32px 0;
          font-size: 20px;
          color: rgb(147, 153, 159);
          @include _1px('bottom', rgba(7, 17, 27, 0.1));
          .user {
            position: absolute;
            display: flex;
            align-items: center;
            right: 0;
            top: 16px;
            line-height: 24px;

            .name {
              margin-right: 12px;
            }
            .avatar {
              width: 24px;
              height: 24px;
              border-radius: 50%;
            }
          }
          .time {
            line-height: 24px;
            margin-bottom: 12px;
          }
          .text {
            line-height: 32px;
            font-size: 24px;
            color: rgb(7, 17, 27);
            .icon-thumb_up, .icon-thumb_down {
              margin-right: 8px;
              line-height: 48px;
              font-size: 24px;
            }
            .icon-thumb_up {
              color: rgb(0, 160, 220);
            }
          }
        }
        .no-rating {
          padding: 32px 0;
          font-size: 24px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
</style>
