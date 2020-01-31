import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'

import closeImg from '@/assets/images/close.png'

const TabList = ({ files, openedIds, onTabClose, activeId, onTabClick, unSavedIds }) => {
  return (
    <ul className="tablist-wrap">
      {files.map(item => {
        return openedIds.includes(item.id) ? (
          <li
            className={`list-item ${unSavedIds.includes(item.id) ? 'unsave' : ''} ${
              activeId === item.id ? 'active' : ''
            }`}
            key={item.id}
            title={item.title}
            onClick={() => onTabClick(item.id)}
          >
            <span className="content">{item.title}</span>
            {unSavedIds.includes(item.id) ? <div className="unsave" /> : null}

            <img
              className="icon"
              src={closeImg}
              alt="close"
              onClick={e => {
                e.stopPropagation()
                onTabClose(item.id)
              }}
            />
          </li>
        ) : null
      })}
    </ul>
  )
}

TabList.propTypes = {
  files: PropTypes.array,
  openedIds: PropTypes.array,
  unSavedIds: PropTypes.array,
  activeId: PropTypes.string,
  onTabClose: PropTypes.func,
  onTabClick: PropTypes.func,
}

TabList.defaultProps = {
  activeId: '',
}

export default TabList
