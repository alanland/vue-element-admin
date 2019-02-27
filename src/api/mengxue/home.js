import {default as request, GET, POST, DELETE, PUT} from '@/utils/request'
import baseApi from '@/api/base'

const baseUrl = '/rest/mengxueHome'

export default Object.assign(baseApi(baseUrl), {
  update: data => request({url: `${baseUrl}`, method: PUT, data}),
})
