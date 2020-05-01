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
  },
};
