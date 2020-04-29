<template>
  <div class="index w-100 flex flex-column">
    <header class="w-100 flex jc-between ai-center">
      <div class="flex-1">
        <el-select class="proj-select" v-model="projId" filterable @change="change">
          <el-option v-for="item in projList" :key="item.id" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="header-center flex flex-2 flex-column ai-center">
        <img src="@/assets/images/index-logo.png" alt />
        <h1 class="title">城市智慧路灯物联云平台</h1>
      </div>
      <div class="flex ai-center jc-around flex-1">
        <router-link to="/device/list">
          <span class="text-grey-4">管理中心</span>
        </router-link>
        <user-account></user-account>
      </div>
    </header>
    <main class="flex">
      <div :class="['map', isFold?'w-100':'']">
        <div class="tool flex jc-between ai-center">
          <div class="flex search-input">
            <input type="text" placeholder="搜索设备编号" />
            <svg-icon icon-class="search"></svg-icon>
          </div>
          <div class="flex">
            <i :class="['lock', isLock?'el-icon-lock':'el-icon-unlock']" @click="lockMap"></i>
            <i :class="['el-icon-s-unfold','fold', isFold?'fold-rotate':'']" @click="foldEquips"></i>
          </div>
        </div>
        <baidu-map></baidu-map>
      </div>
      <transition name="fade">
        <div class="equips" v-show="!isFold">
          <ul class="flex">
            <li
              :class="['equip-tab', 'flex-1','flex', 'flex-column', 'jc-between', 'ai-center', currentTab.includes(1)?'active':'']"
              @click="chooseDevice(1)"
            >
              <img
                :src="require(`@/assets/images/control${currentTab.includes(1)?'-active':''}.png`)"
                alt
              />
              <span :class="{'active': currentTab.includes(1)}">智慧监控</span>
            </li>
            <li
              :class="['equip-tab', 'flex-1','flex', 'flex-column', 'jc-between', 'ai-center', currentTab.includes(2)?'active':'']"
              @click="chooseDevice(2)"
            >
              <img
                :src="require(`@/assets/images/screen${currentTab.includes(2)?'-active':''}.png`)"
                alt
              />
              <span :class="{'active': currentTab.includes(2)}">智慧屏</span>
            </li>
            <li
              :class="['equip-tab', 'flex-1','flex', 'flex-column', 'jc-between', 'ai-center', currentTab.includes(3)?'active':'']"
              @click="chooseDevice(3)"
            >
              <img
                :src="require(`@/assets/images/light${currentTab.includes(3)?'-active':''}.png`)"
                alt
              />
              <span :class="{'active':currentTab.includes(3)}">智慧照明</span>
            </li>
            <li
              :class="['equip-tab', 'flex-1','flex', 'flex-column', 'jc-between', 'ai-center', currentTab.includes(4)?'active':'']"
              @click="chooseDevice(4)"
            >
              <img
                :src="require(`@/assets/images/detect${currentTab.includes(4)?'-active':''}.png`)"
                alt
              />
              <span :class="{'active': currentTab.includes(4)}">智慧检测</span>
            </li>
          </ul>
          <h3 v-if="faultList.length>0">当前警告</h3>
          <el-collapse class="alarms-list" accordion v-if="faultList.length>0">
            <el-collapse-item>
              <template slot="title">
                设备SN
                <span class="alarm-num">01</span>
              </template>
              <div class="detail">{{detail|limitStrLen}}</div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title">
                设备SN
                <span class="alarm-num">01</span>
              </template>
              <div class="detail">控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title">
                设备SN
                <span class="alarm-num">01</span>
              </template>
              <div class="detail">{{detail|limitStrLen}}</div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title">
                设备SN
                <span class="alarm-num">01</span>
              </template>
              <div class="detail">控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title">
                设备SN
                <span class="alarm-num">01</span>
              </template>
              <div class="detail">{{detail|limitStrLen}}</div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title">
                设备SN
                <span class="alarm-num">01</span>
              </template>
              <div class="detail">控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title">
                设备SN
                <span class="alarm-num">01</span>
              </template>
              <div class="detail">控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            </el-collapse-item>
            <el-collapse-item>
              <template slot="title">
                设备SN
                <span class="alarm-num">01</span>
              </template>
              <div class="detail">控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            </el-collapse-item>
          </el-collapse>
          <no-fault class="mg-top-3" v-else></no-fault>
        </div>
      </transition>
    </main>
    <footer class="flex jc-between">
      <div class="flex-column footer-left">
        <!-- 摄像头详情 -->
        <div class="tip flex jc-between ai-center" v-show="currentTab.includes(1)">
          <div>
            <svg-icon icon-class="camera"></svg-icon>
            <span class="text-white">摄像头：</span>
          </div>
          <div>
            <span class="state-name text-normal">正常：</span>
            <span class="state-name text-fault">故障：</span>
            <span class="state-name text-offline">离线：</span>
          </div>
        </div>
        <!-- LED屏详情 -->
        <div class="tip flex jc-between ai-center" v-show="currentTab.includes(2)">
          <div>
            <svg-icon icon-class="screen"></svg-icon>
            <span class="text-white">LED屏：</span>
          </div>
          <div>
            <span class="state-name text-normal">正常：</span>
            <span class="state-name text-fault">故障：</span>
            <span class="state-name text-offline">离线：</span>
          </div>
        </div>
        <!-- 照明灯详情 -->
        <div class="tip flex jc-between ai-center" v-show="currentTab.includes(3)">
          <div>
            <svg-icon icon-class="light"></svg-icon>
            <span class="text-white">照明灯：</span>
          </div>
          <div>
            <span class="state-name text-normal">正常：</span>
            <span class="state-name text-fault">故障：</span>
            <span class="state-name text-offline">离线：</span>
          </div>
        </div>
        <!-- 气象站详情 -->
        <div class="tip flex jc-between ai-center" v-show="currentTab.includes(4)">
          <div>
            <svg-icon icon-class="detect"></svg-icon>
            <span class="text-white">气象站：</span>
          </div>
          <div>
            <span class="state-name text-normal">正常：</span>
            <span class="state-name text-fault">故障：</span>
            <span class="state-name text-offline">离线：</span>
          </div>
        </div>
      </div>
      <!-- 摄像头 -->
      <div class="device-content footer-right" v-show="false">
        <div class="device-item">
          <div class="top flex jc-start">
            <div>
              <svg-icon icon-class="camera"></svg-icon>
              <span class="device-name">摄像头</span>
            </div>
          </div>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">设备编号</span>
            <span class="text-light detail-btn" @click="openDeviceDetail(1)">详情/设置 ></span>
          </div>
          <div class="content flex flex-column"></div>
        </div>
      </div>
      <!-- LED屏 -->
      <div class="device-content flex-1" v-show="false">
        <div class="device-item">
          <div class="top flex jc-start">
            <div>
              <svg-icon icon-class="screen"></svg-icon>
              <span class="device-name">LED屏</span>
            </div>
          </div>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">设备编号</span>
            <span class="text-light detail-btn" @click="openDeviceDetail(2)">详情/设置 ></span>
          </div>
          <div class="content flex flex-column"></div>
        </div>
      </div>
      <!-- 照明灯 -->
      <div class="device-content flex-1" v-show="false">
        <div class="device-item">
          <div class="top flex jc-start">
            <div>
              <svg-icon icon-class="light"></svg-icon>
              <span class="device-name">照明灯</span>
            </div>
          </div>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">设备编号</span>
            <span class="text-light detail-btn" @click="openDeviceDetail(3)">详情/设置 ></span>
          </div>
          <div class="content flex flex-column">
            <div class="parameter flex">
              <span class="flex-1 text-light fs-sm">亮度：</span>
              <span class="flex-1 text-light fs-sm">功率：</span>
            </div>
            <div class="parameter flex">
              <span class="flex-1 text-light fs-sm">电压：</span>
              <span class="flex-1 text-light fs-sm">电流：</span>
            </div>
            <div class="parameter flex">
              <span class="flex-1 text-light fs-sm">温度：</span>
            </div>
            <div class="parameter flex">
              <span class="flex-1 text-light fs-sm">定时控灯</span>
            </div>
            <div class="parameter flex">
              <span class="flex-1 text-light fs-sm">6:00</span>
              <span class="flex-1 text-light fs-sm">0%</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 气象站 -->
      <div class="device-content flex-1" v-show="true">
        <div class="device-item">
          <div class="top flex jc-start">
            <div>
              <svg-icon icon-class="detect"></svg-icon>
              <span class="device-name">气象站</span>
            </div>
          </div>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">设备编号</span>
            <span class="text-light detail-btn" @click="openDeviceDetail(4)">详情/设置 ></span>
          </div>
          <div class="content flex flex-column">
            <div class="parameter flex">
              <span class="flex-1 text-light fs-sm">PM2.5：</span>
              <span class="flex-1 text-light fs-sm">PM10：</span>
            </div>
            <div class="parameter flex">
              <span class="flex-1 text-light fs-sm">光照：</span>
              <span class="flex-1 text-light fs-sm">气温：</span>
            </div>
            <div class="parameter flex">
              <span class="flex-1 text-light fs-sm">温度：</span>
              <span class="flex-1 text-light fs-sm">噪声：</span>
            </div>
            <div class="parameter flex">
              <span class="flex-1 text-light fs-sm">风力：</span>
              <span class="flex-1 text-light fs-sm">风向：</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <!-- 设备详情弹出框 -->
    <device-detail :deviceType="deviceType"></device-detail>
    <!-- 编辑密码 -->
    <edit-pwd></edit-pwd>
  </div>
</template>

<script>
import BaiduMap from "@/components/BaiduMap/index";
import UserAccount from "@/components/UserAccount/index";
import DeviceDetail from "@/components/DeviceDetail";
import EditPwd from "@/components/EditPwd";
import NoFault from "@/components/NoFault";
import { mapGetters } from "vuex";

export default {
  name: "Index",
  components: {
    BaiduMap,
    UserAccount,
    DeviceDetail,
    EditPwd,
    NoFault
  },
  filters: {
    limitStrLen(str) {
      return str.length > 41 ? str.slice(0, 41) : str;
    }
  },
  computed: {
    ...mapGetters(["projList", "cur_proj"])
  },
  data() {
    return {
      deviceType: 1,
      currentTab: [1, 2, 3, 4],
      isFold: false,
      isLock: true,
      faultList: [],
      projects: [
        { value: 1, label: "项目1" },
        { value: 2, label: "项目2" }
      ],
      projId: "",
      detail:
        "故障信息描述内容故障信息描述内容故障信息描述内容故障信息描述内容故障信息描述内容故障信息描述内容信息描述内容"
    };
  },
  async mounted() {
    // 获取项目列表
    if (this.projList.length == 0) {
      console.log("length", this.projList.length);
      await this.$store.dispatch("project/allProject");
    }
    this.projId = this.cur_proj;
  },
  methods: {
    change() {
      this.$store.commit("project/SET_CURPROJ", this.projId);
    },
    lockMap() {
      this.isLock = !this.isLock;
    },
    foldEquips() {
      this.isFold = !this.isFold;
    },
    chooseDevice(type) {
      this.currentTab.includes(type)
        ? this.currentTab.splice(this.currentTab.indexOf(type), 1)
        : this.currentTab.push(type);
    },
    openDeviceDetail(type) {
      this.deviceType = type;
      this.$store.dispatch("app/openDeviceDialog");
    }
  }
};
</script>
<style scoped>
.proj-select >>> .el-input__inner {
  background: linear-gradient(90deg, rgba(9, 56, 170, 1), rgba(32, 62, 171, 1));
  border: none;
  border-radius: 19px;
  color: #ffffffff;
}
.alarms-list {
  height: 50%;
  overflow: scroll;
  width: 100%;
  margin: 0 auto;
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
  background-color: #ff6d02ff;
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
  height: 46px;
  pointer-events: none;
}
.detail::after {
  content: "详情/设置 >";
  display: inline-block;
  padding: 2px 14px;
  border-radius: 10px;
  pointer-events: auto;
  font-size: 12px;
  background: linear-gradient(90deg, rgba(9, 56, 170, 1), rgba(11, 32, 103, 1));
  transform: scale(0.8);
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.index {
  position: relative;
  min-height: 100%;
  background-image: url(../../assets/images/index-bg.png);
  header {
    height: 100px;
    background-image: url(../../assets/images/index-header-bg.png);
    background-size: 100% 110%;
    background-repeat: no-repeat;
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
  }
  main {
    height: calc(100vh - 120px);
    padding: 0 1rem;
    margin-top: 1rem;
    .map {
      width: 75%;
      transition: width 0.5s;
      position: relative;
      .tool {
        width: 240px;
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 1;
        .search-input {
          padding: 0.5rem 1.5rem;
          background: linear-gradient(
            90deg,
            rgba(9, 56, 170, 1),
            rgba(11, 32, 103, 1)
          );
          border-radius: 19px;
          input {
            background: transparent;
            border: none;
            color: #fefefe;
          }
        }
        .fold,
        .lock {
          color: #d7d7d7;
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
    }
    .w-100 {
      width: 100%;
    }
    .equips {
      width: 25%;
      height: 68%;
      background-image: url(../../assets/images/equips-bg.png);
      background-size: 100% 90%;
      background-repeat: no-repeat;
      ul {
        width: 97%;
        margin: 0 auto;
      }
      li {
        height: 60px;
        padding: 1rem 0;
        cursor: pointer;
        transition: background 0.5s;
        &.active {
          background: rgba(10, 84, 255, 0.3);
        }
        img {
          width: 1.5rem;
          height: 1.5rem;
        }
        span {
          background: linear-gradient(
            0deg,
            rgba(158, 186, 255, 1) 0%,
            rgba(107, 141, 255, 1) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 12px;
          display: inline-block;
          transition: all 0.5s;
          &.active {
            background: #fefefe;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
      h3 {
        width: 100%;
        margin: 1rem auto;
        color: #fefefeff;
        font-size: 1rem;
        padding: 0 1rem;
      }
    }
  }
  footer {
    width: 100%;
    height: 30vh;
    padding: 0 1rem;
    position: absolute;
    left: 0;
    bottom: 0.5rem;
    .footer-left,
    .footer-right {
      align-self: flex-end;
      height: 100%;
    }
    .footer-left {
      width: 75%;
    }
    .footer-right {
      width: 25%;
    }
    .tip {
      width: 320px;
      height: 40px;
      padding: 0 1rem;
      background-image: url(../../assets/images/tip-bg.png);
      background-size: 100% 100%;
      margin-bottom: 0.3rem;
      margin-left: 0.5rem;
      span.text-white {
        padding: 0 0.5rem;
      }
    }
    // .device-content {
    //   width: 100%;
    // }
    .device-item {
      width: 100%;
      margin: 0 auto;
      background-image: url(../../assets/images/device-item-bg.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      .top {
        width: 95%;
        margin: 0 auto;
        padding: 2% 1%;
        span.state-name {
          display: inline-block;
          font-size: 12px;
          transform: scale(0.9);
        }
        span.device-name {
          font-size: 0.8rem;
          color: #fefefeff;
          padding: 0 0.5rem;
        }
      }
      .device {
        width: 95%;
        margin: 1rem auto;
        padding: 0 0.5rem;
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
      }
      .content {
        width: 95%;
        margin: 0 auto;
        padding: 0 0.5rem;
        height: 120px;
        overflow: scroll;
        .parameter {
          padding: 0.3rem 0;
        }
      }
    }
  }
}
</style>