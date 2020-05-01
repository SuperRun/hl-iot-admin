<template>
  <div class="screen-panel">
    <!-- 搜索栏 -->
    <div class="operate flex">
      <button type="button" class="btn btn-del">关闭</button>
      <div class="search flex">
        <el-input placeholder="搜索设备编号" v-model="sn">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <button type="button" class="btn btn-refresh mg-left-1">刷新</button>
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
        <el-table-column prop="name" label="设备编号" width="200"></el-table-column>
        <el-table-column prop="mode" label="产品名称" width="200"></el-table-column>
        <el-table-column prop="mode" label="位号" width="200"></el-table-column>
        <el-table-column prop="mode" label="告警内容" width="200"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template>
            <a class="operate-btn" href>详情</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="page">
        <el-pagination background layout="total,prev, pager, next" :total="1" :page-size="5"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScreenPanel",
  data() {
    return {
      sn: "",
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
      ]
    };
  },
  methods: {
    handleSelectionChange() {}
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
</style>