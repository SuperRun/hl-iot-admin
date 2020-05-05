<template>
  <div>
    <el-dialog
      title="分组详情"
      :visible="showDialog"
      @close="$listeners.closeDialog('detail')"
      @open="open"
    >
      <!-- 组号 -->
      <div class="flex text-dark">
        <span>组号：</span>
        <span>组号</span>
      </div>
      <!-- 定时控灯 -->
      <div class="flex flex-column mg-top-1 text-dark">
        <div class="flex">
          <span>定时控灯：</span>
          <span>{{'开启/关闭'}}</span>
        </div>
        <ul class="mg-top-1 time-list">
          <li class="flex">
            <span class="flex-1">时间</span>
            <span class="flex-1">亮度</span>
          </li>
          <li class="flex time mg-top-1">
            <span class="w-50">08:00</span>
            <span class="w-50">0%</span>
          </li>
          <li class="flex time mg-top-1">
            <span class="w-50">08:00</span>
            <span class="w-50">0%</span>
          </li>
        </ul>
      </div>
      <!-- 搜索栏 -->
      <div class="flex mg-top-1">
        <el-input placeholder="搜索设备编号" v-model="sn" class="wpx-200 mg-right-1"></el-input>
        <button type="button" class="btn-del wpx-100">移除</button>
      </div>
      <!-- 表格 -->
      <div class="table mg-top-1">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
          v-loading="listLoading"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="device_number" label="编号"></el-table-column>
          <el-table-column prop="place_number" label="位号"></el-table-column>
          <el-table-column prop="brightness" label="亮度"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{scope.row.status | faultStatus}}</template>
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GroupdetailDialog",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    group_id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      model: {}
    };
  },
  methods: {
    async open() {
      if (this.group_id != 0) {
        this.model = await this.$store.dispatch("group/detailGroup", {
          id: this.group_id
        });
      }
    }
  }
};
</script>
<style scoped>
.time-list {
  width: 300px;
}
</style>
