import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import './style.scss'

import markdownImg from '@/assets/images/markdown.png'
import editImg from '@/assets/images/edit.png'
import deleteImg from '@/assets/images/delete.png'
import closeImg from '@/assets/images/close.png'

import useKeyPressed from '@/hooks/useKeyPressed'

const FileList = ({ files, onFileDelete, onFileSave, onFileClick }) => {
  const [status, setStatus] = useState(false)
  const [value, setValue] = useState('')
  const inputNode = useRef(null)
  const enterPressed = useKeyPressed(13)
  const escPressed = useKeyPressed(27)

  const closeUpdateInput = editorItem => {
    setValue('')
    setStatus(null)
    if (editorItem.isNew) {
      onFileDelete(editorItem.id)
    }
  }

  const onFileEdit = item => {
    setValue(item.title)
    setStatus(item.id)
  }

  useEffect(() => {
    const file = files.find(item => item.id === status)
    if (status && enterPressed) {
      if (!inputNode.current.value || !inputNode.current.value.trim()) return
      onFileSave(status, inputNode.current.value)
      setStatus(false)
    } else if (status && escPressed) {
      closeUpdateInput(file)
    }
  })

  useEffect(() => {
    const newFile = files.find(file => file.id === status)
    const handleInputBlur = () => closeUpdateInput(newFile)
    if (status) {
      inputNode.current.focus()
      inputNode.current.addEventListener('blur', handleInputBlur)
    }
    return () => {
      if (inputNode.current) {
        inputNode.current.removeEventListener('blur', handleInputBlur)
      }
    }
  }, [status])

  useEffect(() => {
    const newFile = files.find(file => file.isNew)
    if (newFile) {
      setStatus(newFile.id)
      setValue(newFile.title)
    }
  }, [files])

  return (
    <ul className="filelist-wrap">
      {files.length ? (
        files.map(item => (
          <li className="item" key={item.id} onClick={() => onFileClick(item)}>
            {item.id === status || item.isNew ? (
              <div className="active-item" onClick={event => event.stopPropagation()}>
                <input
                  className="input small"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  placeholder="请输入文件名称"
                  ref={inputNode}
                  maxLength="30"
                />
                <button className="btn none search-btn" onClick={() => closeUpdateInput(item)}>
                  <img className="search-img" src={closeImg} alt="close" />
                </button>
              </div>
            ) : (
              <>
                <div className="item-left">
                  <img className="markdown" src={markdownImg} alt="markdown" />
                  <span className="content" title={item.title}>
                    {item.title}
                  </span>
                </div>
                <div className="item-right">
                  <button
                    className="btn none edit-btn"
                    title="edit"
                    onClick={event => {
                      event.stopPropagation()
                      onFileEdit(item)
                    }}
                  >
                    <img src={editImg} alt="edit" />
                  </button>

                  <button
                    className="btn none edit-btn"
                    title="delete"
                    onClick={event => {
                      event.stopPropagation()
                      onFileDelete(item.id)
                    }}
                  >
                    <img src={deleteImg} alt="delete" />
                  </button>
                </div>
              </>
            )}
          </li>
        ))
      ) : (
        <p className="nofile">新建Markdown文档</p>
      )}
    </ul>
  )
}

FileList.propTypes = {
  files: PropTypes.array.isRequired,
  onFileDelete: PropTypes.func.isRequired,
  onFileSave: PropTypes.func.isRequired,
  onFileClick: PropTypes.func.isRequired,
}

export default FileList
