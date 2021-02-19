import request from '@/utils/request'

export function getBlogSortList(params) {
  return request({
    url: process.env.WEB_API + '/type/getBlogTypeList',
    method: 'get',
    params
  })
}

export function getArticleByBlogSortUid(params) {
  return request({
    url: process.env.WEB_API + '/type/getBlogsByType',
    method: 'get',
    params
  })
}