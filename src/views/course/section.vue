<template>
  <div class="course-section">
    <el-card>
      <div slot="header" class="card-header">
        课程管理
        <el-button
          type="primary"
          @click="handleShowAddSection"
        >
          添加阶段
        </el-button>
      </div>

      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleSort"
      >
        <div class="inner" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="data.sectionName" class="actions">
            <el-button @click.stop="handleEditSectionShow(data)"
              >编辑</el-button
            >
            <el-button type="primary" @click.stop="handleShowAddLesson(data)"
              >添加课时</el-button
            >
            <el-select
              class="select-status"
              v-model="data.status"
              placeholder="请选择"
              @change="handleSectionStatusChange(data)"
            >
              <el-option label="已隐藏" :value="0"></el-option>
              <el-option label="待更新" :value="1"></el-option>
              <el-option label="已更新" :value="2"></el-option>
            </el-select>
          </span>
          <span v-else class="actions">
            <el-button @click="handleShowEditLesson(data, node.parent.data)"
              >编辑</el-button
            >
            <el-button type="success"
              @click="$router.push({
                name: 'course-video',
                params: {
                  courseId
                },
                query: {
                  sectionId: node.parent.id,
                  lessonId: data.id,
                }
              })"
            >上传视频</el-button>
            <el-select
              class="select-status"
              v-model="data.status"
              placeholder="请选择"
              @change="handleLessonStatusChange(data)"
            >
              <el-option label="已隐藏" :value="0"></el-option>
              <el-option label="待更新" :value="1"></el-option>
              <el-option label="已更新" :value="2"></el-option>
            </el-select>
          </span>
        </div>
      </el-tree>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getSectionAndLesson,
  getSectionById,
  saveOrUpdateSection
} from '@/services/course-section'
import { Form } from 'element-ui'

import { saveOrUpdateLesson } from '@/services/course-lesson'

export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      section: {
        courseId: this.courseId,
        sectionName: '',
        description: '',
        orderNum: 0,
        status: 0
      },
      lesson: {
        courseId: this.courseId,
        sectionId: undefined,
        sectionName: '',
        theme: '',
        duration: 0,
        isFree: false,
        orderNum: 0,
        status: 0
      },
      isAddSectionShow: false,
      isAddLessonShow: false,
      defaultProps: {
        children: 'lessonDTOS',
        label: (data: any) => {
          return data.sectionName || data.theme
        }
      }
    }
  },
  created () {
    this.loadSections()
  },

  methods: {
    async loadSections () {
      const { data } = await getSectionAndLesson(this.courseId)

      this.sections = data.data
    },

    handleShowAddSection () {
      this.section = {
        courseId: this.courseId,
        sectionName: '',
        description: '',
        orderNum: 0,
        status: 0
      }

      this.isAddSectionShow = true
    },

    async handleAddSection () {
      const { data } = await saveOrUpdateSection(this.section)
      this.loadSections()
      this.isAddSectionShow = false;
      (this.$refs['section-form'] as Form).resetFields()
      this.$message.success('操作成功')
    },

    async handleEditSectionShow (section: any) {
      const { data } = await getSectionById(section.id)

      this.section = data.data
      this.isAddSectionShow = true
    },

    async handleSectionStatusChange (section: any) {
      await saveOrUpdateSection(section)
      this.$message.success('操作成功')
    },

    async handleLessonStatusChange (lesson: any) {
      await saveOrUpdateLesson(lesson)
      this.$message.success('操作成功')
    },

    handleShowAddLesson (data: any) {
      this.lesson = {
        sectionName: data.sectionName,
        sectionId: data.id,
        courseId: this.courseId,
        theme: '',
        duration: 0,
        isFree: false,
        orderNum: 0,
        status: 0
      }

      this.isAddLessonShow = true
    },

    async handleAddLesson () {
      await saveOrUpdateLesson(this.lesson)
      this.$message.success('操作成功')
      this.loadSections()
      this.isAddLessonShow = false
    },

    handleShowEditLesson (lesson: any, section: any) {
      this.lesson = lesson
      this.lesson.sectionName = section.sectionName
      this.isAddLessonShow = true
    },

    handleAllowDrop (draggingNode: any, dropNode: any, type: any) {
      return (
        draggingNode.data.sectionId === dropNode.data.sectionId &&
        type !== 'inner'
      )
    },

    async handleSort (dragNode: any, dropNode: any, type: any, event: any) {
      try {
        await Promise.all(dropNode.parent.childNodes.map((item: any, index: number) => {
          if (dragNode.data.lessonDTOS) {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        }))

        this.$message.success('排序成功')
      } catch (e) {
        this.$message.success('排序失败')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

::v-deep .el-tree-node__content {
  height: auto;
}

.select-status {
  width: 100px;
  margin-left: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
