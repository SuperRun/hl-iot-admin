<template>
  <div class="content">
    <!-- 摄像头 -->
    <div v-if="deviceType==1">
      <div class="flex jc-between">
        <el-button type="button" class="btn-add">实时</el-button>
        <div class="flex">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-button type="button" class="btn-add mg-left-1" @click="replay">回放</el-button>
        </div>
      </div>
      <!-- <iframe
        src="https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/203751922/1.live&autoplay=1&accessToken=ra.23xamzw35p27yshy6ea2hvud3riulmqo-173c7qgql3-0lxt9kc-jkzzoodlk"
        width="700"
        height="400"
        id="ysOpenDevice"
        allowfullscreen
      ></iframe>-->
    </div>
    <!-- LED屏幕 -->
    <div v-if="deviceType==2">
      显示屏开关
      <el-switch v-model="isOpend" active-color="#5372FB" inactive-color="#D6DAEF"></el-switch>
      <p class="text-dark">
        <span class="text-grey-2">当前播放:</span>
        {{!file.src?'暂无播放内容':file.name}}
      </p>
      <div class="flex">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <!-- <div slot="tip" class="el-upload__tip">
          视频要求：mp4，不超过500MB;
          图片要求：jpg、png，不超过10MB。
          </div>-->
          <el-button size="small" class="btn-upload mg-right-1">点击上传</el-button>
        </el-upload>
        <el-button class="btn-light" size="small" type="button" v-if="file.src" @click="clear">清除</el-button>
      </div>
    </div>
    <!-- 照明灯 -->
    <div class="flex flex-column" v-if="deviceType==3">
      <div class="refresh">
        <i class="el-icon-refresh"></i>
      </div>
      <ul class="flex mg-top-1">
        <li class="flex mg-right-5">
          <span class="text-grey-2">电压：</span>
        </li>
        <li class="flex mg-right-5">
          <span class="text-grey-2">电流：</span>
        </li>
        <li class="flex mg-right-5">
          <span class="text-grey-2">功率：</span>
        </li>
        <li class="flex">
          <span class="text-grey-2">温度：</span>
        </li>
      </ul>
      <div class="flex mg-top-1 ai-center">
        <span class="text-grey-2 mg-right-1 light">亮度：{{brightness}}%</span>
        <el-switch
          class="mg-right-1"
          v-model="isFull"
          active-color="#5372FB"
          inactive-color="#D6DAEF"
        ></el-switch>
        <div class="progress">
          <el-slider v-model="brightness"></el-slider>
        </div>
      </div>
      <div class="flex flex-column mg-top-3">
        <span class="text-dark">定时控灯：</span>
        <div class="time flex text-dark mg-top-1 jc-between">
          <span>08:00</span>
          <span>0%</span>
        </div>
        <div class="time flex text-dark mg-top-1 jc-between">
          <span>08:00</span>
          <span>0%</span>
        </div>
      </div>
    </div>
    <!-- 气象站 -->
    <div class="flex flex-column" v-if="deviceType==4">
      <div class="refresh">
        <i class="el-icon-refresh"></i>
      </div>
      <div class="flex text-grey-2">
        <div class="flex data-item flex-column">
          <span>PM2.5：</span>
          <span>气温：</span>
          <span>风力：</span>
        </div>
        <div class="flex data-item flex-column">
          <span>PM10：</span>
          <span>温度：</span>
          <span>风向：</span>
        </div>
        <div class="flex data-item flex-column">
          <span>光照：</span>
          <span>噪声：</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { showWarningMsg, showSuccessMsg, showInfoMsg } from "@/utils/message";
export default {
  name: "Content",
  props: {
    deviceType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dateRange: [],
      isOpend: true, // LED屏幕
      isFull: true, // 亮度
      brightness: 50,
      file: {
        name: "1.png",
        src: "",
        type: "img"
      }
    };
  },
  watch: {
    isFull() {
      this.isFull ? (this.brightness = 100) : (this.brightness = 0);
    },
    brightness() {
      this.brightness == 0 ? (this.isFull = false) : (this.isFull = true);
    }
  },
  methods: {
    replay() {
      if (this.dateRange.length == 0) {
        showWarningMsg("请选择回放时间");
        return;
      }
    },
    handleRemove() {},
    beforeRemove() {},
    handleExceed() {},
    clear() {
      this.$confirm("确认清除文件？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(_ => {
          showSuccessMsg("清除成功");
        })
        .catch(_ => {
          showInfoMsg("已取消删除");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
iframe {
  margin: 1rem auto;
}
.refresh {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: #c4c4c4;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
}
.light {
  display: inline-block;
  width: 80px;
}
.progress {
  width: 500px;
}
.time {
  width: 150px;
}
.data-item {
  width: 150px;
  span {
    padding: 1rem 0 0.5rem 0;
  }
}
</style>