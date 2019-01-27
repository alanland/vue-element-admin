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
        <el-form :inline="true" class="filters flex-row">
          <el-select v-model="listQuery.companyId" style="width: 200px" class="filter-item" placeholder="选择公司">
            <el-option v-for="item in companyOptions" :key="item.name" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form>
      </div>
      <div class="buttons flex-row">
        <el-button type="primary" class="filter-item" @click="getList">查询</el-button>
        <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                   @click="handleDownload">导出
        </el-button>
      </div>
    </sticky>

    <div class="content-container">
      <el-table v-loading="listLoading" ref="multipleTable" :data="list" :stripe="true" tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="id" label="订单号" width="120"></el-table-column>
        <el-table-column label="公司名称" width="120">
          <template slot-scope="scope">{{ companyName(scope.row.companyId) }}</template>
        </el-table-column>
        <el-table-column label="岗位名称" width="120">
          <template slot-scope="scope">{{ positionName(scope.row.positionId) }}</template>
        </el-table-column>
        <el-table-column prop="message2Date" label="入职时间" width="120">
        </el-table-column>
        <el-table-column prop="welfare" label="返佣金额" width="120" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button :disabled="!(scope.row.welfared===0)"
                       type="danger" size="mini"
                       @click="doWelfare(scope.row.id)">支付
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
import api from '@/api/zhaopin/delivery'
import apiCompany from '@/api/zhaopin/company'
import apiPosition from '@/api/zhaopin/position'
import _ from 'lodash'

export default {
  components: {Sticky},
  filters: {
    status: function (value) {
      const map = {
        0: '待回复',
        1: '已邀请',
        2: '已录取',
        9: '未通过'
      }
      return map[value]
    }
  },
  mixins: [ListMixin],
  data() {
    return {
      api,
      positions: [],
      companies: [],
      companyOptions: [],
      defaultListQuery: {
        page: 1,
        size: 100,
        sort: 'code,asc',
        status: 2,
        companyId: undefined
      }

    }
  },
  async created() {
    let res = await apiPosition.options()
    this.positions = res.data
    res = await apiCompany.options()
    this.companyOptions = this.companies = res.data
  },
  methods: {
    async getList() {
      this.listLoading = true
      const query = _.cloneDeep(this.listQuery)
      this.beforeGetList(query)
      query.page = query.page - 1
      if (query.companyId) {
        query.companyId = [query.companyId]
      } else {
        query.companyId = undefined
      }
      if (query.status) {
        query.status = [query.status]
      } else {
        query.status = undefined
      }
      return this.api.list(query).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    positionName(value) {
      const c = this.positions.find((i) => i.id === value)
      if (!c) return value
      else return c.name
    },
    companyName(value) {
      const c = this.companies.find((i) => i.id === value)
      if (!c) return value
      else return c.name
    },
    async doWelfare(id) {
      const res = await api.welfare(id)
      if (res.code === 0) this.$message({message: '成功', type: 'success'})
      else this.$message({message: '失败', type: ' error'})
      this.getList()
      return
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['订单号', '公司', '岗位', '入职时间', '返佣金额'].map(h => this.$t(h))
        const filterVal = ['id', 'companyId', 'positionId', 'message2Date', 'welfare']
        const data = this.formatJson(filterVal, this.list)
        data.forEach(d => {
          d[1] = this.companyName(d[1])
          d[2] = this.positionName(d[2])
        })
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '会员返佣列表',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    }
  }
}

</script>
