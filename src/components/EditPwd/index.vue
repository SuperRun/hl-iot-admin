<template>
  <el-dialog title="更改密码" width="400px" @close="closeDialog" :visible="editPwdDialogOpened">
    <el-form
      :model="pwdForm"
      :rules="rules"
      ref="pwdForm"
      label-width="80px"
      label-position="left"
      style="padding: 0 20px"
    >
      <el-form-item label="新密码" prop="new_pwd" required>
        <el-input type="password" v-model="pwdForm.new_pwd" placeholder="新密码"></el-input>
      </el-form-item>
      <div class="form-item btn-set">
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
    return {
      pwdForm: {
        new_pwd: ""
      },
      rules: {
        new_pwd: [{ required: true, message: "请输入新密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    closeDialog() {
      this.$store.dispatch("app/closePwdDialog");
    },
    async confirm() {
      await this.$store.dispatch("user/updatePwd", this.pwdForm);
      this.closeDialog();
      showSuccessMsg("修改成功");
    }
  }
};
</script>

<style scoped>
.btn {
  width: 150px;
}
</style>