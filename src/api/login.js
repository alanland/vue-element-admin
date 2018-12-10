import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/rest/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/rest/auth/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/rest/auth/userInfo',
    method: 'get',
    params: { token }
  })
}
