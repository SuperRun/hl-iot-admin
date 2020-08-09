import Map from '@/utils/map-util';
import { keep7Num } from '@/utils/util';
import { validString } from '@/utils/validate';
import cameraMark from '@/assets/images/marker-camera.png';
import { showSuccessMsg, showWarningMsg } from '@/utils/message';
export default {
  data() {
    const validCode = (rule, value, callback) => {
      if (!validString(value)) {
        callback(new Error('验证码必须为6位大写字母'));
      } else {
        callback();
      }
    };
    return {
      formLabelWidth: '100px',
      place: '', // 检索地名
      placeList: [], // 地名列表
      loading: false,
      products: [],
      gateways: [],
      weathers: [],
      groups: [],
      rules: {
        device_number: [
          { required: true, message: '请填写设备编号', trigger: 'blur' },
        ],
        product_id: [
          { required: true, message: '请选择产品', trigger: 'blur' },
        ],
        place_number: [
          { required: true, message: '请填写位号', trigger: 'blur' },
        ],
        gateway_device_id: [
          { required: true, message: '请选择网关', trigger: 'blur' },
        ],
        group_id: [{ required: true, message: '请选择分组', trigger: 'blur' }],
        validate_code: [
          { required: true, message: '请填写设备验证码', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' },
        ],
        longitude: [{ required: true, message: '请标记地点', trigger: 'blur' }],
        latitude: [{ required: true, message: '请标记地点', trigger: 'blur' }],
      },
      dialogMap: {}, // 弹出框地图
      model: {
        device_number: '', // 设备号
        place_number: '', // 位号
        project_id: '', // 项目id
        product_id: '', // 产品id
        longitude: '', // 经度
        latitude: '', // 纬度
        gateway_device_id: '', // 网关的产品id
        is_weather: 2, // 气象站id
        group_id: '', // 分组id
        validate_code: '', // 验证码
      },
    };
  },
  methods: {
    add() {
      this.showDialog = true;
      this.mode = 'add';
    },
    edit(item) {
      this.mode = 'edit';
      this.showDialog = true;
      this.model = Object.assign(this.model, item);
      if (this.params.product_type == 3) {
        this.model.group_id == null ? (this.model.group_id = 0) : '';
      }
    },
    async dialogOpened() {
      // 获取产品和网关列表
      if (this.params.product_type == 3) {
        let { list } = await this.$store.dispatch('group/listGroup', {
          project_id: this.cur_proj,
        });
        this.groups = list;
      }
      let { list } = await this.$store.dispatch('product/listProduct', {
        type: this.params.product_type,
      });
      this.products = list;
      let res = await this.$store.dispatch('device/listDevice', {
        product_type: 5,
        project_id: this.cur_proj,
      });
      this.gateways = res.list;

      // 弹出框地图
      const { longitude, latitude } = await this.$store.dispatch(
        'project/detailProject',
        {
          id: this.cur_proj,
        },
      );
      this.dialogMap = new Map('dialog-map', {}, true, true);
      const point = this.dialogMap.createPoint(longitude, latitude);
      this.dialogMap.setPoint(point);

      const self = this;
      this.dialogMap.addMapEvent('click', function(e) {
        self.model.longitude = keep7Num(e.point.lng);
        self.model.latitude = keep7Num(e.point.lat);
        self.dialogMap.addMark(e.point.lng, e.point.lat, {}, true);
      });
      // 编辑：添加标记点
      if (this.mode == 'edit') {
        const point = this.dialogMap.createPoint(
          this.model.longitude,
          this.model.latitude,
        );
        this.dialogMap.setPoint(point);
        this.dialogMap.addMark(
          this.model.longitude,
          this.model.latitude,
          {},
          true,
        );
      }
    },
    confirm() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return;
        // 仅照明灯需要group_id
        // 仅摄像头需要validate_code
        // 仅LED weather_product_id
        // 网关不需要 gateway_device_id
        this.model.project_id = this.cur_proj;
        let data = {};
        const keys = [
          'group_id',
          'validate_code',
          'is_weather',
          'gateway_device_id',
        ];
        Object.keys(this.model).forEach((key) => {
          if (this.params.product_type === 1 && key === 'validate_code') {
            data[key] = this.model[key];
          }
          if (this.params.product_type === 2 && key === 'is_weather') {
            data[key] = this.model[key];
          }
          if (this.params.product_type === 3 && key === 'group_id') {
            data[key] = this.model[key];
          }
          if (this.params.product_type !== 5 && key === 'gateway_device_id') {
            data[key] = this.model[key];
          }
          if (!keys.includes(key)) {
            data[key] = this.model[key];
          }
        });

        if (this.mode == 'add') {
          await this.addDevice(data);
          showSuccessMsg('添加成功');
        } else {
          await this.editDevice(data);
          showSuccessMsg('编辑成功');
        }
        this.showDialog = false;
        this.getList();
      });
    },
    closed() {
      this.$refs['form'].resetFields();
      Object.keys(this.model).forEach((key) => {
        if (key !== 'type' && key !== 'is_weather') {
          return (this.model[key] = '');
        } else if (key === 'is_weather') {
          return (this.model[key] = 2);
        }
        //  (this.model[key] = '') : '';
      });
      this.imgList = [];
    },
    async searchPlace(keyword) {
      if (keyword == '') return;
      this.loading = true;
      this.placeList = await this.$store.dispatch('map/queryPlace', {
        keyword,
        region: '全国',
      });
      this.loading = false;
    },
    async choosePlace(val) {
      const { location } = await this.$store.dispatch('map/queryPlaceDetail', {
        uid: val,
      });
      this.model.longitude = keep7Num(location.lng);
      this.model.latitude = keep7Num(location.lat);
      // 地图上添加标记点
      this.dialogMap.addMark(location.lng, location.lat, {}, true);
    },
  },
};
