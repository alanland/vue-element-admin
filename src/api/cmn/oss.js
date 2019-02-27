import {default as request, GET, POST} from '@/utils/request'
import baseApi from '@/api/base'

const baseUrl = '/rest/aliyunoss/'

export default {
  list: params => request({url: baseUrl + 'list', method: GET, params}),
  get: params => request({url: baseUrl + 'item', method: GET, params}),
  remove: data => request({url: baseUrl + 'remove', method: POST, data})
}
