import React  from 'react'
import {Link } from "react-router-dom"
import "./header.css"
import { FaGithub } from "react-icons/fa6";

// Header component
function Header() {
  return (
    <header className="header">
        <div className="logo-header">
            <Link className="header-img" to="/">
                <img src="./logo512.png" width="40" height="40" alt="BT Classification Logo" />
            </Link>
            <Link className='link' to="/">BT Classification</Link>
        </div>
        <div className="icons">
            <div className="menu-modal-nav">               
              <Link to="https://github.com/NaBo-00" className="GitHub-link link" target="_blank">
                <FaGithub /> <span>GitHub</span>
              </Link>                                                                                
            </div>
        </div>
      </header>
  )
}

export default Header