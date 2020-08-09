<template>
  <div class="auth-manage">
    <el-form ref="form" label-width="80px" :model="model" :rules="rules">
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="model.name"
          type="text"
          maxlength="10"
          style="width:220px"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div class="mg-top-3 tree-list">
      <el-tree
        ref="addTree"
        key="addTree"
        :data="treeData"
        node-key="id"
        show-checkbox
        :props="defaultProps"
        @check="checkHandle"
      />
    </div>
    <div class="flex jc-end mg-top-1">
      <el-button class="btn-dark" type="button" @click="add">创建</el-button>
    </div>
  </div>
</template>

<script>
import { showSuccessMsg } from '@/utils/message';
import { treeAuthList } from '@/api/auth';
export default {
  name: 'AddAuth',
  data() {
    return {
      isEdit: false,
      model: {
        name: '', // 角色名称
      },
      treeData: [],
      defaultProps: {
        label: 'title',
        children: 'children',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请填写角色名称',
            trigger: 'blur',
          },
          {
            max: 10,
            message: '',
            trigger: 'blur',
          },
        ],
      },
      listLoading: false,
      permission_id_list: [],
    };
  },
  async created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      treeAuthList().then((res) => {
        this.listLoading = false;
        this.treeData = res.data.list;
      });
    },
    add() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return;
        this.$store
          .dispatch('role/addRole', {
            ...this.model,
            permission_id_list: this.permission_id_list,
          })
          .then((_) => {
            showSuccessMsg('添加成功');
            this.$router.push({ path: '/role/list' });
          });
      });
    },
    // 新增的方法  选中节点
    checkHandle(data) {
      const halfCheckedKeys = this.$refs.addTree.getHalfCheckedKeys().join(',');
      const checkedKeys = this.$refs.addTree.getCheckedKeys().join(',');
      if (halfCheckedKeys.length && checkedKeys.length) {
        this.permission_id_list = halfCheckedKeys + ',' + checkedKeys;
      } else if (halfCheckedKeys.length && checkedKeys.length === 0) {
        this.permission_id_list = halfCheckedKeys;
      } else if (halfCheckedKeys.length === 0 && checkedKeys.length) {
        this.permission_id_list = checkedKeys;
      } else {
        this.permission_id_list = '';
      }
    },
  },
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
.tree-list {
  padding: 20px;
  background-color: #ffffff;
}
</style>
