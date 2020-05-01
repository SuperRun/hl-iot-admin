<template>
  <el-dialog
    title="更改密码"
    width="400px"
    @close="closeDialog"
    @closed="closed"
    :visible="editPwdDialogOpened"
  >
    <el-form
      :model="pwdForm"
      :rules="rules"
      ref="pwdForm"
      label-width="80px"
      label-position="left"
      style="padding: 0 20px"
    >
      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          :type="showPwd1?'text':'password'"
          v-model="pwdForm.new_pwd"
          placeholder="新密码"
          maxlength="20"
        >
          <svg-icon
            slot="suffix"
            :icon-class="showPwd1?'eye-open':'eye-off'"
            @click="showPwd1=!showPwd1"
          ></svg-icon>
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_pwd">
        <el-input
          :type="showPwd2?'text':'password'"
          v-model="pwdForm.confirm_pwd"
          placeholder="确认新密码"
        >
          <svg-icon
            slot="suffix"
            :icon-class="showPwd2?'eye-open':'eye-off'"
            @click="showPwd2=!showPwd2"
          ></svg-icon>
        </el-input>
      </el-form-item>
      <div class="form-item btn-set flex jc-between">
        <el-button class="btn btn-light" @click="closeDialog">取消</el-button>
        <el-button class="btn btn-dark" @click="confirm">确认</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { showSuccessMsg } from "@/utils/message";
export default {
  name: "EditPwd",
  computed: {
    ...mapGetters(["editPwdDialogOpened"])
  },
  data() {
    const validateConfirmPwd = (rule, value, callback) => {
      if (value !== this.pwdForm.new_pwd) {
        callback(new Error("两次密码输入不匹配"));
      } else {
        callback();
      }
    };
    return {
      showPwd1: false,
      showPwd2: false,
      pwdForm: {
        new_pwd: "",
        confirm_pwd: ""
      },
      rules: {
        new_pwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        confirm_pwd: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: validateConfirmPwd, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    closeDialog() {
      this.$store.dispatch("app/closePwdDialog");
    },
    async confirm() {
      this.$refs["pwdForm"].validate(async valid => {
        if (!valid) {
          return;
        }
        await this.$store.dispatch("user/updatePwd", {
          new_pwd: this.pwdForm.new_pwd
        });
        this.closeDialog();
        showSuccessMsg("修改成功");
      });
    },
    closed() {
      this.$refs["pwdForm"].resetFields();
      this.showPwd1 = false;
      this.showPwd2 = false;
    }
  }
};
</script>

<style scoped>
.btn {
  width: 150px;
}
</style>