import {default as request, GET, POST, PUT, DELETE} from '@/utils/request'

export default function (baseUrl) {
  return {
    list: params => request({url: `${baseUrl}/list`, method: GET, params}),
    save: data => request({url: baseUrl, method: POST, data}),
    update: (data) => request({url: baseUrl, method: PUT, data}),
    remove: (data) => request({url: baseUrl, method: DELETE, data}),

    get: (id) => request({url: `${baseUrl}/get/${id}`, method: GET}),
    options: () => request({url: `${baseUrl}/options`, method: GET}),
    disable: (id) => request({url: `${baseUrl}/disable/${id}`, method: PUT}),
    enable: (id) => request({url: `${baseUrl}/enable/${id}`, method: PUT}),
    updateStatus: (data) => request({url: `${baseUrl}/updateStatus`, method: POST, data})

  }
}
