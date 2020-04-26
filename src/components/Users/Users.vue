<template>
  <div>
    <!-- breadcrumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>用戶管理</el-breadcrumb-item>
      <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card組件 -->
    <el-card>
      <!-- 上方搜尋與添加 - 布局容器(24欄) -->
      <!-- gutter表示間距 -->
      <el-row :gutter="20">
        <!-- 搜尋框 -->
        <el-col :span="8">
          <el-input
            placeholder="搜尋"
            v-model="userList_query_params.query"
            @clear="getUserList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按鈕 -->
        <el-col :span="6">
          <el-button type="primary" @click="addUser_dialogVisible = true">添加用戶</el-button>
        </el-col>
      </el-row>
      <!-- 用戶列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="信箱"></el-table-column>
        <el-table-column prop="mobile" label="電話"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="狀態">
          <template slot-scope="item_data">
            <el-switch
              v-model="item_data.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="item_data">
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUser(item_data.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(item_data.row.id, item_data.row.username)"
              ></el-button>
              <el-tooltip effect="dark" content="角色設定" placement="top" :enterable="false">
                <el-button type="info" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userList_query_params.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userList_query_params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totoalLists"
      ></el-pagination>
    </el-card>

    <!-- 添加用戶的提示框 -->
    <el-dialog
      title="添加用戶"
      :visible.sync="addUser_dialogVisible"
      width="50%"
      @close="reset_Form_Values('addUser_form')"
    >
      <!-- 添加form -->
      <el-form
        :model="addUser_form"
        :rules="addUser_form_rules"
        ref="addUser_form"
        label-width="70px"
        status-icon
      >
        <!-- item -->
        <el-form-item label="用戶名" prop="username">
          <el-input v-model="addUser_form.username"></el-input>
        </el-form-item>
        <!-- item -->
        <el-form-item label="密碼" prop="password">
          <el-input v-model="addUser_form.password"></el-input>
        </el-form-item>
        <!-- item -->
        <el-form-item label="信箱" prop="email">
          <el-input v-model="addUser_form.email"></el-input>
        </el-form-item>
        <!-- item -->
        <el-form-item label="電話" prop="mobile">
          <el-input v-model="addUser_form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加form -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUser_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser_pre_validate">確 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用戶的提示框 -->
    <el-dialog
      title="修改用戶"
      :visible.sync="editUser_dialogVisible"
      width="50%"
      @close="reset_Form_Values('editUser_form')"
    >
      <!-- 修改form -->
      <el-form
        :model="editUser_form"
        :rules="editUser_form_rules"
        ref="editUser_form"
        label-width="70px"
        status-icon
      >
        <!-- item -->
        <el-form-item label="用戶名" prop="username">
          <el-input v-model="editUser_form.username" disabled></el-input>
        </el-form-item>
        <!-- item -->
        <el-form-item label="信箱" prop="email">
          <el-input v-model="editUser_form.email"></el-input>
        </el-form-item>
        <!-- item -->
        <el-form-item label="電話" prop="mobile">
          <el-input v-model="editUser_form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改form -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUser_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser_pre_validate">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    return {
      // 用戶列表查詢參數
      userList_query_params: {
        // 查詢參數
        query: '',
        // 當前頁碼
        pagenum: 1,
        // 每頁顯示條數
        pagesize: 2
      },
      // 保存用戶列表查詢結果
      userList: [],
      totoalLists: 0,
      // 控制添加用戶的dialog提示框顯示
      addUser_dialogVisible: false,
      // 控制修改用戶的dialog提示框顯示
      editUser_dialogVisible: false,
      // 添加用戶的表單數據
      addUser_form: {},
      // 修改用戶的表單數據
      editUser_form: {},
      // 添加用戶的表單驗證規則
      addUser_form_rules: {
        username: [
          { required: true, message: '請輸入用戶名', trigger: 'blur' },
          { min: 4, max: 10, message: '請輸入4~10位用戶名稱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 6, max: 12, message: '請輸入6~12位密碼', trigger: 'change' }
        ],
        email: [
          { required: true, message: '請輸入信箱', trigger: 'blur' },
          { type: 'email', message: '請輸入有效信箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '請輸入電話', trigger: 'blur' },
          { min: 5, max: 20, message: '請輸入有效電話', trigger: 'blur' }
        ]
      },
      // 修改用戶的表單驗證規則
      editUser_form_rules: {
        email: [
          { required: true, message: '請輸入信箱', trigger: 'blur' },
          { type: 'email', message: '請輸入有效信箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '請輸入電話', trigger: 'blur' },
          { min: 5, max: 20, message: '請輸入有效電話', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 按參數 獲取用戶列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.userList_query_params
      })
      console.log(res)
      // 獲取失敗
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 獲取成功 (保存  用戶列表  與 總條數)
      this.userList = res.data.users
      this.totoalLists = res.data.total
    },
    // 每頁條數 改變 觸發
    handleSizeChange(newSize) {
      this.userList_query_params.pagesize = newSize
      this.getUserList()
    },
    // 當前頁碼 改變 觸發
    handleCurrentChange(currentPage) {
      this.userList_query_params.pagenum = currentPage
      this.getUserList()
    },
    // 關閉dialog時 重置dialog內的表單
    reset_Form_Values(refForm) {
      this.$refs[refForm].resetFields()
    },
    // 添加用戶form送出的預校驗 與 送出
    addUser_pre_validate() {
      this.$refs.addUser_form.validate(async (valid, failureObj) => {
        // 校驗失敗
        if (!valid) return false
        // 校驗成功   發起添加用戶請求
        const { data: res } = await this.$http.post('users', this.addUser_form)

        if (res.meta.status === 201) {
          // 創建成功
          this.$message.success('添加用戶成功!')
          // 重新取得用戶數據
          this.getUserList()
          // 關閉添加用戶的dialog
          this.addUser_dialogVisible = false
        } else {
          // 關閉dialog
          this.addUser_dialogVisible = false
          // 創建失敗
          this.$message.error('添加用戶失敗!')
        }
      })
    },
    // 修改用戶form送出的預校驗 與 送出
    editUser_pre_validate() {
      this.$refs.editUser_form.validate(async valid => {
        // 預先校驗失敗
        if (!valid) return false
        // 預先校驗成功
        const { data: res } = await this.$http.put(
          `users/${this.editUser_form.id}`,
          {
            email: this.editUser_form.email,
            mobile: this.editUser_form.mobile
          }
        )

        // 關閉dialog
        this.editUser_dialogVisible = false

        // 響應成功
        if (res.meta.status === 200) {
          // 更新成功
          this.$message.success('用戶資料更新成功')
          // 重新取得userList
          this.getUserList()
        } else {
          // 更新失敗
          this.$message.error('用戶資料更新失敗')
        }
      })
    },
    // 根據id查詢用戶   並   顯示dialog框帶入查詢data
    async editUser(id) {
      // 顯示dialog
      this.editUser_dialogVisible = true
      // 根據id查詢用戶data
      const { data: res } = await this.$http.get(`users/${id}`)

      if (res.meta.status === 200) {
        // 查詢成功
        console.log(res.data)
        // 帶入form中
        this.editUser_form = res.data
      } else {
        // 查詢失敗
        this.$message.error(res.meta.msg)
      }
    },
    // 根據id刪除用戶
    async deleteUser(id, username) {
      // confirm方法返回promise對象
      // 可以使用.then/.catch  也可使用 async/await
      const clientRes = await this.$confirm(
        `是否刪除用戶(${username})`,
        '提示',
        {
          confirmButtonText: '刪除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (clientRes === 'cancel') {
        // 取消刪除用戶
        return this.$message.info('取消刪除用戶')
      }

      // !!!!!!!!!-------隱藏控制刪除權限----------
      if (window.sessionStorage.getItem('user') !== 'ray') {
        return this.$message.warning('您為測試觀察管理員，無法刪除數據')
      }

      // 發起刪除用戶請求
      const { data: res } = await this.$http.delete(`users/${id}`)

      if (res.meta.status === 200) {
        // 刪除成功
        this.$message.success('成功刪除用戶')
        // 更新userList
        this.getUserList()
      } else {
        // 刪除失敗
        this.$message.warning('用戶刪除失敗')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
