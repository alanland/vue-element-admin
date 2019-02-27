<style lang="stylus" scoped>

</style>

<template>
  <div class="page page-user">
    <sticky ref="filterForm" :model="form" class-name="filter-container flex-row flex-wrap full-width">
      <div class="filters">
      </div>
      <div class="buttons flex-row">
        <el-button type="primary" @click="handleUpdate">更新</el-button>
      </div>
    </sticky>

    <!-- form -->
    <el-form ref="dataForm" :model="form" size="mini" label-position="left" label-width="100px"
             style="width: 100%; padding: 15px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="图片" prop="name">
            <Upload v-model="form.pic"></Upload>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="描述" prop="name">
            <el-input :autosize="{ minRows: 20, maxRows: 20}" v-model="form.text" type="textarea"
                      placeholder="Please input"/>
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
import api from '@/api/mengxue/home'
import Upload from '@/components/Upload/aliyunImage2'

export default {
  components: {Sticky, Upload},
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
    let json = await api.get(-2)
    json = json.data
    this.form = json
  },
  methods: {

    handleUpdate() {
      const tempData = Object.assign({}, this.form)
      this.api.update(tempData).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}

</script>
