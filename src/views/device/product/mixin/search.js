import _ from 'lodash';
import {
  showWarningMsg,
  showSuccessMsg,
  showErrorMsg,
  showInfoMsg,
} from '@/utils/message';
import {getValByKey} from '@/utils/util';
import {createNamespacedHelpers} from 'vuex';
const {mapActions} = createNamespacedHelpers ('product');

export default {
  data () {
    return {
      listLoading: false,
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      names: '', // 删除产品的名称
      ids: '', // 删除产品的id
    };
  },
  mounted () {
    this.getList ();
  },
  methods: {
    ...mapActions ([
      'editProduct',
      'addProduct',
      'listProduct',
      'detailProduct',
      'delProduct',
    ]),
    async getList () {
      this.listLoading = true;
      const {total, list} = await this.listProduct ({
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
      this.params.title = '';
      this.params.model = '';
      this.getList ();
    },
    currentPage (page) {
      this.page = page;
      this.getList ();
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
            `已选中产品：${this.names}`
          ),
          h (
            'p',
            {
              style: 'text-align: center;padding:.2rem 0;font-size:0.9rem;',
            },
            '删除以上产品将删除关联的所有设备,确认删除？'
          ),
        ]),
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }
      ).then (async _ => {
        await this.delProduct ({ids: this.ids});
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
