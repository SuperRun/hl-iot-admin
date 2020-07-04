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
    <!-- :span-method="spanMethod" -->
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      header-cell-class-name="table-header"
      class="mg-top-1"
      :span-method="spanMethod"
    >
      <el-table-column label="模块" width="180">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.modelState"
            @change="changeAllModel(scope.row)"
            >{{ scope.row.modelName }}</el-checkbox
          >
        </template>
      </el-table-column>
      <el-table-column label="菜单" width="200">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.menuState"
            @change="changeAllMenu(scope.row)"
            >{{ scope.row.menuName }}</el-checkbox
          >
        </template>
      </el-table-column>
      <el-table-column label="类别" width="200">
        <template slot-scope="scope">
          <el-checkbox
            v-if="scope.row.level == 3"
            v-model="scope.row.state"
            @change="changeAllFunc(scope.row)"
            >{{ scope.row.title }}</el-checkbox
          >
        </template>
      </el-table-column>
      <el-table-column label="功能">
        <template slot-scope="scope">
          <el-checkbox
            v-model="item.funState"
            :key="item.name"
            v-for="item in scope.row.children"
            >{{ item.title }}</el-checkbox
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="flex jc-end mg-top-1">
      <el-button class="btn-dark" type="button" @click="add">创建</el-button>
    </div>
  </div>
</template>

<script>
import {showSuccessMsg} from '@/utils/message';
import {listAuth} from '@/api/auth';
let modelIndex1 = 0; // 合并行数索引，需要合并的第一行
let modelIndex2 = 0; // 合并行数索引，需要合并的第一行
let isInit = false; // 判断表格是否初始化，以防表格重新渲染出错
export default {
  name: 'AddAuth',
  data() {
    return {
      isEdit: false,
      tableData: [
        {
          id: 1, // 类别的id
          model_id: 11, // model的id
          menu_id: 111, // menu的id
          title: '摄像头', // 类别的title
          menuName: '设备列表', // 菜单名称
          modelName: '设备管理', // 模块名称
          level: 3, // 包含类别就为3
          modelState: false,
          menuState: false,
          state: false,
          children: [
            // 功能
            {
              id: 1111,
              parent_id: 10,
              title: '设备列表',
              level: 4,
              funState: false,
            },
            {
              id: 222,
              parent_id: 10,
              title: '添加设备',
              level: 4,
              funState: false,
            },
          ],
        },
        {
          id: 2,
          model_id: 11, // model的id
          menu_id: 111, // menu的id
          title: 'led屏',
          menuName: '设备列表',
          modelName: '设备管理',
          state: false,
          level: 3,
          modelState: false,
          menuState: false,
          children: [
            {
              parent_id: 11,
              title: '设备列表',
              level: 4,
              funState: false,
            },
            {
              parent_id: 11,
              title: '添加设备',
              level: 4,
              funState: false,
            },
          ],
        },
        {
          id: 3,
          model_id: 11, // model的id
          menu_id: 111, // menu的id
          title: '照明灯',
          menuName: '设备列表',
          modelName: '设备管理',
          state: false,
          level: 3,
          modelState: false,
          menuState: false,
          children: [
            {
              parent_id: 12,
              title: '设备列表',
              level: 4,
              funState: false,
            },
            {
              parent_id: 12,
              title: '添加设备',
              level: 4,
              funState: false,
            },
          ],
        },
        {
          id: 4,
          model_id: 11, // model的id
          menu_id: 111, // menu的id
          title: '气象站',
          menuName: '设备列表',
          modelName: '设备管理',
          level: 3,
          modelState: false,
          menuState: false,
          state: false,
          children: [
            {
              parent_id: 13,
              title: '设备列表',
              level: 4,
              funState: false,
            },
            {
              parent_id: 13,
              title: '添加设备',
              level: 4,
              funState: false,
            },
          ],
        },
        {
          id: 5,
          model_id: 11, // model的id
          menu_id: 222, // menu的id
          title: '摄像头',
          menuName: '产品管理',
          modelName: '设备管理',
          level: 3,
          modelState: false,
          menuState: false,
          state: false,
          children: [
            {
              parent_id: 14,
              title: '产品列表',
              level: 4,
              funState: false,
            },
            {
              parent_id: 14,
              title: '添加产品',
              level: 4,
              funState: false,
            },
          ],
        },
        {
          id: 6,
          model_id: 11, // model的id
          menu_id: 222, // menu的id
          title: 'LED屏',
          menuName: '产品管理',
          modelName: '设备管理',
          level: 3,
          modelState: false,
          menuState: false,
          state: false,
          children: [
            {
              parent_id: 15,
              title: '产品列表',
              level: 4,
              funState: false,
            },
            {
              parent_id: 15,
              title: '添加产品',
              level: 4,
              funState: false,
            },
          ],
        },
        {
          id: 7,
          model_id: 22, // model的id
          menu_id: 333, // menu的id
          title: '照明灯',
          menuName: '告警管理',
          modelName: '告警管理',
          level: 3,
          modelState: false,
          menuState: false,
          state: false,
          children: [
            {
              parent_id: 10,
              title: '告警列表',
              level: 4,
              funState: false,
            },
            {
              parent_id: 10,
              title: '关闭告警',
              level: 4,
              funState: false,
            },
            {
              parent_id: 10,
              title: '删除告警',
              level: 4,
              funState: false,
            },
          ],
        },
        {
          id: 8,
          model_id: 33, // model的id
          menu_id: 444, // menu的id
          title: '',
          menuName: '项目管理',
          modelName: '项目管理',
          level: 2,
          modelState: false,
          menuState: false,
          state: false,
          children: [
            {
              parent_id: 10,
              title: '设备列表',
              level: 4,
              funState: false,
            },
            {
              parent_id: 10,
              title: '添加设备',
              level: 4,
              funState: false,
            },
          ],
        },
      ],
      model: {
        name: '', // 角色名称
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
      configs: [
        {
          rowSpan1: 0, // 合并第一列行的数量
          rowSpan2: 0, // 合并第二列行的数量
        },
      ],
      modelIds: [],
      modelNum: {}, // 每个模块行数
      menuIds: [],
      menuNum: {}, // 每个菜单行数
    };
  },
  async created() {
    this.genConfigs();
    // this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      listAuth({page: 1, limit: 10}).then((res) => {
        const {total} = res.data;
        listAuth({page: 1, limit: total}).then((res) => {
          this.listLoading = false;
          const {list} = res.data;
          this.tableData = list;
          this.genConfigs();
        });
      });
    },
    add() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return;
        this.$store.dispatch('role/addRole', this.model).then((_) => {
          showSuccessMsg('添加成功');
          this.$router.push({path: '/auth/list'});
        });
      });
    },
    genConfigs() {
      this.tableData.map((data) => {
        this.modelIds.includes(data.model_id)
          ? ''
          : this.modelIds.push(data.model_id);
        this.menuIds.includes(data.menu_id)
          ? ''
          : this.menuIds.push(data.menu_id);
      });
      this.modelIds.forEach((id) => {
        this.modelNum[id] = this.tableData.filter((data) => {
          return data.model_id == id;
        }).length;
      });
      this.menuIds.forEach((id) => {
        this.menuNum[id] = this.tableData.filter((data) => {
          return data.menu_id == id;
        }).length;
      });
    },
    // 当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性
    spanMethod({row, column, rowIndex, columnIndex}) {
      // 初始化完成, 重新设定参数
      if (isInit) {
        isInit = false;
        modelIndex1 = 0;
        modelIndex2 = 0;
      }
      let rowNum = this.modelNum[row.model_id]; // 统计合并出行数
      // 合并第一列和第二列
      if (columnIndex === 0) {
        // 遍历到的行数与索引行相等 进行行合并
        if (rowIndex === modelIndex1) {
          console.log('合并');
          return {
            rowspan: rowNum,
            colspan: 1,
          };
        } else {
          console.log('不合并');
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      let menuRowNum = this.menuNum[row.menu_id];
      if (columnIndex === 1) {
        // 遍历到的行数与索引行相等 进行行合并
        if (rowIndex === modelIndex2) {
          console.log('合并');
          return {
            rowspan: menuRowNum,
            colspan: 1,
          };
        } else {
          console.log('不合并');
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      // 遍历完成，初始化完成
      if (rowIndex === this.tableData.length - 1 && columnIndex === 3) {
        console.log('isinit', isInit);
        isInit = true;
      }
      // 完成一次合并
      if (rowIndex === rowNum + modelIndex1 - 1 && columnIndex === 3) {
        modelIndex1 += rowNum; // 更改行索引
      }
      // 完成一次合并
      if (rowIndex === menuRowNum + modelIndex2 - 1 && columnIndex === 3) {
        modelIndex2 += menuRowNum; // 更改行索引
      }
    },
    changeAllModel(row) {
      let selectModelId = row.model_id;
      this.tableData.forEach((data) => {
        if (selectModelId == data.model_id) {
          data.menuState = row.modelState;
          data.state = row.modelState;
          data.children.forEach((child) => {
            child.funState = row.modelState;
          });
        }
      });
    },
    changeAllMenu(row) {
      let selectMenuId = row.menu_id;
      this.tableData.forEach((data) => {
        if (selectMenuId == data.menu_id) {
          data.state = row.menuState;
          data.children.forEach((child) => {
            child.funState = row.menuState;
          });
        }
      });
    },
    changeAllFunc(row) {
      row.children.forEach((child) => {
        child.funState = row.state;
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
</style>
