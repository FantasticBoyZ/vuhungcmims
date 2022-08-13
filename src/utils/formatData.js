import Label from '@/components/Common/Label';
import { format } from 'date-fns';

const formatCurrency = (value) =>
  value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });

const formatDateTime = (date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const getRoundNumber = (value, precision) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

const getRoundFloorNumber = (value, precision) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.floor(value * multiplier) / multiplier;
};

const convertUTCDateToLocalDate = (date) => {
  var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

  // var offset = date.getTimezoneOffset() / 60;
  // var hours = date.getHours();

  // newDate.setHours(hours - offset);

  return newDate;
};

const getOption = (listData) => {
  return listData.map((data) => {
    return {
      value: data,
      label: data.name,
    };
  });
};

const getOptionWithIdandName = (listData) => {
  return listData.map((data) => {
    return {
      value: data.id,
      label: data.name,
    };
  });
};

const getOptionProduct = (listData) => {
  return listData.map((data) => {
    return {
      value: data,
      label: data.productName,
    };
  });
};

const getSelectedOption = (array, value) => {
  const arrayOption = getOptionWithIdandName(array);
  if (value !== null) {
    return arrayOption.find((item) => item.value === value);
  } else {
    return null;
  }
};

const getSelectedOptionWithId = (array, id) => {
  const arrayOption = getOption(array);
  return arrayOption.find((item) => item.value.id === id);
};

const getStatusLabel = (exportOrderStatus) => {
  const map = {
    canceled: {
      text: 'Đã huỷ',
      color: 'error',
    },
    completed: {
      text: 'Đã nhập kho',
      color: 'success',
    },
    pending: {
      text: 'Đang chờ xử lý',
      color: 'warning',
    },
  };

  const { text, color } = map[exportOrderStatus];

  return <Label color={color}>{text}</Label>;
};

const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0
}

const removeExtraSpace = (s) => s.trim().split(/ +/).join(' ');

const FormatDataUtils = {
  formatCurrency,
  formatDateTime,
  formatDate,
  convertUTCDateToLocalDate,
  getOption,
  getOptionWithIdandName,
  getSelectedOption,
  getStatusLabel,
  getOptionProduct,
  getRoundNumber,
  getRoundFloorNumber,
  getSelectedOptionWithId,
  removeExtraSpace,
  isEmptyObject,
};
export default FormatDataUtils;
