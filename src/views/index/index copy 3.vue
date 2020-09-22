<template>
  <div class="index w-100 flex flex-column">
    <header class="w-100 flex jc-between ai-center">
      <div class="flex-3">
        <el-select
          class="proj-select"
          v-model="projId"
          filterable
          @change="change"
        >
          <el-option
            v-for="item in projList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="header-center flex flex-3 ai-center jc-center">
        <!-- <img src="@/assets/images/index-logo.png" alt /> -->
        <h1 class="title">{{ platName }}</h1>
      </div>
      <div class="flex ai-center jc-end flex-3">
        <router-link to="/device/list">
          <span class="btn-admin text-grey-4 gradient-blue-4">管理中心</span>
        </router-link>
        <user-account class="mg-left-1"></user-account>
      </div>
    </header>
    <main class="flex flex-column">
      <div class="menu-list flex w-100 jc-around">
        <div
          class="menu-item flex ai-center jc-around"
          :class="[
            `menu-item-bg${index}`,
            !currentTab.includes(index) ? 'menu-item-inactive' : '',
          ]"
          :key="index"
          v-for="(menu, index) in menus"
          @click="chooseDevice(menu.id, index)"
        >
          <svg-icon :icon-class="menu.iconName" class="menu-icon"></svg-icon>
          <div class="item-info flex flex-column">
            <h2 class="text-white">{{ menu.title }}</h2>
            <span class="text-white fs-md" v-if="menu.online != null">
              在线：
              <strong class="txt-num">{{ menu.online }}</strong>
            </span>
            <span class="text-white fs-md mg-top5" v-if="menu.total != null">
              总数：
              <strong class="txt-num">{{ menu.total }}</strong>
            </span>
          </div>
        </div>
      </div>
      <div class="content flex">
        <!-- 当前告警+搜索框 -->
        <div
          class="flex cur-fault"
          :class="
            isFold ? 'cur-fault-translate-right' : 'cur-fault-translate-left'
          "
        >
          <div class="tool flex jc-between ai-center">
            <el-select
              class="search-input"
              v-model="searchKey"
              filterable
              remote
              :remote-method="searchDevice"
              placeholder="搜索设备编号"
              :loading="loading"
              @change="searchChange"
            >
              <el-option
                v-for="device in deviceOptions"
                :key="device.device_number"
                :label="device.device_number"
                :value="device.device_number"
              ></el-option>
            </el-select>
            <div class="flex">
              <i
                :class="['lock', isLock ? 'el-icon-lock' : 'el-icon-unlock']"
                @click="lockMap"
              ></i>
              <i
                :class="[
                  'el-icon-s-unfold',
                  'fold',
                  isFold ? 'fold-rotate' : '',
                ]"
                @click="foldEquips"
              ></i>
            </div>
          </div>
          <div class="flex-1 equips">
            <h3>当前警告</h3>
            <el-collapse
              class="alarms-list"
              accordion
              v-if="faultList != null && faultList.length > 0"
            >
              <el-collapse-item
                v-for="(fault, index) in faultList"
                :key="index"
              >
                <template slot="title">
                  设备SN:{{ fault.device.device_number }}
                  <!-- <span class="alarm-num">01</span> -->
                </template>
                <div class="detail flex jc-between">
                  <span @click="faultDetail(fault.device.id)">{{
                    '设备故障' | limitStrLen
                  }}</span>
                  <span
                    class="text-light detail-btn"
                    @click="faultDetail(fault.device.id)"
                    >详情/设置 ></span
                  >
                </div>
              </el-collapse-item>
            </el-collapse>
            <template v-else>
              <no-fault class="mg-top-1"></no-fault>
            </template>
          </div>
        </div>
        <!-- 地图 -->
        <baidu-map
          v-if="defaultSelects != null"
          @setDefaultDetail="setDefaultDetail"
          @showDetail="showDetail"
          :defaultSelects="defaultSelects"
          :isLock="isLock"
          :types="types"
          :selectedDevice="selectedDevice"
        ></baidu-map>
        <!-- 智慧路灯 -->
        <div class="fun-intro"></div>
      </div>
    </main>
    <footer class="flex jc-start">
      <!-- 摄像头 -->
      <div
        class="device-content"
        v-show="currentTab.includes(0) && hasDevice(11)"
      >
        <div class="device-item">
          <h3>摄像头+音频广播+语音对讲</h3>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">
              设备编号:{{
                cameraDetail != null ? cameraDetail.device_number : '无'
              }}
            </span>
            <span
              class="text-light detail-btn"
              v-if="cameraDetail != null"
              @click="openDeviceDetail(cameraDetail.id)"
              >详情/设置 ></span
            >
          </div>
          <div class="content flex flex-column">
            <template v-if="cameraDetail != null">
              <iframe
                :src="videoSrc"
                width="100%"
                height="500"
                id="ysOpenDevice"
                class="mg-top-1"
                allowfullscreen
              ></iframe>
            </template>
            <template v-else>
              <no-device></no-device>
            </template>
          </div>
        </div>
      </div>
      <!-- LED屏 -->
      <div
        class="device-content"
        v-show="currentTab.includes(1) && hasDevice(12)"
      >
        <div class="device-item">
          <h3>LED屏</h3>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">
              设备编号:{{
                screenDetail != null ? screenDetail.device_number : '无'
              }}
            </span>
            <span
              class="text-light detail-btn"
              v-if="screenDetail != null"
              @click="openDeviceDetail(screenDetail.id)"
              >详情/设置 ></span
            >
          </div>
          <div class="content flex flex-column text-white">
            <template v-if="screenDetail != null">
              <div
                class="flex flex-column"
                v-if="
                  screenDetail.status == 2 &&
                    screenDetail.is_open == 1 &&
                    files != null
                "
              >
                <a
                  class="text-white"
                  v-for="(file, index) in files"
                  :key="index"
                  :href="file.link"
                  >{{ file.filename | filenameFilter }}</a
                >
              </div>
              <p v-if="screenDetail.is_open == 2">LED屏未开启</p>
              <p class="text-white fs-sm" v-if="screenDetail.status == 4">
                设备离线，无法获取数据
              </p>
            </template>
            <template v-else>
              <no-device></no-device>
            </template>
          </div>
        </div>
      </div>
      <!-- 照明灯 -->
      <div
        class="device-content"
        v-show="currentTab.includes(2) && hasDevice(13)"
      >
        <div class="device-item">
          <h3>照明灯</h3>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">
              设备编号:{{
                lightDetail != null ? lightDetail.device_number : '无'
              }}
            </span>
            <span
              class="text-light detail-btn"
              v-if="lightDetail != null"
              @click="openDeviceDetail(lightDetail.id)"
              >详情/设置 ></span
            >
          </div>
          <div class="content flex flex-column">
            <template v-if="lightDetail != null">
              <template v-if="lightDetail.status == 4">
                <span class="text-white fs-sm">设备离线，无法获取数据</span>
              </template>
              <template v-else-if="lightDetail.light_report_data != null">
                <div class="parameter flex">
                  <span class="flex-1 text-light fs-sm"
                    >亮度：{{ lightDetail.light_report_data.brightness }}</span
                  >
                  <span class="flex-1 text-light fs-sm"
                    >功率：{{ lightDetail.light_report_data.power }}mW</span
                  >
                </div>
                <div class="parameter flex">
                  <span class="flex-1 text-light fs-sm"
                    >电压：{{ lightDetail.light_report_data.voltage }}V</span
                  >
                  <span class="flex-1 text-light fs-sm"
                    >电流：{{
                      lightDetail.light_report_data.electric_current
                    }}mA</span
                  >
                </div>
                <div class="parameter flex">
                  <span class="flex-1 text-light fs-sm"
                    >温度：{{
                      lightDetail.light_report_data.temperature
                    }}ºC</span
                  >
                </div>
                <div class="parameter flex">
                  <span class="flex-1 text-light fs-sm">定时控灯:</span>
                </div>
                <template v-if="controlList != null && controlList.length > 0">
                  <div
                    class="parameter flex"
                    v-for="(control, index) in controlList"
                    :key="index"
                  >
                    <span class="flex-1 text-light fs-sm"
                      >{{ control.hour }}:{{ control.minute }}</span
                    >
                    <span class="flex-1 text-light fs-sm"
                      >{{ control.brightness }}%</span
                    >
                  </div>
                </template>
                <span class="text-white fs-sm" v-else>暂无数据</span>
              </template>
              <template v-else>
                <span class="text-white fs-sm">暂无数据</span>
              </template>
            </template>
            <template v-else>
              <no-device></no-device>
            </template>
          </div>
        </div>
      </div>
      <!-- 气象站 -->
      <div
        class="device-content"
        v-show="currentTab.includes(3) && hasDevice(14)"
      >
        <div class="device-item">
          <h3>气象站</h3>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">
              设备编号:{{
                weatherDetail != null ? weatherDetail.device_number : '无'
              }}
            </span>
            <span
              class="text-light detail-btn"
              v-if="weatherDetail != null"
              @click="openDeviceDetail(weatherDetail.id)"
              >详情/设置 ></span
            >
          </div>
          <div class="content flex flex-column">
            <template v-if="weatherDetail != null">
              <template v-if="weatherDetail.status == 4">
                <span class="text-white fs-sm">设备离线，无法获取数据</span>
              </template>
              <template v-else-if="weatherDetail.weather_info != null">
                <div class="parameter flex">
                  <span class="flex-1 text-light fs-sm"
                    >PM2.5：{{ weatherDetail.weather_info.pm2 }}μg/m³</span
                  >
                  <span class="flex-1 text-light fs-sm"
                    >PM10：{{ weatherDetail.weather_info.pm10 }}μg/m³</span
                  >
                </div>
                <div class="parameter flex">
                  <span class="flex-1 text-light fs-sm"
                    >气温：{{ weatherDetail.weather_info.t }}ºC</span
                  >
                  <span class="flex-1 text-light fs-sm"
                    >湿度：{{ weatherDetail.weather_info.h }}%rh</span
                  >
                </div>
                <div class="parameter flex">
                  <span class="flex-1 text-light fs-sm"
                    >噪声：{{ weatherDetail.weather_info.ns }}db</span
                  >
                  <span class="flex-1 text-light fs-sm"
                    >风力：{{ weatherDetail.weather_info.ws }}m/s</span
                  >
                </div>
                <div class="parameter flex">
                  <span class="flex-1 text-light fs-sm"
                    >风向：{{
                      weatherDetail.weather_info.wd | directionFilter
                    }}</span
                  >
                </div>
              </template>
              <template v-else>
                <span class="text-white fs-sm">暂无数据</span>
              </template>
            </template>
            <template v-else>
              <no-device></no-device>
            </template>
          </div>
        </div>
      </div>
    </footer>
    <!-- 编辑密码 -->
    <edit-pwd></edit-pwd>
    <!-- 设备详情弹出框 -->
    <device-detail
      :curContent="content"
      v-if="isShow"
      @hideDetail="hideDetail"
    ></device-detail>
    <!-- 气象站设备详情弹出框 -->
    <weather-detail></weather-detail>
  </div>
</template>

<script>
import BaiduMap from '@/components/VueBaiduMap';
import UserAccount from '@/components/UserAccount/index';
import DeviceDetail from '@/components/DeviceDetail';
import WeatherDetail from '@/components/WeatherDetail';
import EditPwd from '@/components/EditPwd';
import NoFault from '@/components/NoFault';
import NoDevice from '@/components/NoDevice';
import { mapGetters } from 'vuex';
import { countDevice, firstDevice } from '@/api/device';
import { getCameraToken, setCameraDirection } from '@/api/device';
import { setGroupBrightness, controlGroup } from '@/api/group';
import { getPlatform } from '@/utils/auth';
import request from '@/utils/request';
export default {
  name: 'Index',
  components: {
    BaiduMap,
    UserAccount,
    DeviceDetail,
    EditPwd,
    NoFault,
    NoDevice,
    WeatherDetail,
  },
  filters: {
    limitStrLen(str) {
      return str != null && str.length > 41 ? str.slice(0, 41) : str;
    },
    filenameFilter(filename) {
      console.log('filename', filename);
      return filename.split('_-').pop();
    },
  },
  computed: {
    ...mapGetters(['projList', 'cur_proj', 'tabs']),
    videoSrc() {
      return `https://open.ys7.com/ezopen/h5/iframe?url=ezopen://${this.cameraDetail.validate_code}@open.ys7.com/${this.cameraDetail.device_number}/1.hd.live&audio=1&autoplay=1&accessToken=${this.cameraToken}`;
    },
  },
  watch: {
    cur_proj() {
      this.getDefaultDevice();
      this.countDeviceNum();
      this.getToken();
      this.getFaults();
    },
  },
  data() {
    return {
      deviceType: 1,
      currentTab: [4, 5, 6],
      types: [],
      isFold: false,
      isLock: true,
      faultList: [],
      projId: '',
      menus: [
        {
          iconName: 'menu-icon1',
          title: '智慧监控',
          online: 12,
          total: 10,
          id: 11,
        },
        {
          iconName: 'menu-icon2',
          title: '智慧显示',
          online: 12,
          total: 10,
          id: 12,
        },
        {
          iconName: 'menu-icon3',
          title: '智慧照明',
          online: 12,
          total: 10,
          id: 13,
        },
        {
          iconName: 'menu-icon4',
          title: '气象检测',
          online: 12,
          total: 10,
          id: 14,
        },
        {
          iconName: 'menu-icon5',
          title: '城市热点',
          online: null,
          total: null,
          id: null,
        },
        {
          iconName: 'menu-icon6',
          title: '智慧充电',
          online: null,
          total: null,
          id: null,
        },
        {
          iconName: 'menu-icon7',
          title: '一键求助',
          online: null,
          total: null,
          id: null,
        },
      ],
      cameraDetail: null,
      screenDetail: null,
      lightDetail: null,
      weatherDetail: null,
      files: null,
      cameraToken: '',
      defaultSelects: null,
      defaultSelectsNoChange: null, // 记录初始状态默认选中的设备
      params: {
        product_type: 3, // 产品类型 3-照明灯
        status: 3, // 状态
      },
      controlList: [],
      loading: false,
      searchKey: '',
      deviceOptions: [],
      selectedDevice: '',
      isShow: false,
      platName: '',
      logo: '',
    };
  },
  async created() {
    // 获取设备的权限
    this.menus.forEach((menu, index) => {
      if (!!menu.id && this.tabs.includes(menu.id)) {
        this.currentTab.push(index);
        this.types.push(index + 1);
      }
    });
    // 获取项目列表
    if (this.projList != null && this.projList.length == 0) {
      await this.$store.dispatch('project/allProject');
    }
    this.projId = this.cur_proj;
    // 获取设备数目统计
    this.countDeviceNum();
    // 获取初始状态默认设备详情
    this.getDefaultDevice();
    this.getToken();
    this.getFaults();
    this.getPlatformConfig();
  },
  methods: {
    getPlatformConfig() {
      const config = getPlatform();
      if (!config) {
        const p = JSON.parse(config);
        // this.logo = p.logo;
        this.platName = p.title;
        return;
      }
      this.getLogo();
    },
    getLogo() {
      request({
        url: '/getSystem',
        methods: 'get',
      }).then((res) => {
        this.platName = res.data.title;
        this.logo = res.data.logo;
        setPlatform(res.data);
      });
    },
    async getFaults() {
      const res = await this.$store.dispatch('fault/listWarn', {
        type: 1,
        project_id: this.cur_proj,
        page: 1,
        limit: 10,
      });
      this.faultList = res.data.list;
    },
    getToken() {
      getCameraToken().then((res) => {
        this.cameraToken = res.data.accessToken;
      });
    },
    change() {
      this.$store.commit('project/SET_CURPROJ', this.projId);
    },
    lockMap() {
      this.isLock = !this.isLock;
    },
    foldEquips() {
      this.isFold = !this.isFold;
    },
    chooseDevice(id, type) {
      if (!this.hasDevice(id)) {
        return;
      }
      if (type < 4) {
        this.currentTab.includes(type)
          ? this.currentTab.splice(this.currentTab.indexOf(type), 1)
          : this.currentTab.push(type);
        this.types.includes(type + 1)
          ? this.types.splice(this.types.indexOf(type + 1), 1)
          : this.types.push(type + 1);
        let arr = [0, 0, 0, 0];
        this.types.map((type) => {
          arr[type - 1] = this.defaultSelectsNoChange[type - 1];
        });
        this.defaultSelects = arr;
      }
    },
    openDeviceDetail(id) {
      this.isShow = true;
      this.content = 'Content';
      this.$store.dispatch('device/detailDevice', { id }).then((res) => {
        if (
          res.product_type == 2 &&
          res.is_weather == 1 &&
          this.types.includes(4)
        ) {
          this.$store.commit('app/SET_DEVICE_DETAIL', res);
          this.$store.commit('app/OPEN_WEATHERDIALOG');
        } else {
          this.$store.commit('app/SET_DEVICE_DETAIL', res);
          this.$store.commit('app/OPEN_DEVICEDIALOG');
        }
      });
    },
    countDeviceNum() {
      countDevice({ project_id: this.cur_proj }).then((res) => {
        this.menus.map((menu, index) => {
          switch (index) {
            case 0:
              menu.online = res.data.camera_online_count;
              menu.total = res.data.camera_total_count;
              break;
            case 1:
              menu.online = res.data.led_online_count;
              menu.total = res.data.led_total_count;
              break;
            case 2:
              menu.online = res.data.light_online_count;
              menu.total = res.data.light_total_count;
              break;
            case 3:
              menu.online = res.data.weather_online_count;
              menu.total = res.data.weather_total_count;
              break;
          }
          return menu;
        });
      });
    },
    getDefaultDevice() {
      firstDevice({ project_id: this.cur_proj }).then((res) => {
        if (res.data) {
          this.cameraDetail = res.data.camera_data;
          this.screenDetail = res.data.led_data;
          this.lightDetail = res.data.light_data;
          this.weatherDetail = res.data.weather_data;
          this.defaultSelects = [
            this.cameraDetail != null ? this.cameraDetail.id : 0,
            this.screenDetail != null ? this.screenDetail.id : 0,
            this.lightDetail != null ? this.lightDetail.id : 0,
            this.weatherDetail != null ? this.weatherDetail.id : 0,
          ];
          this.defaultSelectsNoChange = this.defaultSelects;
          if (this.lightDetail != null && this.lightDetail.group != null) {
            this.getLightTimeControl(this.lightDetail.group.id);
          }

          if (
            this.screenDetail != null &&
            this.screenDetail.playerContent != null &&
            this.screenDetail.playerContent.content != null
          ) {
            const arr = JSON.parse(this.screenDetail.playerContent.content);
            this.files = arr.map((item) => {
              return { filename: item.url.split('/').pop(), link: item.url };
            });
          }
        }
      });
    },
    setDefaultDetail({ varName, data }) {
      this[varName] = data;
    },
    async getLightTimeControl(group_id) {
      const { list } = await this.$store.dispatch('group/detailControlGroup', {
        group_id,
      });
      this.controlList = list;
    },
    async searchDevice(keyword) {
      this.loading = true;
      let typesCopy = [];
      if (this.types.includes(4) && !this.types.includes(2)) {
        typesCopy = [...this.types];
        typesCopy[this.types.findIndex((type) => type == 4)] = 2;
      } else {
        typesCopy = [...this.types];
      }
      const { list } = await this.$store.dispatch('device/listDevice', {
        project_id: this.cur_proj,
        device_number: keyword,
        product_type_list: typesCopy.join(','),
      });
      if (this.types.includes(4) && !this.types.includes(2)) {
        this.deviceOptions = list.filter((item) => {
          if (item.product_type == 2) {
            if (item.is_weather == 1) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        });
      } else {
        this.deviceOptions = list;
      }
      this.loading = false;
    },
    searchChange(val) {
      this.selectedDevice = val;
    },
    faultDetail(id) {
      this.isShow = true;
      this.content = 'Fault';
      this.$store.dispatch('device/detailDevice', { id }).then((res) => {
        this.$store.commit('app/SET_DEVICE_DETAIL', res);
        this.$store.commit('app/OPEN_DEVICEDIALOG');
      });
    },
    hideDetail() {
      this.isShow = false;
    },
    showDetail() {
      this.isShow = true;
    },
    hasDevice(id) {
      return this.tabs.includes(id);
    },
  },
};
</script>
<style scoped>
.proj-select >>> .el-input__inner {
  background: linear-gradient(
    90deg,
    rgba(0, 112, 255, 0.77),
    rgba(0, 207, 255, 0.77)
  );
  border: none;
  border-radius: 19px;
  color: #ffffffff;
  width: 150px;
  /* height: 40px; */
}
.search-input >>> .el-input__inner {
  background: #385de9;
  border: none;
  border-radius: 19px;
  color: #ffffffff;
  width: 200px;
  /* height: 40px; */
}
.alarms-list {
  height: 50%;
  overflow: auto;
  width: 100%;
  margin: 1vh auto;
  border: none;
  padding: 0 1rem;
}
.alarms-list >>> .el-collapse-item__header {
  height: 2rem;
  background: transparent;
  border: none;
  color: #fefefeff;
  font-size: 14px;
}
.alarms-list >>> .el-collapse-item__header.focusing:focus:not(:hover) {
  color: #fefefeff;
}
.alarms-list >>> .el-collapse-item__wrap {
  background: transparent;
  border: none;
}
.alarm-num {
  width: 26px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  display: inline-block;
  background-color: #ff6d12ff;
  color: #fefefeff;
  font-size: 12px;
  border-radius: 0.8rem;
  margin-left: 0.5rem;
  transform: scale(0.8);
}
.detail {
  color: #fefefeff;
  -webkit-line-clamp: 2;
  -moz-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  /* pointer-events: none; */
}
/* .detail::after {
  content: '详情/设置 >';
  display: inline-block;
  padding: 2px 14px;
  border-radius: 10px;
  pointer-events: auto;
  font-size: 12px;
  background: linear-gradient(90deg, rgba(9, 56, 170, 1), rgba(11, 32, 103, 1));
  transform: scale(0.8);
  cursor: pointer;
} */
</style>
<style lang="scss" scoped>
.index {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/images/index-bg2.png);
  background-size: 100% 100%;
  overflow: hidden;
  .detail-btn {
    display: inline-block;
    padding: 2px 14px;
    border-radius: 10px;
    font-size: 12px;
    background: linear-gradient(
      90deg,
      rgba(9, 56, 170, 1),
      rgba(11, 32, 103, 1)
    );
    transform: scale(0.8);
    cursor: pointer;
  }
  header {
    height: 6vh;
    .proj-select {
      margin-left: 2rem;
    }
    .header-center {
      flex-basis: 320px;
      img {
        width: 160px;
        height: 53px;
      }
      .title {
        color: #fff;
        font-size: 1.4rem;
        letter-spacing: 0.5rem;
        margin: 0.5rem;
      }
    }
    .btn-admin {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 20px;
    }
  }
  main {
    height: 94vh;
    .menu-list {
      height: 23vh;
      // border: 1px solid #fff;
      padding: 2vh 1vw;
    }
    .menu-item {
      cursor: pointer;
      background-size: 100% 100%;
      width: 13vw;
    }
    .menu-item-inactive {
      filter: grayscale(1);
    }
    .menu-icon {
      font-size: 4rem;
    }
    .menu-item-bg0 {
      background-image: url(../../assets/images/menu-item-bg1.png);
    }
    .menu-item-bg1 {
      background-image: url(../../assets/images/menu-item-bg2.png);
    }
    .menu-item-bg2 {
      background-image: url(../../assets/images/menu-item-bg3.png);
    }
    .menu-item-bg3 {
      background-image: url(../../assets/images/menu-item-bg4.png);
    }
    .menu-item-bg4 {
      background-image: url(../../assets/images/menu-item-bg5.png);
    }
    .menu-item-bg5 {
      background-image: url(../../assets/images/menu-item-bg6.png);
    }
    .menu-item-bg6 {
      background-image: url(../../assets/images/menu-item-bg7.png);
    }
    .txt-num {
      font-size: 25px;
    }
    .content {
      height: 72vh;
      width: 100%;
      // border: 1px solid #fff;
      transition: width 0.5s;
      position: relative;
      padding: 1vh 1vw 3vh;
      .cur-fault {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 1;
        height: 50px;
        // pointer-events: none;
        .tool {
          // width: 240px;
          // .search-input {
          //   padding: 0.5rem 1.5rem;
          //   background: #385de9;
          //   border-radius: 19px;
          //   input {
          //     background: transparent;
          //     border: none;
          //     color: #fefefe;
          //   }
          //   ::-webkit-input-placeholder {
          //     /* WebKit browsers */
          //     color: #fefefe;
          //   }

          //   ::-moz-placeholder {
          //     /* Mozilla Firefox 19+ */
          //     color: #fefefe;
          //   }
          // }
          .fold,
          .lock {
            color: #a3a3a3;
            font-size: 20px;
            transition: all 0.5s;
            cursor: pointer;
          }
          .lock {
            font-size: 18px;
            font-weight: 600;
            margin-right: 0.5rem;
          }
          .fold-rotate {
            transform: rotate(180deg);
          }
        }
        .equips {
          width: 24vw;
          height: 30vh;
          background-image: url(../../assets/images/block-bg.png);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          padding: 1vh 1rem;
          h3 {
            width: 100%;
            margin: 0;
            color: #fefefeff;
            font-size: 1rem;
            height: 6vh;
            line-height: 6vh;
            padding: 0 1vw;
          }
        }
        &-translate-right {
          transition: all 0.5s;
          transform: translateX(24vw);
        }
        &-translate-left {
          transition: all 0.5s;
          transform: translateX(0);
        }
      }
      .fun-intro {
        position: absolute;
        top: 1rem;
        left: 2rem;
        width: 24vw;
        height: 35vh;
        background-image: url(../../assets/images/fun-intro.png);
        background-size: 100% 100%;
      }
    }
  }
  footer {
    width: 100%;
    position: absolute;
    bottom: 4vh;
    height: 30vh;
    padding: 0 1vw;
    .device-content {
      width: 25vw;
      // padding: 0 1rem;
    }
    .device-item {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      background-image: url(../../assets/images/block-bg.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      padding: 1vh 1rem;
      h3 {
        width: 100%;
        margin: 0;
        color: #fefefeff;
        font-size: 18px;
        height: 6vh;
        line-height: 6vh;
        padding: 0 1vw;
      }
      .device {
        // width: 95%;
        margin: 1vh auto;
        margin-bottom: 0;
        padding: 0 0.5rem;
      }
      .content {
        // width: 95%;
        margin: 0 auto;
        padding: 0 0.5rem;
        height: 120px;
        overflow: auto;
        .parameter {
          padding: 0.5rem 0;
        }
      }
      .light-content {
        height: 120px;
        overflow: auto;
      }
    }
  }
}
</style>
