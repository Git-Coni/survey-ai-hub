import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className='header'>
      <div className='container'>
        <div className='header-content'>
          <Link to='/' className='logo'>
            <h1>Survey AI Hub</h1>
          </Link>

          <nav className='nav'>
            <Link
              to='/'
              className={`nav-link ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              홈
            </Link>
            <Link
              to='/surveys'
              className={`nav-link ${
                location.pathname === "/surveys" ? "active" : ""
              }`}
            >
              설문 목록
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
