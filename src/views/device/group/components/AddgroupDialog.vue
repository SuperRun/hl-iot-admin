<template>
  <div>
    <el-dialog
      :title="title"
      :visible="showDialog"
      @close="$listeners.closeDialog('add')"
      @closed="closed"
      width="300px"
    >
      <el-form ref="form" :model="model" label-width="60px" :rules="rules" label-position="left">
        <el-form-item label="组号" prop="group_number">
          <el-input
            type="text"
            v-model.number="model.group_number"
            maxlength="3"
            class="wpx-150"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="flex jc-around">
        <el-button class="dialog-btn btn-light wpx-100" @click="showDialog = false">取 消</el-button>
        <el-button class="dialog-btn btn-dark wpx-100" type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AddgroupDialog",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: "add"
    }
  },
  computed: {
    ...mapGetters(["cur_proj"]),
    title() {
      return this.mode == "add" ? "添加分组(照明灯)" : "编辑分组(照明灯)";
    }
  },
  data() {
    return {
      model: {
        group_number: ""
      },
      rules: {
        group_number: [
          { required: true, message: "请输入组号", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    closed() {
      this.$refs["form"].resetFields();
      this.model.group_number = "";
    },
    confirm() {
      this.$refs["form"].validate(async valid => {
        if (!valid) return;
        if (this.mode == "add") {
          await this.$store.dispatch("group/addGroup", {
            ...this.model,
            project_id: this.cur_proj
          });
          showSuccessMsg("添加成功");
        } else {
          await this.$store.dispatch("group/editGroup", {
            ...this.model,
            project_id: this.cur_proj
          });
          showSuccessMsg("编辑成功");
        }
        this.$emit("closeDialog", "add");
        this.$emit("getList");
      });
    }
  }
};
</script>
