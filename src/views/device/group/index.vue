<template>
  <div class="group-manage bg-white-3 min-h-1 bx-shadow-2">
    <ul class="flex">
      <li class="tab active">照明灯</li>
    </ul>
    <!-- 搜索栏 -->
    <div class="flex jc-start mg-top-1">
      <button
        type="button"
        class="btn btn-add"
        @click="
          showGroupaddDialog = true;
          mode = 'add';
        "
      >
        添加
      </button>
      <button type="button" class="btn btn-del" @click="del">删除</button>
      <el-input
        placeholder="搜索组号"
        v-model="params.group_number"
        class="wpx-150 mg-right-1"
        @input="search"
      ></el-input>
    </div>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      header-cell-class-name="table-header"
      class="mg-top-1"
      v-loading="listLoading"
      element-loading-spinner="el-icon-loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="组号" prop="group_number"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span
            class="btn-table mg-right-1"
            @click="
              showGroupdetailDialog = true;
              id = scope.row.id;
            "
            >详情</span
          >
          <span
            class="btn-table mg-right-1"
            @click="
              showGroupcontrolDialog = true;
              id = scope.row.id;
            "
            >控制</span
          >
          <span
            class="btn-table"
            @click="
              showGroupaddDialog = true;
              mode = 'edit';
              num = scope.row.group_number;
              id = scope.row.id;
            "
            >编辑</span
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="mg-top-2">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="total"
        :page-size="limit"
        :current-page="page"
        @current-change="currentPage"
      ></el-pagination>
    </div>
    <!-- 添加分组弹出框 -->
    <addgroup-dialog
      :showDialog="showGroupaddDialog"
      @closeDialog="closeDialog"
      @getList="getList"
      :mode="mode"
      :num="num"
      :id="id"
    ></addgroup-dialog>
    <!-- 控制分组弹出框 -->
    <controlgroup-dialog
      :showDialog="showGroupcontrolDialog"
      :id="id"
      @closeDialog="closeDialog"
    ></controlgroup-dialog>
    <!-- 分组详情弹出框 -->
    <groupdetail-dialog
      :showDialog="showGroupdetailDialog"
      @closeDialog="closeDialog"
      :id="id"
    ></groupdetail-dialog>
  </div>
</template>

<script>
import {getValByKey} from '@/utils/util';
import {showInfoMsg, showSuccessMsg} from '@/utils/message';
import AddgroupDialog from './components/AddgroupDialog';
import ControlgroupDialog from './components/ControlgroupDialog';
import GroupdetailDialog from './components/GroupdetailDialog';
import {mapGetters} from 'vuex';
import _ from 'lodash';

export default {
  name: 'GroupManage',
  components: {
    AddgroupDialog,
    ControlgroupDialog,
    GroupdetailDialog,
  },
  data() {
    return {
      currentTab: 'CameraPanel',
      params: {
        group_number: '',
      },
      page: 1,
      total: 0,
      limit: 10,
      tableData: [],
      listLoading: false,
      showGroupaddDialog: false,
      showGroupcontrolDialog: false,
      showGroupdetailDialog: false,
      mode: 'add',
      num: '',
      ids: '',
      id: 0,
      delItems: [],
    };
  },
  computed: {
    ...mapGetters(['cur_proj']),
  },
  watch: {
    cur_proj() {
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const {list, total} = await this.$store.dispatch('group/listGroup', {
        ...this.params,
        project_id: this.cur_proj,
        page: this.page,
        limit: this.limit,
      });
      this.listLoading = false;
      this.total = total;
      this.tableData = list;
    },
    del() {
      if (this.ids == '') {
        showInfoMsg('未选中任何设备');
        return;
      }
      const h = this.$createElement;

      this.$confirm(
        h('div', null, [
          h(
            'h4',
            {
              style: 'text-align: center',
            },
            '已选中分组：',
          ),
          ...this.delItems,
          h(
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            '删除分组将移动选中分组内的设备到未分组',
          ),
          h(
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            '确认删除已选中分组？',
          ),
        ]),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        },
      )
        .then(async (_) => {
          this.$store
            .dispatch('group/destroyGroup', {ids: this.ids})
            .then((res) => {
              showSuccessMsg('删除成功');
              this.getList();
            });
        })
        .catch((_) => {
          // showInfoMsg('取消删除');
        });
    },
    search: _.debounce(function() {
      this.getList();
    }, 500),
    closeDialog(operate) {
      this[`showGroup${operate}Dialog`] = false;
    },
    currentPage(page) {
      this.page = page;
      this.getList();
    },
    handleSelectionChange(val) {
      this.ids = getValByKey('id', val);
      const h = this.$createElement;
      this.delItems = val.map((item) => {
        return h(
          'p',
          {
            style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
          },
          `组号：${item.group_number}, 所属项目：${item.project.title}`,
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.group-manage {
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

  .btn {
    padding: 0.3rem 1.2rem;
    margin-right: 0.5rem;
  }
}
</style>
