<template>
    <!--评价页面-->
    <div class="ratings" ref="ratingsContent">
      <div class="ratings-content" >
        <div class="overview">
          <div class="overview-left">
            <h1 class="score">{{seller.score}}</h1>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="overview-right">
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <stars :size="36" :score="seller.serviceScore"></stars>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">商品评分</span>
              <stars :size="36" :score="seller.foodScore"></stars>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrapper">
              <span class="title">送达时间</span>
              <span class="delivery">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <split-line></split-line>
        <rating-select
          :selectType="selectType"
          :onlyContent="onlyContent"
          :desc="desc"
          :ratings="ratings"
          @changeType="changeSelectType"
          @toggle-on="toggle"
        ></rating-select>
        <div class="rating-wrapper">
          <ul>
            <li v-show="needShow(rating.rateType, rating.text)" class="rating-item" v-for="(rating, index) in ratings" :key="index">
              <div class="avatar">
                <img :src="rating.avatar">
              </div>
              <div class="content">
                <h1 class="name">{{rating.username}}</h1>
                <div class="star-wrapper">
                  <stars :size="24" :score="rating.score"></stars>
                  <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
                </div>
                <p class="text">{{rating.text}}</p>
                <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                  <span class="icon-thumb_up"></span>
                  <span
                    class="item"
                    v-for="(item, index) in rating.recommend"
                    :key="index"
                  >
                    {{item}}
                  </span>
                </div>
                <div class="time">
                  {{format(rating.rateTime)}}
                </div>
              </div>

            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
  import stars from '@components/stars/stars';
  import splitLine from '@components/splitLine/splitLine';
  import ratingSelect from '@components/ratingSelect/ratingSelect';
  // 格式化日期函数
  import {formatDate as newFormatDate} from '@/utils/date';
  import BScroll from 'better-scroll';
  // 所有
  const ALL = 2;
  // ok
  const ERR_OK = 0;
    export default {
      name: "ratings",
      // 通过router-view去接收参数
      props: {
        seller: {
          type: Object,
          default: () => ({})
        }
      },
      data () {
        return {
          ratings: [],
          showFlag: false,
          selectType: ALL,
          onlyContent: true
        }
      },
      methods: {
        format (time) {
          const date = new Date(time);
          return newFormatDate(date, 'YYYY-MM-DD HH:mm')
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
      components: {
        stars,
        splitLine,
        ratingSelect
      },
      created () {
        console.log('this is rating');
        this.$api.mall.ratings()
          .then(({ data: { data, errno } }) => {
            if (errno === ERR_OK) {
              this.ratings = data;

              this.$nextTick(() => {
                this.scroll = new BScroll(this.$refs.ratingsContent, {
                  click: true
                });

              });

            }
          });
      }
    }
</script>

<style lang="scss" scoped>
  .ratings {
    position: absolute;
    top: 348px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      display: flex;
      padding: 36px 0;
      .overview-left {
        flex: 0 0 274px;
        width: 274px;
        padding: 12px 0;
        border-right: 1px solid rgba(7, 17, 27, 0.1);
        text-align: center;
        .score {
          margin-bottom: 12px;
          line-height: 56px;
          font-size: 48px;
          color: rgb(255, 153, 0);
        }
        .stars {
          margin: 0 24px;
        }
        .title {
          font-size: 24px;
          color: rgb(7, 17, 27);
          line-height: 24px;
          font-weight: 700;
        }
        .rank {
          padding-top: 16px;
          padding-bottom: 12px;
          font-size: 20px;
          color: rgb(147,153,159);
        }
      }
      .overview-right {
        flex: 1;
        padding: 12px 0 12px 48px;
        .score-wrapper {
          margin-bottom: 16px;
          line-height: 36px;
          font-size: 0;
          // stars已经是inline-flex类型
          .title,  .score {
            display: inline-block;
            vertical-align: top;
          }
          .title {
            font-size: 12px;
            color: rgb(7, 17, 27);
            line-height: 36px;
          }
          .stars {
            margin: 0 24px;

          }
          .score {
            line-height: 36px;
            vertical-align: top;
            font-size: 24px;
            color: rgb(253, 153, 0);
          }
        }
        .delivery-wrapper {
          font-size: 24px;
          .title {
            color: rgb(7,17, 27);
          }
          .delivery {
            margin-left: 24px;
            color: rgb(147, 153, 159);
          }
        }
      }

    }
    .rating-wrapper {
      padding: 0 36px;
      .rating-item {
        display: flex;
        padding: 36px 0;
        @include border_1px('bottom', '#ddd');
        &:last-child {
          border: none;
        }
        .avatar {
          flex: 0 0 56px;
          width: 56px;
          margin-right: 24px;
          img {
            width: 100%;
            border-radius: 50%;
          }
        }
        .content {
          position: relative;
          flex: 1;
          .name {
            margin-bottom: 8px;
            line-height: 24px;
            color: rgb(7, 17, 27);
          }
          .star-wrapper {
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            .star {
              margin-right: 12px;
            }
            .delivery {
              color: rgb(147, 153, 159);
            }
          }
          .text {
            margin-bottom: 16px;
            line-height: 36px;
            color: rgb(7, 17, 27);
            font-size: 24px;
          }
          .recommend {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .icon-thumb_up, .item {
              margin: 0 16px 8px 0;
              font-size: 18px;
            }
            .icon-thumb_up {
              color: rgb(0, 160, 220);
            }
            .item {
              padding: 0 12px;
              border-radius: 1px;
              border: 2px solid rgba(7,17,27, 0.1);
              color: rgb(147, 153, 159);
              background: #fff;
            }
          }
          .time {
            position: absolute;
            top: 0;
            right: 0;
            line-height: 24px;

          }
        }
      }

    }
  }
</style>
