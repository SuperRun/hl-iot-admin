<template>
  <div class="project-manage bg-white-3 min-h-1 bx-shadow-2">
    <!-- 搜索栏 -->
    <div class="operate flex">
      <button
        type="button"
        class="btn btn-add"
        @click="
          showDialog = true;
          mode = 'add';
        "
      >
        添加
      </button>
      <button type="button" class="btn btn-del" @click="del">删除</button>
      <div class="search flex">
        <el-input
          placeholder="搜索名称"
          v-model="params.title"
          class="mg-right-1"
          @input="search"
        ></el-input>
        <el-input
          placeholder="搜索省份"
          v-model="params.province"
          class="mg-right-1"
          @input="search"
        ></el-input>
        <el-input
          placeholder="搜索城市"
          v-model="params.city"
          class="mg-right-1"
          @input="search"
        ></el-input>
        <button type="button" class="reset btn-light" @click="reset">
          重置
        </button>
        <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          prop="title"
          label="名称"
          width="220"
        ></el-table-column>
        <el-table-column prop="mode" label="城市" width="220">
          <template slot-scope="scope">{{
            scope.row | convertCityName
          }}</template>
        </el-table-column>
        <el-table-column prop="mode" label="管理员" width="400">
          <template slot-scope="scope">{{
            scope.row.project_users | adminFilter
          }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="220">
          <template slot-scope="scope">{{
            scope.row.created_at | formatTime
          }}</template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <span class="btn-table" @click="edit(scope.row)">编辑</span>
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
    <!-- 弹出框 -->
    <el-dialog
      :title="title"
      :visible.sync="showDialog"
      center
      @opened="dialogOpened"
      width="600px"
      @closed="closed"
    >
      <el-form :model="model" :rules="rules" ref="form" label-position="left">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="title">
          <el-input
            v-model="model.title"
            autocomplete="off"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item
          label="城市"
          :label-width="formLabelWidth"
          prop="location"
        >
          <div class="flex">
            <el-select v-model="country" placeholder="国家" style="width:80px">
              <el-option label="中国" value="1"></el-option>
            </el-select>
            <v-distpicker
              :province="model.province"
              :city="model.city"
              hide-area
              @province="onChangeProvince"
              @city="onChangeCity"
              class="mg-left-1"
            ></v-distpicker>
          </div>

          <!-- <el-input v-model="model.position" autocomplete="off" maxlength="20" show-word-limit></el-input> -->
        </el-form-item>
        <div class="flex jc-between">
          <el-form-item
            label="经度"
            :label-width="formLabelWidth"
            prop="longitude"
          >
            <el-input v-model="model.longitude" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item
            label="纬度"
            :label-width="formLabelWidth"
            prop="latitude"
          >
            <el-input v-model="model.latitude" :readonly="true"></el-input>
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
        <el-form-item label="描述" :label-width="formLabelWidth" prop="remark">
          <el-input
            type="textarea"
            v-model="model.remark"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="dialog-btn btn-light" @click="showDialog = false"
          >取 消</el-button
        >
        <el-button class="dialog-btn btn-dark" type="primary" @click="confirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import BaiduMap from '@/utils/map-util';
import { keep7Num, getValByKey } from '@/utils/util';
import { showSuccessMsg, showWarningMsg, showInfoMsg } from '@/utils/message';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('project');

export default {
  name: 'ProjectManage',
  computed: {
    title() {
      return this.mode == 'add' ? '创建项目' : '编辑项目';
    },
  },
  data() {
    const validateLocation = (rule, value, callback) => {
      if (
        this.model.province == '' ||
        this.model.city == '' ||
        this.model.province == '省' ||
        this.model.city == '市'
      ) {
        callback(new Error('请选择省份、城市'));
      } else {
        callback();
      }
    };
    return {
      showDialog: false,
      loading: false,
      formLabelWidth: '60px',
      place: '', // 检索地名
      placeList: [], // 地名列表
      dialogMap: {}, // 弹出框地图
      country: '1',
      model: {
        title: '', // 标题
        province: '', // 省
        city: '', // 市
        // county: 2, // 区
        longitude: '', // 经度
        latitude: '', // 纬度
        remark: '', // 描述
      },
      rules: {
        title: [{ required: true, message: '请填写项目名称', trigger: 'blur' }],
        location: [
          { required: true, validator: validateLocation, trigger: 'blur' },
        ],
        longitude: [{ required: true, message: '请标记地点', trigger: 'blur' }],
        latitude: [{ required: true, message: '请标记地点', trigger: 'blur' }],
        remark: [{ required: true, message: '请填写描述', trigger: 'blur' }],
      },
      tableData: [],
      total: 0, // 总数
      page: 1,
      limit: 10,
      listLoading: false, // 表格数据加载
      params: {
        title: '',
        city: '',
        province: '',
      },
      mode: 'add',
      names: '', // 要删除所有项目的名称
      ids: '', // 要删除所有项目的id
      copyItem: {
        // 记录编辑前的经纬度
        latitude: '',
        longitude: '',
      },
    };
  },
  async mounted() {
    this.getList();
  },
  methods: {
    ...mapActions([
      'editProject',
      'addProject',
      'listProject',
      'detailProject',
      'delProject',
      'allProject',
    ]),
    async getList() {
      this.listLoading = true;
      const { total, list } = await this.listProject({
        ...this.params,
        page: this.page,
        limit: this.limit,
      });
      this.listLoading = false;
      this.tableData = list;
      this.total = total;
    },
    reset() {
      Object.keys(this.params).forEach((key) => {
        this.params[key] = '';
      });
      this.getList();
    },
    currentPage(page) {
      this.page = page;
      this.getList();
    },
    search: _.debounce(function(e) {
      this.getList();
    }, 500),
    dialogOpened() {
      // 弹出框地图
      this.dialogMap = new BaiduMap('dialog-map', {}, true, true);
      const self = this;
      this.dialogMap.addMapEvent('click', function(e) {
        self.model.longitude = keep7Num(e.point.lng);
        self.model.latitude = keep7Num(e.point.lat);
        self.dialogMap.addMark(e.point.lng, e.point.lat, {}, true);
      });

      // 经纬度重新赋值(city，provide 触发change事件经纬度被清空)
      this.model.longitude = this.copyItem.longitude;
      this.model.latitude = this.copyItem.latitude;

      // 编辑：添加标记点
      if (this.mode == 'edit') {
        const point = this.dialogMap.createPoint(
          this.model.longitude,
          this.model.latitude,
        );
        this.dialogMap.setPoint(point);
        this.dialogMap.addMark(
          this.model.longitude,
          this.model.latitude,
          {},
          true,
        );
      }
    },
    async searchPlace(keyword) {
      if (keyword == '') return;
      this.loading = true;
      this.placeList = await this.$store.dispatch('map/queryPlace', {
        keyword,
        region: this.model.city || this.model.province || '全国',
      });
      this.loading = false;
    },
    async choosePlace(val) {
      const { location } = await this.$store.dispatch('map/queryPlaceDetail', {
        uid: val,
      });
      this.model.longitude = keep7Num(location.lng);
      this.model.latitude = keep7Num(location.lat);
      // 地图上添加标记点
      this.dialogMap.addMark(location.lng, location.lat, {}, true);
    },
    onChangeProvince(province) {
      this.model.province = province.value;
      this.dialogMap.setCenterByCity(province.value);
      // 清空经纬度
      this.model.longitude = '';
      this.model.latitude = '';
    },
    onChangeCity(city) {
      this.model.city = city.value;
      this.dialogMap.setCenterByCity(city.value);
      // 清空经纬度
      this.model.longitude = '';
      this.model.latitude = '';
    },
    closed() {
      this.$refs['form'].resetFields();
      Object.keys(this.model).forEach((key) => (this.model[key] = ''));
      Object.keys(this.copyItem).forEach((key) => (this.copyItem[key] = ''));
      this.placeList = [];
      this.place = '';
    },
    confirm() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return;
        if (this.mode == 'add') {
          await this.addProject(this.model);
          showSuccessMsg('添加成功');
        } else {
          await this.editProject(this.model);
          showSuccessMsg('编辑成功');
        }
        this.showDialog = false;
        this.getList();
        this.allProject();
      });
    },
    edit(item) {
      this.mode = 'edit';
      this.showDialog = true;
      this.model = Object.assign({}, item);
      this.copyItem.longitude = item.longitude;
      this.copyItem.latitude = item.latitude;
    },
    handleSelectionChange(val) {
      this.names = getValByKey('title', val, ', ');
      this.ids = getValByKey('id', val);
    },
    del() {
      if (this.ids == '') {
        showInfoMsg('未选中任何项目');
        return;
      }
      const h = this.$createElement;
      this.$confirm(
        h('div', null, [
          h(
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            `已选中项目：${this.names}`,
          ),
          h(
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            '删除以上项目将删除关联的所有设备确认删除?',
          ),
        ]),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        },
      ).then(async (_) => {
        await this.delProject({ ids: this.ids });
        this.getList();
        showSuccessMsg('删除成功');
        // 重新获取导航条上项目下拉框
        await this.$store.dispatch('project/allProject');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.project-manage {
  padding: 2rem;
  border-radius: 6px;
  .operate {
    margin-top: 1rem;
    .btn {
      padding: 0 1rem;
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
