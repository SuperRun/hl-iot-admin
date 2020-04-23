<template>
  <div>
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
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination background layout="total,prev, pager, next" :total="1" :page-size="5"></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScreenPanel"
};
</script>

<style lang="scss" scoped>
.table {
  margin-top: 2rem;
  .device-pic {
    width: 50px;
    height: 50px;
  }
}
.page {
  margin-top: 2rem;
}
</style>