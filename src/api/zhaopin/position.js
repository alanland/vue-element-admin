import {default as request, GET, POST, PUT, DELETE} from '@/utils/request'
import baseApi from '@/api/base'

const baseUrl = '/rest/zhaopinPosition'

export default Object.assign(baseApi(baseUrl), {
  pay: (id) => request({url: `${baseUrl}/pay/${id}`, method: PUT}),
  payConfirm: (id) => request({url: `${baseUrl}/payConfirm/${id}`, method: PUT}),
  payUnconfirm: (id) => request({url: `${baseUrl}/payUnconfirm/${id}`, method: PUT}),
})
