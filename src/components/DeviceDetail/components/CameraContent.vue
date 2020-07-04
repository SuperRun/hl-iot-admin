<template>
  <!-- 摄像头 -->
  <div class="container" v-loading="loading">
    <div class="flex jc-start">
      <el-button
        type="button"
        @click="playNow"
        :class="isLive ? 'btn-dark' : 'btn-add'"
        >实时</el-button
      >
      <el-button
        type="button"
        class="mg-left-1"
        :class="!isLive ? 'btn-dark' : 'btn-add'"
        @click="replay"
        >回放</el-button
      >
      <el-upload
        action="https://open.ys7.com/api/lapp/voice/upload"
        class="upload-demo ai-center mg-left-1"
        :data="uploadData"
        :before-upload="beforeUpload"
        :on-success="onSuccess"
        name="voiceFile"
      >
        <el-button class="btn-upload mg-right-1">选择语音</el-button>
      </el-upload>
      <el-select v-model="audio" placeholder="语音列表" @change="audio = ''">
        <el-option
          v-for="audio in audioList"
          :key="audio.voiceName"
          :label="audio.voiceName"
          :value="audio.voiceName"
        >
          <div class="flex jc-between ai-center">
            <span style="float: left">{{ audio.voiceName }}</span>
            <i
              class="el-icon-circle-close"
              @click="deleteAudio(audio.voiceName)"
            ></i>
          </div>
        </el-option>
      </el-select>
    </div>
    <div id="monitor"></div>
    <iframe
      :src="url"
      width="750"
      height="400"
      id="ysOpenDevice"
      class="mg-top-1"
      allowfullscreen
      name="videoIframe"
    >
    </iframe>
    <!-- <iframe
      :src="iframeSrc"
      width="750"
      height="400"
      id="ysOpenDevice"
      class="mg-top-1"
      allowfullscreen
    >
    </iframe> -->
    <!-- 控制方向 -->
    <div class="direction flex flex-column jc-center" v-if="!isReplay">
      <div class="up">
        <svg-icon :icon-class="'up'" @click="setDirection(0)"></svg-icon>
      </div>
      <div class="center flex  jc-between ai-center">
        <span @click="setDirection(2)"
          ><svg-icon :icon-class="'left'"></svg-icon
        ></span>
        <span
          ><svg-icon @click="setDirection(3)" :icon-class="'right'"></svg-icon
        ></span>
      </div>
      <div class="down">
        <svg-icon @click="setDirection(1)" :icon-class="'down'"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {showSuccessMsg, showWarningMsg} from '@/utils/message';
import {getCameraToken, setCameraDirection} from '@/api/device';
import {
  uploadAudioFile,
  getAudioFile,
  delAudioFile,
  queryAudioFile,
} from '@/api/camera';
import $ from 'jquery';
var ezuikitTalkData = null;
export default {
  name: 'CameraContent',
  computed: {
    ...mapGetters(['deviceDetail']),
    url() {
      //open.ys7.com/ezopen/h5/iframe?url=ezopen://MLXIYY@open.ys7.com/D95050244/1.hd.live&audio=1&autoplay=1&accessToken=at.7obzyhqhbbp6cq2md2ra78oxctpfh4qc-64c4bpfe5q-12voqre-zxs0vthui
      https: return `https://open.ys7.com/ezopen/h5/${
        this.iframeType
      }?url=ezopen://${this.deviceDetail.validate_code}@open.ys7.com/${
        this.deviceDetail.device_number
      }/1.${this.isLive ? 'hd.live' : 'cloud.rec'}&accessToken=${
        this.cameraToken
      }&audio=1&autoplay=1&${
        this.iframeType == 'iframe_se' ? 'templete=2' : ''
      }`;
    },
  },
  data() {
    return {
      dateRange: [],
      cameraToken: '',
      beginTime: '',
      endTime: '',
      pickerOptions: {
        disabledDate(time) {
          // 参数为当前时间，返回boolean
          let lastMonthTime = new Date();
          lastMonthTime.setDate(lastMonthTime.getDate() - 30);
          return (
            time.getTime() - lastMonthTime - 8.64e7 < 30 ||
            Date.now() - 8.64e7 - time.getTime() < 0
          );
        },
      },
      isOn: false,
      timer: null,
      minutes: 0,
      seconds: 0,
      audioList: [],
      isReplay: false,
      ezuikitTalkData: null,
      isLive: true,
      iframeType: 'iframe_voice',
      uploadData: {
        accessToken: '',
        force: true,
        voiceName: '',
      },
      loading: false,
      audio: '',
    };
  },
  created() {
    getCameraToken().then((res) => {
      this.cameraToken = res.data.accessToken;
      this.getAudioList();
    });
  },
  methods: {
    initCamera() {
      ezuikitTalkData = {
        // 应用accessToken
        accessToken: this.cameraToken,
        // 包含设备信息的ezopen协议
        ezopen: this.url,
        // 当前页面与插件主文件ezuiit-talk相对路径
        decoderPath: '../',
      };
      $('#monitor').load('../../../lib/ui-voice.html');
      // ezuikitTalkData = this.ezuikitTalkData;
    },
    replay() {
      // if (this.dateRange != null && this.dateRange.length == 0) {
      //   showWarningMsg('请选择回放时间');
      //   return;
      // }
      this.isLive = false;
      this.beginTime = this.dateRange[0];
      this.endTime = this.dateRange[1];
      this.isReplay = true;
      this.iframeType = 'iframe_se';
    },
    setDirection(direction) {
      setCameraDirection({device_id: this.deviceDetail.id, direction}).then(
        (res) => {
          if (res.data.code == 200) {
            showSuccessMsg('操作成功');
          }
        },
      );
    },
    openAudio() {
      this.isOn = true;
      this.timer = setInterval(() => {
        this.seconds++;
        if (this.seconds == 59) {
          this.minutes++;
          this.seconds = 0;
        }
      }, 1000);
    },
    closeAudio() {
      this.isOn = false;
      this.seconds = 0;
      this.minutes = 0;
      clearInterval(this.timer);
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    getAudioList() {
      let formData = new FormData();
      formData.append('accessToken', this.cameraToken);
      console.log('formData', formData);
      queryAudioFile(formData).then((res) => {
        console.log('res', res);
        if (res.status == 200 && res.data.code == '200') {
          this.audioList = res.data.data;
          console.log('audioList', this.audioList);
        }
      });
    },
    deleteAudio(voiceName) {
      let formData = new FormData();
      formData.append('accessToken', this.cameraToken);
      formData.append('voiceName', voiceName);

      delAudioFile(formData).then((res) => {
        if (res.status == 200 && res.data.code == '200') {
          showSuccessMsg('删除成功');
          this.getAudioList();
          this.reloadIframe();
        } else {
          showWarningMsg('删除失败');
        }
      });
    },
    playNow() {
      this.beginTime = '';
      this.endTime = '';
      this.isReplay = false;
      this.dateRange = [];
      this.isLive = true;
      this.iframeType = 'iframe_voice';
    },
    beforeUpload(file) {
      const isLimit20M = file.size / 1024 / 1024 < 20;
      if (!isLimit20M) {
        showWarningMsg('语音文件最大20M');
        return false;
      }
      console.log('file', file);

      if (
        !(
          file.name.includes('mp3') ||
          file.name.includes('wav') ||
          file.name.includes('aac')
        )
      ) {
        showWarningMsg('语音文件仅支持wav、mp3、aac格式');
        return false;
      }

      const fileName = file.name.split('.')[0];
      this.uploadData.accessToken = this.cameraToken;
      this.uploadData.voiceName = fileName;
      this.loading = true;
    },
    onSuccess(res) {
      console.log('res', res);
      this.loading = false;
      if (res.code != 200) {
        showWarningMsg(res.msg);
      } else {
        // 下发文件给设备
        uploadAudioFile({
          accessToken: this.cameraToken,
          deviceSerial: this.deviceDetail.device_number,
          channelNo: 1,
          fileUrl: res.url,
        });
        showSuccessMsg('上传成功');
        this.getAudioList();
        this.reloadIframe();
      }
    },
    reloadIframe() {
      console.log('reloadIframe');
      console.log('reloadIframe', document.getElementById('ysOpenDevice').src);
      window.open(this.url, 'videoIframe', '');
    },
  },
};
</script>

<style scoped>
.container >>> .el-upload-list {
  display: none;
}
.container {
  position: relative;
}
.direction {
  position: absolute;
  top: 120px;
  left: 20px;
  /* background: red; */
  position: absolute;
  width: 60px;
}
.up,
.down {
  text-align: center;
}
.center {
  height: 30px;
}
</style>
