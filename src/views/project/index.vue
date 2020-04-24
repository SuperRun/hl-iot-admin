<template>
  <div class="project-manage bg-white-3 min-h-1 bx-shadow-2">
    <!-- 搜索栏 -->
    <div class="operate flex">
      <button type="button" class="btn btn-add" @click="showDialog=true">添加</button>
      <button type="button" class="btn btn-del">删除</button>
      <div class="search flex">
        <el-input placeholder="搜索名称/城市" v-model="keyword">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
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
        <el-table-column prop="name" label="名称" width="220"></el-table-column>
        <el-table-column prop="mode" label="城市" width="220"></el-table-column>
        <el-table-column prop="mode" label="管理员" width="220"></el-table-column>
        <el-table-column prop="mode" label="创建时间" width="220"></el-table-column>
        <el-table-column prop="operation" label="操作">
          <template>
            <a href>编辑</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="page">
        <el-pagination background layout="total,prev, pager, next" :total="1" :page-size="5"></el-pagination>
      </div>
    </div>
    <!-- 弹出框 -->
    <el-dialog title="创建项目" :visible.sync="showDialog" center @opened="dialogOpened" width="600px">
      <el-form :model="model" :rules="rules" ref="form" label-position="left">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="model.name" autocomplete="off" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="城市" :label-width="formLabelWidth" prop="city">
          <el-input v-model="model.position" autocomplete="off" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <div class="flex jc-between">
          <el-form-item label="经度" :label-width="formLabelWidth" prop="lng">
            <el-input v-model="model.lng" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="纬度" :label-width="formLabelWidth" prop="lat">
            <el-input v-model="model.lat" :readonly="true"></el-input>
          </el-form-item>
        </div>
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
        <el-form-item label="描述" :label-width="formLabelWidth" prop="desc">
          <el-input type="textarea" v-model="model.desc" maxlength="50" show-word-limit></el-input>
        </el-form-item>
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
export default {
  name: "ProjectManage",
  data() {
    return {
      keyword: "",
      showDialog: false,
      loading: false,
      formLabelWidth: "60px",
      place: "", // 检索地名
      placeList: [], // 地名列表
      dialogMap: {}, // 弹出框地图
      model: {
        name: "", // 名称
        product: "", // 城市
        lng: "", // 经度
        lat: "" // 纬度
      },
      rules: {
        name: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
        city: [{ required: true, message: "请选择城市", trigger: "blur" }],
        lng: [{ required: true, message: "请标记地点", trigger: "blur" }],
        lat: [{ required: true, message: "请标记地点", trigger: "blur" }],
        desc: [{ required: true, message: "请填写项目描述", trigger: "blur" }]
      }
    };
  },
  methods: {
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
    handleSelectionChange() {}
  }
};
</script>

<style lang="scss" scoped>
.project-manage {
  padding: 2rem;
  border-radius: 6px;
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
    margin-bottom: 2rem;
    .search-location {
      position: absolute;
      left: 80px;
      top: 10px;
      width: 200px;
      z-index: 1;
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
}
</style>