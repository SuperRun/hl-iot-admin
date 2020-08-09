import { getValByKey } from '@/utils/util';
import { showSuccessMsg, showInfoMsg, showErrorMsg } from '@/utils/message';
import { mapGetters, createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('device');
import _ from 'lodash';

export default {
  data() {
    return {
      listLoading: false,
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      ids: '', // 删除设备的id
      selectedDevice: [], // 选中要删除的设备
      options: [
        { label: '全部', value: 0 },
        { label: '待检测', value: 1 },
        { label: '正常', value: 2 },
        { label: '故障', value: 3 },
        { label: '离线', value: 4 },
      ],
      timer: null,
    };
  },
  computed: {
    ...mapGetters(['cur_proj']),
  },
  watch: {
    cur_proj() {
      this.params.project_id = this.cur_proj;
      this.getList();
    },
  },
  mounted() {
    // 获取设备列表
    this.params.project_id = this.cur_proj;
    this.getList();
    this.roundRequest();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    ...mapActions([
      'editDevice',
      'editDeviceLocation',
      'addDevice',
      'listDevice',
      'detailDevice',
      'delDevice',
    ]),
    async getList(loading = true) {
      if (loading) {
        this.listLoading = true;
      } else {
        showInfoMsg('正在读取……');
      }
      const { total, list } = await this.listDevice({
        ...this.params,
        page: this.page,
        limit: this.limit,
      });
      if (loading) {
        this.listLoading = false;
      } else {
        showSuccessMsg('读取成功');
      }
      this.tableData = list;
      this.total = total;
    },
    search: _.debounce(function() {
      this.getList();
    }, 500),
    reset() {
      this.params.device_number = '';
      this.params.place_number = '';
      this.params.status = 0;
      this.getList();
    },
    del() {
      if (this.ids == '') {
        showInfoMsg('未选中任何设备');
        return;
      }

      const h = this.$createElement;
      const question =
        this.params.product_type == 2
          ? '删除以上设备将删除所有关联的气象站设备，确认删除？'
          : '确认删除已选中设备?';
      const tags = this.selectedDevice.reduce(
        (pre, cur) => {
          pre.push(
            h(
              'p',
              {
                style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
              },
              `编号：${cur.device_number} ${cur.name}`,
            ),
          );
          return pre;
        },
        [
          h(
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            `已选中设备：`,
          ),
        ],
      );

      this.$confirm(
        h('div', null, [
          h('div', null, tags),
          h(
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            question,
          ),
        ]),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        },
      )
        .then(
          async (_) => {
            await this.delDevice({ ids: this.ids });
            this.getList();
            showSuccessMsg('删除成功');
          },
          (_) => {
            showInfoMsg('取消删除');
          },
        )
        .catch((error) => {
          showErrorMsg(error);
        });
    },
    handleSelectionChange(val) {
      this.ids = getValByKey('id', val);
      // 编号：22222   产品名称1（型号）
      this.selectedDevice = val.reduce((pre, cur) => {
        let obj = {};
        obj['device_number'] = cur.device_number;
        obj['name'] = `${cur.product.title}(${cur.product.model})`;
        pre.push(obj);
        return pre;
      }, []);
    },
    currentPage(page) {
      this.page = page;
      this.getList();
    },
    detail(id) {
      this.detailDevice({ id }).then((res) => {
        this.$store.commit('app/SET_DEVICE_DETAIL', res);
        this.$store.commit('app/OPEN_DEVICEDIALOG');
      });
    },
    selectByStatus() {
      this.getList();
    },
    roundRequest() {
      this.timer = setInterval(() => {
        this.getList(false);
      }, 600000);
    },
    async exportExcel() {
      const res = await this.listDevice({
        ...this.params,
        is_export: 1,
      });
      const blob = new Blob([res]);
      const elink = document.createElement('a');
      elink.download = '照明灯列表.csv';
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    },
  },
};
