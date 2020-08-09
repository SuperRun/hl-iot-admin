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
        @check-change="handleCheckChange"
      ></el-tree>
      <!-- <el-tree
        v-else
        ref="editTree"
        key="editTree"
        :data="treeDataEdit"
        node-key="id"
        show-checkbox
        :props="defaultProps"
        @check-change="handleCheckChange"
      ></el-tree> -->
    </div>

    <div class="flex jc-end mg-top-1">
      <div v-if="isEdit">
        <el-button class="btn-light" type="button" @click="cancel"
          >取消</el-button
        >
        <el-button class="btn-dark" type="button" @click="confirm"
          >确定</el-button
        >
      </div>
      <el-button v-else class="btn-dark" type="button" @click="edit"
        >编辑</el-button
      >
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
      treeDataDetail: [],
      treeDataEdit: [],
      defaultProps: {
        label: 'title',
        children: 'children',
        disabled: () => {
          return this.isEdit ? false : true;
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
    this.getList();
    // this.getAuthList();
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
          if (item.permission.level != 1) {
            this.permission_id_list.push(item.permission_id);
            this.permission_id_list_copy.push(item.permission_id);
          }
        });
        this.$refs.detailTree.setCheckedKeys(this.permission_id_list_copy);
      });
    },
    confirm() {
      if (this.model.name == '') {
        showErrorMsg('请输入角色名称');
        return;
      }
      this.$store
        .dispatch('role/editRole', {
          id: this.model.id,
          name: this.model.name,
          permission_id_list: this.permission_id_list.join(','),
        })
        .then((_) => {
          console.log(_);
          showSuccessMsg('编辑成功');
          this.$router.push({ path: '/role/list' });
        });
    },
    handleCheckChange(data, checked, indeterminate) {
      if (data.parent_id === 0) {
        return;
      }
      if (checked && !this.permission_id_list.includes(data.id)) {
        this.permission_id_list.push(data.id);
        if (
          data.level === 2 &&
          !this.permission_id_list.includes(data.parent_id)
        ) {
          this.permission_id_list.push(data.parent_id);
        }
      }
      if (!checked && this.permission_id_list.includes(data.id)) {
        const index = this.permission_id_list.findIndex((id) => id === data.id);
        if (index != -1) {
          this.permission_id_list.splice(index, 1);
        }
        if (data.level === 2) {
          const temp = this.permission_id_list.findIndex(
            (id) => id === data.parent_id,
          );
          if (temp != -1) {
            this.permission_id_list.splice(temp, 1);
          }
        }
      }
    },
    edit() {
      this.isEdit = true;
    },
    cancel() {
      this.isEdit = false;
      this.$nextTick(() => {
        console.log('permission_id_list_copy', this.permission_id_list_copy);
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
