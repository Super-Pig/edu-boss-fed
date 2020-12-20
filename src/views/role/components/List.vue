<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-from ref="form" :model="form">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="loading"
              >查询搜索</el-button>
            <el-button :disabled="loading" @click="onReset">重置</el-button>
          </el-form-item>
        </el-from>
      </div>

      <el-button @click="handleAdd">添加角色</el-button>

      <el-table
        :data="roles"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="createdTime" label="添加时间"></el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <div>
              <el-button type="text"
              @click="$router.push({
                name: 'alloc-menu',
                params: {
                  roleId: scope.row.id
                }
              })"
              >分配菜单</el-button>
              <el-button type="text">分配资源</el-button>
            </div>
            <div>
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="isEdit ? '编辑角色' : '添加角色'" :visible.sync="dialogVisible" width="50%">
      <create-or-edit
      @success="onSuccess"
      @cancel="dialogVisible = false"
      :role-id="roleId"
      :is-edit="isEdit"
      v-if="dialogVisible"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRoles, deleteRole } from '@/services/role'
import CreateOrEdit from './CreateOrEdit.vue'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'RoleList',
  data () {
    return {
      roles: [],
      form: {
        current: 1,
        size: 50,
        name: ''
      },
      loading: false,
      dialogVisible: false,
      roleId: null,
      isEdit: false
    }
  },

  components: {
    CreateOrEdit
  },

  created () {
    this.loadRoles()
  },

  methods: {
    async loadRoles () {
      this.loading = true
      const { data } = await getRoles(this.form)
      this.$message.success('操作成功')
      this.roles = data.data.records
    },

    onSubmit () {
      this.loadRoles()
    },

    handleEdit (role: any) {
      this.dialogVisible = true
      this.roleId = role.id
      this.isEdit = true
    },

    async handleDelete (role: any) {
      try {
        await this.$confirm(`确认删除角色：${role.name}?`, '删除提示')
        await deleteRole(role.id)
        this.$message.success('删除成功')
        this.loadRoles()
      } catch (err) {
        if (err && err.response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消删除')
        }
      }
    },

    onReset () {
      (this.$refs.form as Form).resetFields()

      this.loadRoles()
    },

    onSuccess () {
      this.dialogVisible = false

      this.loadRoles()
    },

    handleAdd () {
      this.isEdit = false
      this.dialogVisible = true
    }
  }
})
</script>
