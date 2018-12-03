import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/rest/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/rest/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/rest/user/info',
    method: 'get',
    params: { token }
  })
}
