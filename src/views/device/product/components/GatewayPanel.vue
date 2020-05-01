<template>
  <div class="gateway-panel">
    <!-- 搜索栏 -->
    <div class="operate flex jc-start">
      <button type="button" class="btn btn-add" @click="showDialog=true">添加</button>
      <button type="button" class="btn btn-del" @click="del">删除</button>
      <div class="search flex">
        <el-input placeholder="搜索产品名称" v-model="params.title" class="mg-right-1" @input="search"></el-input>
        <el-input placeholder="搜索产品型号" v-model="params.model" @input="search"></el-input>
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
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" label="名称" width="220"></el-table-column>
        <el-table-column prop="model" label="型号" width="220"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img
              class="device-pic"
              @error="(e)=> e.target.src = require ('@/assets/images/no-pic.png')"
              :src="scope.row.image || require('@/assets/images/no-pic.png')"
              alt
            />
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
    <el-dialog :title="title" :visible.sync="showDialog" center width="500px" @closed="closed">
      <el-form :model="model" :rules="rules" ref="form" label-position="left">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="title">
          <el-input v-model="model.title" autocomplete="off" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth" prop="model">
          <el-input v-model="model.model" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth" prop="image">
          <el-upload
            action
            list-type="picture-card"
            :before-upload="beforeImgUpload"
            :http-request="uploadImage"
            :on-preview="handlePictureCardPreview"
            :before-remove="beforePicRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="imgList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog title="查看大图" :visible.sync="dialogVisible" :modal="false">
            <img width="100%" :src="model.image" alt />
          </el-dialog>
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
import SearchMixin from "../mixin/search";
import DialogMixin from "../mixin/dialog";

export default {
  name: "GatewayPanel",
  mixins: [SearchMixin, DialogMixin],
  computed: {
    title() {
      return this.mode == "add" ? "添加产品(物联网关)" : "编辑产品(物联网关)";
    }
  },
  data() {
    return {
      showDialog: false,
      formLabelWidth: "60px",
      model: {
        type: 5, // 产品类型 5-气象站
        title: "", // 名称
        model: "", // 型号
        image: "" // 图片
      },
      rules: {
        name: [{ required: true, message: "请填写设备名称", trigger: "blur" }],
        mode: [{ required: true, message: "请填写产品型号", trigger: "blur" }]
      },
      params: {
        type: 5, // 5-网关
        title: "", // 产品名称
        model: "" // 产品型号
      },
      mode: "add" // 编辑还是新增
    };
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