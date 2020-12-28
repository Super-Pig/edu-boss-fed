<template>
  <div class="course-create">
    <el-card>
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
            :title="item.title"
            :icon="item.icon"
            @click.native="activeStep = index"
            v-for="(item, index) in steps"
            :key="index"
          ></el-step>
        </el-steps>
      </div>

      <el-form label-width="80px">
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              type="textarea"
              v-model="course.previewFirstField"
              style="margin-bottom: 10px"
              placeholder="概述1"
            ></el-input>
            <el-input
              type="textarea"
              v-model="course.previewSecondField"
              placeholder="概述2"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number
              label="描述文字"
              v-model="course.sortNum"
            ></el-input-number>
          </el-form-item>
        </div>
        <div v-show="activeStep === 1">
          <el-form-item label="课程封面">
            <course-image v-model="course.courseListImg" :limit="5" />
          </el-form-item>

          <el-form-item label="介绍封面">
            <course-image v-model="course.courseImgUrl" :limit="2" />
          </el-form-item>
        </div>
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input>
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input></el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 2">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="isSecKill"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>

          <template v-if="isSecKill">
            <el-form-item label="开始时间">
              <el-date-picker type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input>
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <el-input type="textarea"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary">保存</el-button>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button
            v-if="activeStep >= 0 && activeStep < 4"
            @click="activeStep++"
            >下一步</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdateCourse } from '@/services/course'
import CourseImage from './components/CourseImage.vue'

export default Vue.extend({
  name: 'CourseCreate',
  components: {
    CourseImage
  },
  data () {
    return {
      activeStep: 0,
      isSecKill: false,
      imageUrl: '',
      setps: [
        { title: '基本信息', icon: 'el-icon-edit' },
        { title: '课程封面', icon: 'el-icon-edit' },
        { title: '销售信息', icon: 'el-icon-edit' },
        { title: '秒杀活动', icon: 'el-icon-edit' },
        { title: '课程详情', icon: 'el-icon-edit' }
      ],
      course: {
        id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          id: 0,
          courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          id: 0,
          courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
</style>
