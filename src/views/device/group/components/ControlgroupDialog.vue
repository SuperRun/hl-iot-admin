<template>
  <div>
    <el-dialog title="控制分组(照明灯)" :visible="showDialog" @open="open" @close="close">
      <div class="flex">
        <span>组号：</span>
        <span>{{ model.group_number }}</span>
      </div>
      <div class="flex mg-top-1 ai-center">
        <span class="mg-right-1 light">亮度：{{ brightness }}%</span>
        <el-switch
          class="mg-right-1"
          v-model="isFull"
          active-color="#5372FB"
          inactive-color="#D6DAEF"
        ></el-switch>
        <div class="progress">
          <el-slider v-model="brightness" :step="10"></el-slider>
        </div>
      </div>
      <div class="flex jc-around mg-top-1">
        <!-- <el-button class="dialog-btn btn-light wpx-200" @click="showDialog = false">取 消</el-button> -->
        <el-button class="dialog-btn btn-dark wpx-200" type="primary" @click="confirmBrightness">确 定</el-button>
      </div>
      <divider />
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
        <template v-if="isControl">
          <div
            :class="[
              item.isEdit ? '' : 'time',
              'flex',
              'text-dark',
              'mg-top-1',
              'jc-between',
            ]"
            v-for="(item, index) in items"
            :key="item.hour + ':' + item.minute"
          >
            <template v-if="!item.isEdit">
              <span>{{ item.hour + ':' + item.minute }}</span>
              <span>{{ item.brightness }}%</span>
              <div class="flex">
                <button type="button" class="mg-right-1 btn-add" @click="item.isEdit = true">编辑</button>
                <button type="button" class="btn-del" @click="del(item, index)">删除</button>
              </div>
            </template>
            <template v-else>
              <div class="flex">
                <el-select v-model="item.hour" placeholder="时" class="wpx-100 mg-right-1">
                  <el-option label="00" value="00" key="00"></el-option>
                  <el-option
                    v-for="hour in 23"
                    :key="hour"
                    :label="hour < 10 ? '0' + hour : hour"
                    :value="hour < 10 ? '0' + hour : hour"
                  ></el-option>
                </el-select>
                <el-select v-model="item.minute" placeholder="分" class="wpx-100 mg-right-1">
                  <el-option label="00" value="00" key="00"></el-option>
                  <el-option
                    v-for="minute in 59"
                    :key="minute"
                    :label="minute < 10 ? '0' + minute : minute"
                    :value="minute < 10 ? '0' + minute : minute"
                  ></el-option>
                </el-select>
                <el-select v-model="item.brightness" placeholder="选择亮度">
                  <el-option
                    v-for="brightness in brightnessList"
                    :key="brightness"
                    :label="`${brightness}%`"
                    :value="brightness"
                  ></el-option>
                </el-select>
              </div>

              <div class="flex">
                <button
                  type="button"
                  size="small"
                  class="mg-right-1 btn-dark br-4 wpx-100"
                  @click="addItem(item, index)"
                >确定</button>
                <button
                  type="button"
                  size="small"
                  class="btn-light br-4 wpx-100"
                  @click="item.isNew ? items.pop() : (item.isEdit = false)"
                >取消</button>
              </div>
            </template>
          </div>
          <button
            type="button"
            class="wpx-150 btn-dark br-4 mg-top-1 pd-tb-05"
            @click="
              items.push({
                time: '',
                brightness: '',
                isEdit: true,
                isNew: true,
              })
            "
          >增加定时控灯</button>
        </template>
      </div>
      <div class="flex jc-around mg-top-1">
        <!-- <el-button class="dialog-btn btn-light wpx-200" @click="showDialog = false">取 消</el-button> -->
        <el-button class="dialog-btn btn-dark wpx-200" type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '@/utils/message';
import { controlGroup, setGroupBrightness } from '@/api/group';
import Divider from '@/components/Divider/index.vue';
export default {
  name: 'ControlgroupDialog',
  components: {
    Divider,
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isFull: false, // 亮度
      brightness: 0,
      isControl: false, // 定时控灯
      item: {
        hour: '',
        minute: '',
        brightness: '', // 亮度
        isEdit: false, // 是否编辑状态
        isNew: false, // 是否新增状态
      },
      items: [],
      isShow: false,
      model: {},
    };
  },
  computed: {
    brightnessList() {
      let arr = [];
      for (let num = 0; num <= 100; num += 5) {
        arr.push(num);
      }
      return arr;
    },
  },
  watch: {
    isFull() {
      this.isFull ? (this.brightness = 100) : (this.brightness = 0);
    },

    brightness() {
      this.brightness == 0 ? (this.isFull = false) : (this.isFull = true);
    },
  },
  methods: {
    async open() {
      if (this.group_id != 0) {
        this.model = await this.$store.dispatch('group/detailGroup', {
          id: this.id,
        });
        this.isControl = this.model.is_timing == 1 ? true : false;
      }
      const { list } = await this.$store.dispatch('group/detailControlGroup', {
        group_id: this.id,
      });
      this.items = list.reduce((pre, cur) => {
        pre.push({ ...cur, isEdit: false, isNew: false });
        return pre;
      }, []);
    },
    close() {
      this.$listeners.closeDialog('control');
      this.isFull = false;
      this.brightness = 0;
      this.isControl = false;
      this.isShow = false;
    },
    del(item, index) {
      const h = this.$createElement;
      this.$confirm(
        h('div', null, [
          h('p', null, '确认删除以下定时控灯设置？'),
          h('p', null, `时间：${item.time}    亮度：${item.brightness}%`),
        ]),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        },
      )
        .then((_) => {
          this.items.splice(index, 1);
        })
        .catch((_) => {});
    },
    addItem(item, index) {
      if (item.brightness === '' || !item.hour || item.minute === '') {
        showErrorMsg('请选择时间和亮度');
      } else {
        item.isEdit = false;
        item.isNew = false;
      }
      this.items[index] = item;
      this.items.sort(function (a, b) {
        if (a.hour > b.hour || (a.hour == b.hour && a.minute > b.minute)) {
          return 1;
        } else {
          return -1;
        }
      });
    },
    async confirm() {
      if (this.items.some((item) => item.isNew == true)) {
        this.items.pop();
      }
      await this.groupConfig();
      showSuccessMsg('操作成功');
      // this.$listeners.closeDialog('control');
    },
    async confirmBrightness() {
      await this.setBrightness();
      showSuccessMsg('操作成功');
    },
    groupConfig() {
      const controlJson = this.items.reduce((pre, cur) => {
        const { hour, minute, brightness } = cur;
        pre.push({
          hour,
          minute,
          brightness,
        });
        return pre;
      }, []);
      return new Promise((resolve) => {
        controlGroup({
          group_id: this.id,
          is_timing: this.isControl ? 1 : 2, // 是否定时控灯
          control_json: JSON.stringify(controlJson),
        }).then((res) => {
          resolve(res);
        });
      });
    },
    setBrightness() {
      return new Promise((resolve) => {
        setGroupBrightness({
          group_id: this.id,
          type: 2,
          brightness: this.brightness,
        }).then((res) => {
          resolve(res);
        });
      });
    },
  },
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
