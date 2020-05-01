import {showSuccessMsg, showWarningMsg} from '@/utils/message';
export default {
  data () {
    return {
      productId: '',
      rules: {
        title: [{required: true, message: '请填写产品名称', trigger: 'blur'}],
        model: [{required: true, message: '请填写产品型号', trigger: 'blur'}],
      },
    };
  },
  methods: {
    add () {
      this.showDialog = true;
      this.mode = 'add';
      console.log (this.model);
    },
    edit (item) {
      const {id, title, model, image} = item;
      this.mode = 'edit';
      this.showDialog = true;
      this.productId = id;
      this.model = Object.assign (this.model, {title, model, image});
      // 添加图片
      this.imgList.push ({url: this.model.image});
    },
    confirm () {
      console.log (this.model);
      this.$refs['form'].validate (async valid => {
        if (!valid) return;
        if (this.mode == 'add') {
          await this.addProduct (this.model);
          showSuccessMsg ('添加成功');
          this.showDialog = false;
        } else if (this.mode == 'edit') {
          await this.editProduct ({...this.model, id: this.productId});
          showSuccessMsg ('编辑成功');
          this.showDialog = false;
        }
        // 重新获取列表数据
        this.getList ();
      });
    },
    closed () {
      console.log ('closed');
      this.$refs['form'].resetFields ();
      Object.keys (this.model).forEach (
        key => (key !== 'type' ? (this.model[key] = '') : '')
      );
      this.imgList = [];
    },
    handleAvatarSuccess (res, file) {
      console.log ('handleAvatarSuccess');
      console.log (res, file);
    },
  },
};
