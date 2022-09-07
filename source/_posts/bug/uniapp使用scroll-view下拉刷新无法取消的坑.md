---
title: uniapp使用scroll-view下拉刷新无法取消的坑
tags: [uniapp]
date: 2021-09-16 15:15:02
categories: [bug,uniapp]
---

>在做uniapp的时候需要用到tap页  但是uView的基础tap页是不支持左右滑动的  所以使用了tap-swiper组件 

>但是这个组件必须包裹一个scroll-view  包裹后uniapp自带的下拉刷新就没了  必须使用scroll-view自带的下拉刷新才行

>但是做的时候出现了一个问题  scroll-view自带的下拉刷新 刷新后无法取消那个动画  我在网上也找了很多  都没有找到一个好的解决方案

>后来就自己搞出来了  虽然性能不太好  但是还是可以用的  思路如下  仅供参考  如果有更好的方法可以留言回复

- tab-swiper里的swiper-item会遍历一个数组  数组代表着有多少个tab页  uView有实例 我们这个数组可以这么写 

```javascript
 <swiper-item
    class="swiper-item"
    v-for="(item, index) in list"
    :key="index"
  >
  // ...里面的东西暂时不用管
 <swiper-item />
 data(){
	return {
		 list: [[1], [1], [1]],
	}
 }
 
```

- 然后当我们触发下拉刷新的时候  我们把这个数组给置空 就比如这样

```javascript
  this.list = [[], [], []]
```
- 然后我们会在里面的scroll-view里写一条属性`v-if='item.length'`  意思就是这个遍历后的数组里面有值得话才显示 没值得话就不显示
- 我们下拉刷新置空后scroll-view就不会显示了  这样的话下拉刷新的那个动画自然也就没了  也就停止了下拉刷新
- 然后我们下拉后当然要调用接口获取数据了  我们获取数据并且赋值完后  再把list给恢复` list: [[1], [1], [1]],`
- 这样的话 每次触发下拉刷新的时候  就会因为list情空而停止(可以使用定时器来控制停止的时间)
- 然后获取数据的时候再给他恢复成本来的状态即可

代码如下  仅供参考  

```javascript
<template>
  <view class="container">
    <view class="header">
      <u-search
        bg-color="#fff"
        placeholder="请输入搜索内容"
        :show-action="false"
        v-model="keyword"
        @search="searchChange"
      ></u-search>
    </view>
    <view style="padding-top: 50px">
      <u-tabs-swiper
        ref="tabs"
        active-color="#4FCBA1"
        :is-scroll="false"
        :bold="false"
        :list="tabList"
        :current="current"
        @change="changeTabs"
      >
      </u-tabs-swiper>
    </view>
    <swiper
      class="main"
      :current="swiperCurrent"
      duration="300"
      @transition="transition"
      @animationfinish="animationfinish"
    >
      <swiper-item
        class="swiper-item"
        v-for="(item, index) in list"
        :key="index"
      >
        <scroll-view
          scroll-y
          style="height: 100%; width: 100%"
          @refresherrefresh="refresherrefresh"
          @scrolltolower="scrolltolower"
          refresher-enabled
          v-if="item.length > 0"
        >
          <view class="message-content">
            <!-- 可领取 -->
            <view v-if="current === 0">
              <view
                v-for="(item, index) in getSendList"
                :key="index"
                class="card-v-for"
              >
                <getTesk @fsList="fsList" :data="item" />
              </view>
            </view>
            <!-- 治理中 -->
            <view v-if="current === 1">
              <view
                v-for="(item, index) in sendList"
                :key="index"
                class="card-v-for"
              >
                <govern :data="item" :type="1" />
              </view>
            </view>
            <!-- 已完成 -->
            <view v-if="current === 2">
              <view
                v-for="(item, index) in sendList"
                :key="index"
                class="card-v-for"
              >
                <govern :type="2" :data="item" />
              </view>
            </view>
          </view>
          <view style="padding: 10rpx">
            <u-loadmore
              :status="status"
              :icon-type="iconType"
              :load-text="loadText"
            />
          </view>
        </scroll-view>
        <u-empty v-else mode="list"></u-empty>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  import getTesk from './getTesk.vue'
  import govern from './govern.vue'
  import { Search, getSearch } from '@/api/country/governace'

  export default {
    components: { getTesk, govern },
    data() {
      return {
        list: [[1], [1], [1]],

        tabList: [
          {
            name: '可领取'
          },
          {
            name: '治理中'
          },
          {
            name: '已完成'
          }
        ],
        page: 1,
        keyword: '',
        status: 'loadmore',
        iconType: 'flower',
        loadText: {
          loadmore: '轻轻上拉',
          loading: '努力加载中',
          nomore: '实在没有了'
        },
        sendList: [],
        getSendList: [],
        current: 0,
        swiperCurrent: 0
      }
    },
    onLoad() {
      // console.log('触发')
      // this.getData()
    },
    onShow() {
      console.log('触发')
      this.page = 1
      this.sendList = []
      this.getSendList = []
      this.getData()
    },

    methods: {
      // =================  下拉刷新 =================
      async refresherrefresh(a) {
        //初始化数据
        this.page = 1
        this.sendList = []
        this.getSendList = []
        this.list = [[], [], []]
        await this.getData()
      },
      // =================  上啦加载 =================
      scrolltolower() {
        this.status = 'loading'

        this.page = this.page + 1

        setTimeout(() => {
          this.getData()
          this.status = 'nomore'
        }, 1000)
      },
      // =================  搜索 =================
      searchChange() {
        this.page = 1
        this.sendList = []
        this.getData()
        this.getSendList = []
      },
      // =================  获取数据 =================
      getData(val) {
        // +++++++++  重置刷新  +++++++++
        const params = {
          page: this.page,
          limit: 5,
          governState: 1,
          title: this.keyword
        }
        if (this.current === 1) {
          params.governState = 1
        } else if (this.current === 2) {
          params.governState = 2
        }
        // +++++++++  治理中 / 已完成  +++++++++
        Search(params).then((res) => {
          if (res.data.records.length || !this.sendList.length) {
            this.status = 'nomore'
          }
          this.sendList = this.sendList.concat(res.data.records)
          if (+this.current === 1 || +this.current === 0) {
            this.$set(this.tabList, 1, {
              name: `治理中 (${res.data.total})`
            })
          }
        })
        // +++++++++  可领取  +++++++++
        const obj = {
          page: this.page,
          limit: 5,
          governState: '',
          title: this.keyword
        }
        getSearch(obj).then((res) => {
          if (res.data.records.length || !this.getSendList.length) {
            this.status = 'nomore'
          }
          this.getSendList = this.getSendList.concat(res.data.records)
        })
        // }
        // +++++++++  控制刷新  +++++++++
        setTimeout(() => {
          this.list = [[1], [1], [1]]
        }, 100)
      },
      // =================  刷新列表 =================
      fsList() {
        this.page = 1
        this.getSendList = []
        this.sendList = []
        this.getData()
      },
      // =================  切换tabs页 =================
      changeTabs(index) {
        this.swiperCurrent = index
        this.current = index
      },
      // tab滑动
      transition({ detail: { dx } }) {
        // this.$refs.tabs.setDx(dx)
      },
      // tab动画结束
      animationfinish({ detail: { current } }) {
        this.$refs.tabs.setFinishCurrent(current)
        this.swiperCurrent = current
        this.current = current
      }
    },
    watch: {
      current: {
        handler() {
          this.page = 1
          this.sendList = []
          this.getSendList = []
          this.getData()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    z-index: 10;
    padding: 14rpx 24rpx;
    position: fixed;
    width: 100%;
    background: #f5f5f5;
  }
  .message-card {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 28rpx 40rpx;
    margin-bottom: 20rpx;
    background: #fff;
    color: #333;
    .title {
      font-size: 28rpx;
      font-weight: bold;
      padding-bottom: 24rpx;
    }
    .msg-content {
      display: flex;
      padding-bottom: 24rpx;
      justify-content: space-between;
    }
    .msg-review {
      text-align: center;
      color: #4fcca0;
      font-size: 28rpx;
      border-top: 1rpx solid #eee;
      padding: 24rpx 0 0 0;
    }
  }
  .footer {
    padding: 60rpx 0;
    display: flex;
    align-items: center;
    background: #fff;
    position: fixed;
    bottom: 0;
    z-index: 999;
  }
  .message-content {
    padding: 0rpx 0 20rpx 0;
    // height: 100%;
  }

  .card-v-for {
    margin-bottom: 30rpx;
  }
</style>

```
