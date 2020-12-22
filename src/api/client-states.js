import request from '@/utils/request'

export function getClientStates(params) {
  return request({
    url: 'client_states',
    method: 'get',
    params,
    baseURL: '/api'
  })
}
