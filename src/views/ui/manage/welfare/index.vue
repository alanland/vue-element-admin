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

    <el-dialog
      :visible.sync="interviewDialogVisible"
      title="提示"
      width="30%">
      <el-input v-model="interviewMessage" placeholder=""></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button @click="interviewDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doInterview">确 定</el-button>
  </span>
    </el-dialog>

    <div class="content-container">
      <el-table v-loading="listLoading" ref="multipleTable" :data="list" :stripe="true" tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="id" label="订单号" width="120"></el-table-column>
        <el-table-column label="公司名称" width="120">
          <template slot-scope="scope">{{ positionName(scope.row.positionId) }}</template>
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
import apiMember from '@/api/zhaopin/member'

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
      defaultListQuery: {
        page: 1,
        size: 100,
        sort: 'code,asc',
        status: 2,
      }

    }
  },
  async created() {
    let res = await apiPosition.options()
    this.positions = res.data
    res = await apiCompany.options()
    this.companies = res.data
  },
  methods: {
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
    }
  }
}

</script>
