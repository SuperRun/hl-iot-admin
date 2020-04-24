<template>
  <div class="camera-panel">
    <!-- 搜索栏 -->
    <div class="operate flex jc-start">
      <button type="button" class="btn btn-add" @click="showDialog=true">添加</button>
      <button type="button" class="btn btn-del">删除</button>
      <div class="search flex">
        <el-input placeholder="搜索SN" v-model="sn">
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
        <el-table-column prop="mode" label="型号" width="220"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img class="device-pic" :src="scope.row.image" alt />
          </template>
        </el-table-column>
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
    <el-dialog title="添加产品(摄像头)" :visible.sync="showDialog" center width="500px">
      <el-form :model="model" :rules="rules" ref="form" label-position="left">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="model.name" autocomplete="off" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth" prop="mode">
          <el-input v-model="model.mode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth" prop="image">
          <el-input v-model="model.image" autocomplete="off"></el-input>
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
export default {
  name: "CameraPanel",
  data() {
    return {
      showDialog: false,
      tableData: [
        {
          name: "摄像头1",
          mode: "bdhjb",
          image:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587549810674&di=f5cb5da88097485bf9583f2f2b3945a4&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F12%2F19%2Fa7e75a580c4af917756a2e4a35621c49.jpg"
        },
        {
          name: "摄像头1",
          mode: "bdhjb",
          image:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587549810674&di=f5cb5da88097485bf9583f2f2b3945a4&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F12%2F19%2Fa7e75a580c4af917756a2e4a35621c49.jpg"
        },
        {
          name: "摄像头1",
          mode: "bdhjb",
          image:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587549810674&di=f5cb5da88097485bf9583f2f2b3945a4&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F12%2F19%2Fa7e75a580c4af917756a2e4a35621c49.jpg"
        },
        {
          name: "摄像头1",
          mode: "bdhjb",
          image:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587549810674&di=f5cb5da88097485bf9583f2f2b3945a4&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F12%2F19%2Fa7e75a580c4af917756a2e4a35621c49.jpg"
        },
        {
          name: "摄像头1",
          mode: "bdhjb",
          image:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1587549810674&di=f5cb5da88097485bf9583f2f2b3945a4&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F16%2F12%2F19%2Fa7e75a580c4af917756a2e4a35621c49.jpg"
        }
      ],
      sn: "",
      formLabelWidth: "60px",
      model: {
        name: "", // 名称
        mode: "" // 型号
      },
      rules: {
        name: [{ required: true, message: "请填写设备名称", trigger: "blur" }],
        mode: [{ required: true, message: "请填写产品型号", trigger: "blur" }],
        image: [{ required: true, message: "请上传产品图片", trigger: "blur" }]
      }
    };
  },
  methods: {
    headColor({ row, rowIndex }) {
      return "bg-grey-6";
    },
    handleSelectionChange() {},
    confirm() {
      this.$refs["form"].validate(valid => {
        if (!valid) return;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>