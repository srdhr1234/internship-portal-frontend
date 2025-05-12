// src/utils/toastUtils.js
import { toast } from 'react-toastify';

export const showToast = (message, type = 'success') => {
  const options = {
    position: "top-center",
    autoClose: 3000,
  };

  if (type === 'success') toast.success(message, options);
  else if (type === 'error') toast.error(message, options);
  else toast(message, options);
};
