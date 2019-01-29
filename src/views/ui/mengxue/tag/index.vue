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
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="form.price"></el-input-number>
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
        <el-table-column prop="name" label="name" width="120">
        </el-table-column>
        <el-table-column prop="price" label="price" width="120">
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
import api from '@/api/mengxue/tag'

export default {
  components: {Sticky},
  mixins: [ListMixin, RoleMixin],
  data() {
    return {
      api,
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
  },
  methods: {
  }
}

</script>
