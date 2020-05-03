<template>
  <div class="user-manage bg-white-3 min-h-1 bx-shadow-2">
    <!-- 搜索栏 -->
    <div class="operate flex">
      <button type="button" class="btn btn-add" @click="add">添加</button>
      <button type="button" class="btn btn-del" @click="del">删除</button>
      <div class="search flex">
        <el-input placeholder="搜索名称" v-model="params.name" class="mg-right-1" @input="search"></el-input>
        <el-input placeholder="搜索账号" v-model="params.username" @input="search" class="mg-right-1"></el-input>
        <el-input placeholder="搜索手机号" v-model="params.mobile" @input="search"></el-input>
      </div>
      <button type="button" class="btn btn-light mg-left-1 br-4" @click="reset">重置</button>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        header-cell-class-name="table-header"
        v-loading="listLoading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="名称" width="220"></el-table-column>
        <el-table-column prop="username" label="账号" width="220"></el-table-column>
        <el-table-column prop="mobile" label="手机" width="220"></el-table-column>
        <el-table-column label="项目" width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.project_user | projFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <span class="btn-table" @click="edit(scope.row)">编辑</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="page">
        <el-pagination
          background
          layout="total,prev, pager, next"
          :total="total"
          :page-size="limit"
          :current-page="page"
          @current-change="currentPage"
        ></el-pagination>
      </div>
    </div>
    <!-- 弹出框 -->
    <el-dialog :title="title" :visible.sync="showDialog" center width="600px" @closed="closed">
      <el-form
        :model="model"
        :label-width="formLabelWidth"
        :rules="rules"
        ref="form"
        label-position="left"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="model.username"
            autocomplete="off"
            minlength="5"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="show_pwd">
          <el-input
            v-model="model.show_pwd"
            :type="showPwd?'text':'password'"
            autocomplete="off"
            maxlength="20"
          >
            <svg-icon
              slot="suffix"
              :icon-class="showPwd?'eye-open':'eye-off'"
              @click="showPwd=!showPwd"
            ></svg-icon>
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="model.name"
            autocomplete="off"
            minlength="6"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="model.mobile" autocomplete="off" maxlength="11" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="model.sex" class="w-100">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="model.role_id" class="w-100">
            <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in roleList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目配置">
          <el-select v-model="projIds" multiple class="w-100">
            <el-option :label="item.title" :value="item.id" :key="item.id" v-for="item in projList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="dialog-btn btn-light" @click="showDialog = false">取 消</el-button>
        <el-button class="dialog-btn btn-dark" type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validPhoneNumber } from "@/utils/validate";
import _ from "lodash";
import { showSuccessMsg, showInfoMsg } from "@/utils/message";
import { getValByKey } from "@/utils/util";
import { getProjlist } from "@/utils/auth";
import { createNamespacedHelpers, mapGetters } from "vuex";
const { mapActions } = createNamespacedHelpers("user");
const projList = getProjlist();
export default {
  name: "UserManage",
  computed: {
    ...mapGetters(["projList"]),
    title() {
      return this.mode == "add" ? "添加用户" : "编辑用户";
    }
  },
  filters: {
    projFilter(projs) {
      const proj_list_id = projs
        .reduce((pre, cur) => {
          if (cur.project) {
            pre.push(cur.project_id);
          }
          return pre;
        }, [])
        .join(", ");
      return proj_list_id == ""
        ? "无"
        : projList
            .reduce((pre, cur) => {
              if (proj_list_id.includes(cur.id)) {
                pre.push(cur.title);
              }
              return pre;
            }, [])
            .join(", ");
    }
  },
  data() {
    // 验证手机号
    var checkPhone = (rule, value, callback) => {
      if (!validPhoneNumber(value)) {
        return callback(new Error("请输入正确手机号"));
      } else {
        callback();
      }
    };
    return {
      formLabelWidth: "80px",
      showDialog: false, // 弹出框
      showPwd: false,
      projIds: [],
      model: {
        username: "", // 账号
        password: "", // 密码
        show_pwd: "", // 未加密的密码
        name: "", // 名称
        mobile: "", // 手机
        sex: "1", // 性别 1-男,2-女
        role_id: "", // 角色id
        project_id_list: "" // 项目配置 项目id多个用逗号拼接如（1,2）
      },
      rules: {
        username: [
          { required: true, message: "请填写账号", trigger: "blur" },
          { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
        ],
        show_pwd: [
          { required: true, message: "请填写密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请填写手机号", trigger: "blur" },
          { max: 11, message: "手机号不能超过11个字符", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        role_id: [{ required: true, message: "请选择角色", trigger: "blur" }]
      },
      roleList: [],
      params: {
        username: "", // 账号
        mobile: "", // 手机号
        name: "" // 名称
      },
      total: 0,
      page: 1,
      limit: 5,
      listLoading: false,
      tableData: [],
      mode: "add",
      names: "",
      ids: ""
    };
  },
  async mounted() {
    this.getList();
    // 获取角色、项目列表
    const { totla, list } = await this.$store.dispatch("role/listRole");
    this.roleList = list;
    console.log("role", this.roleList);
  },
  methods: {
    ...mapActions(["listUser", "addUser", "editUser", "delUser"]),
    async getList() {
      this.listLoading = true;
      // 过滤空值的属性
      let param = {};
      Object.keys(this.params).forEach(key =>
        this.params[key] ? (param[key] = this.params[key]) : ""
      );
      const { total, list } = await this.listUser({
        ...param,
        page: this.page,
        limit: this.limit
      });
      this.listLoading = false;
      this.tableData = list;
      this.total = total;
    },
    search: _.debounce(function() {
      this.getList();
    }, 500),
    currentPage(page) {
      this.page = page;
      this.getList();
    },
    reset() {
      Object.keys(this.params).forEach(key => (this.params[key] = ""));
      this.getList();
    },
    add() {
      this.showDialog = true;
      this.mode = "add";
      console.log("title", this.title);
    },
    edit(item) {
      this.mode = "edit";
      this.showDialog = true;
      this.model = Object.assign({}, item);
      this.model.sex += "";
      const ids = this.model.project_user.map(proj =>
        proj.project ? proj.project_id : ""
      );
      console.log(ids.filter(id => id != ""));

      this.projIds = ids.filter(id => id != "");
    },
    confirm() {
      this.$refs["form"].validate(async valid => {
        if (!valid) return;
        if (this.mode == "add") {
          this.model.project_id_list = this.projIds.join(",");
          await this.addUser(this.model);
          showSuccessMsg("添加成功");
        } else {
          this.model.project_id_list = this.projIds.join(",");
          this.model.password = this.model.show_pwd;
          await this.editUser(this.model);
          showSuccessMsg("编辑成功");
        }
        this.showDialog = false;
        this.getList();
      });
    },
    del() {
      if (this.ids == "") {
        showInfoMsg("未选中任何用户");
        return;
      }
      const h = this.$createElement;
      this.$confirm(
        h("div", null, [
          h(
            "p",
            {
              style: "text-align: center;padding:.2rem 0;font-size:0.9rem;"
            },
            "确认删除以下用户？"
          ),
          h(
            "p",
            {
              style: "text-align: center;padding:.2rem 0;font-size:0.9rem;"
            },
            `${this.names}`
          )
        ]),
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      ).then(async _ => {
        await this.delUser({ ids: this.ids });
        showSuccessMsg("删除成功");
        this.getList();
      });
    },
    handleSelectionChange(val) {
      this.names = getValByKey("name", val, ", ");
      this.ids = getValByKey("id", val);
    },
    closed() {
      this.$refs["form"].resetFields();
      Object.keys(this.model).forEach(key =>
        key !== "sex" ? (this.model[key] = "") : ""
      );
      this.projIds = [];
      this.showPwd = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.user-manage {
  padding: 2rem;
  border-radius: 6px;
  .operate {
    margin-top: 1rem;
    .btn {
      padding: 0.3rem 1.2rem;
      margin-right: 0.5rem;
    }
    .search {
      margin-left: 1rem;
    }
    .icon-btn {
      padding: 0 1.2rem;
      border-radius: 4px;
      border: 1px solid #d3d3d3;
    }
  }
  .table {
    margin-top: 2rem;
    .device-pic {
      width: 50px;
      height: 50px;
    }
    .operate-btn {
      margin-right: 1rem;
    }
  }
  .page {
    margin-top: 2rem;
  }
  .dialog-btn {
    width: 40%;
  }
}
</style>