import waves from '@/directive/waves'
import * as _ from 'lodash'
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  directives: {
    waves
  },
  components: {
    Pagination
  },
  filters: {},
  data() {
    return {
      list: [],
      api: {},
      total: 0, // list 总行数
      selection: [], // 选中的数据
      dialogFormVisible: false,
      dialogTitleMap: {create: '新增', edit: '编辑'},
      dialogStatus: 'create', // edit
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
  computed: {
    editing() {
      return this.dialogStatus === 'edit'
    },
    creating() {
      return this.dialogStatus === 'creat'
    }
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
      if (query.name) {
        query.name = [query.name, 'like']
      }
      if (query.orderCode) {
        query.orderCode = [query.orderCode, 'like']
      }
      return this.api.list(query).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.selection = val
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
    handleNew() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getNewItem() {
      return {code: this.form.code, name: this.form.name, remark: this.form.remark}
    },
    handleCreate() {
      console.log(this.form)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.form)
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
    handleEdit(row) {
      this.form = row
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
    },
    handleUpdate() {
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
        this.api.remove([row.id]).then(res => {
          this.getList()
          this.$notify({title: '成功', message: '删除成功', type: 'success', duration: 2000})
        })
      })
    },
    handleDeleteSelected() {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.api.remove(this.selection.map(it => it.id)).then(res => {
          this.getList()
          this.$notify({title: '成功', message: '删除成功', type: 'success', duration: 2000})
        }).catch(() => this.getList())
      })
    },
    async handleEnable(row) {
      const res = await this.api.enable(row.id)
      if (res.code === 0) {
        row.status = 0
        this.$notify({title: '成功', message: '启用成功', type: 'success', duration: 2000})
      }
    },
    async handleDisable(row) {
      const res = await this.api.disable(row.id)
      if (res.code === 0) {
        row.status = 1
        this.$notify({title: '成功', message: '禁用成功', type: 'success', duration: 2000})
      }
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
