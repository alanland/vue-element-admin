<style lang="stylus" scoped>

.el-button .route-link {
  color white
}

.page-mycompany {
  .form {
    padding 20px
  }
}

</style>

<template>
  <div class="page page-mycompany">
    <sticky ref="filterForm" :model="form" class-name="filter-container flex-row flex-wrap full-width">
      <div class="filters">
      </div>
      <div class="buttons flex-row">
        <el-button type="primary" @click="getList">刷新</el-button>
        <el-button v-if="!editing" type="primary" @click="editing=true">修改</el-button>
        <el-button v-if="editing" type="danger" @click="save">保存</el-button>
        <el-button type="danger">
          <router-link :to="{ name: 'company-positions', params: { companyId: company.id }}" class="route-link">
            岗位列表
          </router-link>
        </el-button>

      </div>
    </sticky>

    <!-- form -->
    <el-form ref="dataForm" :model="form" size="mini" label-position="left" label-width="100px"
             class="form"
             style="width: 100%">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="企业编码" prop="code">
            <el-input :disabled="!editing" v-model="form.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业全称" prop="code">
            <el-input :disabled="!editing" v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="工商注册地址" prop="code">
            <el-input :disabled="!editing" v-model="form.licenseAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="企业执照" prop="code">
            <el-input :disabled="!editing" v-model="form.licensePic1"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="招聘联系人" prop="code">
            <el-input :disabled="!editing" v-model="form.contactName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人电话" prop="code">
            <el-input :disabled="!editing" v-model="form.contactTel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="公司电话" prop="code">
            <el-input :disabled="!editing" v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司邮箱" prop="code">
            <el-input :disabled="!editing" v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="公司所属行业" prop="code">
            <el-select :disabled="!editing" v-model="form.industry" placeholder="请选择" width="100%">
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
            <el-select :disabled="!editing" v-model="form.financing" placeholder="请选择" width="100%">
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
            <el-select :disabled="!editing" v-model="form.teamSize" placeholder="请选择" width="100%">
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
            <el-input :disabled="!editing" v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="开票名称" prop="code">
            <el-input :disabled="!editing" v-model="form.dutyName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票税号" prop="code">
            <el-input :disabled="!editing" v-model="form.dutyNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="开票地址" prop="code">
            <el-input :disabled="!editing" v-model="form.dutyAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票电话" prop="code">
            <el-input :disabled="!editing" v-model="form.dutyTel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="开票银行" prop="code">
            <el-input :disabled="!editing" v-model="form.dutyBankName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票银行卡号" prop="code">
            <el-input :disabled="!editing" v-model="form.dutyBankCard"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

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
      user: '',
      company: {},
      form: {},

      isAdmin: '',
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
    let user = this.user = this.$store.getters.user
    let company = await api.getByCode(user.name)
    this.company = this.form = company.data
    let json = await api.getByCode(user.name)
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
    save() {
      this.editing = false
    }
  }
}

</script>
