<template>
    <div class="stars" :class="starSizeType">
      <span v-for="(starState,index) in starsClasses" :key="index" class="stars-item" :class="starState"></span>
    </div>
</template>

<script>
  const length = 5;
  // 全亮
  const star_on = 'on';
  // 半亮
  const star_half = 'half';
  // 不亮
  const star_off = 'off';
    export default {
        name: 'stars',
        props: {
          size: {
            type: Number,
            default: 0
          },
          score: {
            type: Number,
            default: 0
          }
        },
      computed: {
        starSizeType () {
          return 'stars-' + this.size;
        },
        starsClasses () {
          let result = [];

          // 分数分为 整数半 和 整数 两种，比如 1, 1.5
          // 分数取半，当分数在[3,3.5) => 3 , 当分数[3.5, 4) => 3.5, 以此类推
          let score = Math.floor(this.score * 2) / 2;
          // 是否是小数，即是否有半亮的星星，
          let hasDecimal = score % 1 !== 0;
          // 全亮的星星个数
          let integer = Math.floor(score);

          // 全亮
          for (let i=0; i<integer; i++) {
            result.push(star_on);
          }
          // 是否有半亮的
          if (hasDecimal) {
            result.push(star_half);
          }
          // 小于总个数，就添加不亮的星星
          while (result.length < length) {
            result.push(star_off);
          }

          return result;
        }
      }
    }
</script>

<style lang="scss" scoped>
  .stars {
    display: inline-flex;

    &.stars-48 {
      .stars-item {
        width: 40px;
        height: 38px;
        margin-right: 44px;
        &.on {
           @include bg_image('star48_on');
        }
        &.half {
          @include bg_image('star48_half');
        }
        &.off {
          @include bg_image('star48_off');
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
    &.stars-36 {
      .stars-item {
        width: 30px;
        height: 30px;
        margin-right: 12px;
        &.on {
          @include bg_image('star36_on');
        }
        &.half {
          @include bg_image('star36_half');
        }
        &.off {
          @include bg_image('star36_off');
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
    &.stars-24 {
      .stars-item {
        width: 20px;
        height: 20px;
        margin-right: 6px;
        &.on {
          @include bg_image('star24_on');
        }
        &.half {
          @include bg_image('star24_half');
        }
        &.off {
          @include bg_image('star24_off');
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
