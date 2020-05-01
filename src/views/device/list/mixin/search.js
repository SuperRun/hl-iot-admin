import {getValByKey} from '@/utils/util';
import {showSuccessMsg, showInfoMsg} from '@/utils/message';
import {mapGetters, createNamespacedHelpers} from 'vuex';
const {mapActions} = createNamespacedHelpers ('device');
import _ from 'lodash';

export default {
  data () {
    return {
      listLoading: false,
      tableData: [],
      page: 1,
      limit: 5,
      total: 0,
      names: '', // 删除设备的名称
      ids: '', // 删除设备的id
    };
  },
  computed: {
    ...mapGetters (['cur_proj']),
  },
  watch: {
    cur_proj () {
      this.params.project_id = this.cur_proj;
      this.getList ();
    },
  },
  mounted () {
    // 获取设备列表
    this.params.project_id = this.cur_proj;
    this.getList ();
  },
  methods: {
    ...mapActions (['editDevice', 'addDevice', 'listDevice', 'detailDevice']),
    async getList () {
      this.listLoading = true;
      const {total, list} = await this.listDevice ({
        ...this.params,
        page: this.page,
        limit: this.limit,
      });
      this.listLoading = false;
      this.tableData = list;
      this.total = total;
    },
    search: _.debounce (function () {
      this.getList ();
    }, 500),
    reset () {
      this.params.device_number = '';
      this.params.place_number = '';
      this.getList ();
    },
    headColor({row, rowIndex}) {
      return 'bg-grey-6';
    },
    del () {
      if (this.ids == '') {
        showInfoMsg ('未选中任何产品');
        return;
      }
      const h = this.$createElement;
      this.$confirm (
        h ('div', null, [
          h (
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            `已选中设备：${this.names}`
          ),
          h (
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            '确认删除已选中设备？'
          ),
        ]),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }
      ).then (async _ => {
        await this.delDevice ();
        this.getList ();
        showSuccessMsg ('删除成功');
      });
    },
    handleSelectionChange (val) {
      this.names = getValByKey ('title', val, ', ');
      this.ids = getValByKey ('id', val);
    },
  },
};
