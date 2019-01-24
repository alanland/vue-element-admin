import {default as request, GET, POST, PUT, DELETE} from '@/utils/request'
import baseApi from '@/api/base'

const baseUrl = '/rest/dashboard'

export default Object.assign(baseApi(baseUrl), {
  values: id => request({url: `${baseUrl}/values`, method: GET}),
})
