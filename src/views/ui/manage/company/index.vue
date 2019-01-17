<style lang="stylus" scoped>

</style>

<template>
<div class="page page-user">
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
    <el-form ref="dataForm" :model="form" size="mini" label-position="left" label-width="100px"
             style="width: 100%">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="企业编码" prop="code">
            <el-input :disabled="editing" v-model="form.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业全称" prop="code">
            <el-input :disabled="editing" v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="工商注册地址" prop="code">
            <el-input v-model="form.licenseAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业执照" prop="code">
            <el-input v-model="form.licensePic1"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="招聘联系人" prop="code">
            <el-input v-model="form.contactName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人电话" prop="code">
            <el-input v-model="form.contactTel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="公司电话" prop="code">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司邮箱" prop="code">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="公司所属行业" prop="code">
            <el-select v-model="form.industry" placeholder="请选择" width="100%">
              <el-option
                v-for="item in industryOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="融资情况" prop="code">
            <el-select v-model="form.financing" placeholder="请选择" width="100%">
              <el-option
                v-for="item in financingOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="团队规模" prop="code">
            <el-select v-model="form.teamSize" placeholder="请选择" width="100%">
              <el-option
                v-for="item in teamSizeOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="公司地址" prop="code">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="开票名称" prop="code">
            <el-input v-model="form.dutyName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票税号" prop="code">
            <el-input v-model="form.dutyNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="开票地址" prop="code">
            <el-input v-model="form.dutyAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票电话" prop="code">
            <el-input v-model="form.dutyTel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="开票银行" prop="code">
            <el-input v-model="form.dutyBankName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票银行卡号" prop="code">
            <el-input v-model="form.dutyBankCard"></el-input>
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
      <el-table-column prop="code" label="企业编码" width="120">
      </el-table-column>
      <el-table-column prop="name" label="企业名称" width="120">
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
        <el-tag v-if="scope.row.status === 0">已启用</el-tag>
        <el-tag v-else type="info">已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="公司电话" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="email" label="公司邮箱" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="查看招聘" width="120">
        <template slot-scope="scope">
        <router-link class="route-link" :to="{ name: 'company-positions', params: { companyId: scope.row.id }}">岗位列表</router-link>
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
        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="handleDelete(scope.row)"></el-button>
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
import api from '@/api/zhaopin/company'
import apiRole from '@/api/sys/role'
import data from '../data'

export default {
  components: {Sticky},
  mixins: [ListMixin, RoleMixin],
  data() {
    return {
      api,
      industryOptions: [],
      financingOptions: [],
      teamSizeOptions: [],
      defaultListQuery: {
        page: 1,
        size: 100,
        city: undefined,
        district: undefined,
        area1: undefined, // [100,999,'between:int']
        sort: 'hintCode,asc'
      },

      roleOptions: []
    }
  },
  async created() {
    const res = await apiRole.options()
    this.roleOptions = res.data
    this.industryOptions = data.company.filter(i => i.value === 'industry')[0]
      .items.filter(i => i.value !== '')
    this.financingOptions = data.company.filter(i => i.value === 'financing')[0]
      .items.filter(i => i.value !== '')
    this.teamSizeOptions = data.company.filter(i => i.value === 'teamSize')[0]
      .items.filter(i => i.value !== '')
  },
  methods: {
  }
}

</script>
