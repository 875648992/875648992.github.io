---
title: js自定义滚动tabs
tags: [js]
date: 2021-12-13 15:23:05
categories: [js,组件]
---
## vue组件
```javascript
<template>
<div style="width:100%;display:flex">
  <div @click="left" v-if="tabList.length>5" class="jiantou">◀</div>
  <div class="tabs"  ref='tabs'>
    <div  class="tabs_son " ref="tabs_son" :class="item.key==active?'active activeColor':''" @click="handleClick(item.key)" v-for="(item) in tabList" :key="item.key">
      <div>{{item.name}}</div>
    </div>
</div>
  <div @click="right" v-if="tabList.length>5" class="jiantou">▶</div>

</div>

</template>

<script>
export default {
  props: {
    tabList: {
      type: Array,
      default: () => [ { name: '默认tabs', key: 0 },
        { name: '默认Tabs', key: 1},
        { name: '默认Tabs', key: 2 },
        { name: '默认Tabs', key: 3 },
        { name: '默认Tabs', key: 4 },
        { name: '默认Tabs', key: 5 },
        { name: '默认Tabs', key: 6 },
        { name: '默认Tabs', key: 7 },
        { name: '默认Tabs', key: 8 },
        { name: '默认Tabs', key: 9 },
        { name: '默认Tabs', key: 10 }]
    }
  },
  data(){
    return {
      active: 0
    };
  },
  
  methods: {
    handleClick(val){
      this.active = val;
      this.$emit('currentTabs', val);
    },
    async left(){
        await this.$nextTick();
        if (this.tabList.length>5){
          const doc = this.$refs.tabs_son[0];

          doc.scrollIntoView({block: 'start', inline: 'nearest', behavior: 'smooth' });
        }
    },
    async right(){
       await this.$nextTick();
        if (this.tabList.length>5){
          const doc = this.$refs.tabs_son[this.$refs.tabs_son.length-1];

          doc.scrollIntoView({block: 'start', inline: 'nearest', behavior: 'smooth' });
        }
    }
  }
};
</script>

<style lang='less' scoped>

.tabs{
  width: 90%;
  display: flex;
  // flex-wrap: wrap;
  overflow: scroll;
  .tabs_son{
    flex-shrink: 0;
    font-size: 1rem /* 16/16 */;
    margin-right: 1.5rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    border-bottom:0.2rem solid transparent ;

  }
}
.tabs .active{
  border-bottom:0.2rem solid #36FDB9 ;
}
.tabs .activeColor{
 color: #36FDB9 ;
}
.jiantou{
  cursor: pointer;
  padding:0 1rem;
  box-sizing: border-box;
  color: #36FDB9;
  font-size: 1.125rem;
}
</style>

```
## 传入tabList 格式就是props里的
## 数组的length超过5个就可以滚动