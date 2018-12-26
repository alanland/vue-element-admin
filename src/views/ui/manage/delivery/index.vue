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

  <div class="margin-b10 full-width company-info">
    岗位：{{ position.name }}
  </div>

  <sticky ref="filterForm" :model="form" class-name="filter-container flex-row flex-wrap full-width">
    <div class="filters">
    </div>
    <div class="buttons flex-row">
      <el-button type="primary" @click="getList">查询</el-button>
      <el-button type="primary" @click="handleNew">新增</el-button>
      <el-button type="danger" @click="handleDeleteSelected">删除</el-button>
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
      <el-table-column prop="member_name" label="用户名" width="120">
        <template slot-scope="scope">
        <router-link :to="{ name: 'member', params: { id: scope.row.member_id }}" class="route-link">
          {{ scope.row.member_name }}
        </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="120">
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">{{ scope.row.status | status }}</template>
      </el-table-column>
      <el-table-column prop="message1" label="面试邀请" width="300" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="message1date" label="邀请时间" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="message2date" label="录取时间" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="查看招聘" width="120">
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
        <el-button :disabled="scope.row.status===9 || scope.row.status===2" type="danger" size="mini"
                   @click="doNotOk(scope.row)">不通过
        </el-button>
        <el-button :disabled="scope.row.status>0" type="primary" size="mini" @click="toInterview(scope.row)">面试
        </el-button>
        <el-button :disabled="scope.row.status>1" type="success" size="mini" @click="doOk(scope.row)">录取</el-button>
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
  props: {
    positionId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      interviewDialogVisible: false,
      interviewMessage: '',
      interviewRow: {},
      api,
      company: {},
      position: {},
      defaultListQuery: {
        page: 1,
        size: 100,
        sort: 'code,asc',
        positionId: this.positionId
      },

      roleOptions: []
    }
  },
  async created() {
    const res = await apiPosition.get(this.positionId)
    this.position = res.data
  },
  methods: {
    async getList() {
      const res = await api.findByPositionId(this.positionId)
      this.list = res.data
    },
    toInterview(row) {
      this.interviewRow = row
      this.interviewMessage = ''
      this.interviewDialogVisible = true
    },
    async doInterview() {
      await api.interview({id: this.interviewRow.id, message: this.interviewMessage})
      this.interviewDialogVisible = false
      this.getList()
    },
    async doOk(row) {
      await api.ok(row.id)
      this.getList()
    },
    async doNotOk(row) {
      await api.notOk(row.id)
      this.getList()
    }
  }
}

</script>
