---
title: 基于element-ui实现前端自行分页组件
tags: [elementUI]
date:  2022-02-15 15:27:47
categories: [vue,组件]
---
```javascript
<template>
  <div>
    <div class="table">
      <el-pagination
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        @prev-click="prevPage"
        @next-click="nextPage"
        >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableDataAll: { // 把后端获取的数据传进来
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentPage: 1, // 当前第几页
      pageSize: 6, // 每页第几条
      nowPage: {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      },
      total: 50,
      nowPageList: [] // 表格显示的内容
    }
  },
  watch: {
    nowPage(newVal, oldVal) {
      this.currentPage = newVal.currentPage
      this.pageSize = newVal.pageSize
    }
  },
  mounted() {
    // this.nowPageList = this.tableDataAll.slice(0, 5);
    this.changePage()
    this.total = this.tableDataAll.length
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.changePage();
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.changePage();
    },
    // 上一页
    prevPage() {
      if (this.currentPage == 1) {
        return false;
      } else {
        this.currentPage--;
        this.changePage();
      }
    },
    // 下一页
    nextPage() {
      if (this.currentPage == this.totalPage) {
        return false;
      } else {
        this.currentPage++;
        this.changePage();
      }
    },
    changePage() {
      const obj = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }

      const currentPage = obj.currentPage

      const pageSize = obj.pageSize

      const data = JSON.parse(JSON.stringify(this.tableDataAll))

      const begin = (currentPage - 1) * pageSize;

      const end = currentPage * pageSize;

      this.nowPageList = data.slice(begin, end);
      // 丢出去给外面的表格使用
      this.$emit('nowPageList', this.nowPageList)
    }
  }
}

</script>

```
# 使用
```javascript
        <paging :tableDataAll='表格数据'  @nowPageList='(val)=>{this.nowPageList = val}' />

data(){
	return{
		nowPageList:[]
	}
}
```
