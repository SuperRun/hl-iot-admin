import {Message} from 'element-ui';

/**
 * @description: 提示成功信息
 * @param {String} msg
 * @param {Function} closeCallBack
 * @return: 
 */
export function showSuccessMsg (msg, closeCallBack = () => {}) {
  Message.success ({
    message: msg,
    duration: 1500,
    onClose () {
      closeCallBack ();
    },
  });
}

/**
 * @description: 提示警告信息
 * @param {String} msg 
 * @param {Function} closeCallBack
 * @return: 
 */
export function showWarningMsg (msg, closeCallBack = () => {}) {
  Message.warning ({
    message: msg,
    duration: 1500,
    onClose () {
      closeCallBack ();
    },
  });
}

/**
 * @description: 提示普通信息
 * @param {String} msg 
 * @param {Function} closeCallBack
 * @return: 
 */
export function showInfoMsg (msg, closeCallBack = () => {}) {
  Message.info ({
    message: msg,
    duration: 1500,
    onClose () {
      closeCallBack ();
    },
  });
}

/**
 * @description: 提示错误信息
 * @param {String} msg 
 * @param {Function} closeCallBack
 * @return: 
 */
export function showErrorMsg (msg, closeCallBack = () => {}) {
  Message.error ({
    message: msg,
    duration: 1500,
    onClose () {
      closeCallBack ();
    },
  });
}
