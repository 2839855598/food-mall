<template>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" @click="select(index, $event)" class="menu-item" :class="{'current': currentIndex === index}" :key="index">
            <span class="text">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li  v-for="(item,index) in goods" class="food-list food-list-hook"  :key="index">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food, $event)" v-for="food in item.foods" class="food-item" :key="food.name">
                <div class="icon">
                  <img :src="food.icon" alt="">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-parent">
                    <div class="cartcontrol-wrapper">
                      <cart-control :food="food"  @cart-add="cartAdd"></cart-control>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--食物详情页-->
     <!--在购物车展开栏和遮罩层的 底部显示，所以要放在前面，后来者居上-->
      <food :food="clickedFood" @cart-add="cartAdd" ref="food"></food>
      <!--购物车-->
      <shopCart  ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopCart>

    </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import shopCart from '@components/shopcart/shopcart'
  import food from '@components/food/food'
  import cartControl from '@components/cartcontrol/cartcontrol';
  const ERR_OK = 0;
export default {
  name: 'goods',
  props: {
    seller: {
      type: Object,
      default: () => ({})
    }

  },
  data () {
    return {
      goods: [],
      classMap: [],
      menuScroll: {},
      foodScroll: {},
      listHeight: [],
      scrollY: 0,
      clickedFood: {}
    }
  },
  computed: {
    // 根据滚动高度来 动态计算索引
    currentIndex() {
       for(let i=0; i<this.listHeight.length; i++) {
         let height1 = this.listHeight[i];
         let height2 = this.listHeight[i+1];
         // 滚动到最后一个 或者 在某个区间内
         if(!height2 || (this.scrollY >= height1 && this.scrollY < height2) ) {
           return i;
         }
       }
       return 0;
    },
    // 选中的食物
    // 一旦goods中的food.count变化，就会改变selectFoods
    selectFoods () {
      let foods = [];
      for(let good of this.goods) {
        for(let food of good.foods) {
          if(food.count) {
            foods.push(food);
          }
        }
      }
      return foods;
    }
  },
  methods: {
    _initScroll () {

      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        // 实时滚动的位置
        probeType: 3
      });
      // 监听实时滚动的位置
      this.foodScroll.on('scroll', pos => {

        this.scrollY = Math.abs(Math.round(pos.y));
      })
    },
    // 计算所有li高度
    _calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      // 所有li的高度，包括0
      let height = 0;
      this.listHeight.push(height);

      for(let val of foodList) {
        height += val.clientHeight;
        this.listHeight.push(height);
      }
    },
    select(index, $event) {
      // 右侧所有大li的集合
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      // dom对应的高度
      const el = foodList[index];
      // 滚动到某个dom元素的顶部
      this.foodScroll.scrollToElement(el, 300);
    },
    cartAdd (el) {
      // el是子组件的中的dom对象
      // 调用购物车中的 drop函数
      this.$refs.shopcart.drop(el);
    },
    selectFood (food, event) {
      // 传递给子组件当前的food
      this.clickedFood = food;
      // 调用子组件的方法来 显示子组件
      this.$refs.food.show();
    }

  },
  created () {

    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

    this.$api.mall.goods()
      .then(({ data: { data, errno } }) => {
        if (errno === ERR_OK) {
          this.goods = data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();

          });
        }
      });
  },
  components: {
    shopCart,
    cartControl,
    food
  }

}
</script>

<style lang="scss" scoped>
  .goods {
    display: flex;
     /*固定在中间位置 */
    position: absolute;
    top: 348px;
    bottom: 92px;
    width: 100%;
    overflow: hidden;
    .menu-wrapper {
      flex: 0 0 160px;
      /*预防android出问题*/
      width: 160px;

      .menu-item {
        display: table;
        box-sizing: border-box;
        width: 100%;
        padding: 0 24px;
        height: 108px;
        font-size: 24px;
        background: #f3f5f7;
        @include _1px( 'bottom', rgba(7,17,27, .1));
        &:last-child {
          @include border_none();
        }
        &.current {
          font-weight: 700;
          margin-top: -1px;
          background: #fff;
          .text {
            border: none;
          }
        }

        .icon {
          display: inline-block;
          vertical-align: top;
          width: 24px;
          height: 24px;
          margin-bottom: 4px;
          margin-right: 8px;
          &.decrease {
            @include bg_image('decrease_3');
          }
          &.discount {
            @include bg_image('discount_3');
          }
          &.guarantee {
            @include bg_image('guarantee_3');
          }
          &.invoice {
            @include bg_image('invoice_3');
          }
          &.special {
            @include bg_image('special_3');
          }
        }
        .text {
          display: table-cell;
          vertical-align: middle;

        }
      }
    }
    .foods-wrapper {
      flex: 1;
      .food-list {
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .title {
        padding-left: 28px;
        border-left: 2px solid #d9dde1;
        background: #f3f5f7;
        font-size: 24px;
        line-height: 52px;
        color: rgb(147,153,159);
      }
      .food-item {
        display: flex;
        margin: 36px 36px 0;
        padding-bottom: 36px;
        @include _1px( 'bottom', rgba(7,17,27, .1));
        &:last-child {
          padding-bottom: 0;
          @include border_none();
        }
        .icon {
          flex: 0 0 114px;
          margin-right: 20px;
          img {
            width: 100%;
          }
        }
        .content {
          flex: 1;
          .name {
            margin-top: 4px;
            font-size: 28px;
            color: rgb(7,17,27);
          }
          .desc, .extra {
            font-size: 20px;
            color: rgb(147,153,159);

          }
          .desc {
            line-height: 32px;
            margin: 16px 0;
          }
          .extra {
            .count {
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
              color: rgb(147,153,159);
            }
          }
          .cartcontrol-parent {
            position: relative;
            .cartcontrol-wrapper {
              position: absolute;
              right: 0;
              bottom: 12px;

            }
          }
        }

      }
    }
  }
</style>
