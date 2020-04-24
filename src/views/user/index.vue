<template>
  <div class="user-manage bg-white-3 min-h-1 bx-shadow-2">
    <!-- 搜索栏 -->
    <div class="operate flex">
      <button type="button" class="btn btn-add" @click="showDialog=true">添加</button>
      <button type="button" class="btn btn-del">删除</button>
      <div class="search flex">
        <el-input placeholder="搜索名称/账号/手机号" v-model="keyword">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="名称" width="220"></el-table-column>
        <el-table-column prop="mode" label="账号" width="220"></el-table-column>
        <el-table-column prop="mode" label="手机" width="220"></el-table-column>
        <el-table-column prop="mode" label="项目" width="220"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template>
            <a href>编辑</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="page">
        <el-pagination background layout="total,prev, pager, next" :total="1" :page-size="5"></el-pagination>
      </div>
    </div>
    <!-- 弹出框 -->
    <el-dialog title="创建用户" :visible.sync="showDialog" center width="600px">
      <el-form
        :model="model"
        :label-width="formLabelWidth"
        :rules="rules"
        ref="form"
        label-position="left"
      >
        <el-form-item label="账号" prop="account">
          <el-input
            v-model="model.account"
            autocomplete="off"
            minlength="5"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="model.password" autocomplete="off" maxlength="20" show-word-limit></el-input>
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
        <el-form-item label="手机" prop="phone">
          <el-input v-model="model.phone" autocomplete="off" maxlength="11" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="model.sex" class="w-100">
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="model.role" class="w-100">
            <el-option
              :label="item.label"
              :value="item.value"
              :key="item.value"
              v-for="item in roleList"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目配置" prop="proj">
          <el-select v-model="model.proj" multiple class="w-100">
            <el-option
              :label="item.label"
              :value="item.value"
              :key="item.value"
              v-for="item in projList"
            ></el-option>
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
export default {
  name: "UserManage",
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
      model: {
        account: "", // 账号
        password: "", // 密码
        name: "", // 名称
        phone: "", // 手机
        sex: 1, // 性别
        role: 1, // 角色
        proj: "" // 项目配置
      },
      rules: {
        account: [
          { required: true, message: "请填写账号", trigger: "blur" },
          { min: 5, max: 20, message: "长度在 5 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请填写手机号", trigger: "blur" },
          { max: 11, message: "手机号不能超过11个字符", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "blur" }]
      },
      roleList: [
        {
          value: 1,
          label: "管理员"
        },
        {
          value: 2,
          label: "角色2"
        },
        {
          value: 3,
          label: "角色3"
        }
      ],
      projList: [
        {
          value: 1,
          label: "项目1"
        },
        {
          value: 2,
          label: "项目2"
        },
        {
          value: 3,
          label: "项目3"
        }
      ]
    };
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