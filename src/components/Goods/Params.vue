<template>
  <div>
    <!-- Breadcumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分類參數</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片視圖 -->
    <el-card>
      <!-- alert -->
      <el-alert title="注意! 只允許為第三級分類添加參數" type="warning" :closable="false"></el-alert>
      <!-- cascader -->
      <el-row :gutter="10">
        <el-col :span="5">請選擇商品分類</el-col>
        <el-col :span="10">
          <el-cascader
            v-model="selected_cascader_value"
            :options="cate_List"
            :props="cascader_setting_prop"
            @change="handle_Cascader_Change"
            :clearable="true"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="tab_activeName" @tab-click="handle_tab_Click">
        <el-tab-pane label="動態參數" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisableBtn"
            @click="add_params_dialog_visible = true"
          >添加參數</el-button>
          <!-- table -->
          <el-table :data="manyTabList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="{row}">
                <!-- tag -->
                <el-tag
                  v-for="(item,index) in row.attr_vals"
                  :key="index"
                  :closable="true"
                  @close="add_tagClose(row,index)"
                >{{item}}</el-tag>
                <!-- 動態編輯 -->
                <el-input
                  class="add_tag_input"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleTagInputConfirm(row)"
                  @blur="handleTagInputConfirm(row)"
                ></el-input>
                <el-button v-else size="small" @click="show_tage(row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="參數名稱" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="edit_params_open(row.attr_id)"
                >編輯</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delete_attr(row.attr_id)"
                >刪除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="靜態屬性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisableBtn"
            @click="add_params_dialog_visible = true"
          >添加屬性</el-button>
          <!-- table -->
          <el-table :data="onlyTabList" border stripe>
            <el-table-column type="expand">
              <template slot-scope="{row}">
                <!-- tag -->
                <el-tag
                  v-for="(item,index) in row.attr_vals"
                  :key="index"
                  :closable="true"
                  @close="add_tagClose(row,index)"
                >{{item}}</el-tag>
                <!-- 動態編輯 -->
                <el-input
                  class="add_tag_input"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleTagInputConfirm(row)"
                  @blur="handleTagInputConfirm(row)"
                ></el-input>
                <el-button v-else size="small" @click="show_tage(row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="屬性名稱" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="edit_params_open(row.attr_id)"
                >編輯</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delete_attr(row.attr_id)"
                >刪除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加參數的dialog -->
    <el-dialog
      :title="'添加'+add_params_dialog_title"
      :visible.sync="add_params_dialog_visible"
      width="50%"
      @close="add_params_dialog_closed"
    >
      <!-- form -->
      <el-form
        ref="add_params_formRef"
        :model="add_params_form"
        :rules="add_params_formRules"
        label-width="80px"
      >
        <el-form-item :label="add_params_dialog_title" prop="attr_name">
          <el-input v-model="add_params_form.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- form -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="add_params_dialog_visible = false">取 消</el-button>
        <el-button type="primary" @click="add_params_dialog_confirm">確 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改參數的dialog -->
    <el-dialog
      :title="'修改'+add_params_dialog_title"
      :visible.sync="edit_params_dialog_visible"
      width="50%"
      @close="edit_params_dialog_closed"
    >
      <!-- form -->
      <el-form
        ref="edit_params_formRef"
        :model="edit_params_form"
        :rules="edit_params_formRules"
        label-width="80px"
      >
        <el-form-item :label="add_params_dialog_title" prop="attr_name">
          <el-input v-model="edit_params_form.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- form -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit_params_dialog_visible = false">取 消</el-button>
        <el-button type="primary" @click="edit_params_dialog_confirm">確 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.get_cate_list()
  },
  data() {
    return {
      // 分類列表
      cate_List: [],
      //   cascader選中的值
      selected_cascader_value: [],
      //   cascader的配置props
      cascader_setting_prop: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      //   tab組件的activeName
      tab_activeName: 'many',
      //   動態參數的數據
      manyTabList: [],
      //   靜態屬性的數據
      onlyTabList: [],
      //   控制添加參數的dialog 顯示與隱藏
      add_params_dialog_visible: false,
      //   添加參數/屬性的form
      add_params_form: {
        attr_name: ''
      },
      //   添加參數/屬性的form的校驗
      add_params_formRules: {
        attr_name: [{ required: true, message: '請輸入名稱', trigger: 'blur' }]
      },
      //   修改參數的dialog的顯示與隱藏
      edit_params_dialog_visible: false,
      //   修改參數/屬性的form
      edit_params_form: {
        attr_name: ''
      },
      //   修改參數/屬性的form的校驗
      edit_params_formRules: {
        attr_name: [{ required: true, message: '請輸入名稱', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //   異步請求cate列表
    async get_cate_list() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        this.$message.error('分類數據獲取失敗')
        return false
      }

      this.cate_List = res.data
      console.log(this.cate_List)
    },
    // 異步請求參數列表
    async get_params_list() {
      // 選中非三級分類
      if (this.selected_cascader_value.length !== 3) {
        this.manyTabList = []
        this.onlyTabList = []
        this.selected_cascader_value = []
        return false
      }

      // 選中三級分類
      const { data: res } = await this.$http.get(
        `categories/${this.selected_cate_id}/attributes`,
        {
          params: {
            sel: this.tab_activeName
          }
        }
      )

      if (res.meta.status !== 200) {
        this.$message.error('分類參數加載失敗')
        return false
      }

      //   得到data後對vals進行整理
      res.data.forEach(item => {
        if (item.attr_vals === '') {
          item.attr_vals = []
        } else {
          item.attr_vals = item.attr_vals.split(' ')
        }

        // 為每個item添加Iinput的show與value(在data中定義會共用干擾)
        // 參數tag的輸入框顯示與隱藏
        item.inputVisible = false
        // 參數tag的輸入框的value
        item.inputValue = ''
      })

      console.log(res.data)

      //   按照this.tab_activeName來判斷數據該保存(渲染)到哪一個tab panel中
      if (this.tab_activeName === 'many') {
        this.manyTabList = res.data
      } else if (this.tab_activeName === 'only') {
        this.onlyTabList = res.data
      }
    },
    // cascader的change監聽處理Fn
    handle_Cascader_Change() {
      this.get_params_list()
    },
    // tab組件的click Fn
    handle_tab_Click() {
      this.get_params_list()
      console.log(this.tab_activeName)
    },
    // add params dialog的關閉處理Fn
    add_params_dialog_closed() {
      this.$refs.add_params_formRef.resetFields()
    },
    // add params dialog 點擊確定
    add_params_dialog_confirm() {
      this.$refs.add_params_formRef.validate(async (valid, obj) => {
        if (!valid) return false
        const { data: res } = await this.$http.post(
          `categories/${this.selected_cate_id}/attributes`,
          {
            attr_name: this.add_params_form.attr_name,
            attr_sel: this.tab_activeName
          }
        )

        if (res.meta.status !== 201) {
          this.$message.error(`添加${this.add_params_dialog_title}失敗`)
          this.add_params_dialog_visible = false
          return false
        }

        this.get_params_list()
        this.$message.success(`添加${this.add_params_dialog_title}成功`)
        this.add_params_dialog_visible = false
      })
    },
    // edit params dialog的關閉處理Fn
    edit_params_dialog_closed() {
      this.$refs.edit_params_formRef.resetFields()
    },
    // 編輯按鈕的 click Fn
    async edit_params_open(arrtId) {
      this.edit_params_dialog_visible = true
      const {
        data: res
      } = await this.$http.get(
        `categories/${this.selected_cate_id}/attributes/${arrtId}`,
        { attr_sel: this.tab_activeName }
      )

      if (res.meta.status !== 200) {
        this.$message.error(`${this.add_params_dialog_title}加載失敗`)
        this.edit_params_dialog_visible = false
        return false
      }

      this.edit_params_form = res.data
    },
    // edit params dialog 點擊確定
    async edit_params_dialog_confirm() {
      this.$refs.edit_params_formRef.validate(async (valid, obj) => {
        if (!valid) return false

        const { data: res } = await this.$http.put(
          `categories/${this.selected_cate_id}/attributes/${this.edit_params_form.attr_id}`,
          {
            attr_name: this.edit_params_form.attr_name,
            attr_sel: this.tab_activeName
          }
        )

        if (res.meta.status !== 200) {
          this.$message.error(`${this.add_params_dialog_title}編輯失敗`)
          this.edit_params_dialog_visible = false
          return false
        }

        this.get_params_list()
        this.$message.success(`${this.add_params_dialog_title}編輯成功`)
        this.edit_params_dialog_visible = false
      })
    },
    // 刪除分類/參數
    async delete_attr(arrtId) {
      const result = await this.$confirm(
        `是否刪除該${this.add_params_dialog_title}?`,
        '刪除',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (result !== 'confirm') {
        this.$message.info('取消刪除操作')
        return false
      }

      const { data: res } = await this.$http.delete(
        `categories/${this.selected_cate_id}/attributes/${arrtId}`
      )

      if (res.meta.status !== 200) {
        console.log(res)
        this.$message.error('刪除失敗')
        return false
      }

      this.get_params_list()
      this.$message.success('刪除成功')
    },
    // 處理input框在按下enter或失去焦點時的Fn
    handleTagInputConfirm(item) {
      // 判斷是否為有效值
      if (item.inputValue.trim().length === 0) {
        // 沒有有效值(非空白)
        // 清空input
        item.inputValue = ''
        // 切換回按鈕
        item.inputVisible = false
        return false
      }

      // 有效 - 添加inputvalue到vals中
      item.attr_vals.push(item.inputValue.trim())
      // 發出請求
      this.saveAttrTag(item)
    },
    async saveAttrTag(item) {
      // 重製Tag input
      item.inputValue = ''
      item.inputVisible = false
      // 發出請求
      const { data: res } = await this.$http.put(
        `categories/${this.selected_cate_id}/attributes/${item.attr_id}`,
        {
          attr_name: item.attr_name,
          attr_sel: this.tab_activeName,
          attr_vals: item.attr_vals.join(' ')
        }
      )

      if (res.meta.status !== 200) {
        this.get_params_list()
        item.inputValue = ''
        item.inputVisible = false
        this.$message.error(`${this.add_params_dialog_title}更新失敗`)
        return false
      }

      this.$message.success(`${this.add_params_dialog_title}更新成功`)
    },
    show_tage(item) {
      item.inputVisible = true
      // this.$nextTick指定在 頁面重新渲染後  執行指定函數
      // 避免dom尚未渲染時  進行操作  而報錯
      this.$nextTick(_ => {
        // 指定input框獲得焦點
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async add_tagClose(item, index) {
      item.attr_vals.splice(index, 1)

      // 發出請求
      this.saveAttrTag(item)
    }
  }, // end methods
  computed: {
    isDisableBtn() {
      // 如果選中的不是第三級分類
      if (this.selected_cascader_value.length !== 3) {
        return true
      }
      return false
    },
    selected_cate_id() {
      // 如果選中第三級分類，返回他的id
      if (this.selected_cascader_value.length === 3) {
        return this.selected_cascader_value[2]
      }
      return null
    },
    //   添加參數/屬性的diaglog title
    add_params_dialog_title() {
      if (this.tab_activeName === 'many') {
        return '動態參數'
      } else {
        return '靜態屬性'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  display: flex;
  align-items: center;
}

.el-col {
  font-size: 14px;
  text-align: center;
}

.el-tag {
  margin: 7px;
}

.add_tag_input {
  width: 120px;
}
</style>
