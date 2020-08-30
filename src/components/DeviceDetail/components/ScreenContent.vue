<template>
  <!-- LED屏幕 -->
  <div>
    <el-button
      v-if="btns.includes(97)"
      size="small"
      class="btn-dark mg-bottom-1"
      @click="restart"
    >重启设备</el-button>
    <div class="flex">
      显示屏开关：
      <el-switch
        :disabled="!btns.includes(98)"
        v-model="isOn"
        active-color="#5372FB"
        inactive-color="#D6DAEF"
        @change="turn"
      ></el-switch>
    </div>
    <div class="flex ai-center" v-if="isOn">
      显示屏亮度：
      <span>{{ lightness }}%</span>
      <div class="flex mg-left-1" v-if="isEdit">
        <div class="wpx-300 mg-right-1">
          <el-slider :step="10" v-model="lightness"></el-slider>
        </div>
        <el-button size="small" class="btn-light" @click="isEdit = false">取消</el-button>
        <el-button size="small" class="btn-dark" @click="confirm">确定</el-button>
      </div>

      <el-button
        class="mg-left-1 btn-light"
        v-if="!isEdit && btns.includes(99)"
        @click="isEdit = true"
        size="small"
      >编辑</el-button>
    </div>
    <divider />
    <div
      class="flex flex-column mg-bottom-1"
      v-loading="uploadLoading"
      element-loading-spinner="el-icon-loading"
      :element-loading-text="loadingText"
    >
      <p class="text-dark ai-center">
        <span class="text-grey-2">当前播放:</span>
        <span v-if="!content.url">暂无播放内容</span>
        <span v-else @click="download" style="cursor:pointer">
          {{
          content.url.split('/').pop().split('_-').pop()
          }}
        </span>
      </p>
      <div v-if="!isUpload">
        <el-upload
          action
          class="upload-demo ai-center mg-bottom-1"
          :on-remove="handleLedRemove"
          :before-upload="beforeVideoUpload"
          :before-remove="beforePicRemove"
          :limit="1"
          :on-exceed="handleExceed"
          :http-request="uploadVideo"
          :file-list="fileList"
          v-if="btns.includes(100)"
        >
          <el-button size="small" class="btn-upload mg-right-1">选择文件</el-button>
        </el-upload>
        <div class="flex ai-center mg-bottom-1">
          <label class="pd-lr-1">分辨率</label>
          <el-input type="text" placeholder="宽" class="wpx-100" v-model="model.width"></el-input>
          <span class="pd-lr-1">x</span>
          <el-input type="text" placeholder="高" class="wpx-100" v-model="model.height"></el-input>
        </div>
      </div>
      <a ref="downloadBtn" style="display:none;" target="_blank"></a>
      <div class="flex">
        <div class="flex" v-if="isUpload">
          <el-button
            size="small"
            class="btn-upload mg-right-1"
            v-if="btns.includes(100)"
            @click.stop="isUpload = false"
          >上传</el-button>
          <el-button
            size="small"
            class="btn-light mg-right-1"
            v-if="btns.includes(101)"
            @click.stop="clear"
          >清除</el-button>
        </div>
        <div class="flex" v-else>
          <el-button size="small" class="btn-light mg-right-1" @click.stop="isUpload = true">取消</el-button>
          <el-button size="small" class="btn-dark" @click="uploadLed">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  restartLed,
  getLedOpenState,
  getLedLightness,
  getLedImgOrVedio,
  setLedLightness,
  uploadLedImgOrVedio,
  clearLedFile,
  turnLED,
} from '@/api/device';
import { showSuccessMsg, showInfoMsg, showErrorMsg } from '@/utils/message';
import { mapGetters } from 'vuex';
import Divider from '@/components/Divider';

export default {
  name: 'ScreenContent',
  components: { Divider },
  computed: {
    ...mapGetters(['deviceDetail', 'btns']),
  },
  data() {
    return {
      isOn: false, // LED亮度
      lightness: 0, // LED
      isEdit: false,
      isUpload: true, // 显示上传按钮
      uploadLoading: false,
      loadingText: '',
      model: {
        width: 32,
        height: 256,
        device_id: '',
      },
      content: {
        url: '',
        size: 0,
      },
      fileList: [],
    };
  },
  created() {
    if (this.deviceDetail.status == 2) {
      this.getLedConfig();
      this.getUploadDetail();
      this.createIsOnWatch();
    }
  },
  methods: {
    restart() {
      this.$confirm('确认重启设备？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then((_) => {
        restartLed({ device_id: this.deviceDetail.id }).then((_) => {
          showSuccessMsg('重启成功');
        });
      });
    },
    turn(e) {
      if (e) {
        this.brightness = 100;
      } else {
        this.brightness = 0;
      }
    },
    getLedConfig() {
      getLedOpenState({ device_id: this.deviceDetail.id }).then((res) => {
        this.isOn = res.data.result;
        this.isOnWatch(); // 取消
        this.createIsOnWatch();
      });
      getLedLightness({ device_id: this.deviceDetail.id }).then((res) => {
        this.lightness = Math.floor((res.data.result / 255) * 100);
        this.copyLightness = this.lightness;
      });
    },
    createIsOnWatch() {
      this.isOnWatch = this.$watch('isOn', function () {
        turnLED({
          device_id: this.deviceDetail.id,
          is_open: this.isOn ? 1 : 2,
        }).then((_) => {
          showSuccessMsg(`${this.isOn ? '开启' : '关闭'}成功!`);
        });
      });
    },
    confirm() {
      setLedLightness({
        device_id: this.deviceDetail.id,
        brightness_number: Math.ceil((this.lightness / 100) * 255), // 亮度值0-255
      }).then((res) => {
        if (!res.data.result) {
          showErrorMsg('亮度调节失败!');
          this.lightness = this.copyLightness;
        } else {
          showSuccessMsg('亮度调节成功!');
          this.isEdit = false;
        }
      });
    },
    download() {
      const downloadBtn = this.$refs['downloadBtn'];
      downloadBtn.href = this.content.url;
      downloadBtn.click();
    },
    clear() {
      this.$confirm('确认清除文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(
        (_) => {
          clearLedFile({ device_id: this.deviceDetail.id }).then((_) => {
            showSuccessMsg('清除成功');
            this.getUploadDetail();
          });
        },
        (_) => {
          showInfoMsg('已取消删除');
        },
      );
    },
    uploadLed() {
      if (this.model.width == '' || this.model.width == '') {
        showErrorMsg('请输入分辨率');
        return;
      }
      if (this.urlCache == '') {
        showErrorMsg('请选择文件');
        return;
      }
      this.uploadLoading = true;
      this.loadingText = '上传中……';
      this.model.device_id = this.deviceDetail.id;
      this.content.url = this.urlCache;
      this.model.content = [];
      this.model.content.push(this.content);
      this.model.content = JSON.stringify(this.model.content);
      uploadLedImgOrVedio(this.model).then((_) => {
        this.uploadLoading = false;
        showSuccessMsg('上传成功');
        this.isUpload = true;
        this.getUploadDetail();
      });
    },
    getUploadDetail() {
      getLedImgOrVedio({ device_id: this.deviceDetail.id }).then((res) => {
        this.fileList = [];
        if (res.data != null) {
          const { content, width, height } = res.data;
          this.content = JSON.parse(content)[0];
          this.fileList.push({
            url: this.content.url,
            name: this.content.url.split('/').pop(),
          });
          this.model.width = width;
          this.model.height = height;
        } else {
          Object.keys(this.model).forEach((key) => {
            if (key == 'width') {
              this.model[key] = 32;
            } else if (key == 'height') {
              this.model[key] = 256;
            } else {
              this.model[key] = '';
            }
          });
          this.content.size = 0;
          this.content.url = '';
        }
      });
    },
  },
};
</script>

<style></style>
