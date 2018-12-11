import waves from '@/directive/waves'
import * as _ from 'lodash'
import {parseTime} from '@/utils'

export default {
  directives: {
    waves
  },
  filters: {},
  data() {
    return {
      list: [],
      api: {},
      defaultListQuery: {
        page: 1,
        size: 10,
        code: undefined,
        name: undefined,
        sort: 'hintCode,asc'
      },
      listQuery: {},
      listLoading: false,
      defaultForm: {
        id: undefined,
        code: '',
        name: '',
        remark: ''
      },
      form: {}

    }
  },
  created() {
    this.listQuery = Object.assign({}, this.defaultListQuery)
    this.form = Object.assign({}, this.defaultForm)
  },
  async mounted() {
    await this.getList()
  },
  methods: {
    getApi: require('@/api/getApi'),
    resetQuery() {
      this.listQuery = Object.assign({}, this.defaultListQuery)
    },
    resetAndQuery() {
      this.resetQuery()
      this.getList()
    },
    beforeGetList(query) {
    },
    async getList() {
      this.listLoading = true
      const query = _.cloneDeep(this.listQuery)
      this.beforeGetList(query)
      query.page = query.page - 1
      if (query.code) {
        query.code = [query.code, 'like']
      }
      if (query.orderCode) {
        query.orderCode = [query.orderCode, 'like']
      }
      return this.api.list(query).then(response => {
        this.list = response.data.data.items
        this.total = response.data.data.total
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetForm() {
      this.form = Object.assign({}, this.defaultForm)
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getCreateData() {
      return {code: this.form.code, name: this.form.name, remark: this.form.remark}
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = this.getCreateData()
          this.api.save(data).then(res => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    getUpdateData(row) {
      return {id: row.id, code: row.code, name: row.name, remark: row.remark}
    },
    handleUpdate(row) {
      this.form = this.getUpdateData(row)
      this.$router.push(`/zhw/item/${this.itemClass}/${this.form.id}/${this.form.name}`)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.form)
          this.api.update(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDialogUpdate(row) {
      this.form = this.getUpdateData(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.api.remove(row.id).then(res => {
          this.getList()
          this.$notify({title: '成功', message: '删除成功', type: 'success', duration: 2000})
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['table.id', 'table.code', 'table.name', 'table.lastUpdated'].map(h => this.$t(h))
        const filterVal = ['id', 'code', 'name', 'lastUpdated']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel(tHeader, data, 'table-list')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
