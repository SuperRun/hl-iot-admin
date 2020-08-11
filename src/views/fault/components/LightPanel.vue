<template>
  <div class="camera-panel">
    <!-- 搜索栏 -->
    <div class="operate flex">
      <button
        v-if="btns.includes(72)"
        type="button"
        class="btn btn-del"
        @click="closeFaults"
      >{{ isCur == 1 ? '关闭' : '删除' }}</button>
      <div class="search flex">
        <el-input placeholder="搜索设备编号" v-model="sn">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
      <button type="button" class="btn btn-refresh mg-left-1" @click="refresh">刷新</button>
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
        <el-table-column prop="name" label="设备编号" width="200">
          <template slot-scope="scope">{{ scope.row.device.device_number }}</template>
        </el-table-column>
        <el-table-column prop="mode" label="产品名称" width="200">
          <template slot-scope="scope">{{ scope.row.product.title }}</template>
        </el-table-column>
        <el-table-column prop="mode" label="位号" width="200">
          <template slot-scope="scope">{{ scope.row.device.place_number }}</template>
        </el-table-column>
        <el-table-column prop="mode" label="告警内容" width="200">
          <template>设备故障</template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <a class="operate-btn" @click="detail(scope.row.device_id)">详情</a>
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
    <!-- 设备详情弹出框 -->
    <device-detail :curContent="content" @hideDetail="hideDetail" v-if="isShow"></device-detail>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { closeWarn } from '@/api/fault';
import { getValByKey } from '@/utils/util';
import { showSuccessMsg, showInfoMsg, showErrorMsg } from '@/utils/message';
import DeviceDetail from '@/components/DeviceDetail';

export default {
  name: 'LightPanel',
  components: {
    DeviceDetail,
  },
  props: {
    isCur: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters(['cur_proj', 'btns']),
  },
  data() {
    return {
      sn: '',
      tableData: [],
      params: {
        project_id: this.cur_proj,
        product_type: 3, // 产品类型 3-摄像头
        status: 3, // 状态
      },
      page: 1,
      limit: 10,
      total: 0,
      listLoading: false,
      ids: '',
      selectFaults: [],
      content: 'Fault',
      isShow: false,
    };
  },
  watch: {
    isCur() {
      this.getList();
    },
    cur_proj() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const res = await this.$store.dispatch('fault/listWarn', {
        type: this.isCur ? 1 : 2,
        page: this.page,
        limit: this.limit,
        project_id: this.cur_proj,
        device_number: this.sn,
      });
      const { list, total } = res.data;
      this.listLoading = false;
      this.tableData = list;
      this.total = total;
    },
    currentPage(page) {
      this.page = page;
      this.getList();
    },
    handleSelectionChange(val) {
      this.ids = getValByKey('id', val);
      // 编号：22222   产品名称1（型号）
      this.selectFaults = val.reduce((pre, cur) => {
        let obj = {};
        obj['device_number'] = cur.device.device_number;
        obj['content'] = `${cur.product.title}(${cur.product.model})`;
        pre.push(obj);
        return pre;
      }, []);
    },
    closeFaults() {
      if (this.ids == '') {
        showInfoMsg('未选中任何设备');
        return;
      }
      const h = this.$createElement;
      const question =
        this.isCur == 1 ? '确认关闭以下告警？' : '确认删除以下告警?';
      const tags = this.selectFaults.reduce((pre, cur) => {
        pre.push(
          h(
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            `编号：${cur.device_number}   设备故障`,
          ),
        );
        return pre;
      }, []);

      this.$confirm(
        h('div', null, [
          h(
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            question,
          ),
          h('div', null, tags),
        ]),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        },
      )
        .then(
          async (_) => {
            await closeWarn({ ids: this.ids, type: this.isCur ? 2 : 1 });
            this.getList();
            showSuccessMsg('操作成功');
          },
          (_) => {
            showInfoMsg('取消操作');
          },
        )
        .catch((error) => {
          showErrorMsg(error);
        });
    },
    search() {
      this.getList();
    },
    refresh() {
      this.sn = '';
      this.getList();
    },
    detail(id) {
      this.$store.dispatch('device/detailDevice', { id }).then((res) => {
        this.isShow = true;
        this.content = 'Fault';
        this.$store.commit('app/SET_DEVICE_DETAIL', res);
        this.$store.commit('app/OPEN_DEVICEDIALOG');
      });
    },
    hideDetail() {
      this.isShow = false;
    },
  },
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
    cursor: pointer;
  }
}
.page {
  margin-top: 2rem;
}
</style>
