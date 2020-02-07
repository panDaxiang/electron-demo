import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import './style.scss'

import searchFileImg from '@/assets/images/search.png'
import closeImg from '@/assets/images/close.png'

import useKeyPressed from '@/hooks/useKeyPressed'
import useIpcRender from '@/hooks/useIpcRender'

const FileSearch = ({ title, onFileSearch, exit }) => {
  const [inputActive, setInputActive] = useState(false)
  const [value, setValue] = useState('')
  const inputNode = useRef(null)
  const enterPressed = useKeyPressed(13)
  const escPressed = useKeyPressed(27)

  const closeInputSearch = () => {
    setInputActive(false)
    setValue('')
    onFileSearch('')
    exit()
  }

  useEffect(() => {
    if (inputActive && enterPressed) {
      onFileSearch(value)
    }
    if (inputActive && escPressed) {
      closeInputSearch()
    }
  })

  useEffect(() => {
    if (inputActive) {
      inputNode.current.focus()
    }
  }, [inputActive])

  useIpcRender({
    'search-file': () => setInputActive(true),
  })

  return (
    <div className="search-file-wrap">
      {!inputActive ? (
        <>
          <span className="title">{title}</span>
          <button className="btn none search-btn" onClick={() => setInputActive(true)}>
            <img className="search-img" src={searchFileImg} alt="search" />
          </button>
        </>
      ) : (
        <>
          <input
            ref={inputNode}
            className="input small"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="请输入搜索文件名"
          />
          <button className="btn none search-btn" onClick={closeInputSearch}>
            <img className="search-img" src={closeImg} alt="close" />
          </button>
        </>
      )}
    </div>
  )
}

FileSearch.propTypes = {
  title: PropTypes.string.isRequired,
  onFileSearch: PropTypes.func.isRequired,
  exit: PropTypes.func.isRequired,
}

export default FileSearch
