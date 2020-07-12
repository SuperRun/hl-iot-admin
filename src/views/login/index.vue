<template>
  <div class="login w-100 h-100 flex jc-center ai-center text-white">
    <main class="flex flex-column ai-center">
      <h1>城市智慧路灯物联云平台</h1>
      <div class="login-form flex flex-column jc-center ai-center bg-white">
        <div class="title">用户登录</div>
        <form>
          <div :class="['form-item', model.username ? 'active' : '']">
            <svg-icon :icon-class="icon1 ? 'user-active' : 'user'"></svg-icon>
            <input
              v-model="model.username"
              placeholder="请输入账号"
              @focus="icon1 = true"
              @blur="model.username ? '' : (icon1 = false)"
            />
          </div>
          <div :class="['form-item', model.password ? 'active' : '']">
            <svg-icon :icon-class="icon2 ? 'pwd-active' : 'pwd'"></svg-icon>
            <input
              v-model="model.password"
              type="password"
              placeholder="请输入密码"
              autocomplete="off"
              @focus="icon2 = true"
              @blur="model.password ? '' : (icon2 = false)"
            />
          </div>
          <div :class="['form-item', model.captcha ? 'active' : '']">
            <svg-icon :icon-class="icon3 ? 'pwd-active' : 'pwd'"></svg-icon>
            <input
              v-model="model.captcha"
              placeholder="请输入验证码"
              @focus="icon3 = true"
              @blur="model.captcha ? '' : (icon3 = false)"
            />
            <img :src="code" alt @click="getValidCode" />
          </div>
          <p ref="tip">{{ !loading ? tip : '' }}</p>
          <el-button :loading="loading" class="btn gradient-blue text-white fs-md" @click="login">登录</el-button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate';
import request from '@/utils/request';
import { setPlatform } from '@/utils/auth';
export default {
  name: 'Login',
  data() {
    return {
      icon1: false,
      icon2: false,
      icon3: false,
      loading: false,
      model: {
        username: '', // 账号
        password: '', // 密码
        captcha: '', // 验证码
        captcha_key: '', // 验证码key
      },
      tip: '', // 登录提示语
      userTip: 'ndjsnk', // 账号提示语
      code: '', // 验证码
      platName: '',
      logo: '',
    };
  },
  mounted() {
    this.getValidCode();
    this.getLogo();
  },
  methods: {
    valid() {
      // 验证是否未填写信息
      for (const key in this.model) {
        if (!this.model[key]) {
          this.tip = '请输入账号/密码/验证码';
          return false;
        }
      }
      // 验证账号
      this.tip = validUsername(this.model.username);
      if (!this.tip) return true;
      return false;
    },
    userBlur() {
      this.userTip = validUsername(this.model.username);
    },
    async login() {
      this.$refs['tip'].style.opacity = 0;
      this.loading = true;
      if (this.valid()) {
        try {
          await this.$store.dispatch('user/userLogin', this.model);
          // 获取上传图片信息
          this.$store.dispatch('upload/getUploadImgConfig');
          this.$store.dispatch('upload/getUploadVideoConfig', { type: 1 });
          this.$router.push({ path: '/' });
        } catch (error) {
          this.tip = error;
          this.$refs['tip'].style.opacity = 1;
        } finally {
          this.loading = false;
        }
      } else {
        setTimeout(() => {
          this.$refs['tip'].style.opacity = 1;
          this.loading = false;
        }, 1000);
      }
    },
    async getValidCode() {
      const { img, key } = await this.$store.dispatch('user/getValidCode');
      this.code = img;
      this.model.captcha_key = key;
    },
    async getLogo() {
      request({
        url: '/getSystem',
        methods: 'get',
      }).then(res => {
        console.log(res);
        this.platName = res.data.title;
        this.logo = res.data.logo;
        setPlatform(res.data);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  background-image: url(../../assets/images/login-bg.jpeg);
  background-size: 100% 100%;
  overflow: hidden;
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
    // .user-tip {
    //   margin: 0;
    //   color: #572adc;
    //   font-size: 0.5rem;
    // }
    .form-item {
      width: 277px;
      height: 38px;
      border-radius: 19px;
      border: 1px solid #cfcfcf;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      transition: border-color 0.5s;
      margin-bottom: 1rem;
      input {
        border: none;
        padding: 0 0.5rem;
        // margin-left: 0.5rem;
      }
      &:focus-within {
        border-color: #2d65ff;
      }
      img {
        width: 78px;
        height: 25px;
      }
    }
    .active {
      border-color: #2d65ff;
    }

    p {
      opacity: 0;
      color: #808080;
      font-size: 0.8rem;
      text-align: center;
      transition: opacity 0.5s;
      height: 16px;
    }

    .btn {
      width: 277px;
      height: 38px;
      border: none;
      border-radius: 19px;
      font-weight: bold;
      color: #fff;
    }
  }
}
</style>
