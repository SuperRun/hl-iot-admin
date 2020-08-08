import {getToken, getUploadimgConfig, getUploadvideoConfig} from '@/utils/auth';
import {getFileNameUUID} from '@/utils/util';
import {showWarningMsg, showSuccessMsg, showErrorMsg} from '@/utils/message';
import {uploadImg, delImg} from '@/api/upload';
import {setSystem} from '@/api/platform';

export default {
  data() {
    return {
      uploadimgConfig: getUploadimgConfig()
        ? JSON.parse(getUploadimgConfig())
        : {},
      uploadvideoConfig: getUploadvideoConfig()
        ? JSON.parse(getUploadvideoConfig())
        : {},
      config: '',
      file: null,
      dialogVisible: false, // 查看大图弹出框
      imgList: [],
      videoList: [],
    };
  },
  computed: {
    uploadImgUrl() {
      return `${this.uploadimgConfig.host}`;
    },
    uploadVideoUrl() {
      return `${this.uploadvideoConfig.host}`;
    },
    uploadImgData() {
      return {
        OSSAccessKeyId: this.uploadimgConfig.accessid,
        policy: this.uploadimgConfig.policy,
        signature: this.uploadimgConfig.signature,
        key: this.config,
      };
    },
    uploadVideoData() {
      return {
        OSSAccessKeyId: this.uploadvideoConfig.accessid,
        policy: this.uploadvideoConfig.policy,
        signature: this.uploadvideoConfig.signature,
        key: this.config,
      };
    },
  },
  methods: {
    async beforeImgUpload(file) {
      console.log('beforeImgUpload');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        showWarningMsg('上传产品图片大小不能超过 2MB!');
        return;
      }
      if (this.uploadimgConfig.expire < new Date().getTime() / 1000) {
        console.log('过期了');
        this.uploadimgConfig = await this.$store.dispatch(
          'upload/getUploadImgConfig',
        );
      }

      this.config =
        this.uploadimgConfig.dir +
        getFileNameUUID() +
        '.' +
        file.name.split('.').pop();
      this.file = file;
      return true;
    },
    uploadImage() {
      let param = new FormData();
      Object.keys(this.uploadImgData).forEach((key) => {
        param.append(key, this.uploadImgData[key]);
      });
      param.append('file', this.file);
      uploadImg({url: this.uploadImgUrl, data: param}).then((_) => {
        this.model.image = this.uploadimgConfig.host + '/' + this.config;
      });
    },
    uploadLogo() {
      let param = new FormData();
      Object.keys(this.uploadImgData).forEach((key) => {
        param.append(key, this.uploadImgData[key]);
      });
      param.append('file', this.file);
      uploadImg({url: this.uploadImgUrl, data: param}).then((_) => {
        setSystem({
          title: this.model.title,
          logo: this.uploadimgConfig.host + '/' + this.config,
        }).then((res) => {
          showSuccessMsg('上传成功');
          this.$store.dispatch('app/setPlatformConfig', res.data);
        });
      });
    },
    async beforePicRemove(file, fileList) {
      return this.$confirm('确定删除?', '提示');
    },
    handlePicRemove() {
      this.model.image = '';
      this.file = null;
    },
    handleLedRemove() {
      this.urlCache = '';
      this.file = null;
    },
    handlePictureCardPreview() {
      this.dialogVisible = true;
    },
    handleExceed(files, fileList) {
      showWarningMsg('最多上传一张请先删除');
    },
    async beforeVideoUpload(file) {
      console.log('beforeVideoUpload', file.type.includes('image'));

      const isLt10M = file.size / 1024 / 1024 < 2;
      const isLt500M = file.size / 1024 / 1024 < 50;

      if (!isLt10M && file.type.includes('image')) {
        showWarningMsg('上传图片大小不能超过 2MB!');
        this.uploadLoading = false;
        this.fileList = [];
        return false;
      }

      if (!isLt500M && file.type.includes('mp4')) {
        showWarningMsg('上传视频大小不能超过 500MB!');
        this.uploadLoading = false;
        this.fileList = [];
        return false;
      }

      console.log('cjdn');

      if (file.type.includes('image')) {
        if (
          !this.uploadimgConfig.expire ||
          this.uploadimgConfig.expire < new Date().getTime() / 1000
        ) {
          console.log('过期了');
          this.uploadimgConfig = await this.$store.dispatch(
            'upload/getUploadImgConfig',
          );
        }
        this.config =
          this.uploadimgConfig.dir +
          getFileNameUUID() +
          '.' +
          file.name.split('.').pop();
        this.file = file;
      }

      if (file.type.includes('mp4')) {
        if (
          !this.uploadvideoConfig.expire ||
          this.uploadvideoConfig.expire < new Date().getTime() / 1000
        ) {
          console.log('过期了');
          this.uploadvideoConfig = await this.$store.dispatch(
            'upload/getUploadVideoConfig',
            {type: 1},
          );
        }
        this.config =
          this.uploadvideoConfig.dir +
          getFileNameUUID() +
          '.' +
          file.name.split('.').pop();
        this.file = file;
      }

      return true;
    },
    uploadVideo() {
      console.log('uploadVideo', this.file);
      if (!this.file) {
        return false;
      }
      let param = new FormData();
      console.log('size', this.content);
      console.log('size', this.file.size);
      this.content.size = this.file.size;
      this.uploadLoading = true;
      this.loadingText = '正在生成链接,请稍等……';
      if (this.file.type.includes('mp4')) {
        console.log('上传视频');
        Object.keys(this.uploadVideoData).forEach((key) => {
          param.append(key, this.uploadVideoData[key]);
        });
        param.append('file', this.file);
        uploadImg({url: this.uploadVideoUrl, data: param}).then((_) => {
          this.uploadLoading = false;
          this.urlCache = this.uploadvideoConfig.host + '/' + this.config;
          showSuccessMsg('上传成功');
        });
      } else if (this.file.type.includes('image')) {
        console.log('上传图片');
        Object.keys(this.uploadImgData).forEach((key) => {
          param.append(key, this.uploadImgData[key]);
        });
        param.append('file', this.file);
        uploadImg({url: this.uploadImgUrl, data: param}).then((_) => {
          this.uploadLoading = false;
          this.urlCache = this.uploadimgConfig.host + '/' + this.config;
          showSuccessMsg('上传成功');
        });
      }
    },
  },
};
