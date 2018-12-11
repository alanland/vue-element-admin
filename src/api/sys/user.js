import {default as request, GET, POST, DELETE} from '@/utils/request'
import baseApi from '@/api/base'

const baseUrl = '/rest/user'

export default Object.assign(baseApi(baseUrl), {})
