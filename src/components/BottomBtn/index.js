import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'

const BottomBtn = ({ title, icon, color, onClick }) => {
  return (
    <button
      className="btn none buttom-btn"
      style={{ background: `${color}` }}
      onClick={() => onClick()}
    >
      {icon ? <img src={icon} alt={title} /> : null}

      <span className="title">{title}</span>
    </button>
  )
}

BottomBtn.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
}

export default BottomBtn
