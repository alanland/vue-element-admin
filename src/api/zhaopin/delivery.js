import {default as request, GET, POST, PUT, DELETE} from '@/utils/request'
import baseApi from '@/api/base'

const baseUrl = '/rest/zhaopinDelivery'

export default Object.assign(baseApi(baseUrl), {
  findByPositionId: (positionId) => request({url: `${baseUrl}/position/${positionId}`, method: GET}),
  findByMemberId: (memberId) => request({url: `${baseUrl}/member/${memberId}`, method: GET}),
  interview: data => request({url: `${baseUrl}/interview`, method: PUT, data}),
  ok: id => request({url: `${baseUrl}/ok/${id}`, method: PUT}),
  notOk: id => request({url: `${baseUrl}/notOk/${id}`, method: PUT}),
  welfare: id => request({url: `${baseUrl}/welfare/${id}`, method: PUT}),
})
