<template>
  <div>
    <!-- breadcrumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>權限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片視圖 -->
    <el-card>
      <!-- 表格 -->
      <el-table :data="rights_List" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="權限區域"></el-table-column>
        <el-table-column prop="path" label="請求路徑"></el-table-column>
        <el-table-column prop="level" label="訪問等級">
          <slot slot-scope="item_data">
            <el-tag type="success" v-if="item_data.row.level === '0'">一級</el-tag>
            <el-tag type="warning" v-else-if="item_data.row.level === '1'">二級</el-tag>
            <el-tag type="danger" v-else-if="item_data.row.level === '2'">三級</el-tag>
          </slot>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.get_rights_List()
  },
  data() {
    return {
      // 權限列表
      rights_List: []
    }
  },
  methods: {
    //   異步請求權限列表data
    async get_rights_List() {
      const { data: res } = await this.$http.get('rights/list')

      // 請求失敗
      if (res.meta.status !== 200) {
        return this.$message.error('權限列表加載失敗')
      }
      // 請求成功
      //   保存data
      this.rights_List = res.data
      console.log(this.rights_List)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
