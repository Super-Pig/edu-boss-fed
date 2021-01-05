<template>
  <div class="course-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据筛选</span>
      </div>
      <el-form
        ref="form"
        :model="filterParams"
        label-width="70px"
        label-position="left"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="filterParams.courseName"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select clearable v-model="filterParams.status">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="上架"></el-option>
            <el-option value="0" label="下架"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset" :disabled="loading">重置</el-button>

          <el-button type="primary" @click="handleFilter" :disabled="loading"
            >查询搜索</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>查询结果</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="primary"
          @click="$router.push({
              name: 'course-create',
            })">添加课程</el-button
        >
      </div>
      <el-table
        v-loading="loading"
        :data="courses"
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="courseName" label="课程名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="sortNum" label="排序"></el-table-column>
        <el-table-column prop="status" label="上架状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="onStateChange(scope.row)"
              :disabled="scope.row.isStatusLoading"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini">内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getQueryCourse, changeState } from '@/services/course'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      loading: true,
      courses: [],
      totalCount: 0,
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      }
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    handleFilter () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },

    handleReset () {
      (this.$refs.form as Form).resetFields()
      this.filterParams.currentPage = 1
      this.loadCourses()
    },

    async loadCourses () {
      const { data } = await getQueryCourse(this.filterParams)

      data.data.records.forEach((item: any) => {
        item.isStatusLoading = false
      })

      this.courses = data.data.records
      this.totalCount = data.data.total
      this.loading = false
    },

    handleEdit (item: any) {
      console.log('handleEdit')
    },

    async onStateChange (course: any) {
      course.isStatusLoading = true

      await changeState({
        courseId: course.id,
        status: course.status
      })

      course.isStatusLoading = false

      this.$message.success(course.status === 0 ? '下架成功' : '上架成功')
    }
  }
})
</script>
