import {default as request, GET, POST, DELETE} from '@/utils/request'
import baseApi from '@/api/base'

const baseUrl = '/rest/zhaopinCompany'

export default Object.assign(baseApi(baseUrl), {
  getByCode: (id) => request({url: `${baseUrl}/getByCode/${id}`, method: GET})
})
