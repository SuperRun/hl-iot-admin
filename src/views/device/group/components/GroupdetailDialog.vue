<template>
  <div>
    <el-dialog
      title="分组详情"
      :visible="showDialog"
      @close="
        $listeners.closeDialog('detail');
        params.device_number = '';
      "
      @open="open"
    >
      <!-- 组号 -->
      <div class="flex text-dark">
        <span>组号：</span>
        <span>{{ model.group_number }}</span>
      </div>
      <!-- 定时控灯 -->
      <div class="flex flex-column mg-top-1 text-dark">
        <div class="flex">
          <span>定时控灯：</span>
          <span>{{ model.is_timing == 1 ? '开启' : '关闭' }}</span>
        </div>
        <template
          v-if="
            model.is_timing == 1 &&
              model.group_controls &&
              model.group_controls.length > 0
          "
        >
          <ul class="mg-top-1 time-list">
            <li class="flex">
              <span class="flex-1">时间</span>
              <span class="flex-1">亮度</span>
            </li>
            <li
              class="flex time mg-top-1"
              v-for="control in model.group_controls"
              :key="control.time"
            >
              <span class="w-50">{{
                control.hour + ':' + control.minute
              }}</span>
              <span class="w-50">{{ control.brightness }}%</span>
            </li>
          </ul>
        </template>
        <template v-else-if="model.is_timing == 1">
          <p>暂无内容</p>
        </template>
      </div>
      <!-- 搜索栏 -->
      <div class="flex mg-top-1">
        <!-- <button
          type="button"
          size="small"
          class="btn-del wpx-100 mg-right-1"
          @click="del"
        >
          移除
        </button> -->
        <el-input
          placeholder="搜索设备编号"
          v-model="params.device_number"
          class="wpx-200 "
          @input="search"
        ></el-input>
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
          element-loading-spinner="el-icon-loading"
        >
          <el-table-column label="序号">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="device_number" label="编号"></el-table-column>
          <el-table-column prop="place_number" label="位号"></el-table-column>
          <el-table-column label="亮度">
            <template slot-scope="scope">
              {{
                scope.row.light_report_data != null
                  ? scope.row.light_report_data.brightness
                  : '无'
              }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{
              scope.row.status | faultStatus
            }}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  name: 'GroupdetailDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      model: {},
      tableData: [],
      params: {
        device_number: '',
        group_id: '',
      },
      listLoading: false,
    };
  },
  methods: {
    async open() {
      if (this.group_id != 0) {
        this.model = await this.$store.dispatch('group/detailGroup', {
          id: this.id,
        });
        this.getDeviceList();
      }
    },
    async getDeviceList() {
      this.params.group_id = this.id;
      this.listLoading = true;
      const { list } = await this.$store.dispatch(
        'group/deviceListGroup',
        this.params,
      );
      this.tableData = list;
      this.listLoading = false;
    },
    search: _.debounce(function() {
      this.getDeviceList();
    }, 500),
    del() {},
    handleSelectionChange() {},
  },
};
</script>
<style scoped>
.time-list {
  width: 300px;
}
</style>
