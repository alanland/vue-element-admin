import {default as request, GET, POST, DELETE} from '@/utils/request'
import baseApi from '@/api/base'

const baseUrl = '/rest/sysRole'

export default Object.assign(baseApi(baseUrl), {})
