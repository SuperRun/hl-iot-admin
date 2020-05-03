<template>
  <div>
    <el-dialog title="分组详情" :visible="showDialog" @close="$listeners.closeDialog('detail')"></el-dialog>
  </div>
</template>

<script>
export default {
  name: "GroupdetailDialog",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  }
};
</script>
