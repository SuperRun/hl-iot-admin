<template>
  <div class="auth-manage">
    <el-button type="button" class="btn-add" @click="showDialog = true"
      >添加</el-button
    >
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      header-cell-class-name="table-header"
      class="mg-top-1"
      v-loading="listLoading"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column label="序号">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="权限名称" prop="title"></el-table-column>
      <el-table-column label="路由">
        <template slot-scope="scope">{{
          scope.row.route != null ? scope.row.route : scope.row.h5_route
        }}</template>
      </el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span class="btn-table" @click="edit(scope.row)">修改</span>
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
    <!-- 弹出框 -->
    <el-dialog
      :title="title"
      :visible="showDialog"
      @opened="opened"
      @close="showDialog = false"
      @closed="closed"
    >
      <el-form
        ref="form"
        :model="model"
        label-width="80px"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="父级">
          <div class="flex jc-between">
            <el-select
              style="width:140px"
              v-model="model.parent_id"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in parentOptions"
                :key="index"
                :label="`${item.level}:${item.title}`"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="级别" prop="title">
          <el-select
            style="width:140px"
            v-model="model.level"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in levelOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input type="text" v-model="model.title"></el-input>
        </el-form-item>
        <el-form-item label="后端接口" prop="route">
          <el-input type="text" v-model="model.route"></el-input>
        </el-form-item>
        <el-form-item label="前端路由" prop="h5_route">
          <el-input type="text" v-model="model.h5_route"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="model.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="flex jc-around">
        <el-button class="dialog-btn btn-light" @click="showDialog = false"
          >取 消</el-button
        >
        <el-button class="dialog-btn btn-dark" type="primary" @click="confirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listAuth, addAuth, editAuth, detailAuth} from '@/api/auth';
import {showSuccessMsg, showErrorMsg} from '@/utils/message';
export default {
  name: 'AuthManage',
  data() {
    return {
      showDialog: false,
      mode: 'add',
      model: {
        parent_id: '',
        level: '',
        title: '',
        route: '',
        h5_route: '',
        remark: '',
      },
      rules: {
        title: [{required: true, message: '请填写名称', trigger: 'blur'}],
      },
      tableData: [],
      listLoading: false,
      parentOptions: [{level: 0, title: '顶级权限', id: 0}],
      levelOptions: [
        {label: '一级', value: 1},
        {label: '二级', value: 2},
        {label: '三级', value: 3},
        {label: '四级', value: 4},
      ],
      page: 1,
      limit: 10,
      total: 0,
    };
  },
  computed: {
    title() {
      return this.mode == 'add' ? '添加权限' : '编辑权限';
    },
  },
  created() {
    this.getList();

    // this.getLevel(2);
    // this.getLevel(3);
  },
  methods: {
    getList() {
      this.listLoading = true;
      listAuth({page: this.page, limit: this.limit}).then((res) => {
        this.listLoading = false;
        const {list, total} = res.data;
        this.total = total;
        this.getLevel();
        this.tableData = list;
      });
    },
    edit(row) {
      this.mode = 'edit';
      this.showDialog = true;
      this.model = Object.assign({}, row);
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        console.log(this.model);
        // return;
        if (this.mode == 'add') {
          addAuth({...this.model}).then((res) => {
            showSuccessMsg('添加成功');
            this.getList();
          });
        } else {
          editAuth({...this.model}).then((res) => {
            showSuccessMsg('编辑成功');
            this.getList();
          });
        }
        this.showDialog = false;
      });
    },
    opened() {},
    closed() {
      Object.keys(this.model).forEach((key) => {
        this.model[key] = '';
      });
    },
    getLevel(level = '', parent_id = '') {
      let params = {
        page: 1,
        limit: this.total,
      };
      if (level != '') {
        params.level = level;
      }
      if (parent_id != '') {
        params.parent_id = parent_id;
      }
      listAuth(params).then((res) => {
        this.listLoading = false;
        const {list} = res.data;
        this.parentOptions = [...this.parentOptions, ...list];
      });
    },
    currentPage(page) {
      this.page = page;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-manage {
  padding: 2rem;
  border-radius: 6px;
  .tab {
    padding: 0.8rem 1.4rem;
    background-color: #f2f6fd;
    margin-right: 0.5rem;
    border-top-right-radius: 8px;
    color: #333333;
    transition: all 0.3s;
    cursor: pointer;
  }
  .tab.active {
    background-color: #4360ec;
    color: #ffffff;
  }
  .tab-panel {
    padding: 1rem 0;
  }
  .dialog-btn {
    width: 40%;
  }
  .page {
    margin-top: 2rem;
  }
}
</style>
