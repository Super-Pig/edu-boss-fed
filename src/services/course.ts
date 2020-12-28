/**
 * 课程相关请求模块
 */
import request from '@/utils/request'

export const getQueryCourse = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourse',
    data
  })
}

export const changeState = (params: any) => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

export const saveOrUpdateCourse = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

export const uploadCourseImage = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data
  })
}
