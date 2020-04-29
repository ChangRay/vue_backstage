<template>
  <el-container class="layout_box">
    <!-- header -->
    <el-header>
      <!-- header_left -->
      <div class="header_left">
        <!-- logo -->
        <img src="../assets/logo.jpg" alt />
        <h1>Vue後台管理系統</h1>
      </div>
      <el-button type="warning" @click="logout">登出</el-button>
    </el-header>
    <el-container>
      <!-- aside -->
      <el-aside :width="nav_is_collapse ? '64px' : '200px'">
        <!-- 摺疊按鈕 -->
        <div class="toggle_button" @click="nav_is_collapse = !nav_is_collapse">|||</div>
        <!-- 菜單 -->
        <el-menu
          class="aside_nav"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          :default-active="active_menu_item"
          unique-opened
          :collapse-transition="false"
          :collapse="nav_is_collapse"
          router
        >
          <!-- 一級菜單 -->
          <el-submenu v-for="item in menuList" :key="item.id" :index="`${item.id}`">
            <!-- slot -->
            <template slot="title">
              <!-- 圖標 -->
              <i :class="menuList_Icon[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二級選單 -->
            <!-- 在父組件el-menu開啟router功能後 -->
            <!-- 在el-menu-item點擊時，會跳轉到index的值 -->
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="`/${subItem.path}`"
              @click="set_Active_MenuItem(`/${subItem.path}`)"
            >
              <template slot="title">
                <!-- 圖標 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
            <!-- 二級選單 -->
          </el-submenu>
          <!-- 一級菜單 -->
        </el-menu>
      </el-aside>
      <!-- main -->
      <el-main>
        <!-- 路由佔位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 生命週期 - 發起異步請求
  created() {
    this.getMenuList()
    this.active_menu_item = window.sessionStorage.getItem('Active_MenuItem')
  },
  data() {
    return {
      // 當前active的menu Item
      active_menu_item: '',
      // 左側nav是否摺疊
      nav_is_collapse: false,
      // 左側nav內容
      menuList: [],
      // 左側nav圖標
      menuList_Icon: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  methods: {
    async getMenuList() {
      // 發起異步請求
      const { data: res } = await this.$http.get('menus')
      // 請求失敗
      if (res.meta.status !== 200) this.$message.error(res.meta.msg)
      // 請求成功
      this.menuList = res.data
      console.log(this.menuList)
    },
    logout() {
      // 清除sesseion
      window.sessionStorage.clear()
      // 重定向到login
      this.$router.push('/login')
      // 提示message框
      this.$message('登出成功')
    },
    set_Active_MenuItem(activeValue) {
      // 紀錄當前active的item 以供對應組件高亮
      this.active_menu_item = activeValue
      // 保存到session中 以供頁面一加載
      window.sessionStorage.setItem('Active_MenuItem', activeValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.layout_box {
  height: 100vh;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #323141;

  .header_left {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    color: #fff;
  }

  img {
    height: 50px;
  }
}

.el-aside {
  background-color: #333744;
  user-select: none;
  transition: width 0.2s ease;
  i {
    margin-right: 10px;
  }

  .toggle_button {
    text-align: center;
    color: #fff;
    background-color: lighten($color: #333744, $amount: 10%);
    letter-spacing: 0.1em;
    user-select: none;
    cursor: pointer;
  }

  .aside_nav {
    border: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>
