<template>
  <div class="platform-manage bg-white-3 min-h-1 bx-shadow-2">
    <div class="flex ai-center">
      <span class="text-grey-2 fs-md">平台名称：</span>
      <div v-if="!isEditName" class="flex ai-center">
        <span class="fs-md pd-right-1">{{pName}}</span>
        <el-button type="button" class="btn btn-dark" @click="isEditName=true">编辑</el-button>
      </div>
      <div class="flex" v-else>
        <el-input class="mg-right-1" v-model="pName" type="text" maxlength="20" show-word-limit></el-input>
        <el-button type="button" class="btn btn-dark" @click="editPName">确定</el-button>
        <el-button type="button" class="btn btn-light" @click="isEditName=false">取消</el-button>
      </div>
    </div>
    <div class="flex mg-top-1">
      <span class="text-grey-2 fs-md pd-right-1">平台LOGO：</span>
      <div class="flex flex-column">
        <img src="@/assets/images/no-device.png" alt />
        <div v-if="!isEditPic" class="flex ai-center mg-top-1">
          <el-button type="button" class="btn btn-dark" @click="isEditPic=true">编辑</el-button>
        </div>
        <div class="flex mg-top-1" v-else>
          <el-input class="mg-right-1" v-model="pName" type="text" maxlength="20" show-word-limit></el-input>
          <el-button type="button" class="btn btn-dark" @click="editPName">确定</el-button>
          <el-button type="button" class="btn btn-light" @click="isEditPic=false">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlatformManage",
  data() {
    return {
      isEditName: false,
      pName: "平台名称",
      isEditPic: false
    };
  },
  methods: {
    editPName() {
      this.isEditName = false;
    }
  }
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