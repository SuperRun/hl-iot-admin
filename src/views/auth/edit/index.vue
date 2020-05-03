<template>
  <div class="auth-manage">
    <el-form label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="model.name"
          type="text"
          maxlength="10"
          style="width:140px"
          show-word-limit
          :disabled="!isEdit"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      header-cell-class-name="table-header"
      class="mg-top-1"
    >
      <el-table-column label="页面" width="220">
        <template slot-scope="scope">
          <el-checkbox :disabled="!isEdit" v-model="scope.row.state">{{scope.row.p.name}}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="权限">
        <template slot-scope="scope">
          <el-checkbox
            :disabled="!isEdit"
            v-model="scope.row.state"
            :key="item.name"
            v-for="item in scope.row.p.children"
          >{{item.name}}</el-checkbox>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex jc-end mg-top-1">
      <el-button class="btn-light mg-right-1" type="button" @click="$router.back()">返回</el-button>
      <div v-if="isEdit">
        <el-button class="btn-light" type="button" @click="isEdit=false">取消</el-button>
        <el-button class="btn-dark" type="button" @click="confirm">确定</el-button>
      </div>
      <el-button v-else class="btn-dark" type="button" @click="isEdit=true">编辑</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditAuth",
  data() {
    return {
      isEdit: false,
      tableData: [
        {
          p: {
            name: "页面1",
            children: [
              { name: "页面1-权限1" },
              { name: "页面1-权限2" },
              { name: "页面1-权限3" }
            ]
          }
        },
        {
          p: {
            name: "页面2",
            children: [
              { name: "页面2-权限1" },
              { name: "页面2-权限2" },
              { name: "页面2-权限3" }
            ]
          }
        }
      ],
      model: {
        name: ""
      }
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  async mounted() {
    this.model = await this.$store.dispatch("role/detailRole", { id: this.id });
  },
  methods: {
    confirm() {
      this.$refs["form"].validate(valid => {
        if (!valid) return;
        this.$store.dispatch("role/editRole", this.model).then(_ => {
          showSuccessMsg("编辑成功");
          this.$router.push({ path: "/auth/list" });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.auth-manage {
  padding: 2rem;
  border-radius: 6px;
  .tab {
    padding: 0.8rem 1.4rem;
    background-color: #f2f6fd;
    margin-right: 0.5rem;
    border-top-right-radius: 8px;
    color: #333333;
    transition: all 0.3s;
    cursor: pointer;
  }
  .tab.active {
    background-color: #4360ec;
    color: #ffffff;
  }
  .tab-panel {
    padding: 1rem 0;
  }
}
</style>