<template>
  <div>
    <!-- Breadcumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>訂單管理</el-breadcrumb-item>
      <el-breadcrumb-item>訂單清單</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card -->
    <el-card>
      <!-- top -->
      <!-- <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            placeholder="搜尋訂單"
            v-model="orders_list_query.query"
            clearable
            @clear="get_orders_list"
          >
            <el-button slot="append" icon="el-icon-search" @click="get_orders_list"></el-button>
          </el-input>
        </el-col>
      </el-row> -->
      <!-- table -->
      <el-table :data="orders_list">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="訂單編號" prop="order_number" width="200"></el-table-column>
        <el-table-column label="訂單金額" prop="order_price"></el-table-column>
        <el-table-column label="付款狀態" prop="pay_status">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.pay_status === 1">已付款</el-tag>
            <el-tag type="warning" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否出貨" prop="is_send"></el-table-column>
        <el-table-column label="下單時間" prop="create_time">
          <template slot-scope="{row}">{{row.create_time | dateformat}}</template>
        </el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" icon="el-icon-edit" :dd="row"></el-button>
            <el-button type="success" icon="el-icon-location"></el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- pagination -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orders_list_query.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="orders_list_query.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orders_list_total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.get_orders_list()
  },
  data() {
    return {
      orders_list_query: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orders_list: [],
      orders_list_total: 0
    }
  },
  methods: {
    async get_orders_list() {
      const { data: res } = await this.$http.get('orders', {
        params: this.orders_list_query
      })

      if (res.meta.status !== 200) {
        this.$message.error('訂單列表加載失敗')
        return false
      }

      this.orders_list = res.data.goods
      this.orders_list_total = res.data.total

      console.log(this.orders_list)
    },
    handleSizeChange(newSize) {
      this.orders_list_query.pagesize = newSize
      this.get_orders_list()
    },
    handleCurrentChange(newCurrent) {
      this.orders_list_query.pagenum = newCurrent
      this.get_orders_list()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
