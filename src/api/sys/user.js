import {default as request, GET, POST, DELETE} from '@/utils/request'
import baseApi from '@/api/base'

const baseUrl = '/rest/sysUser'

export default Object.assign(baseApi(baseUrl), {})
