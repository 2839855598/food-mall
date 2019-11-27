<template>
  <div>
    <transition name="fade">
      <!--遮罩-->
      <div class="mask" v-show="listShow" @click="hideShop"></div>
    </transition>
    <div class="shopcart" @click="toggleList">
      <div class="content">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="num-wrapper" v-show="totalCount > 0">
              <div class="num">{{totalCount}}</div>
            </div>
            <div class="logo" :class="{'highlight': totalCount > 0}">
              <span class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></span>
            </div>
          </div>
          <div class="price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click.stop="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <transition-group
          name="drop"
          @before-enter="beforeEnter"
          @enter="enter"
          @after-enter="afterEnter"
        >
          <div class="ball" v-for="(ball,index) in balls" v-show="ball.show" :key="index">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow" @click="stop">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food, index) in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food" ></cart-control>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script>
    import cartControl from '@components/cartcontrol/cartcontrol';
    import BScroll from 'better-scroll';
    export default {
      name: 'shopcart',
      data () {
        return {
          balls: [
            {
              show: false
            },
            {
              show: false
            },
            {
              show: false
            },
            {
              show: false
            }
          ],
          dropBalls: [],
          // 收缩
          fold: true
        }
      },
      props: {
        deliveryPrice: {
          type: Number,
          default: 0
        },
        minPrice: {
          type: Number,
          default: 0
        },
        selectFoods: {
          type: Array,
          default: () => []
        }
      },
      computed: {
        totalPrice () {
          let total = 0;
          for(let food of this.selectFoods) {
            total += food.price * food.count;
          }
          return total;
        },
        totalCount () {
          let count = 0;
          for(let food of this.selectFoods) {
            count += food.count;
          }
          return count;
        },
        payDesc () {
          if(this.totalPrice === 0) {
            return `￥${this.minPrice}元起送`;
          } else if(this.totalPrice < this.minPrice) {
            let differ = this.minPrice - this.totalPrice;
            return `还差￥${differ}元起送`;
          } else {
            return '去结算';
          }
        },
        payClass () {
          if(this.totalPrice < this.minPrice) {
            return 'not-enough';
          } else {
            return 'enough';
          }
        },
        listShow () {
          // 防止当减少到0的时候，仍然是展开效果
          // 所以必须是计算属性，以为也依赖totalCount
           if(!this.totalCount) {
             // 收缩
             this.fold = true;
             return false;
           }
           let show = !this.fold;
           if(show) {
             this.$nextTick(() => {
               if(!this.scroll) {
                 this.scroll = new BScroll(this.$refs.listContent, {
                   click: true
                 })
                 // 下一次显示就重新计算高度
               } else {
                 this.scroll.refresh();
               }

             })
           }
           return show;
        }
      },
      methods: {
        drop (el) {
          // 遍历这么多球和设置这么多球，主要为了避免多次点击
          for(let ball of this.balls) {
            if(!ball.show) {
              // 由 none => block，触发动画
              ball.show = true;
              ball.el = el;
              this.dropBalls.push(ball);
              // 跳出for循环,相当于每次点击的时候，都找到一个为false的小球，
              // 然后跳出for循环
              return;
              // 具体过程如下：
              // 比如第一次点击时候，第一个为false，找到它之后，改变未true，然后跳出
              // for循环，第二次点击时候，通过for循环，第一个为true了，第二个还是false，
              // 找到它，改变未true，然后跳出for循环。第三次点击找到for循环的第三个false
              // 总结：
              //      每次点击时候，都通过for循环找到一个为false的，改变为true，终止
              //      for循环，保证每次都是找到一个，因为点击一次，显示一个球。
            }
          }

        },
        beforeEnter (el) {
          let count = this.balls.length;
          while(count--) {
            let ball = this.balls[count];
            if(ball.show) {
              let rect = ball.el.getBoundingClientRect();
              // 从无到有，小球是进场运动，小球刚开始的位置是在 购物车里
              // 所以是从按钮处运动到 购物车里
              let x = rect.left - 32;

              // 向上
              let y = -(window.innerHeight - rect.top - 22);
              // 小球显现
              el.style.display = '';
              // 外层向上垂直运动
              el.style.webkitTransform = `translate3d(0,${y}px, 0)`;
              el.style.transform = `translate3d(0,${y}px, 0)`;
              let inner = el.getElementsByClassName('inner-hook')[0];

              inner.style.webkitTransform = `translate3d(${x}px,0, 0)`;
              inner.style.transform = `translate3d(${x}px,0, 0)`;
            }
          }
        },
        enter (el, done) {
          // 强制重绘
          let rf = el.offsetHeight;
          el.style.transform = el.style.webkitTransform = 'translate3d(0,0, 0)';
          let inner = el.getElementsByClassName('inner-hook')[0];

          inner.style.transform = inner.style.webkitTransform = 'translate3d(0,0, 0)'

          // 执行done后才能触发 afterEnter，如果在外面里直接执行done
          // 将导致没有动画
          el.addEventListener('transitionend', done);

        },
        afterEnter (el) {
           let ball = this.dropBalls.shift();
           if (ball) {
             ball.show = false;
             el.style.display='none';
           }
        },
        // 阻止冒泡，防止点击购物车展开栏的时候冒泡到父级，隐藏掉购物车展开栏
        stop (event) {
          event.stopPropagation();
        },
        // 切换 购物车展开栏的状态
        toggleList () {
          if(!this.totalCount) {
            return;
          }
          this.fold = !this.fold;
        },
        // 清空购物车
        empty () {
          for(let food of this.selectFoods) {
            food.count = 0;
          }
        },
        // 点击遮罩层，隐藏 购物车展开栏
        hideShop () {
          this.fold = true;
        },
        // 支付
        pay () {
          if(this.totalPrice < this.minPrice) {
            return;
          }
          window.alert(`一共要支付￥${this.totalPrice}元`);
        }
      },
      components: {
        cartControl
      }
    }
</script>

<style lang="scss" scoped>
  .shopcart {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 96px;
    .content {
      display: flex;
      background: #141d27;
      color: rgba(255, 255, 255, .4);
      font-weight: 700;
      .content-left {
        flex: 1;
        font-size: 0;
        .logo-wrapper {
          display: inline-block;
          // 为什么不用margin负值，由于baseline作用，不能超出父元素
          // 所以用relative
          position: relative;
          top: -20px;
         /*margin-top: -20px;*/
          box-sizing: border-box;
          width: 112px;
          height: 112px;
          padding: 12px;
          margin: 0 36px;
          border-radius: 50%;
          background: #141d27;
          vertical-align: top;
          .num-wrapper {
            position: relative;
            .num {
              position: absolute;
              top: -12px; right: -12px;
              width: 48px;
              line-height: 32px;
              text-align: center;
              border-radius: 32px;
              font-size: 18px;
              color: #fff;
              background: rgb( 240, 20, 20);
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4);
            }
          }
          .logo {
            height: 100%;
            border-radius: 50%;
            background: rgb(43,52,60);
            text-align: center;
            &.highlight {
              background: rgb(0, 160, 220);
            }
            .icon-shopping_cart {
              line-height: 88px;
              font-size: 48px;
              color: #80858a;
              &.highlight {
                color: #fff;
              }
            }
          }
        }
        .price {
          display: inline-block;
          margin: 24px 0;
          line-height: 48px;
          padding-right: 24px;
          font-size: 32px;
          &.highlight {
            color: #fff;
          }
        }
        @include border_1px('.price', 'right', rgba(255, 255, 255, .1));
        .desc {
          display: inline-block;
          margin: 24px 0 0 24px;
          line-height: 48px;
          font-size: 24px;

        }
      }
      .content-right {
        flex: 0 0 210px;
        width: 210px;
        .pay {
          line-height: 96px;
          padding: 0  16px ;
          font-size: 24px;
          text-align: center;

          &.not-enough {
            background: #2b333b;
          }
          &.enough {
            background: #00b43c;
            color: #fff;
          }
        }
      }
    }
    .ball-container {
      .ball {
        position: fixed;
        left: 64px;
        bottom: 44px;
        .inner {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgb(0, 160, 220);
        }
        // 外层
        &.drop-enter-active, &.drop-leave-active {
          transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
          // 内层
          .inner {
            transition: all 0.4s linear;
          }
        }

      }
    }
    .shopcart-list {
      position: absolute;
      top: 0;
      left: 0;
      // 从背景层底部移动上来，
      // 不加的话，就从最上面移动上来了，
      z-index: -1;
      width: 100%;

      // 向上移动相对于自身100%
      transform: translate3d(0, -100%, 0);
      &.fold-enter-active, &.fold-leave-active {
        transition: all .5s;
      }
      &.fold-enter, &.fold-leave-to {
        // 从无到有，进场动画
        transform: translate3d(0, 0, 0);
      }
      .list-header {
        line-height: 80px;
        padding: 0 36px;
        background: #f3f5f7;
        border-bottom: 2px solid rgba(7,17, 27,.1);
        overflow: hidden;
        .title {
          float: left;
          font-size: 28px;
          color: rgb(7,17, 27);
        }
        .empty {
          float: right;
          font-size: 24px;
          color: rgb(0, 160, 220);
        }
      }
      .list-content {
        padding: 0 36px;
        max-height: 434px;
        overflow: hidden;
        background: #fff;
        .food {
          position: relative;
          padding: 24px 0;
          box-sizing: border-box;
          @include _1px('bottom', rgba(7,17, 27,.1));
          .name {
            line-height: 48px;
            font-size: 28px;
            color: rgb(7,17, 27);
          }
          .price {
            position: absolute;
            right: 180px;
            bottom: 24px;
            line-height: 48px;
            font-size: 28px;
            font-weight: 700;
            color: rgb(240,20,20)
          }
          .cartcontrol-wrapper {
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
 }
  // 购物车展开栏时候的遮罩蒙版
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.6);
    // ios上的模糊效果
    backdrop-filter: blur(10px);
    &.fade-enter-active, &.fade-leave-active {
      transition: all .5s;
    }
    &.fade-enter, &.fade-leave-to {
      opacity: 0;
      background: rgba(0,0,0, 0);
    }
  }
</style>
