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
      <el-form :inline="true" class="filters flex-row">
        <el-select v-model="listQuery.companyId" style="width: 200px" class="filter-item" placeholder="选择公司"
                   @change="companyChange">
          <el-option v-for="item in companyOptions" :key="item.name" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-input v-model="listQuery.name" class="filter-item" placeholder="名称"></el-input>
      </el-form>
      <div class="buttons flex-row">
        <el-button type="primary" class="filter-item" @click="getList">查询</el-button>
        <el-button type="primary" class="filter-item" @click="enableSelected">启用</el-button>
        <el-button type="primary" class="filter-item" @click="disableSelected">禁用</el-button>
        <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                   @click="handleDownload">导出
        </el-button>
      </div>
    </sticky>

    <!-- form -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :model="form" size="mini" label-position="left" label-width="80px"
               style="width: 100%">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="标题" prop="code">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="薪资" prop="code">
              <el-select v-model="form.pay" placeholder="请选择" width="100%">
                <el-option
                  v-for="item in data.salaryOptions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="返佣额度" prop="code">
              <el-input-number v-model="form.welfare"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="城市" prop="code">
              <el-select v-model="form.city" filterable placeholder="Select">
                <el-option-group
                  v-for="group in data.cities"
                  :key="group.title"
                  :label="group.title">
                  <el-option
                    v-for="item in group.lists"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="code">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="address">
            <el-form-item label="角色" prop="code">
              <el-select v-model="form.roles" multiple placeholder="请选择" width="100%">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="handleCreate">保存</el-button>
        <el-button v-else type="primary" @click="handleUpdate">更新</el-button>
      </div>
    </el-dialog>

    <div class="content-container">
      <el-table v-loading="listLoading" ref="multipleTable" :data="list" :stripe="true" tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="名称" width="120">
        </el-table-column>
        <el-table-column v-if="false" label="状态" width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.paied===1">
              <el-tag v-if="scope.row.status === 0">已启用</el-tag>
              <el-tag v-else type="info">已禁用</el-tag>
            </template>
            <template v-else>
              <el-button v-if="!roleHasAdmin" type="success" size="mini" @click="pay(scope.row)">
                <svg-icon icon-class="payment" class-name="disabled"/>
                付款
              </el-button>
              <el-tag v-else type="info">未付款</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="付款状态" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.paied===1">已付款</el-tag>
            <el-tag v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0">已启用</el-tag>
            <el-tag v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="状态" width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.paied===1">
              <el-tag v-if="scope.row.status === 0">已启用</el-tag>
              <el-tag v-else type="info">已禁用</el-tag>
            </template>
            <template v-else>
              <el-button v-if="!roleHasAdmin" type="success" size="mini" @click="pay(scope.row)">
                <svg-icon icon-class="payment" class-name="disabled"/>
                付款
              </el-button>
              <el-tag v-else type="info">未付款</el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="city" label="城市" width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="pay" label="薪资" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ translateP('salary', scope.row.pay) }}
          </template>
        </el-table-column>
        <el-table-column prop="welfare" label="返现" width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="experience" label="工作年限" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ translateP('experience', scope.row.experience) }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="学历" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ translateP('education', scope.row.education) }}
          </template>
        </el-table-column>
        <el-table-column label="查看招聘" width="120">
          <template slot-scope="scope">
            <router-link :to="{ name: 'position-delivery', params: { positionId: scope.row.id }}" class="route-link">
              招聘详情
            </router-link>
          </template>
        </el-table-column>
        <el-table-column v-if="false" label="操作" width="200">
          <template slot-scope="scope">
            <template v-if="roleHasAdmin">
              <el-button v-if="scope.row.status === 0" type="warning" title="禁用" icon="el-icon-close" size="mini"
                         circle @click="handleDisable(scope.row)"></el-button>
              <el-button v-else type="success" icon="el-icon-check" size="mini" circle
                         @click="handleEnable(scope.row)"></el-button>
            </template>
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="handleEdit(scope.row)"></el-button>
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
      defaultListQuery: {
        page: 1,
        size: 100,
        sort: 'code,asc',
        companyId: this.companyId
      },

      companyOptions: [],
      roleOptions: []
    }
  },
  async created() {
    let json = await apiCompany.options()
    this.companyOptions = json.data
  },
  methods: {
    translateP,

    async getList() {
      this.listLoading = true
      const query = _.cloneDeep(this.listQuery)
      this.beforeGetList(query)
      query.page = query.page - 1
      if (query.companyId) {
        query.companyId = [query.companyId]
      }
      if (query.code) {
        query.code = [query.code, 'like']
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
    async pay(row) {
      await api.pay(row.id)
      this.$message({message: '支付成功', type: 'success'})
      this.getList()
      return
    },
    companyChange(e) {

    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['名称', '付款状态', '启用状态', '城市', '薪资', '返现', '工作年限', '学历'].map(h => this.$t(h))
        const filterVal = ['name', 'paied', 'status', 'city', 'pay', 'welfare', 'experience', 'education']
        const data = this.formatJson(filterVal, this.list)
        data.forEach(d => {
          d[1] = d[1] === 1 ? '已付款' : '未付款'
          d[2] = d[2] === 0 ? '已启用' : '未启用'
          d[4] = translateP('salary', d[4])
          d[6] = translateP('experience', d[6])
          d[7] = translateP('education', d[7])
        })
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '职位列表',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    }
  }
}

</script>
