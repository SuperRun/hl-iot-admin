<template>
  <div class="auth-manage">
    <el-form ref="form" label-width="80px">
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

    <div class="mg-top-3 tree-list">
      <el-tree
        ref="detailTree"
        key="detailTree"
        :data="treeDataDetail"
        node-key="id"
        show-checkbox
        disabled
        :props="defaultProps"
        @check="checkHandle"
      ></el-tree>
    </div>

    <div class="flex jc-end mg-top-1">
      <div v-if="isEdit">
        <el-button class="btn-light" type="button" @click="cancel">取消</el-button>
        <el-button class="btn-dark" type="button" @click="confirm">确定</el-button>
      </div>
      <el-button v-else class="btn-dark" type="button" @click="edit">编辑</el-button>
      <!-- <el-button class="btn-dark" type="button" @click="test">测试</el-button> -->
    </div>
  </div>
</template>

<script>
import { treeAuthList } from '@/api/auth';
import { roleAuthList, editRole } from '@/api/role';
import { showErrorMsg, showSuccessMsg } from '@/utils/message';
export default {
  name: 'EditAuth',
  data() {
    return {
      isEdit: false,
      treeData: [],
      model: {
        name: '',
      },
      nameCopy: '',
      treeDataDetail: [],
      treeDataEdit: [],
      defaultProps: {
        label: 'title',
        children: 'children',
        disabled: () => {
          return !this.isEdit;
        },
      },
      permission_id_list_copy: [],
      permission_id_list: [],
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  async mounted() {
    this.model = await this.$store.dispatch('role/detailRole', { id: this.id });
    this.nameCopy = this.model.name;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      treeAuthList().then((res) => {
        this.listLoading = false;
        this.treeDataEdit = JSON.parse(JSON.stringify(res.data.list));
        this.treeDataDetail = JSON.parse(JSON.stringify(res.data.list));
        this.getAuthList();
      });
    },
    convertList(arr, state) {
      arr.forEach((item) => {
        item.disabled = state;
        if (item.children && item.children.length > 0) {
          this.convertList(item.children, state);
        }
      });
      return arr;
    },
    getAuthList() {
      roleAuthList({ role_id: this.id }).then((res) => {
        res.data.list.forEach((item) => {
          this.permission_id_list.push(item.permission_id);
          this.permission_id_list_copy.push(item.permission_id);
        });
        this.permission_id_list.join(',');
        this.permission_id_list_copy.forEach((value) => {
          this.$refs.detailTree.setChecked(value, true, false);
        });
      });
    },
    confirm() {
      if (this.model.name == '') {
        showErrorMsg('请输入角色名称');
        return;
      }
      let permissionIds = '';
      if (typeof this.permission_id_list == 'object') {
        permissionIds = this.permission_id_list.join(',');
      } else {
        permissionIds = this.permission_id_list;
      }
      console.log();
      this.$store
        .dispatch('role/editRole', {
          id: this.model.id,
          name: this.model.name,
          permission_id_list: permissionIds,
        })
        .then((_) => {
          showSuccessMsg('编辑成功');
          this.$router.push({ path: '/role/list' });
        });
    },
    checkHandle(data) {
      const halfCheckedKeys = this.$refs.detailTree
        .getHalfCheckedKeys()
        .join(',');
      const checkedKeys = this.$refs.detailTree.getCheckedKeys().join(',');
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
    edit() {
      this.isEdit = true;
    },
    cancel() {
      this.isEdit = false;
      this.model.name = this.nameCopy;
      this.$nextTick(() => {
        this.$refs.detailTree.setCheckedKeys(this.permission_id_list_copy);
      });
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
