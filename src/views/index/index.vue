<template>
  <div class="index w-100 flex flex-column">
    <header class="w-100 flex jc-between ai-center">
      <div class="flex-1">
        <el-select class="proj-select" v-model="proj" filterable placeholder="全部项目">
          <el-option
            v-for="item in projects"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="header-center flex flex-2 flex-column ai-center">
        <img src="@/assets/images/index-logo.png" alt />
        <h1 class="title">城市智慧路灯物联云平台</h1>
      </div>
      <div class="flex ai-center jc-around flex-1">
        <router-link to="/index">
          <span class="text-grey-4">管理中心</span>
        </router-link>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link text-grey-4">
            账号
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>账号：</el-dropdown-item>
            <el-dropdown-item>角色：</el-dropdown-item>
            <el-dropdown-item>
              <button type="button" class="btn-light btn">更改密码</button>
              <button type="button" class="btn-dark btn">退出登录</button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <main class="flex">
      <div class="map flex-3">
        <div class="tool flex jc-between ai-center">
          <div class="flex search-input">
            <input type="text" placeholder="搜索设备编号" />
            <svg-icon icon-class="search"></svg-icon>
          </div>
          <i :class="['el-icon-s-unfold','fold', isFold?'fold-rotate':'']" @click="foldEquips"></i>
        </div>
        <baidu-map></baidu-map>
      </div>
      <transition name="fade">
        <div class="flex-1 equips" v-show="!isFold">
          <ul class="flex">
            <li
              :class="['equip-tab', 'flex-1','flex', 'flex-column', 'jc-between', 'ai-center', currentTab == 1?'active':'']"
              @click="currentTab = 1"
            >
              <img :src="require(`@/assets/images/control${currentTab==1?'-active':''}.png`)" alt />
              <span :class="{'active': currentTab==1}">智慧监控</span>
            </li>
            <li
              :class="['equip-tab', 'flex-1','flex', 'flex-column', 'jc-between', 'ai-center', currentTab == 2?'active':'']"
              @click="currentTab = 2"
            >
              <img :src="require(`@/assets/images/screen${currentTab==2?'-active':''}.png`)" alt />
              <span :class="{'active': currentTab==2}">智慧屏</span>
            </li>
            <li
              :class="['equip-tab', 'flex-1','flex', 'flex-column', 'jc-between', 'ai-center', currentTab == 3?'active':'']"
              @click="currentTab = 3"
            >
              <img :src="require(`@/assets/images/light${currentTab==3?'-active':''}.png`)" alt />
              <span :class="{'active': currentTab==3}">智慧照明</span>
            </li>
            <li
              :class="['equip-tab', 'flex-1','flex', 'flex-column', 'jc-between', 'ai-center', currentTab == 4?'active':'']"
              @click="currentTab = 4"
            >
              <img :src="require(`@/assets/images/detect${currentTab==4?'-active':''}.png`)" alt />
              <span :class="{'active': currentTab==4}">智慧检测</span>
            </li>
          </ul>
          <h3>当前警告</h3>
          <el-collapse class="alarms-list" accordion>
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
          </el-collapse>
        </div>
      </transition>
    </main>
    <footer class="flex jc-around">
      <!-- 摄像头 -->
      <div class="flex-1">
        <div class="device-item">
          <div class="top flex jc-between">
            <div>
              <svg-icon icon-class="camera"></svg-icon>
              <span class="device-name">摄像头：</span>
            </div>
            <div>
              <span class="state-name text-normal">正常：</span>
              <span class="state-name text-fault">故障：</span>
              <span class="state-name text-offline">离线：</span>
            </div>
          </div>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">设备编号</span>
            <span class="text-light detail-btn">详情/设置 ></span>
          </div>
          <div class="content flex flex-column"></div>
        </div>
      </div>
      <!-- LED屏 -->
      <div class="flex-1">
        <div class="device-item">
          <div class="top flex jc-between">
            <div>
              <svg-icon icon-class="screen"></svg-icon>
              <span class="device-name">LED屏：</span>
            </div>
            <div>
              <span class="state-name text-normal">正常：</span>
              <span class="state-name text-fault">故障：</span>
              <span class="state-name text-offline">离线：</span>
            </div>
          </div>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">设备编号</span>
            <span class="text-light detail-btn">详情/设置 ></span>
          </div>
          <div class="content flex flex-column"></div>
        </div>
      </div>
      <!-- 照明灯 -->
      <div class="flex-1">
        <div class="device-item">
          <div class="top flex jc-between">
            <div>
              <svg-icon icon-class="light"></svg-icon>
              <span class="device-name">照明灯：</span>
            </div>
            <div>
              <span class="state-name text-normal">正常：</span>
              <span class="state-name text-fault">故障：</span>
              <span class="state-name text-offline">离线：</span>
            </div>
          </div>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">设备编号</span>
            <span class="text-light detail-btn">详情/设置 ></span>
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
      <div class="flex-1">
        <div class="device-item">
          <div class="top flex jc-between">
            <div>
              <svg-icon icon-class="detect"></svg-icon>
              <span class="device-name">气象站：</span>
            </div>
            <div>
              <span class="state-name text-normal">正常：</span>
              <span class="state-name text-fault">故障：</span>
              <span class="state-name text-offline">离线：</span>
            </div>
          </div>
          <div class="device flex jc-between">
            <span class="text-light fs-sm">设备编号</span>
            <span class="text-light detail-btn">详情/设置 ></span>
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
  </div>
</template>

<script>
import BaiduMap from "@/components/BaiduMap/index";
export default {
  name: "Index",
  components: {
    BaiduMap
  },
  filters: {
    limitStrLen(str) {
      console.log(str.length);
      return str.length > 41 ? str.slice(0, 41) : str;
    }
  },
  data() {
    return {
      currentTab: 1,
      isFold: false,
      projects: [
        { value: 1, label: "项目1" },
        { value: 2, label: "项目2" }
      ],
      proj: "",
      detail:
        "故障信息描述内容故障信息描述内容故障信息描述内容故障信息描述内容故障信息描述内容故障信息描述内容信息描述内容"
    };
  },
  methods: {
    foldEquips() {
      this.isFold = !this.isFold;
    }
  }
};
</script>
<style>
input.el-input__inner {
  background: linear-gradient(90deg, rgba(9, 56, 170, 1), rgba(32, 62, 171, 1));
  border: none;
  border-radius: 19px;
  color: #ffffffff;
}
.btn {
  border-radius: 2px;
  padding: 0.3rem 0.8rem;
}
button:last-of-type {
  margin-left: 0.5rem;
}
.alarms-list {
  width: 320px;
  margin: 0 auto;
  border: none;
}
.alarms-list .el-collapse-item__header {
  height: 2rem;
  background: transparent;
  border: none;
  color: #fefefeff;
  font-size: 14px;
}
.el-collapse-item__header.focusing:focus:not(:hover) {
  color: #fefefeff;
}
.alarms-list .el-collapse-item__wrap {
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
  background-image: url(../../assets/images/index-bg.png);
  header {
    height: 100px;
    background-image: url(../../assets/images/index-header-bg.png);
    background-size: 100% auto;
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
    height: 420px;
    padding: 0 1rem;
    margin-top: 1rem;
    .map {
      transition: width 0.5s;
      position: relative;
      .tool {
        width: 220px;
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
        .fold {
          color: #d7d7d7;
          font-size: 20px;
          transition: all 0.5s;
          cursor: pointer;
        }
        .fold-rotate {
          transform: rotate(180deg);
        }
      }
    }
    .equips {
      background-image: url(../../assets/images/equips-bg.png);
      background-size: 100% auto;
      background-repeat: no-repeat;
      ul {
        width: 97%;
        margin: 0 auto;
      }
      li {
        height: 72px;
        padding: 1.4rem 0;
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
        width: 320px;
        margin: 1rem auto;
        color: #fefefeff;
        font-size: 1rem;
      }
    }
  }
  footer {
    margin-top: 2rem;
    .device-item {
      width: 94%;
      margin: 0 auto;
      height: 280px;
      background-image: url(../../assets/images/device-item-bg.png);
      background-size: 100% auto;
      background-repeat: no-repeat;
      .top {
        width: 95%;
        margin: 0 auto;
        padding: 3.5% 1%;
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
          padding: 0.5rem 0;
        }
      }
      // .light-content {
      //   height: 120px;
      //   overflow: scroll;
      // }
    }
  }
}
.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter,
.fade-leave-to {
  transform: translateX(300px);
  opacity: 0;
}
</style>