<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="login_avatar">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginPre">登录</el-button>
          <el-button type="info" @click="$refs.loginFormRef.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { log } from "util";
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    loginPre() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
      });
    }
  }
};
</script>
<style scoped lang="less">
.login_container {
  background: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .login_avatar {
      width: 130px;
      height: 130px;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      padding: 10px;
      box-shadow: 0 0 5px #ddd;
      img {
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>

