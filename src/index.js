import React, { useState, useRef, useEffect } from 'react'
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
const Store = window.require('electron-store')
const fs = window.require('fs')

const store = new Store({
  name: 'Markdown Files Data',
})

const saveFileToStore = files => {
  const newFiles = []
  files &&
    files.forEach(file => {
      newFiles.push({
        id: file.id,
        title: file.title || '',
        path: file.path || '',
        createdAt: file.createdAt || '',
      })
    })

  store.set('files', newFiles || [])
  return newFiles
}

// 暂时文件存储在桌面
const saveLocation = `${remote.app.getPath('desktop')}/markdown_files`

const join = filename => path.join(saveLocation, `${filename}.md`)

const App = () => {
  const [files, setFiles] = useState(store.get('files') || [])
  const [searchFiles, setSearchFiles] = useState([])
  const [openedIds, setOpenedIds] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [unSavedIds, setUnSavedIds] = useState([])
  let timer = useRef(null)

  useEffect(() => {
    const watchFiles = async () => {
      try {
        await fileHelper.readdir(saveLocation)
        fs.watch(saveLocation, (event, filename) => {
          fileHelper.readdir(saveLocation).then(res => {
            if (!res.includes(filename) && filename) {
              console.log('file_change', event)
            }
          })
        })
      } catch (err) {
        console.log(err)
        fs.mkdir(saveLocation, { recursive: true }, errMsg => console.log(errMsg))
      }
    }

    watchFiles()
  }, [])

  const deleteUnsaveFile = id => {
    // alert('文件不存在')
    remote.dialog.showErrorBox('', '文件不存在')
    const newFiles = files.filter(file => file.id !== id)
    setFiles(newFiles)
    saveFileToStore(newFiles)
  }

  // 点击文件,会打开在tab栏中
  const onFileClick = id => {
    setActiveId(id)

    const file = files.find(item => item.id === id)

    if (file.isLoaded) {
      setOpenedIds([...openedIds, id])
    }

    file.isLoaded ||
      fileHelper
        .readFile(file.path)
        .then(value => {
          const newFiles = files.map(item => {
            if (item.id === file.id) {
              item.body = value
              item.isLoaded = true
            }
            return item
          })
          setFiles(newFiles)
          setOpenedIds([...openedIds, file.id])
        })
        .catch(() => {
          deleteUnsaveFile(file.id)
          const ids = openedIds.filter(item => item !== file.id)
          setOpenedIds(ids)
        })
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
  const onFileDelete = async id => {
    let deletepath = ''
    const newFiles = files.filter(item => {
      if (item.id !== id) {
        return true
      }
      deletepath = item.path
      return false
    })
    try {
      deletepath && (await fileHelper.deleteFile(deletepath))
      setFiles(newFiles)
      saveFileToStore(newFiles)
      onTabClose(id)
    } catch (err) {
      deleteUnsaveFile(id)
    }
  }

  // 更新文件
  const onFileUpdate = async (id, title) => {
    let newPath = ''
    let oldPath = ''
    // eslint-disable-next-line
    let isNew = false,
      file = null
    const newFiles = files.map(item => {
      if (item.id === id) {
        file = { ...item }
        if (item.isNew) {
          isNew = true
        }
        oldPath = isNew ? join(title) : item.path
        newPath = path.join(path.dirname(oldPath), `${title}${path.extname(oldPath)}`)
        item.title = title
        item.path = newPath
      }
      item.isNew = false
      return item
    })

    try {
      if (isNew) {
        await fileHelper.writeFile(oldPath, file.body)
      } else {
        await fileHelper.rename(oldPath, newPath)
      }
      setFiles(newFiles)
      saveFileToStore(newFiles)
    } catch (err) {
      console.log(err)
      deleteUnsaveFile(id)
    }
  }

  // 新建文件
  const onCreateFile = () => {
    setFiles([
      ...files,
      {
        id: uuidv1(),
        title: '',
        createdAt: new Date().getTime(),
        isNew: true,
        body: '',
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
    const file = files.find(item => item.id === activeId)
    try {
      await fileHelper.writeFile(file.path, file.body)
      const newUnSavedIds = unSavedIds.filter(item => item !== activeId)
      setUnSavedIds(newUnSavedIds)
    } catch (err) {
      deleteUnsaveFile(activeId)
      const ids = openedIds.filter(id => id !== activeId)
      setOpenedIds(ids)
    }
  }

  // 导入文件
  const onImportFiles = async () => {
    const { filePaths = [] } = await remote.dialog.showOpenDialog({
      title: '导入文件',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Markdown files', extensions: ['md'] }],
    })

    if (filePaths.length > 0) {
      const addFiles =
        filePaths
          .filter(curPath => {
            const isAlready = !!files.find(
              file => file.title === path.basename(curPath, path.extname(curPath)),
            )
            return !isAlready
          })
          .map(item => ({
            id: uuidv1(),
            title: path.basename(item, path.extname(item)),
            path: item,
            createAt: new Date().getTime(),
          })) || []

      if (addFiles.length > 0) {
        setFiles([...files, ...addFiles])
        saveFileToStore(files)
        remote.dialog.showMessageBox({
          type: 'info',
          message: '导入文件成功',
        })
      }
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
          <BottomBtn
            title="导入"
            icon={importImg}
            color="rgb(55, 189, 103)"
            onClick={onImportFiles}
          />
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
