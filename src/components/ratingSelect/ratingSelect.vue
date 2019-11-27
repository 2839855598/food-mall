<template>
    <div class="rating-select">
        <div class="rating-type">
          <span @click="select(2)" class="block all" :class="{'active': selectType === 2}">
            {{desc.all}}
            <span class="count">{{positives.length + negatives.length}}</span>
          </span>
          <span @click="select(0)" class="block positive" :class="{'active': selectType === 0}">
            {{desc.positive}}
            <span class="count">{{positives.length}}</span>
          </span>
          <span @click="select(1)" class="block negative" :class="{'active': selectType === 1}">
            {{desc.negative}}
            <span class="count">{{negatives.length}}</span>
          </span>
        </div>
        <div @click="toggleOn" class="switch" :class="{'on': onlyContent}">
           <span class="icon-check_circle"></span>
           <span class="text">内容</span>
        </div>
    </div>

</template>

<script>
    // 正向
    const POSITIVE = 0;
    // 负向
    const NEGATIVE = 1;
    // 所有
    const ALL = 2;
    export default {
      name: "ratingSelect",
      data () {
        return {
          type: 0
        }
      },
      computed: {
        positives() {

          return this.ratings.filter((rating) => {
            return rating.rateType === POSITIVE;
          })
        },
        negatives() {
          return this.ratings.filter((rating) => {
            return rating.rateType === NEGATIVE;
          })
        }
      },
      props: {
        ratings: {
          type: Array,
          default: () => []
        },
        selectType: {
          type: Number,
          default: ALL
        },
        onlyContent: {
          type: Boolean,
          default: false
        },
        desc: {
          type: Object,
          default: () => ({
            all: '全部',
            positive: '满意',
            negative: '不满意'
          })
        }
      },
      methods: {
        select (selectType) {
          this.$emit('changeType', selectType);
        },
        toggleOn () {
          this.$emit('toggle-on');
        }
      }

    }
</script>

<style lang="scss" scoped>
  .rating-select {
    .rating-type {
      padding: 36px 0;
      margin: 0 36px;
      @include _1px('bottom', rgba(7, 17, 27, .1));
      font-size: 0;
      .block {
        display: inline-block;
        padding:  18px 24px;
        margin-right: 16px;
        border-radius: 2px;
        line-height: 32px;
        font-size: 24px;
        color: rgb(77, 85, 93);
        &.active {
          color: #fff;
        }
        .count {
          margin-left: 4px;
          font-size: 16px;
        }
        &.positive, &.all {
          background: rgba(0, 160, 220, .2);
          &.active {
            background: rgb(0, 160, 220);
          }
        }
        &.negative {
          background: rgba(77, 85, 93, .2);
          &.active {
            background: rgb(77,85,93);
          }
        }
      }
    }
    .switch {
      padding: 24px 36px;
      line-height: 48px;
      border-bottom: 2px solid rgba(7, 17, 27, .1);
      color: rgb(147, 153, 159);
      font-size: 0;
      .icon-check_circle {
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
        font-size: 48px;
      }
      &.on {
        .icon-check_circle {
          color: #00c850;
        }
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: 24px;
      }
    }
  }
.shop {
  &.active {
    color: red;
  }

}
.buy {
  &.active {
    color: blue;
  }
}
.toge {
  &.active {
    color: green;
  }
}
</style>
