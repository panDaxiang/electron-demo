import { useEffect, useRef } from 'react'

const { remote } = window.require('electron')
const { Menu, MenuItem } = remote

/* 
  menuItemList: muen list, []
  domWrapperClass: 可显示菜单的dom class, string
*/
const useContextMenu = (menuItemList, domWrapperClass) => {
  const curMenuDOM = useRef(null)
  useEffect(() => {
    const menu = new Menu()
    const contextWrapper = document.querySelector(domWrapperClass)

    menuItemList.forEach(item => {
      menu.append(new MenuItem(item))
    })
    const handleContextMenu = e => {
      if (contextWrapper !== e.target && contextWrapper.contains(e.target)) {
        curMenuDOM.current = e.target
        menu.popup({
          window: remote.getCurrentWindow(),
        })
      }
    }
    contextWrapper.addEventListener('contextmenu', handleContextMenu)
    return () => {
      contextWrapper.removeEventListener('contextmenu', handleContextMenu)
    }
  })

  return curMenuDOM
}

export default useContextMenu
