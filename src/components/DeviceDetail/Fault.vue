<template>
  <div class="flex flex-column">
    <div class="item">
      <p>告警信息：差不多就方便快捷你放开我从江东父老窝囊废打开违法你今晚能否看见我都能看见额外能否看见我都不渴望被罚款金额为</p>
      <button class="btn btn-del" type="button" @click="closeFault">关闭告警</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Fault",
  methods: {
    closeFault() {
      const h = this.$createElement;
      this.$confirm(
        h("div", null, [
          h(
            "p",
            {
              style: "text-align: center;padding:.2rem 0;font-size:0.9rem;"
            },
            "确认关闭告警？"
          ),
          h(
            "p",
            {
              style: "text-align: center;padding:.2rem 0;font-size:0.9rem;"
            },
            "SN：22222   告警内容"
          )
        ]),
        "关闭告警",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped>
.btn {
  float: right;
}
</style>