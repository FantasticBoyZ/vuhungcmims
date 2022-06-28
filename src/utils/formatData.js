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

const convertUTCDateToLocalDate = (date) => {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

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

const getSelectedOption = (array, value) => {
  const arrayOption = getOptionWithIdandName(array);
  return arrayOption.find((item) => item.value === value);
};
const FormatDataUtils = {
  formatCurrency,
  formatDateTime,
  formatDate,
  convertUTCDateToLocalDate,
  getOption,
  getOptionWithIdandName,
  getSelectedOption,
};
export default FormatDataUtils;
