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
    </div>
  </sticky>

  <!-- form -->
  <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
    <el-form ref="dataForm" :model="form" size="mini" label-position="left" label-width="80px"
             style="width: 100%">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="用户名" prop="code">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名" prop="code">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="密码" prop="code">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电话" prop="code">
            <el-input v-model="form.phone"></el-input>
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
      <el-button v-else type="primary" @click="handleUpdate">保存</el-button>
    </div>
  </el-dialog>

  <div class="content-container">
    <el-table ref="multipleTable" :data="list" :stripe="true" tooltip-effect="dark" style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="code" label="用户名" width="120">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column label="日期" width="120">
        <template slot-scope="scope">
        <el-tag v-if="scope.row.status === 0">已启用</el-tag>
        <el-tag v-else type="info">已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="email" label="邮件" width="300" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
        <el-button v-if="scope.row.status === 0" type="warning" title="禁用" icon="el-icon-close" size="mini"
                   circle></el-button>
        <el-button v-else type="success" icon="el-icon-check" size="mini" circle></el-button>
        <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
        <el-button type="info" icon="el-icon-message" size="mini" circle></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" circle></el-button>
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
import api from '@/api/sys/user'
import apiRole from '@/api/sys/role'

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

      roleOptions: []
    }
  },
  async created() {
    const res = await apiRole.options()
    this.roleOptions = res.data.data
  },
  methods: {
    handleSelectionChange(val) {
      this.selection = val
    }
  }
}

</script>
