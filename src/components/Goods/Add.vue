<template>
  <div>
    <!-- Breadcumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card -->
    <el-card>
      <!-- 提示 -->
      <el-alert title="添加商品" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步驟條 -->
      <!-- step_active_index為了與tabs組件的v-model結合(name要求String)  -->
      <!-- 在data中定義為String -0可以把String to Number -->
      <el-steps :space="200" :active="step_active_index - 0" finish-status="success" align-center>
        <el-step title="基本資料"></el-step>
        <el-step title="商品參數"></el-step>
        <el-step title="商品屬性"></el-step>
        <el-step title="商品圖片"></el-step>
        <el-step title="商品內容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- main -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="step_active_index"
          :before-leave="tab_before_leave"
          @tab-click="tab_current_active"
        >
          <el-tab-pane label="基本資料" name="0">
            <el-form-item label="商品名稱" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品價格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品數量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分類" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cate_list"
                :props="cascader_props"
                @change="handle_cascader_Change"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品參數" name="1">
            <el-form-item :label="item.attr_name" v-for="(item, index) in manyTagData" :key="index">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="item"
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品屬性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,index) in onlyTagData" :key="index">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品圖片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handle_upload_Preview"
              :on-remove="handle_upload_Remove"
              :headers="upload_header"
              :on-success="upload_success"
              list-type="picture"
            >
              <el-button size="small" type="primary">上傳</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品內容" name="4">
            <!-- 富文本編輯器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- button -->
            <el-button type="primary" @click="add_good">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="圖片預覽" :visible.sync="upload_preview_dialogVisible" width="50%">
      <img :src="upload_preview_url" alt width="100%" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  created() {
    this.get_cate_list()
  },
  data() {
    return {
      step_active_index: '0',
      addForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        pics: [],
        attrs: [],
        //   富文本編輯器的value
        goods_introduce: ''
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '請輸入商品名稱', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '請輸入商品價格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '請輸入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '請輸入商品數量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '請選擇商品分類', trigger: 'blur' }
        ]
      },
      cate_list: [],
      cascader_props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTagData: [],
      onlyTagData: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      //   所有api(除了login)需帶有token
      upload_header: {
        Authorization: window.sessionStorage.getItem('token')
      },
      upload_preview_dialogVisible: false,
      upload_preview_url: ''
    }
  },
  methods: {
    async get_cate_list() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        this.$message.error('商品分類加載失敗')
        return false
      }

      this.cate_list = res.data
      console.log(this.cate_list)
    },
    handle_cascader_Change() {
      console.log(this.addForm.goods_cat)
      // 強制讓級聯選擇器只能選擇第三層級
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    tab_before_leave(activeName, oldActiveName) {
      // 當前在商品資料頁面
      if (oldActiveName === '0') {
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.warning('請選擇商品分類')
          return false
        }
      }
    },
    async tab_current_active() {
      // 如果選中 商品參數 頁面
      if (this.step_active_index === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cate_id}/attributes`,
          {
            params: { sel: 'many' }
          }
        )

        if (res.meta.status !== 200) {
          this.$message.error('參數加載失敗')
          return false
        }

        res.data.forEach(item => {
          if (item.attr_vals !== '') {
            item.attr_vals = item.attr_vals.split(' ')
          } else {
            item.attr_vals = []
          }
        })

        this.manyTagData = res.data
        console.log(this.manyTagData)
      }

      // 如果選中 商品屬性 頁面
      if (this.step_active_index === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cate_id}/attributes`,
          {
            params: { sel: 'only' }
          }
        )

        if (res.meta.status !== 200) {
          this.$message.error('屬性加載失敗')
          return false
        }

        this.onlyTagData = res.data
        console.log(this.onlyTagData)
      }
    },
    // 文件上傳預覽
    handle_upload_Preview(file) {
      this.upload_preview_dialogVisible = true
      this.upload_preview_url = file.response.data.url
    },
    // 上傳文件刪除
    handle_upload_Remove(file) {
      //   找到要刪除的index
      const targetIndex = this.addForm.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path
      })
      //   從保存的data中刪除
      this.addForm.pics.splice(targetIndex, 1)
    },
    // 上傳成功時的Fn
    upload_success(response) {
      //   添加到data中
      const temPic = { pic: response.data.tmp_path }
      this.addForm.pics.push(temPic)
    },
    add_good() {
      this.$refs.addFormRef.validate(async (valid, obj) => {
        if (!valid) {
          this.$message.warning('請填寫必要的表單項')
        }

        console.log(this.manyTagData)

        // 此處因為cascader在addform中的value需要array
        // join後變為String會報錯
        // 因此需要deep clone在處理goods_cat 以滿足 api要求
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTagData.forEach(item => {
          const selectedItem = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }

          form.attrs.push(selectedItem)
        })

        this.onlyTagData.forEach(item => {
          const selectedItem = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }

          form.attrs.push(selectedItem)
        })
        console.log(form)

        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          console.log(res)
          this.$message.error('商品添加失敗')
          return false
        }

        this.$router.push('/goods')
        this.$message.success('商品添加成功')
      })
    }
  },
  computed: {
    cate_id() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
