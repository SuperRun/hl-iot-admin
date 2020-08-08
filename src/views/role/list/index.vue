<template>
  <div class="auth-manage">
    <el-button type="button" class="btn-add" @click="$router.push({path: '/role/add'})">添加</el-button>
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
        <template slot-scope="scope">{{ (page-1)*limit + scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="角色名称" prop="name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <span class="btn-table mg-right-1" @click="del(scope.row)">删除</span> -->
          <span class="btn-table" @click="$router.push({path: `/role/detail/${scope.row.id}`})">详情</span>
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
</template>

<script>
import { showWarningMsg, showSuccessMsg, showInfoMsg } from '@/utils/message';

export default {
  name: 'RoleManage',
  data() {
    return {
      isEdit: false,
      tableData: [],
      listLoading: false,
      page: 1,
      limit: 10,
      total: 0,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const { list, total } = await this.$store.dispatch('role/listRole', {
        page: this.page,
        limit: this.limit,
      });
      this.tableData = list;
      this.listLoading = false;
      this.total = total;
    },
    currentPage(page) {
      this.page = page;
      this.getList();
    },
    // del(item) {
    //   this.$confirm(`确认删除角色 ${item.name}? `, "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消"
    //   })
    //     .then(async _ => {
    //       await this.$store.dispatch("role/delRole", { id: item.id });
    //       showSuccessMsg("删除");
    //       this.getList();
    //     })
    //     .catch(_ => {
    //       showInfoMsg("已取消删除");
    //     });
    // }
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
  .page {
    margin-top: 2rem;
  }
}
</style>
