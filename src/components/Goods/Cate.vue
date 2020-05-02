<template>
  <div>
    <!-- Breadcrumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分類</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- main -->
    <el-card>
      <!-- button -->
      <el-row>
        <el-button type="primary" @click="open_addCate_dialog">添加分類</el-button>
      </el-row>
      <!-- table -->
      <TreeTable
        :data="cateList"
        :columns="cateList_columns"
        :show-index="true"
        index-text="#"
        :border="true"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 啟用狀態 -->
        <template slot="cate_state" slot-scope="{row}">
          <i class="el-icon-success" v-if="row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 級別 -->
        <template slot="cat_level" slot-scope="{row}">
          <el-tag type="primary" v-if="row.cat_level === 0">一級</el-tag>
          <el-tag type="success" v-if="row.cat_level === 1">二級</el-tag>
          <el-tag type="info" v-if="row.cat_level === 2">三級</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="cate_opt" slot-scope="{row}">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            :dd="row"
            @click="open_editCate_dialog(row.cat_id)"
          >編輯</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(row.cat_id)"
          >刪除</el-button>
        </template>
      </TreeTable>

      <!-- pagination -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateList_queryParams.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="cateList_queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cateList_total"
      ></el-pagination>
    </el-card>

    <!-- 添加分類的dialog -->
    <el-dialog
      title="添加分類"
      :visible.sync="addCate_dialogVisible"
      width="50%"
      @close="addCate_dialog_close"
    >
      <!-- form -->
      <el-form
        ref="addCate_form_Ref"
        :model="addCate_form"
        :rules="addCate_form_Rules"
        label-width="80px"
      >
        <el-form-item label="分類名稱" prop="cat_name">
          <el-input v-model="addCate_form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父級分類">
          <el-cascader
            v-model="cate_cascader_value"
            :options="cate_parentsList"
            :props="cate_cascader_props"
            @change="handle_cate_cascader_Change"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- button -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCate_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate_dialog_confirm">確 定</el-button>
      </span>
    </el-dialog>

    <!-- 編輯分類的dialog -->
    <el-dialog
      title="編輯分類"
      :visible.sync="editCate_dialogVisible"
      width="50%"
      @close="editCate_dialog_close"
    >
      <!-- form -->
      <el-form
        ref="editCate_form_Ref"
        :model="editCate_form"
        :rules="editCate_form_Rules"
        label-width="80px"
      >
        <el-form-item label="分類名稱" prop="cat_name">
          <el-input v-model="editCate_form.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- button -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCate_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate_dialog_confirm">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.get_cateList()
  },
  data() {
    return {
      // 商品分類列表
      cateList: [],
      //   商品分類列表總頁數
      cateList_total: 0,
      //   商品分類列表api參數(單獨定義的作用: 以對象的方式給請求method當參數& pagination組件的data綁定)
      cateList_queryParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //   TreeTable插件的列標題
      cateList_columns: [
        {
          label: '分類名稱',
          prop: 'cat_name'
        },
        {
          label: '啟用狀態',
          prop: 'cat_deleted',
          type: 'template',
          template: 'cate_state'
        },
        {
          label: '級別',
          prop: 'cat_level',
          type: 'template',
          template: 'cat_level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'cate_opt'
        }
      ],
      //   添加分類的dialog的顯示與隱藏
      addCate_dialogVisible: false,
      //   添加分類的Form
      addCate_form: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      //   添加分類Form的校驗
      addCate_form_Rules: {
        cat_name: [
          { required: true, message: '請輸入分類名稱', trigger: 'blur' }
        ]
      },
      //   父級分類的列表
      cate_parentsList: [],
      //   Cascader的選中值
      cate_cascader_value: [],
      //   Cascader的配值對象
      cate_cascader_props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 編輯分類的dialog顯示與隱藏
      editCate_dialogVisible: false,
      // 編輯分類的form值
      editCate_form: {
        cat_id: '',
        cat_name: ''
      },
      // 編輯分類的form校驗
      editCate_form_Rules: {
        cat_name: [
          { required: true, message: '請輸入分類名稱', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //   異步請求cateList
    async get_cateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.cateList_queryParams
      })

      if (res.meta.status !== 200) {
        this.$message.error('商品分類加載失敗')
        return false
      }

      // 保存商品分類列表
      this.cateList = res.data.result
      //   保存商品分類列表總頁數
      this.cateList_total = res.data.total
    },
    // 異步請求addCate Form中要選擇的父級分類列表
    async get_cate_parentsList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        this.$message.error('父級分類列表加載失敗')
        return false
      }

      this.cate_parentsList = res.data
      console.log(this.cate_parentsList)
    },
    // page size改變的處理Fn
    handleSizeChange(newPageSize) {
      this.cateList_queryParams.pagesize = newPageSize
      //   重新get List
      this.get_cateList()
    },
    // 當前頁碼改變的處理Fn
    handleCurrentChange(newCurrentPage) {
      this.cateList_queryParams.pagenum = newCurrentPage
      //   重新get List
      this.get_cateList()
    },
    // 點擊添加分類button的click處理Fn
    open_addCate_dialog() {
      // 請求添加選擇的父級分類
      this.get_cate_parentsList()
      this.addCate_dialogVisible = true
    },
    // cate cascader的value改變處理Fn
    handle_cate_cascader_Change() {
      //   以cate cascader的value做為判斷標準
      //   如果有選中
      if (this.cate_cascader_value.length > 0) {
        //   父級ID 為 數組的最後一項(index為length -1)
        this.addCate_form.cat_pid = this.cate_cascader_value[
          this.cate_cascader_value.length - 1
        ]
        // 分類層級 恰好為 數組的length(0代表1級)
        this.addCate_form.cat_level = this.cate_cascader_value.length
      } else {
        //   如果沒有選中(or清空cascader)
        this.addCate_form.cat_pid = 0
        this.addCate_form.cat_level = 0
      }
    },
    // addCate的dialog點擊確定時的Fn
    addCate_dialog_confirm() {
      this.$refs.addCate_form_Ref.validate(async (valid, obj) => {
        if (!valid) return false

        const { data: res } = await this.$http.post(
          'categories',
          this.addCate_form
        )

        if (res.meta.status !== 201) {
          this.$message.error('分類添加失敗')
          this.addCate_dialogVisible = false
          return false
        }

        this.$message.success('分類添加成功')
        this.get_cateList()
        this.addCate_dialogVisible = false
      })
    },
    // addCate的dialog關閉時
    addCate_dialog_close() {
      this.$refs.addCate_form_Ref.resetFields()
      this.addCate_form.cat_pid = 0
      this.addCate_form.cat_level = 0
      this.cate_cascader_value = []
    },
    // 點擊添加分類button的click處理Fn
    async open_editCate_dialog(cateId) {
      const { data: res } = await this.$http.get(`categories/${cateId}`)

      if (res.meta.status !== 200) {
        this.$message.error('分類名稱加載失敗')
        return false
      }
      this.editCate_form.cat_id = cateId
      this.editCate_form.cat_name = res.data.cat_name
      this.editCate_dialogVisible = true
    },
    // editCate的dialog點擊確定時的Fn
    editCate_dialog_confirm() {
      this.$refs.editCate_form_Ref.validate(async (valid, obj) => {
        if (!valid) return false

        const { data: res } = await this.$http.put(
          `categories/${this.editCate_form.cat_id}`,
          {
            cat_name: this.editCate_form.cat_name
          }
        )

        if (res.meta.status !== 200) {
          this.$message.error('分類名稱更新失敗')
          this.editCate_dialogVisible = false
          return false
        }

        this.get_cateList()
        this.$message.success('分類名稱更新成功')
        this.editCate_dialogVisible = false
      })
    },
    // editCate的dialog關閉事件Fn
    editCate_dialog_close() {
      this.$refs.editCate_form_Ref.resetFields()
    },
    // 移除cate的Fn
    async deleteCate(cateId) {
      // !!!!!!!!!-------隱藏控制刪除權限----------
      if (window.sessionStorage.getItem('user') !== 'ray') {
        return this.$message.warning('您為測試觀察管理員，無法刪除數據')
      }

      const result = await this.$confirm('是否刪除該分類', '刪除分類', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      console.log(result)

      if (result !== 'confirm') {
        this.$message.info('取消刪除')
        return false
      }

      const { data: res } = await this.$http.delete(`categories/${cateId}`)
      if (res.meta.status !== 200) {
        this.$message.info('分類刪除失敗')
        return false
      }

      this.get_cateList()
      this.$message.success('分類刪除成功')
    }
  } // end method
}
</script>

<style lang="scss" scoped>
.el-icon-success {
  color: #1aad0d;
}

.el-icon-error {
  color: #ff0000;
}
</style>
