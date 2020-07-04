<template>
  <div class="fault-content flex flex-column" v-loading="loading">
    <template v-if="faulList.length > 0">
      <div class="item" v-for="(fault, index) in faulList" :key="index">
        <p>告警信息：设备故障</p>
        <button class="btn btn-del" type="button" @click="closeFault(fault)">
          关闭告警
        </button>
      </div>
    </template>
    <div v-else>
      暂无告警
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {closeWarn} from '@/api/fault';
import {showSuccessMsg, showInfoMsg, showErrorMsg} from '@/utils/message';

export default {
  name: 'Fault',
  computed: {
    ...mapGetters(['cur_proj', 'deviceDetail']),
  },
  data() {
    return {
      faulList: [],
      loading: false,
    };
  },
  created() {
    this.getFaults();
  },
  methods: {
    async getFaults() {
      this.loading = true;
      const res = await this.$store.dispatch('fault/listWarn', {
        type: 1,
        device_id: this.deviceDetail.id,
        project_id: this.cur_proj,
        page: 1,
        limit: 10,
      });
      this.loading = false;
      const {list, total} = res.data;
      this.faulList = list;
    },
    closeFault(fault) {
      const h = this.$createElement;
      this.$confirm(
        h('div', null, [
          h(
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            '确认关闭告警？',
          ),
          h(
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            `SN：${fault.device.device_number}  设备故障`,
          ),
        ]),
        '关闭告警',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        },
      )
        .then(() => {
          closeWarn({
            ids: fault.id,
            type: 2,
          }).then((res) => {
            this.getFaults();
            showSuccessMsg('关闭成功');
          });
        })
        .catch(() => {
          showInfoMsg('取消关闭');
        });
    },
  },
};
</script>

<style scoped>
.btn {
  float: right;
}
.fault-content {
  height: 300px;
  overflow: auto;
}
</style>
