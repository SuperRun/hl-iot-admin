<template>
  <div>
    <el-dialog title="控制分组(照明灯)" :visible="showDialog" @close="$listeners.closeDialog('control')">
      <div class="flex">
        <span>组号：</span>
        <span>组号</span>
      </div>
      <div class="flex mg-top-1 ai-center">
        <span class="text-grey-2 mg-right-1 light">亮度：{{brightness}}%</span>
        <el-switch
          class="mg-right-1"
          v-model="isFull"
          active-color="#5372FB"
          inactive-color="#D6DAEF"
        ></el-switch>
        <div class="progress">
          <el-slider v-model="brightness"></el-slider>
        </div>
      </div>
      <div class="flex flex-column mg-top-1">
        <div class="flex">
          <span class="text-dark">定时控灯：</span>
          <el-switch
            class="mg-right-1"
            v-model="isControl"
            active-color="#5372FB"
            inactive-color="#D6DAEF"
          ></el-switch>
        </div>
        <div
          :class="[item.isEdit?'':'time','flex', 'text-dark', 'mg-top-1', 'jc-between']"
          v-for="item in items"
          :key="item.time"
        >
          <template v-if="!item.isEdit">
            <span>{{item.time}}</span>
            <span>{{item.brightness}}%</span>
            <div class="flex">
              <button type="button" class="mg-right-1 btn-add" @click="item.isEdit=true">编辑</button>
              <button type="button" class="btn-del" @click="del(item)">删除</button>
            </div>
          </template>
          <template v-else>
            <el-time-select
              v-model="item.time"
              placeholder="选择时间"
              :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:59'
            }"
              class="wpx-150"
            ></el-time-select>
            <el-select v-model="item.brightness" placeholder="选择亮度">
              <el-option
                v-for="brightness in brightnessList"
                :key="brightness"
                :label="`${brightness}%`"
                :value="brightness"
              ></el-option>
            </el-select>
            <div class="flex">
              <button type="button" class="mg-right-1 btn-dark br-4 wpx-100">确定</button>
              <button
                type="button"
                class="btn-light br-4 wpx-100"
                @click="item.isNew ? items.pop():item.isEdit=false"
              >取消</button>
            </div>
          </template>
        </div>
        <button
          type="button"
          class="wpx-150 btn-dark br-4 mg-top-1 pd-tb-05"
          @click="items.push({time:'', brightness: '', isEdit: true, isNew: true})"
        >增加定时控灯</button>
      </div>
      <div class="flex jc-around mg-top-1">
        <el-button class="dialog-btn btn-light wpx-200" @click="showDialog = false">取 消</el-button>
        <el-button class="dialog-btn btn-dark wpx-200" type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ControlgroupDialog",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFull: true, // 亮度
      brightness: 50,
      isControl: false, // 定时控灯
      item: {
        time: "", // 时间
        brightness: "" // 亮度
      },
      items: [
        {
          time: "08:00",
          brightness: 50,
          isEdit: false, // 是否编辑状态
          isNew: false // 是否新增状态
        },
        {
          time: "09:00",
          brightness: 50,
          isEdit: false, // 是否编辑状态
          isNew: false // 是否新增状态
        }
      ],
      isShow: false
    };
  },
  computed: {
    brightnessList() {
      let arr = [];
      for (let num = 0; num <= 100; num += 5) {
        arr.push(num);
      }
      return arr;
    }
  },
  methods: {
    del(item) {
      const h = this.$createElement;
      this.$confirm(
        h("div", null, [
          h("p", null, "确认删除以下定时控灯设置？"),
          h("p", null, `时间：${item.time}    亮度：${item.brightness}%`)
        ]),
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }
      )
        .then(_ => {})
        .catch(_ => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.light {
  display: inline-block;
  width: 80px;
}
.progress {
  width: 300px;
}
.time {
  width: 300px;
}
.data-item {
  width: 150px;
  span {
    padding: 1rem 0 0.5rem 0;
  }
}
p {
  text-align: center;
}
</style>
