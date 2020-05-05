<template>
  <div class="screen-panel">
    <!-- 搜索栏 -->
    <div class="operate flex jc-between">
      <div class="flex">
        <button type="button" class="btn btn-add" @click="add">添加</button>
        <button type="button" class="btn btn-del" @click="del">删除</button>
        <div class="search flex">
          <el-input
            placeholder="搜索设备编号"
            v-model="params.device_number"
            class="mg-right-1"
            @input="search"
          ></el-input>
          <el-input placeholder="搜索位号" v-model="params.place_number" @input="search"></el-input>
        </div>
        <button type="button" class="btn btn-light mg-left-1 br-4" @click="reset">重置</button>
        <button type="button" class="btn btn-refresh mg-left-1">读状态</button>
      </div>
      <div class="flex">
        <ul class="flex">
          <li
            class="icon-btn flex ai-center"
            :class="tableOrMap=='table'?'bg-blue-4':''"
            @click="tableOrMap='table'"
          >
            <svg-icon :icon-class="tableOrMap=='table'?'table-active':'table'"></svg-icon>
          </li>
          <li
            class="icon-btn flex ai-center"
            :class="tableOrMap=='map'?'bg-blue-4':''"
            @click="tableOrMap='map'"
          >
            <svg-icon :icon-class="tableOrMap=='map'?'location-active':'location'"></svg-icon>
          </li>
        </ul>
        <button
          type="button"
          class="btn btn-add mg-left-1"
          @click="$router.push({path:'/device/product'})"
        >产品管理</button>
      </div>
    </div>
    <!-- 表格 -->
    <div v-show="tableOrMap=='table'">
      <div class="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          header-cell-class-name="table-header"
          v-loading="listLoading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="device_number" label="编号" width="180"></el-table-column>
          <el-table-column label="产品" width="200">
            <template
              slot-scope="scope"
            >{{scope.row.product?`${scope.row.product.title}(${scope.row.product.model})`:'无'}}</template>
          </el-table-column>
          <el-table-column prop="place_number" label="位号" width="180"></el-table-column>
          <el-table-column label="状态" width="150">
            <template slot-scope="scope">{{scope.row.status | faultStatus}}</template>
          </el-table-column>
          <el-table-column label="安装时间" width="200">
            <template slot-scope="scope">{{scope.row.created_at | formatTime}}</template>
          </el-table-column>
          <el-table-column prop="operation" label="操作">
            <template slot-scope="scope">
              <span class="btn-table mg-right-1" @click="detail(scope.row.id)">详情</span>
              <span class="btn-table" @click="edit(scope.row)">编辑</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <!-- 地图 -->
    <div class="screen-map" v-show="tableOrMap=='map'">
      <div id="screen-map"></div>
      <i :class="[`el-icon-${isLock?'':'un'}lock`, 'lock']" @click="lock"></i>
    </div>
    <!-- 弹出框 -->
    <el-dialog
      :title="title"
      :visible.sync="showDialog"
      center
      @opened="dialogOpened"
      @closed="closed"
    >
      <el-form :model="model" :inline="true" :rules="rules" ref="form">
        <el-form-item label="编号" :label-width="formLabelWidth" prop="device_number">
          <el-input v-model="model.device_number" autocomplete="off" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <!-- 显示产品名称和型号 -->
        <el-form-item label="产品" :label-width="formLabelWidth" prop="product_id">
          <el-select v-model="model.product_id" placeholder="请选择产品">
            <el-option
              :key="product.id"
              :label="`${product.title}(${product.model})`"
              :value="product.id"
              v-for="product in products"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位号" :label-width="formLabelWidth" prop="place_number">
          <el-input v-model="model.place_number" autocomplete="off" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <!-- 显示网关名称和型号 -->
        <el-form-item label="网关" :label-width="formLabelWidth" prop="gateway_product_id">
          <el-select v-model="model.gateway_product_id" placeholder="请选择网关">
            <el-option
              :key="gateway.id"
              :label="`${gateway.title}(${gateway.model})`"
              :value="gateway.id"
              v-for="gateway in gateways"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度" :label-width="formLabelWidth" prop="longitude">
          <el-input v-model="model.longitude" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="纬度" :label-width="formLabelWidth" prop="latitude">
          <el-input v-model="model.latitude" :readonly="true"></el-input>
        </el-form-item>
        <!-- 地图 -->
        <div class="map">
          <el-select
            class="search-location"
            v-model="place"
            filterable
            remote
            reserve-keyword
            placeholder="搜索地点"
            :remote-method="searchPlace"
            :loading="loading"
            @change="choosePlace"
          >
            <el-option
              v-for="item in placeList"
              :key="item.uid"
              :label="item.name"
              :value="item.uid"
            ></el-option>
          </el-select>
          <div id="dialog-map"></div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="dialog-btn btn-light" @click="showDialog = false">取 消</el-button>
        <el-button class="dialog-btn btn-dark" type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DialogMixin from "../mixin/dialog";
import SearchMixin from "../mixin/search";

export default {
  name: "ScreenPanel",
  mixins: [SearchMixin, DialogMixin],
  computed: {
    title() {
      return this.mode == "add" ? "添加设备(LED屏)" : "编辑设备(LED屏)";
    }
  },
  data() {
    return {
      showDialog: false,
      tableOrMap: "table",
      isLock: true,
      params: {
        product_type: 2, // 产品类型 2-led屏
        device_number: "", // 设备编号
        place_number: "", // 位号
        project_id: "" // 项目ID
      },
      rules: {
        num: [{ required: true, message: "请填写设备编号", trigger: "blur" }],
        product: [{ required: true, message: "请选择产品", trigger: "blur" }],
        position: [{ required: true, message: "请填写位号", trigger: "blur" }],
        gateway: [{ required: true, message: "请选择网关", trigger: "blur" }],
        lng: [{ required: true, message: "请标记地点", trigger: "blur" }],
        lat: [{ required: true, message: "请标记地点", trigger: "blur" }]
      },
      screenMap: {} // 列表地图
    };
  },
  mounted() {
    // 设备列表地图
    this.screenMap = new Map(
      "screen-map",
      { lng: "116.404", lat: "39.915" },
      true,
      true
    );
    this.screenMap.addMark(
      "116.404",
      "39.915",
      { url: cameraMark, w: 30, h: 30 }, // icon
      true
    );
  },
  methods: {
    lock() {
      this.isLock = !this.isLock;
      this.isLock
        ? this.screenMap.disableMarksDragging()
        : this.screenMap.enableMarksDragging();
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
}
.page {
  margin-top: 2rem;
}
.map {
  position: relative;
  .search-location {
    position: absolute;
    left: 80px;
    top: 10px;
    width: 200px;
    z-index: 1;
  }
}
.screen-map {
  position: relative;
  #screen-map {
    width: 100%;
    height: 350px;
    margin-top: 2rem;
  }
  .lock {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    font-size: 1.5rem;
  }
}
#dialog-map {
  width: 80%;
  margin: 0 auto;
  height: 350px;
  margin-top: 1rem;
}
.dialog-btn {
  width: 40%;
}
</style>