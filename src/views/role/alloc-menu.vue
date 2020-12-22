<template>
  <div class="alloc-menu">
    <el-card>
      <div slot="header">
        <span>分配权限</span>
      </div>

      <el-tree
        :data="menus"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        ref="menu-tree"
        node-key="id"
        :default-checked-keys="checkedKeys"
      ></el-tree>

      <div style="text-align: center">
        <el-button @click="resetChecked">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },

  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },

  methods: {
    async loadMenus () {
      const { data } = await getMenuNodeList()

      this.menus = data.data
    },

    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      this.getCheckedKeys(data.data)
    },

    getCheckedKeys (menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          this.checkedKeys = [...this.checkedKeys, menu.id as never]
        }

        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList)
        }
      })
    },

    async onSave () {
      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      })

      this.$message.success('操作成功')

      this.$router.back()
    },

    resetChecked () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>
