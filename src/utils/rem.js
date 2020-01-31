// 移动端rem适配方案
;(function setRem(doc, win) {
  const setFontSize = function() {
    const docEle = doc.documentElement
    const designWidth = 750
    const screenWidth = docEle.clientWidth
    docEle.style.fontSize = `${(screenWidth * 100) / designWidth}px`
  }

  setFontSize()
  win.addEventListener('resize', setFontSize, false)
  win.addEventListener('orientationchange', setFontSize, false)
})(document, window)
