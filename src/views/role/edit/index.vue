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
        lazy
        ref="tree"
        :data="treeData"
        node-key="id"
        show-checkbox
        :default-checked-keys="[8, 9]"
        :props="defaultProps"
        @check-change="handleCheckChange"
      >
      </el-tree>
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
      <el-button class="btn-dark" type="button" @click="test">测试</el-button>
    </div>
  </div>
</template>

<script>
import {treeAuthList} from '@/api/auth';
import {roleAuthList} from '@/api/role';
import {showErrorMsg, showSuccessMsg} from '@/utils/message';
export default {
  name: 'EditAuth',
  data() {
    return {
      isEdit: false,
      treeData: [],
      model: {
        name: '',
      },
      treeData: [],
      defaultProps: {
        label: 'title',
        children: 'children',
      },
      permission_list: [],
      permission_id_list: [],
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  async mounted() {
    this.model = await this.$store.dispatch('role/detailRole', {id: this.id});
    this.getList();
    // this.getAuthList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      treeAuthList().then((res) => {
        this.listLoading = false;
        this.treeData = [{id: 8, title: '1', children: [{id: 9, title: '2'}]}];
        console.log('treeData1', this.treeData);
        this.treeData = this.convertList(res.data.list, true);
        console.log('treeData2', this.treeData);
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
      roleAuthList({role_id: this.id}).then((res) => {
        console.log('res', res.data.list);
        res.data.list.forEach((item) => {
          console.log('item', item.permission.level);
          if (item.permission.level != 1) {
            this.permission_list.push(item.permission_id);
          }
        });
        console.log('treeData1', this.treeData);
        console.log('permission_list', this.permission_list);
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys([8, 9, 10]);
        });
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
          permission_id_list: this.permission_list.join(','),
        })
        .then((_) => {
          console.log(_);
          showSuccessMsg('编辑成功');
          this.$router.push({path: '/role/list'});
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
        console.log('index', index);

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
      console.log('permission_id_list', this.permission_id_list);
    },
    edit() {
      this.isEdit = true;
      this.treeData = this.convertList(this.treeData, false);
    },
    cancel() {
      this.isEdit = false;
      this.treeData = this.convertList(this.treeData, true);
      console.log('cancel this.permission_list', this.permission_list);
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.permission_list);
      });
    },
    test() {
      console.log(this.$refs.tree);
      this.$refs.tree.setCheckedKeys([8, 9, 10]);
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
