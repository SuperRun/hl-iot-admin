import {getToken, getUploadimgConfig} from '@/utils/auth';
import {getFileNameUUID} from '@/utils/util';
import {showWarningMsg, showSuccessMsg, showErrorMsg} from '@/utils/message';
import {uploadImg, delImg} from '@/api/upload';

export default {
  data () {
    return {
      uploadimgConfig: getUploadimgConfig ()
        ? JSON.parse (getUploadimgConfig ())
        : {},
      config: '',
      file: '',
      dialogVisible: false, // 查看大图弹出框
      imgList: [],
    };
  },
  computed: {
    uploadImgUrl () {
      return `${this.uploadimgConfig.host}`;
    },
    uploadImgData () {
      return {
        OSSAccessKeyId: this.uploadimgConfig.accessid,
        policy: this.uploadimgConfig.policy,
        signature: this.uploadimgConfig.signature,
        key: this.config,
      };
    },
  },
  methods: {
    async beforeImgUpload (file) {
      console.log ('beforeImgUpload');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        showWarningMsg ('上传产品图片大小不能超过 2MB!');
        return false;
      }
      if (this.uploadimgConfig.expire < new Date ().getTime () / 1000) {
        console.log ('过期了');
        this.uploadimgConfig = await this.$store.dispatch (
          'upload/getUploadImgConfig'
        );
      }

      this.config =
        this.uploadimgConfig.dir +
        getFileNameUUID () +
        '.' +
        file.name.split ('.').pop ();
      this.file = file;
      return true;
    },
    uploadImage () {
      let param = new FormData ();
      Object.keys (this.uploadImgData).forEach (key => {
        param.append (key, this.uploadImgData[key]);
      });
      param.append ('file', this.file);
      uploadImg ({url: this.uploadImgUrl, data: param}).then (_ => {
        this.model.image = this.uploadimgConfig.host + '/' + this.config;
      });
    },
    async beforePicRemove (file, fileList) {
      // return await this.$store
      //   .dispatch ('upload/delImg', {
      //     url: this.config,
      //     signature: this.uploadimgConfig.signature,
      //   })
      //   .then (_ => {
      //     showSuccessMsg ('删除成功');
      //     return Promise.resolve (true);
      //   })
      //   .catch (e => {
      //     showErrorMsg ('删除失败');
      //     return Promise.reject (false);
      //   });
      return this.$confirm ('确定删除?', '提示');
    },
    handlePictureCardPreview () {
      this.dialogVisible = true;
    },
    handleExceed (files, fileList) {
      console.log ('handleExceed');
      showWarningMsg ('最多上传一张请先删除');
    },
  },
};
