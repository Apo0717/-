const reducer = (previousValue, currentValue) => previousValue + currentValue;

const numThree = (val) => {
  let newVal = parseFloat(val.toFixed(2)).toLocaleString();
  return newVal;
};

export default {
  reducer,
  numThree,
};
