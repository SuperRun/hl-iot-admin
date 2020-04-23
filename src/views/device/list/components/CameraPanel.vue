<template>
  <div class="camera-panel">
    <!-- 搜索栏 -->
    <div class="operate flex jc-between">
      <div class="flex">
        <button type="button" class="btn btn-add" @click="showDialog=true">添加</button>
        <button type="button" class="btn btn-del">删除</button>
        <div class="search flex">
          <el-input placeholder="搜索SN" v-model="sn">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="编号" width="120"></el-table-column>
          <el-table-column prop="mode" label="产品" width="120"></el-table-column>
          <el-table-column prop="mode" label="位号" width="120"></el-table-column>
          <el-table-column prop="mode" label="状态" width="120"></el-table-column>
          <el-table-column prop="mode" label="安装时间" width="120"></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <img class="device-pic" :src="scope.row.image" alt />
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作">
            <template>
              <a class="operate-btn" href>详情</a>
              <a class="operate-btn" href>编辑</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="page">
        <el-pagination background layout="total,prev, pager, next" :total="1" :page-size="5"></el-pagination>
      </div>
    </div>
    <!-- 地图 -->
    <div v-show="tableOrMap=='map'">
      <div id="camera-map"></div>
    </div>
    <!-- 弹出框 -->
    <el-dialog title="添加设备(摄像头)" :visible.sync="showDialog" center @opened="dialogOpened">
      <el-form :model="model" :inline="true" :rules="rules" ref="form">
        <el-form-item label="编号" :label-width="formLabelWidth" prop="num">
          <el-input v-model="model.num" autocomplete="off" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <!-- 显示产品名称和型号 -->
        <el-form-item label="产品" :label-width="formLabelWidth" prop="product">
          <el-select v-model="model.product" placeholder="请选择产品">
            <el-option
              :key="product.value"
              :label="product.label"
              :value="product.value"
              v-for="product in products"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位号" :label-width="formLabelWidth" prop="position">
          <el-input v-model="model.position" autocomplete="off" maxlength="20" show-word-limit></el-input>
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
import BMap from "BMap";
import { keep7Num } from "@/utils/util";
// import _ from "lodash";
export default {
  name: "CameraPanel",
  data() {
    return {
      showDialog: true,
      tableOrMap: "table",
      sn: "",
      formLabelWidth: "100px",
      place: "", // 检索地名
      placeList: [], // 地名列表
      loading: false,
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
      ],
      model: {
        num: "", // 编号
        product: "", // 产品
        position: "", // 位号
        gateway: "", // 网关
        lng: "", // 经度
        lat: "" // 纬度
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
        num: [{ required: true, message: "请填写设备编号", trigger: "blur" }],
        product: [{ required: true, message: "请选择产品", trigger: "blur" }],
        position: [{ required: true, message: "请填写位号", trigger: "blur" }],
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
    this.cameraMap = new BMap.Map("camera-map"); // 创建地图实例
    var point = new BMap.Point(116.404, 39.915); // 创建点坐标
    this.cameraMap.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
    this.cameraMap.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
  },
  methods: {
    headColor({ row, rowIndex }) {
      return "bg-grey-6";
    },
    handleSelectionChange() {},
    dialogOpened() {
      console.log("dialogOpened");
      // 弹出框地图
      this.dialogMap = new BMap.Map("dialog-map"); // 创建地图实例
      this.dialogMap.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      var scaleCtrl = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT
      }); // 添加比例尺控件
      this.dialogMap.addControl(scaleCtrl);
      const self = this;
      this.dialogMap.addEventListener("click", function(e) {
        self.model.lng = keep7Num(e.point.lng);
        self.model.lat = keep7Num(e.point.lat);
        self.addMark(self.dialogMap, e.point.lng, e.point.lat);
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
      this.addMark(this.dialogMap, location.lng, location.lat);
    },
    addMark(map, lng, lat) {
      var point = new BMap.Point(lng, lat); // 创建点坐标
      const zoom = map.getZoom() < 15 ? 15 : map.getZoom();
      map.centerAndZoom(point, zoom); // 初始化地图，设置中心点坐标和地图级别
      map.clearOverlays(); // 清除覆盖物
      var marker = new BMap.Marker(point);
      map.addOverlay(marker);
    }
  }
};
</script>

<style lang="scss" scoped>
.operate {
  margin-top: 2rem;
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
#camera-map {
  width: 100%;
  height: 350px;
  margin-top: 2rem;
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