export const arrayToObj = (arr, key) =>
  arr.reduce((obj, item) => {
    obj[item[key]] = item
    return obj
  }, {})
