<template>
  <div class="platform-manage bg-white-3 min-h-1 bx-shadow-2">
    <div class="flex ai-center">
      <span class="text-grey-2 fs-md">平台名称：</span>
      <div v-if="!isEditName" class="flex ai-center">
        <span class="fs-md pd-right-1">{{ model.title }}</span>
        <el-button type="button" class="btn btn-dark" @click="isEditName = true">编辑</el-button>
      </div>
      <div class="flex" v-else>
        <el-input
          class="mg-right-1"
          v-model="model.title"
          type="text"
          maxlength="12"
          show-word-limit
        ></el-input>
        <el-button type="button" class="btn btn-dark" @click="editPName">确定</el-button>
        <el-button type="button" class="btn btn-light" @click="cancel">取消</el-button>
      </div>
    </div>
    <div class="flex mg-top-1 logo">
      <span class="text-grey-2 fs-md pd-right-1">平台LOGO：</span>
      <div class="flex flex-column">
        <el-upload
          action
          class="upload-logo"
          list-type="picture-card"
          :before-upload="beforeImgUpload"
          :http-request="uploadLogo"
          :on-preview="handlePictureCardPreview"
          :before-remove="beforePicRemove"
          :on-remove="handlePicRemove"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="imgList"
          :on-success="uploadSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogVisible">
      <img class="w-100" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import { getSystem, setSystem } from '@/api/platform';
import { showSuccessMsg } from '@/utils/message';
import { setPlatform, getPlatform } from '@/utils/auth';

export default {
  name: 'PlatformManage',
  data() {
    return {
      isEditName: false,
      isEditPic: false,
      imgList: [],
      model: {
        image: '',
        title: '',
      },
      copyTitle: '',
      dialogVisible: false,
      dialogImageUrl: '',
    };
  },
  mounted() {
    this.getSetting();
  },
  methods: {
    editPName() {
      setSystem({ title: this.model.title, logo: this.model.image }).then(
        (res) => {
          showSuccessMsg('编辑成功');
          this.isEditName = false;
          this.copyTitle = res.data.title;
          this.$store.dispatch('app/setPlatformConfig', res.data);
        },
      );
    },
    getSetting() {
      getSystem().then((res) => {
        const { title, logo } = res.data;
        this.copyTitle = title;
        this.model.title = title;
        this.model.image = logo;
        this.imgList = [{ url: logo }];
        setPlatform(res.data);
      });
    },
    uploadSuccess() {
      console.log('uploadSuccess');
    },
    cancel() {
      this.isEditName = false;
      this.model.title = this.copyTitle;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>
<style scoped>
.platform-manage >>> .el-upload--picture-card {
  width: 300px;
  height: 120px;
  line-height: 120px;
}
.platform-manage >>> .el-upload-list__item {
  width: 300px;
  height: 120px;
}
.platform-manage >>> .el-dialog__body {
  background-color: #e7effe;
}
</style>
<style lang="scss" scoped>
.platform-manage {
  padding: 2rem;
  border-radius: 6px;
  .btn {
    font-size: 10px;
  }
  .logo img {
    width: 150px;
    height: 150px;
  }
  // .upload-logo {
  //   width: 200px;
  //   height: 80px;
  // }
}
</style>
