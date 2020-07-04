<template>
  <div class="platform-manage bg-white-3 min-h-1 bx-shadow-2">
    <div class="flex ai-center">
      <span class="text-grey-2 fs-md">平台名称：</span>
      <div v-if="!isEditName" class="flex ai-center">
        <span class="fs-md pd-right-1">{{ model.title }}</span>
        <el-button type="button" class="btn btn-dark" @click="isEditName = true"
          >编辑</el-button
        >
      </div>
      <div class="flex" v-else>
        <el-input
          class="mg-right-1"
          v-model="model.title"
          type="text"
          maxlength="12"
          show-word-limit
        ></el-input>
        <el-button type="button" class="btn btn-dark" @click="editPName"
          >确定</el-button
        >
        <el-button
          type="button"
          class="btn btn-light"
          @click="isEditName = false"
          >取消</el-button
        >
      </div>
    </div>
    <div class="flex mg-top-1">
      <span class="text-grey-2 fs-md pd-right-1">平台LOGO：</span>
      <div class="flex flex-column">
        <el-upload
          action
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
  </div>
</template>

<script>
import {getSystem, setSystem} from '@/api/platform';
import {showSuccessMsg} from '@/utils/message';

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
    };
  },
  mounted() {
    this.getSetting();
  },
  methods: {
    editPName() {
      setSystem({title: this.model.title, logo: this.model.image}).then(
        (res) => {
          showSuccessMsg('编辑成功');
          this.isEditName = false;
        },
      );
    },
    getSetting() {
      getSystem().then((res) => {
        console.log(res);
        const {title, logo} = res.data;
        this.model.title = title;
        this.model.image = logo;
        this.imgList = [{url: logo}];
      });
    },
    uploadSuccess() {
      console.log('uploadSuccess');
    },
  },
};
</script>

<style lang="scss" scoped>
.platform-manage {
  padding: 2rem;
  border-radius: 6px;
  .btn {
    font-size: 10px;
  }
  img {
    width: 150px;
    height: 150px;
  }
}
</style>
