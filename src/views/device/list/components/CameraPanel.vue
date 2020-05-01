<template>
  <div class="camera-panel">
    <!-- 搜索栏 -->
    <div class="operate flex jc-between">
      <div class="flex">
        <button type="button" class="btn btn-add" @click="showDialog=true">添加</button>
        <button type="button" class="btn btn-del">删除</button>
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
        <button type="button" class="btn btn-add mg-left-1">产品管理</button>
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
          <el-table-column prop="name" label="编号" width="200"></el-table-column>
          <el-table-column prop="mode" label="产品" width="200"></el-table-column>
          <el-table-column prop="mode" label="位号" width="200"></el-table-column>
          <el-table-column prop="mode" label="状态" width="200"></el-table-column>
          <el-table-column prop="mode" label="安装时间"></el-table-column>
          <el-table-column prop="operation" label="操作" width="300">
            <template>
              <a class="operate-btn" href>详情</a>
              <a class="operate-btn" href>编辑</a>
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
        ></el-pagination>
      </div>
    </div>
    <!-- 地图 -->
    <div class="camera-map" v-show="tableOrMap=='map'">
      <div id="camera-map"></div>
      <i :class="[`el-icon-${isLock?'':'un'}lock`, 'lock']" @click="lock"></i>
    </div>
    <!-- 弹出框 -->
    <el-dialog title="添加设备(摄像头)" :visible.sync="showDialog" center @opened="dialogOpened">
      <el-form :model="model" :inline="true" :rules="rules" ref="form">
        <el-form-item label="编号" :label-width="formLabelWidth" prop="device_number">
          <el-input v-model="model.device_number" autocomplete="off" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <!-- 显示产品名称和型号 -->
        <el-form-item label="产品" :label-width="formLabelWidth" prop="product_id">
          <el-select v-model="model.product_id" placeholder="请选择产品">
            <el-option
              :key="product.value"
              :label="product.label"
              :value="product.value"
              v-for="product in products"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位号" :label-width="formLabelWidth" prop="place_number">
          <el-input v-model="model.place_number" autocomplete="off" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <!-- 显示网关名称和型号 -->
        <el-form-item label="网关" :label-width="formLabelWidth" prop="gateway">
          <el-select v-model="model.gateway" placeholder="请选择网关">
            <el-option
              :key="gateway.value"
              :label="gateway.label"
              :value="gateway.value"
              v-for="gateway in gateways"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度" :label-width="formLabelWidth" prop="lng">
          <el-input v-model="model.lng" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="纬度" :label-width="formLabelWidth" prop="lat">
          <el-input v-model="model.lat" :readonly="true"></el-input>
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
import Map from "@/utils/map-util";
import { keep7Num } from "@/utils/util";
import cameraMark from "@/assets/images/marker-camera.png";
import SearchMixin from "../mixin/search";

export default {
  name: "CameraPanel",
  mixins: [SearchMixin],
  data() {
    return {
      showDialog: false,
      tableOrMap: "table",
      formLabelWidth: "100px",
      place: "", // 检索地名
      placeList: [], // 地名列表
      loading: false,
      isLock: true,
      params: {
        product_type: 1, // 产品类型 1-摄像头
        device_number: "", // 设备编号
        place_number: "", // 位号
        project_id: "" // 项目ID
      },
      model: {
        device_number: "", // 设备号
        place_number: "", // 位号
        project_id: "", // 项目id
        product_id: "", // 产品id
        longitude: "", // 经度
        latitude: "" // 纬度
      },
      products: [
        {
          value: 1,
          label: "产品1"
        },
        {
          value: 2,
          label: "产品2"
        },
        {
          value: 3,
          label: "产品3"
        }
      ],
      gateways: [
        {
          value: 1,
          label: "网关1"
        },
        {
          value: 2,
          label: "网关2"
        },
        {
          value: 3,
          label: "网关3"
        }
      ],
      rules: {
        device_number: [
          { required: true, message: "请填写设备编号", trigger: "blur" }
        ],
        product_id: [
          { required: true, message: "请选择产品", trigger: "blur" }
        ],
        place_number: [
          { required: true, message: "请填写位号", trigger: "blur" }
        ],
        gateway: [{ required: true, message: "请选择网关", trigger: "blur" }],
        lng: [{ required: true, message: "请标记地点", trigger: "blur" }],
        lat: [{ required: true, message: "请标记地点", trigger: "blur" }]
      },
      dialogMap: {}, // 弹出框地图
      cameraMap: {} // 列表地图
    };
  },
  mounted() {
    // 设备列表地图
    this.cameraMap = new Map(
      "camera-map",
      { lng: "116.404", lat: "39.915" },
      true,
      true
    );
    this.cameraMap.addMark(
      "116.404",
      "39.915",
      { url: cameraMark, w: 30, h: 30 }, // icon
      true
    );
  },
  methods: {
    handleSelectionChange() {},
    dialogOpened() {
      // 弹出框地图
      this.dialogMap = new Map("dialog-map", {}, true, true);
      const self = this;
      this.dialogMap.addMapEvent("click", function(e) {
        self.model.lng = keep7Num(e.point.lng);
        self.model.lat = keep7Num(e.point.lat);
        self.dialogMap.addMark(e.point.lng, e.point.lat, true);
      });
    },
    confirm() {
      this.$refs["form"].validate(valid => {
        if (!valid) return;
      });
    },
    async searchPlace(query) {
      if (query == "") return;
      this.loading = true;
      this.placeList = await this.$store.dispatch("map/queryPlace", {
        query,
        region: "全国"
      });
      this.loading = false;
    },
    async choosePlace(val) {
      const { location } = await this.$store.dispatch("map/queryPlaceDetail", {
        uid: val,
        scope: 1
      });
      this.model.lng = keep7Num(location.lng);
      this.model.lat = keep7Num(location.lat);
      // 地图上添加标记点
      this.dialogMap.addMark(location.lng, location.lat, true);
    },
    lock() {
      this.isLock = !this.isLock;
      this.isLock
        ? this.cameraMap.disableMarksDragging()
        : this.cameraMap.enableMarksDragging();
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
  .operate-btn {
    margin-right: 1rem;
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
.camera-map {
  position: relative;
  #camera-map {
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