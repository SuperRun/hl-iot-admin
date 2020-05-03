import Map from '@/utils/map-util';
import {keep7Num} from '@/utils/util';
import cameraMark from '@/assets/images/marker-camera.png';
import {showSuccessMsg, showWarningMsg} from '@/utils/message';
export default {
  data () {
    return {
      formLabelWidth: '100px',
      place: '', // 检索地名
      placeList: [], // 地名列表
      loading: false,
      products: [],
      gateways: [],
      groups: [],
      rules: {
        device_number: [{required: true, message: '请填写设备编号', trigger: 'blur'}],
        product_id: [{required: true, message: '请选择产品', trigger: 'blur'}],
        place_number: [{required: true, message: '请填写位号', trigger: 'blur'}],
        gateway_product_id: [
          {required: true, message: '请选择网关', trigger: 'blur'},
        ],
        group_id: [{required: true, message: '请选择分组', trigger: 'blur'}],
        longitude: [{required: true, message: '请标记地点', trigger: 'blur'}],
        latitude: [{required: true, message: '请标记地点', trigger: 'blur'}],
      },
      dialogMap: {}, // 弹出框地图
      model: {
        device_number: '', // 设备号
        place_number: '', // 位号
        project_id: '', // 项目id
        product_id: '', // 产品id
        longitude: '', // 经度
        latitude: '', // 纬度
        gateway_product_id: '', // 网关的产品id
        group_id: '', // 分组id
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
      this.mode = 'edit';
      this.showDialog = true;
      this.model = Object.assign (this.model, item);
    },
    async dialogOpened () {
      // 获取产品和网关列表
      console.log ('product_type', this.params.product_type);
      if (this.params.product_type == 3) {
        let {list} = await this.$store.dispatch ('group/listGroup', {
          project_id: this.cur_proj,
        });
        this.groups = list;
      }
      let {list} = await this.$store.dispatch ('product/listProduct', {
        type: this.params.product_type,
      });
      this.products = list;
      let res = await this.$store.dispatch ('product/listProduct', {
        type: 5,
      });
      this.gateways = res.list;
      // 弹出框地图
      this.dialogMap = new Map ('dialog-map', {}, true, true);
      const self = this;
      this.dialogMap.addMapEvent ('click', function (e) {
        self.model.longitude = keep7Num (e.point.lng);
        self.model.latitude = keep7Num (e.point.lat);
        self.dialogMap.addMark (e.point.lng, e.point.lat, {}, true);
      });
      // 编辑：添加标记点
      if (this.mode == 'edit') {
        const point = this.dialogMap.createPoint (
          this.model.longitude,
          this.model.latitude
        );
        this.dialogMap.setPoint (point);
        this.dialogMap.addMark (
          this.model.longitude,
          this.model.latitude,
          {},
          true
        );
      }
    },
    confirm () {
      this.$refs['form'].validate (async valid => {
        if (!valid) return;
        if (this.mode == 'add') {
          this.model.project_id = this.cur_proj;
          await this.addDevice (this.model);
          showSuccessMsg ('添加成功');
        } else {
          this.model.project_id = this.cur_proj;
          await this.editDevice (this.model);
          showSuccessMsg ('编辑成功');
        }
        this.showDialog = false;
        this.getList ();
      });
    },
    closed () {
      this.$refs['form'].resetFields ();
      Object.keys (this.model).forEach (
        key => (key !== 'type' ? (this.model[key] = '') : '')
      );
      this.imgList = [];
    },
    async searchPlace (query) {
      if (query == '') return;
      this.loading = true;
      this.placeList = await this.$store.dispatch ('map/queryPlace', {
        query,
        region: '全国',
      });
      this.loading = false;
    },
    async choosePlace (val) {
      const {location} = await this.$store.dispatch ('map/queryPlaceDetail', {
        uid: val,
        scope: 1,
      });
      this.model.longitude = keep7Num (location.lng);
      this.model.latitude = keep7Num (location.lat);
      // 地图上添加标记点
      this.dialogMap.addMark (location.lng, location.lat, {}, true);
    },
  },
};
