<style lang="stylus" scoped>

</style>

<template>
<div class="page page-user">
  <sticky ref="form" :model="form" class-name="filter-container flex-row flex-wrap full-width">
    <div class="filters">
    </div>
    <div class="buttons flex-row">
      <el-button type="primary" @click="getList">查询</el-button>
      <el-button type="primary" @click="handleCreate">新增</el-button>
    </div>
  </sticky>
  <div class="content-container">
    <el-table
      ref="multipleTable"
      :data="list"
      :stripe="true"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="日期"
        width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <!--<pagination-->
    <!--v-show="total>0"-->
    <!--:total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"-->
    <!--@pagination="getList"/>-->

  </div>
</div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import ListMixin from '@/mixins/list'
import api from '@/api/sys/user'

export default {
  components: {Sticky},
  mixins: [ListMixin],
  data() {
    return {
      api,
      selection: [],
      defaultListQuery: {
        page: 1,
        size: 100,
        city: undefined,
        district: undefined,
        area1: undefined, // [100,999,'between:int']
        sort: 'hintCode,asc'
      },
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.selection = val
    }
  }
}

</script>
