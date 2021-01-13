/**
 * 课程课时相关请求模块
 */
import request from '@/utils/request'

export const getLessonById = (lessonId: string | number) => {
  return request({
    url: '/boss/course/lesson/getById',
    params: {
      lessonId
    }
  })
}

export const saveOrUpdateLesson = (data: any) => {
  return request({
    url: '/boss/course/lesson/saveOrUpdate',
    method: 'POST',
    data
  })
}
