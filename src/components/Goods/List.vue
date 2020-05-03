<template>
  <div>
    <!-- Breadcumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分類參數</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card -->
    <el-card>
      <!-- top -->
      <el-row :gutter="20">
        <!-- 搜尋框 -->
        <el-col :span="8">
          <el-input
            placeholder="搜尋商品"
            v-model="goods_list_query_params.query"
            clearable
            @clear="get_goods_list"
          >
            <el-button slot="append" icon="el-icon-search" @click="get_goods_list"></el-button>
          </el-input>
        </el-col>
        <!--添加商品按鈕 -->
        <el-col :span="5">
          <el-button type="primary" @click="add_goods_page">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- main -->
      <!-- table -->
      <el-table :data="goods_list" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名稱" prop="goods_name" width="430"></el-table-column>
        <el-table-column label="商品價格(元)" prop="goods_price" width="90"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70"></el-table-column>
        <el-table-column label="創建時間" prop="add_time">
          <template slot-scope="{row}">{{row.add_time | dateformat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delete_good(row.goods_id)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <el-pagination
        @size-change="handlePaginationSizeChange"
        @current-change="handlePaginationCurrentChange"
        :current-page="goods_list_query_params.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="goods_list_query_params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goods_list_total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.get_goods_list()
  },
  data() {
    return {
      // 商品列表的query params
      goods_list_query_params: { query: '', pagenum: 1, pagesize: 10 },
      // 商品列表
      goods_list: [],
      //   商品列表總筆數
      goods_list_total: 0
    }
  },
  methods: {
    //   獲取商品列表
    async get_goods_list() {
      const { data: res } = await this.$http.get('goods', {
        params: this.goods_list_query_params
      })

      if (res.meta.status !== 200) {
        this.$message.error('商品列表加載失敗')
        return false
      }

      this.goods_list = res.data.goods
      this.goods_list_total = res.data.total
      console.log(this.goods_list)
    },
    handlePaginationSizeChange(newSize) {
      this.goods_list_query_params.pagesize = newSize
      this.get_goods_list()
    },
    handlePaginationCurrentChange(newCurrent) {
      this.goods_list_query_params.pagenum = newCurrent
      this.get_goods_list()
    },
    async delete_good(id) {
      // !!!!!!!!!-------隱藏控制刪除權限----------
      if (window.sessionStorage.getItem('user') !== 'ray') {
        return this.$message.warning('您為測試觀察管理員，無法刪除數據')
      }

      const result = await this.$confirm('是否刪除該商品', '刪除商品', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (result !== 'confirm') {
        this.$message.info('取消刪除操作')
        return false
      }

      const { data: res } = await this.$http.delete(`goods/${id}`)

      if (res.meta.status !== 200) {
        this.$message.error('商品刪除失敗')
      }

      this.get_goods_list()
      this.$message.success('商品刪除成功')
    },
    add_goods_page() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
