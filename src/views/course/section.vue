<template>
  <div class="course-section">
    <el-card>
      <div slot="header">课程名称</div>

      <el-tree :data="sections" :props="defaultProps" draggable>
        <div class="inner" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="data.sectionName" class="actions">
            <el-button>编辑</el-button>
            <el-button>添加课时</el-button>
            <el-button>状态</el-button>
          </span>
          <span v-else class="actions">
            <el-button>编辑</el-button>
            <el-button>上传视频</el-button>
            <el-button>状态</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSectionAndLesson } from '@/services/course-section'

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
      defaultProps: {
        children: 'lessionDTOS',
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
</style>
