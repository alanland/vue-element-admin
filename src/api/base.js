import {default as request, GET, POST, PUT, DELETE} from '@/utils/request'

export default function (baseUrl) {
  return {
    list: params => {
      const p = {
        page: params.page,
        sort: params.sort,
        size: params.size
      }
      const d = {}
      for (const k in params) {
        if (['page', 'sort', 'size'].indexOf(k) < 0) {
          d[k] = params[k]
        }
      }
      return request({url: `${baseUrl}/list`, method: POST, params: p, data: d})
    },
    save: data => request({url: baseUrl, method: POST, data}),
    update: (data) => request({url: baseUrl, method: PUT, data}),
    remove: (data) => request({url: baseUrl, method: DELETE, data}),

    get: (id) => request({url: `${baseUrl}/get/${id}`, method: GET}),
    options: () => request({url: `${baseUrl}/options`, method: GET}),
    disable: (id) => request({url: `${baseUrl}/disable/${id}`, method: PUT}),
    disableMulti: (data) => request({url: `${baseUrl}/disableMulti`, data, method: PUT}),
    enable: (id) => request({url: `${baseUrl}/enable/${id}`, method: PUT}),
    enableMulti: (data) => request({url: `${baseUrl}/enableMulti`, data, method: PUT}),
    updateStatus: (data) => request({url: `${baseUrl}/updateStatus`, method: POST, data})

  }
}
