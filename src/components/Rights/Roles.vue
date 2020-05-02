<template>
  <div>
    <!-- Breadcumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>權限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片視圖 -->
    <el-card>
      <!-- 按鈕區 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole_dialog_visible = true">新增角色</el-button>
        </el-col>
      </el-row>

      <!-- 表格區 -->
      <el-table :data="userRolesList" broder stripe>
        <!-- 展開用 -->
        <el-table-column type="expand">
          <template v-slot:default="{row}">
            <!-- 24柵格 -->
            <el-row
              :class="['bd-bottom', index_1 === 0 ? 'bd-top': '', 'y-center']"
              v-for="(level_1_item, index_1) in row.children"
              :key="level_1_item.id"
            >
              <!-- 一級權限 -->
              <el-col :span="5">
                <el-tag>{{level_1_item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二&三級權限 -->
              <el-col :span="19">
                <el-row
                  :class="[index_2 === 0 ? '' : 'bd-top', 'y-center']"
                  v-for="(level_2_item, index_2) in level_1_item.children"
                  :key="level_2_item.id"
                >
                  <!-- 二級權限 -->
                  <el-col :span="6">
                    <el-tag type="warning">{{level_2_item.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三級權限 -->
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      v-for="(level_3_item, index_3) in level_2_item.children"
                      :key="level_3_item.id + index_3"
                      closable
                      @close="removeRightsById(row,level_3_item.id)"
                    >{{level_3_item.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 作用域data -->
            <!-- <pre>
              {{row}}
            </pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名稱" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot:default="{row}">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="setRole_dialog_visible_fn(row.id)"
            >編輯</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delete_role(row.id)"
            >刪除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="set_user_rightsList(row)"
            >分配</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- user權限列表dialog -->
    <el-dialog
      title="權限列表"
      :visible.sync="user_rights_dialogVisible"
      width="50%"
      @close="rights_default_array = []"
    >
      <!-- 樹形控件 -->
      <el-tree
        :data="allRishtsList"
        :props="rights_tree_props"
        show-checkbox
        default-expand-all
        check-on-click-node
        node-key="id"
        :default-checked-keys="rights_default_array"
        ref="rights_treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="user_rights_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allot_role_rights">確 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色的dialog -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRole_dialog_visible"
      width="50%"
      @close="reset_setRole_form('add_role_form_ref')"
    >
      <!-- 表單 -->
      <el-form
        ref="add_role_form_ref"
        :model="addRole_data"
        :rules="setRole_form_rules"
        label-width="80px"
      >
        <el-form-item label="角色名稱" prop="roleName">
          <el-input v-model="addRole_data.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRole_data.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRole_dialog_visible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">確 定</el-button>
      </span>
    </el-dialog>

    <!-- 編輯角色的dialog -->
    <el-dialog
      title="編輯角色"
      :visible.sync="setRole_dialog_visible"
      width="50%"
      @close="reset_setRole_form('role_form_ref')"
    >
      <!-- 表單 -->
      <el-form
        ref="role_form_ref"
        :model="setRole_data"
        :rules="setRole_form_rules"
        label-width="80px"
      >
        <el-form-item label="角色名稱" prop="roleName">
          <el-input v-model="setRole_data.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="setRole_data.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按鈕 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRole_dialog_visible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.get_userRoles_List()
  },
  data() {
    return {
      // 角色權限列表
      userRolesList: [],
      // user權限dialog的顯示與隱藏
      user_rights_dialogVisible: false,
      // 所有權限的列表
      allRishtsList: [],
      // 所有權限的樹形組件props
      rights_tree_props: {
        label: 'authName',
        children: 'children'
      },
      // tree控件默認勾選值(依照id)
      rights_default_array: [],
      // 保存點選操作按鈕時的對應 role
      currentRoleId: '',
      // 控制編輯dialog的顯示與隱藏
      setRole_dialog_visible: false,
      // 保存編輯dialog用的role data
      setRole_data: {},
      // 編輯角色的form 校驗規則
      setRole_form_rules: {
        roleName: [
          { required: true, message: '請輸入角色名稱', trigger: 'blur' },
          { min: 2, max: 10, message: '名稱為2~10位', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '請輸入角色描述', trigger: 'blur' },
          { min: 2, max: 20, message: '請輸入簡易說明', trigger: 'blur' }
        ]
      },
      // 控制添加角色的dialog顯示與隱藏
      addRole_dialog_visible: false,
      // 添加角色的雙向form
      addRole_data: {}
    }
  },
  methods: {
    // 異步請求角色權限data
    async get_userRoles_List() {
      const { data: res } = await this.$http.get('roles')

      // 獲取失敗
      if (res.meta.status !== 200) {
        this.$message.error('角色權限加載失敗')
        return false
      }

      // 獲取成功
      // 保存到組件data中
      this.userRolesList = res.data
      console.log(this.userRolesList)
    },
    // 根據id 移除對應權限 ($confirm返回promise對象)
    async removeRightsById(user, rightId) {
      // 點擊confirm返回confirm   點擊cancel返回錯誤對象(使用catch捕獲並返回錯誤值)
      const result = await this.$confirm('是否移除該權限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (result === 'cancel') {
        // 點擊取消
        this.$message.error('操作取消')
        return false
      } else if (result === 'confirm') {
        // !!!!!!!!!-------隱藏控制刪除權限----------
        if (window.sessionStorage.getItem('user') !== 'ray') {
          return this.$message.warning('您為測試觀察管理員，無法刪除數據')
        }
        // 點擊確認
        const { data: res } = await this.$http.delete(
          `roles/${user.id}/rights/${rightId}`
        )

        // 刪除失敗
        if (res.meta.status !== 200) {
          this.$message.error('權限移除請求失敗')
          return false
        }
        // 刪除成功
        // !!!!!!!!!!!!!!!為了實現局部渲染(只更新部分數據)以讓table不重新開合
        // 獲取最新權限列表
        // this.get_userRoles_List()
        // 只需更新對應的節點(提升用戶體驗)
        user.children = res.data
        this.$message.success('權限移除成功')
      }
    },
    // 設定user擁有的所有權限
    async set_user_rightsList(roles) {
      // 保存當前role id
      this.currentRoleId = roles.id
      // 異步
      const { data: res } = await this.$http.get('rights/tree')
      // 獲取失敗
      if (res.meta.status !== 200) {
        this.user_rights_dialogVisible = false
        this.$message.error('權限列表加載失敗')
        return false
      }
      // 獲取成功
      // 遞迴抓取本角色的所有權限id保存到rights_default_array
      this.get_leaf_keys(roles, this.rights_default_array)
      // 保存所有權限列表
      this.allRishtsList = res.data

      // 顯示dialog
      this.user_rights_dialogVisible = true
    },
    // 遞迴指定節點  找到leaf節點(尾巴)的id並添加到arr中(做為請求參數用)
    get_leaf_keys(node, arr) {
      // 如果node節點沒有children attr表示為leaf node
      if (!node.children) {
        return arr.push(node.id)
      }

      // 如果此node有children attr 遞迴遍歷所有屬性
      node.children.forEach(item => {
        this.get_leaf_keys(item, arr)
      })
    },
    // 分配權限請求
    async allot_role_rights() {
      // 獲取請求參數
      const checkedRights = [
        ...this.$refs.rights_treeRef.getCheckedKeys(),
        ...this.$refs.rights_treeRef.getHalfCheckedKeys()
      ]
      // 轉為請求要求格式
      const checkedRightsFormat = checkedRights.join(',')

      // 異步
      const { data: res } = await this.$http.post(
        `roles/${this.currentRoleId}/rights`,
        {
          rids: checkedRightsFormat
        }
      )

      if (res.meta.status !== 200) {
        // 請求失敗
        this.$message.error('角色授權失敗')
        return false
      }
      // 刷新權限列表
      this.get_userRoles_List()
      // 請求成功
      this.$message.success('角色授權成功')
      // 關閉dialog
      this.user_rights_dialogVisible = false
    },
    // 控制編輯角色的dialog顯示方式  與  傳值供dialog使用
    async setRole_dialog_visible_fn(roleId) {
      const { data: res } = await this.$http.get(`roles/${roleId}`)
      if (res.meta.status !== 200) {
        this.$message.error('角色詳情加載失敗')
        return false
      }
      // 保存當前選中的role data
      this.setRole_data = res.data
      console.log(this.setRole_data)
      // 顯示編輯dialog
      this.setRole_dialog_visible = true
    },
    // 提交編輯後的新role
    setRole() {
      this.$refs.role_form_ref.validate(async (valid, obj) => {
        // 校驗失敗
        if (!valid) return false
        // 校驗成功 異步請求
        const { data: res } = await this.$http.put(
          `roles/${this.setRole_data.roleId}`,
          {
            roleName: this.setRole_data.roleName,
            roleDesc: this.setRole_data.roleDesc
          }
        )

        // 失敗
        if (res.meta.status !== 200) {
          this.$message.error('角色編輯失敗')
          return false
        } else if (res.meta.status === 200) {
          // 成功
          // 重新獲取角色列表
          this.get_userRoles_List()
          // 提示
          this.$message.success('角色編輯成功')
          // 關閉編輯dialog
          this.setRole_dialog_visible = false
        }
      })
    },
    // reset 編輯角色dialog中的form
    reset_setRole_form(ref) {
      this.$refs[ref].resetFields()
    },
    // 添加角色請求
    addRole() {
      this.$refs.add_role_form_ref.validate(async (valid, obj) => {
        // 校驗失敗
        if (!valid) return false
        // 校驗成功
        const { data: res } = await this.$http.post('roles', this.addRole_data)
        // 請求失敗
        if (res.meta.status !== 201) {
          this.$message.error('角色添加失敗')
          return false
        }

        // 請求成功
        // 刷新角色列表
        this.get_userRoles_List()
        // 提示
        this.$message.success('角色添加成功')
        // 關閉dialog
        this.addRole_dialog_visible = false
      })
    },
    // 刪除角色
    async delete_role(roleId) {
      // !!!!!!!!!-------隱藏控制刪除權限----------
      if (window.sessionStorage.getItem('user') !== 'ray') {
        return this.$message.warning('您為測試觀察管理員，無法刪除數據')
      }

      const result = await this.$confirm(
        '此操作將永久刪除該角色, 是否繼續?',
        '移除角色',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (result !== 'confirm') {
        this.$message.info('取消操作')
        return false
      }

      const { data: res } = await this.$http.delete(`roles/${roleId}`)
      // 請求失敗
      if (res.meta.status !== 200) {
        this.$message.error('角色刪除失敗')
        return false
      }
      // 請求成功
      // 提示
      this.$message.success('角色刪除成功')
      // 刷新角色列表
      this.get_userRoles_List()
    }
  }
}
</script>

<style lang="scss" scoped>
.bd-top {
  border-top: 1px solid #eee;
}

.bd-bottom {
  border-bottom: 1px solid #eee;
}

.el-tag {
  margin: 7px;
}

// 一級&二級權限垂直居中
.y-center {
  display: flex;
  align-items: center;
}
</style>
