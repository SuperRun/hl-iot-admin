<template>
  <div class="login w-100 h-100 flex jc-center ai-center text-white">
    <main class="flex flex-column ai-center">
      <h1>城市智慧路灯物联云平台</h1>
      <div class="login-form flex flex-column jc-center ai-center bg-white">
        <div class="title">用户登录</div>
        <form>
          <div class="form-item">
            <svg-icon icon-class="chat"></svg-icon>
            <input v-model="model.account" placeholder="请输入账号" />
          </div>
          <div class="form-item">
            <svg-icon icon-class="account"></svg-icon>
            <input v-model="model.password" placeholder="请输入密码" />
          </div>
          <div class="form-item">
            <svg-icon icon-class="account"></svg-icon>
            <input v-model="model.validateCode" placeholder="请输入验证码" />
            <img src="@/assets/images/valid-code.png" alt />
          </div>
          <button class="btn gradient-blue text-white fs-md">登录</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      model: {
        account: "", // 账号
        password: "", // 密码
        validateCode: "" // 验证码
      }
    };
  },
  created() {
    console.log("created");
  }
};
</script>

<style lang="scss" scoped>
.login {
  background-image: url(../../assets/images/login-bg.png);
  h1 {
    letter-spacing: 0.5rem;
    font-size: 2rem;
    text-align: center;
    margin-bottom: 70px;
  }
  .login-form {
    width: 370px;
    height: 360px;
    border-radius: 9px;
    .title {
      height: 1.6rem;
      line-height: 1.6rem;
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 2rem;
      color: #572adc;
      background: linear-gradient(
        0deg,
        rgba(57, 115, 255, 1) 0.5126953125%,
        rgba(2, 69, 255, 1) 100%
      );
      background-size: cover;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .form-item {
      width: 277px;
      height: 38px;
      border-radius: 19px;
      border: 1px solid #cfcfcf;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      transition: border-color 0.5s;
      input {
        border: none;
      }
      &:focus-within {
        border-color: #2d65ff;
      }
      img {
        width: 78px;
        height: 25px;
        margin-left: 2rem;
      }
    }

    .btn {
      width: 277px;
      height: 38px;
      line-height: 38px;
      border-radius: 19px;
      font-weight: bold;
      margin-top: 1rem;
    }
  }
}
</style>