<style lang="stylus" scoped>
.page-company-positions {
  .company-info {
    margin 10px 0
    padding 0 20px
    font-size 20px
  }
}
</style>

<template>
  <div class="page page-company-positions">

    <sticky ref="filterForm" :model="form" class-name="filter-container flex-row flex-wrap full-width">
      <div class="filters">
      </div>
      <div class="buttons flex-row">
        <el-button type="primary" @click="getList">查询</el-button>
      </div>
    </sticky>

    <div class="content-container">
      <el-table v-loading="listLoading" ref="multipleTable" :data="list" :stripe="true" tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="公司" width="120">
          <template slot-scope="scope">
            {{companyName(scope.row.companyId)}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="120">
        </el-table-column>
        <el-table-column label="付款状态" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.paied === 0">未付款</el-tag>
            <el-tag v-else type="info">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="缴费方式" width="120">
          <template slot-scope="scope">
            {{payMethodName(scope.row.paiedMethod)}}
          </template>
        </el-table-column>
        <el-table-column prop="paiedDate" label="缴费时间" width="200">
        </el-table-column>
        <el-table-column prop="paiedMoney" label="缴费金额" width="120">
        </el-table-column>
        <el-table-column prop="paiedConfirm" label="到账状态" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.paiedConfirm === 0">未到账</el-tag>
            <el-tag v-else type="info">已到账</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button :disabled="!(scope.row.paied===1 && scope.row.paiedConfirm===0)"
                       type="primary" size="mini" @click="payConfirm(scope.row.id)">到账
            </el-button>
            <el-button :disabled="!(scope.row.paied===1 && scope.row.paiedConfirm===1)"
                       type="info" size="mini" @click="payUnconfirm(scope.row.id)">未到账
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"
                  @pagination="getList"/>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import ListMixin from '@/mixins/list'
import RoleMixin from '@/mixins/role'
import api from '@/api/zhaopin/position'
import apiCompany from '@/api/zhaopin/company'
import apiRole from '@/api/sys/role'
import data from '@/views/ui/manage/data'
import {translateP} from '../data'

export default {
  components: {Sticky},
  mixins: [ListMixin, RoleMixin],
  props: {},
  data() {
    return {
      api,
      data,
      companies: [],
      defaultListQuery: {
        page: 1,
        size: 100,
        sort: 'code,asc',
        companyId: this.companyId
      },

      roleOptions: []
    }
  },
  async created() {
    const res = await apiCompany.options()
    this.companies = res.data
  },
  methods: {
    translateP,

    async pay(row) {
      const res = await api.pay(row.id)
      if (res.code === 0) this.$message({message: '到账成功', type: 'success'})
      else this.$message({message: '到账失败', type: ' error'})
      this.getList()
      return
    },
    async payConfirm(id) {
      const res = await api.payConfirm(id)
      if (res.code === 0) this.$message({message: '成功', type: 'success'})
      else this.$message({message: '失败', type: ' error'})
      this.getList()
      return
    },
    async payUnconfirm(id) {
      const res = await api.payUnconfirm(id)
      if (res.code === 0) this.$message({message: '成功', type: 'success'})
      else this.$message({message: '失败', type: ' error'})
      this.getList()
      return
    },
    companyName(value) {
      const c = this.companies.find((i) => i.id === value)
      if (!c) return value
      else return c.name
    },
    payMethodName(value) {
      return {'weixin': '微信'}[value]
    }
  }
}

</script>
