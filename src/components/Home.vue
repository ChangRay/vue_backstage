<template>
  <div>
    <el-button type="warning" @click="logout">登出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      // 清除sesseion
      window.sessionStorage.clear()
      // 重定向到login
      this.$router.push('/login')
      // 提示message框
      this.$message('登出成功')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
