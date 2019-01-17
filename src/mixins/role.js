import waves from '@/directive/waves'
import * as _ from 'lodash'
import {parseTime} from '@/utils'

export default {
  directives: {},
  components: {},
  filters: {},
  data() {
    return {
      roleHasAdmin: false
    }
  },
  created() {
    this.roleHasAdmin = this.$store.state.user.roles.filter(i => i.admin === true).length > 0
  },
  async mounted() {
  },
  computed: {},
  methods: {}
}
