<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 頭像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表單 -->
      <!-- 創建組件data並綁定 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginForm_rules"
        label-width="0"
        class="login_form"
      >
        <!-- item -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- item -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- item -->
        <el-form-item class="login_form_button">
          <el-button type="primary" @click="loginForm_validate">登入</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login_container {
  position: relative;
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50vw;
  height: 50vh;
  background-color: #fff;
  transform: translate(-50%, -50%);
}

.avatar_box {
  position: absolute;
  top: 0;
  left: 50%;
  width: 130px;
  height: 130px;
  padding: 20px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 18px 0 #eee;
  overflow: hidden;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0 20px;
}

.login_form_button {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>

<script>
export default {
  data() {
    return {
      // 登入表單對象 用於 綁定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登入表單input驗證
      loginForm_rules: {
        username: [
          { required: true, message: '請輸入帳號', trigger: 'change' },
          { min: 5, max: 10, message: '請輸入5~10位帳號', trigger: 'change' }
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'change' },
          { min: 6, max: 12, message: '請輸入6~12位密碼', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    loginForm_validate() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        // 解構data並附值給res
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('登入成功')
          // 保存token到client端中的session
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        } else {
          this.$message.error('帳號或密碼錯誤!')
        }
      })
    }
  }
}
</script>
