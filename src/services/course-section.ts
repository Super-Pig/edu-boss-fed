/**
 * 课程章节相关请求模块
 */
import request from '@/utils/request'

export const getSectionAndLesson = (courseId: string|number) => {
  return request({
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

export const getSectionById = (sectionId: string|number) => {
  return request({
    url: '/boss/course/section/getBySectionId',
    params: {
      sectionId
    }
  })
}

export const saveOrUpdateSection = (data: any) => {
  return request({
    url: '/boss/course/section/saveOrUpdateSection',
    method: 'POST',
    data
  })
}
