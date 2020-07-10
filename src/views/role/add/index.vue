<template>
  <div class="auth-manage">
    <el-form label-width="80px" :model="model" :rules="rules" ref="form">
      <el-form-item label="角色名称" prop="name">
        <el-input
          type="text"
          v-model="model.name"
          maxlength="10"
          style="width:220px"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="mg-top-3 tree-list">
      <el-tree
        :data="treeData"
        node-key="id"
        show-checkbox
        :props="defaultProps"
        @check-change="handleCheckChange"
      >
      </el-tree>
    </div>
    <div class="flex jc-end mg-top-1">
      <el-button class="btn-dark" type="button" @click="add">创建</el-button>
    </div>
  </div>
</template>

<script>
import {showSuccessMsg} from '@/utils/message';
import {listAuth, treeAuthList} from '@/api/auth';
let modelIndex1 = 0; // 合并行数索引，需要合并的第一行
let modelIndex2 = 0; // 合并行数索引，需要合并的第一行
let isInit = false; // 判断表格是否初始化，以防表格重新渲染出错
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
        console.log('res', res);
      });
    },
    add() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return;
        this.$store
          .dispatch('role/addRole', {
            ...this.model,
            permission_id_list: this.permission_id_list.join(','),
          })
          .then((_) => {
            showSuccessMsg('添加成功');
            this.$router.push({path: '/role/list'});
          });
      });
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data);
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
      console.log(this.permission_id_list);
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
