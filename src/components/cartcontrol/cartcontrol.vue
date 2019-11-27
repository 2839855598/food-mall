<template>
    <div class="cartcontrol">
      <transition name="move">
        <div class="control-decrease " v-show="food.count > 0" @click.stop="decreaseCart">
          <span class="inner icon-remove_circle_outline"></span>
        </div>
      </transition>
      <div class="control-count" v-show="food.count > 0">{{food.count}}</div>
      <div class="control-add icon-add_circle" @click.stop="addCart"></div>
    </div>
</template>

<script>
    export default {
      name: "cartcontrol",
      props: {
          food: {
            type: Object,
            default: () => ({})
          }
      },
      methods: {
        addCart () {
          if(!this.food.count) {
            this.$set(this.food, 'count', 1);
          } else {
            this.food.count++;
          }
          // 向父级传递 cart-add事件，并且传递当前dom对象
          this.$emit('cart-add', event.target);
        },
        decreaseCart () {
          if(this.food.count <= 0) {
            return;
          }
          this.food.count--;
        }
      }
    }
</script>

<style lang="scss" scoped>
  .cartcontrol {
    font-size: 0;
    .control-decrease, .control-add {
      display: inline-block;
      padding: 12px;
      line-height: 48px;
      font-size: 48px;
      color: rgb(0, 160, 220);
    }
    .control-decrease {

      &.move-enter-active, &.move-leave-active { // 外层动画
        transition: all .4s linear;
        .inner {  // 内层动画
          transition: all .4s linear;
        }
      }
      &.move-enter, &.move-leave-to {  // 外层动画
        opacity: 0;
        // 硬件加速，动画更流畅
        transform: translate3d(24px, 0, 0) ;
        .inner {  // 内层动画
          transform: rotate(180deg);
        }
      }
    }



    .control-count {
      display: inline-block;
      vertical-align: top;
      width: 24px;
      line-height: 48px;
      padding-top: 12px;
      text-align: center;
      font-size: 20px;
      color: rgb(147, 153, 159);
    }

  }
</style>
