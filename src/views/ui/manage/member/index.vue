<style lang="stylus" scoped>

</style>

<template>
  <div class="page page-user">
    <sticky ref="filterForm" :model="form" class-name="filter-container flex-row flex-wrap full-width">
      <div class="filters">
        <el-form :inline="true" class="filters flex-row">
          <el-input v-model="listQuery.name" placeholder="名称"></el-input>
          <el-input v-model="listQuery.phone" placeholder="电话"></el-input>
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
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0">已启用</el-tag>
            <el-tag v-else type="info">已禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="200" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="投递详情" width="120">
          <template slot-scope="scope">
            <router-link class="route-link" :to="{ name: 'member-delivery', params: { memberId: scope.row.id }}">投递详情
            </router-link>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" type="warning" title="禁用" icon="el-icon-close" size="mini"
                       circle @click="handleDisable(scope.row)"></el-button>
            <el-button v-else type="success" icon="el-icon-check" size="mini" circle
                       @click="handleEnable(scope.row)"></el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="handleEdit(scope.row)"></el-button>
            <el-button type="info" icon="el-icon-message" size="mini" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle
                       @click="handleDelete(scope.row)"></el-button>
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
import api from '@/api/zhaopin/member'
import apiRole from '@/api/sys/role'
import data from '../data'

export default {
  components: {Sticky},
  mixins: [ListMixin],
  data() {
    return {
      api,
      industryOptions: [],
      financingOptions: [],
      teamSizeOptions: [],
      defaultListQuery: {
        page: 1,
        size: 100,
        district: undefined,
        phone: undefined,
        area1: undefined, // [100,999,'between:int']
        sort: 'code,asc'
      },

      roleOptions: []
    }
  },
  async created() {
  },
  methods: {
    async getList() {
      this.listLoading = true
      const query = _.cloneDeep(this.listQuery)
      this.beforeGetList(query)
      query.page = query.page - 1
      if (query.phone) {
        query.phone = [query.phone, 'like']
      } else {
        query.phone = undefined
      }
      if (query.name) {
        query.name = [query.name, 'like']
      } else {
        query.name = undefined
      }
      return this.api.list(query).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['姓名', '状态', '电话', '邮箱'].map(h => this.$t(h))
        const filterVal = ['name', 'status', 'phone', 'email']
        const data = this.formatJson(filterVal, this.list)
        data.forEach(d => {
          d[1] = d[1] === 1 ? '已启用' : '未启用'
        })
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '会员列表',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    }
  }
}

</script>
