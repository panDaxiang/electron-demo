import React, { useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import uuidv1 from 'uuid/v1'

import './scss/reset.scss'
import './scss/common.scss'
import './style.scss'

import FileSearch from '@/components/FileSearch'
import FileList from '@/components/FileList'
import TabList from '@/components/TabList'

import BottomBtn from '@/components/BottomBtn'
import newFileImg from '@/assets/images/New file.png'
import importImg from '@/assets/images/import-file.png'
import saveImg from '@/assets/images/save.png'

import fileHelper from '@/utils/fileHelper'
// import { arrayToObj } from '@/utils/helper'

const { remote } = window.require('electron')
const path = window.require('path')

// 暂时文件存储在桌面
const saveLocation = remote.app.getPath('desktop')

const join = filename => path.join(saveLocation, 'md', `${filename}.md`)

const App = () => {
  const [files, setFiles] = useState([])
  const [searchFiles, setSearchFiles] = useState([])
  const [openedIds, setOpenedIds] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [unSavedIds, setUnSavedIds] = useState([])
  let timer = useRef(null)

  // const filesObj = arrayToObj(files, 'id')

  // 点击文件,会打开在tab栏中
  const onFileClick = file => {
    setActiveId(file.id)
    if (!openedIds.includes(file.id)) {
      setOpenedIds([...openedIds, file.id])
    }
  }

  // 点击tab 改变active状态
  const onTabClick = id => {
    setActiveId(id)
  }

  // 关闭tab
  const onTabClose = id => {
    const newOpenedIds = openedIds.filter(item => item !== id)
    if (newOpenedIds.length > 0) {
      setActiveId(newOpenedIds[0])
    }
    setOpenedIds(newOpenedIds)
  }

  // 当前文档内容改变回调
  const handleChange = value => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (!unSavedIds.includes(activeId)) {
        setUnSavedIds([...unSavedIds, activeId])
      }
      files.map(item => {
        if (item.id === activeId) {
          item.body = value
        }
        return item
      })
      setFiles(files)
    }, 1000)
  }

  // 删除文件
  const onFileDelete = id => {
    const newFiles = files.filter(item => item.id !== id)
    setFiles(newFiles)
    onTabClose(id)
  }

  // 更新文件
  const onFileUpdate = async (id, title) => {
    // eslint-disable-next-line
    let isNew = false,
      file = null
    const newFiles = files.map(item => {
      if (item.id === id) {
        file = { ...item }
        if (item.isNew) {
          isNew = true
        }
        // 更新文件名称
        item.title = title
      }
      item.isNew = false
      return item
    })

    try {
      if (isNew) {
        await fileHelper.writeFile(join(title), file.body)
      } else {
        await fileHelper.rename(join(file.title), join(title))
      }
      setFiles(newFiles)
    } catch (err) {
      console.log(err)
    }
  }

  // 新建文件
  const onCreateFile = () => {
    setFiles([
      ...files,
      {
        id: uuidv1(),
        title: '',
        body: '## 请输入内容',
        createdAt: new Date().getTime(),
        isNew: true,
      },
    ])
  }

  // 搜索文件
  const onFileSearch = value => {
    const newFiles = files.filter(item => item.title.includes(value.trim()))
    setSearchFiles(newFiles)
  }

  // 保存文件
  const saveFile = async () => {
    try {
      const file = files.find(item => item.id === activeId)
      await fileHelper.writeFile(join(file.title), file.body)
      const newUnSavedIds = unSavedIds.filter(item => item !== activeId)
      setUnSavedIds(newUnSavedIds)
    } catch (err) {
      console.log(err)
    }
  }

  const activeFile = files.find(file => file.id === activeId)
  const defaultFiles = searchFiles.length > 0 ? searchFiles : files
  return (
    <div className="root">
      <aside>
        <FileSearch
          title="My Markdown"
          onFileSearch={value => onFileSearch(value)}
          exit={() => setSearchFiles([])}
        />

        <FileList
          files={defaultFiles}
          onFileClick={onFileClick}
          onFileDelete={onFileDelete}
          onFileSave={(id, value) => onFileUpdate(id, value)}
        />

        <div className="bottom-btn-wrap">
          <BottomBtn
            title="新建"
            icon={newFileImg}
            color="rgb(43, 133, 216)"
            onClick={onCreateFile}
          />
          <BottomBtn title="导入" icon={importImg} color="rgb(55, 189, 103)" />
        </div>
      </aside>

      <section>
        {openedIds.length ? (
          <>
            <TabList
              files={files}
              openedIds={openedIds}
              activeId={activeId}
              unSavedIds={unSavedIds}
              onTabClick={id => onTabClick(id)}
              onTabClose={id => onTabClose(id)}
            />
            {unSavedIds.length ? (
              <button onClick={saveFile} className="save btn none">
                <img src={saveImg} alt="保存" />
              </button>
            ) : null}

            <SimpleMDE
              key={activeFile && activeFile.body}
              onChange={value => handleChange(value)}
              value={activeFile && activeFile.body}
            />
          </>
        ) : (
          <p className="no-opendefiles">选择或者创建新的Markdown文档</p>
        )}
      </section>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
