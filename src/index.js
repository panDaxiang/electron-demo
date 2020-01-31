import React, { useState } from 'react'
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

const App = () => {
  const [files, setFiles] = useState([])
  const [searchFiles, setSearchFiles] = useState([])
  const [openedIds, setOpenedIds] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [unSavedIds, setUnSavedIds] = useState([])

  const onFileClick = file => {
    setActiveId(file.id)
    if (!openedIds.includes(file.id)) {
      setOpenedIds([...openedIds, file.id])
    }
  }

  const onTabClick = id => {
    setActiveId(id)
  }

  const onTabClose = id => {
    const newOpenedIds = openedIds.filter(item => item !== id)
    if (newOpenedIds.length > 0) {
      setActiveId(newOpenedIds[0])
    }
    setOpenedIds(newOpenedIds)
  }

  const handleChange = value => {
    if (!unSavedIds.includes(activeId)) {
      setUnSavedIds([...unSavedIds, activeId])
    }
    files.map(item => {
      if (item.id === activeId) {
        item.body = value
      }
      return item
    })
  }

  const onFileDelete = id => {
    const newFiles = files.filter(item => item.id !== id)
    setFiles(newFiles)
    onTabClose(id)
  }

  const onFileUpdate = (id, title) => {
    const newFiles = files.map(item => {
      item.isNew = false
      if (item.id === id) {
        item.title = title
      }
      return item
    })
    setFiles(newFiles)
  }

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

  const onFileSearch = value => {
    const newFiles = files.filter(item => item.title.includes(value.trim()))
    setSearchFiles(newFiles)
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
