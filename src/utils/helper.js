export const arrayToObj = (arr, key) =>
  arr.reduce((obj, item) => {
    obj[item[key]] = item
    return obj
  }, {})

export const getParentNode = (node, parentClass) => {
  let current = node
  while (current) {
    if (current.classList && current.classList.contains(parentClass)) {
      return current
    }
    current = current.parentNode
  }

  return null
}
