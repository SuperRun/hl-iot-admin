import {
  editProduct,
  addProduct,
  listProduct,
  detailProduct,
  delProduct,
} from '@/api/product';
const state = {};
const actions = {
  editProduct ({commit}, data) {
    return new Promise ((resolve, reject) => {
      editProduct (data).then (res => {
        resolve (res);
      });
    });
  },
  addProduct ({commit}, data) {
    return new Promise ((resolve, reject) => {
      addProduct (data).then (res => {
        resolve (res);
      });
    });
  },
  listProduct ({commit}, params) {
    return new Promise ((resolve, reject) => {
      listProduct (params).then (res => {
        resolve (res);
      });
    });
  },
  detailProduct ({commit}, params) {
    return new Promise ((resolve, reject) => {
      detailProduct (params).then (res => {
        resolve (res);
      });
    });
  },
  delProduct ({commit}, data) {
    return new Promise ((resolve, reject) => {
      delProduct (data).then (res => {
        resolve (res);
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  actions,
};
