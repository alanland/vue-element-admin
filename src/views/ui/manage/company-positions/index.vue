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
      公司：{{company.name}}
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
        <el-table-column label="状态" width="120">
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
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <template v-if="roleHasAdmin">
              <el-button v-if="scope.row.status === 0" type="warning" title="禁用" icon="el-icon-close" size="mini"
                         circle @click="handleDisable(scope.row)"></el-button>
              <el-button v-else type="success" icon="el-icon-check" size="mini" circle
                         @click="handleEnable(scope.row)"></el-button>
            </template>
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
import RoleMixin from '@/mixins/role'
import api from '@/api/zhaopin/position'
import apiCompany from '@/api/zhaopin/company'
import apiRole from '@/api/sys/role'
import data from '@/views/ui/manage/data'
import {translateP} from '../data'

export default {
  components: {Sticky},
  mixins: [ListMixin, RoleMixin],
  props: {
    companyId: {
      default: 0
    }
  },
  data() {
    return {
      api,
      data,
      company: {},
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
    const res = await apiCompany.get(this.companyId)
    this.company = res.data
  },
  methods: {
    translateP,

    async pay(row) {
      await api.pay(row.id)
      this.$message({message: '支付成功', type: 'success'})
      this.getList()
      return
    }
  }
}

</script>
