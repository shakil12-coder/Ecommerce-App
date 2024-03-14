import React from "react";
import { NavLink, Link } from "react-router-dom";
import { HiShoppingBag } from "react-icons/hi";
import { useAuth } from "../../context/auth";
import { toast } from 'react-toastify';
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from '../../context/cart';
import {Badge} from 'antd'

const Header = () => {
  const [cart] = useCart();
  const [auth, setAuth] = useAuth();
  const categories = useCategory();
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: ""
    })
    localStorage.removeItem('auth');
    toast.success("Logout Successfully");
  }

  const navLinkStyle = {
    color: '#000',
    textDecoration: 'none',
    marginLeft: '15px',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  };

  const dropdownItemStyle = {
    color: '#000',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            <HiShoppingBag /> My App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <SearchInput />
              <li className="nav-item">
                <NavLink to="/" className="nav-link" style={navLinkStyle}>
                  Home
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <NavLink
                  className="nav-link dropdown-toggle"
                  to={"/"}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={navLinkStyle}
                >
                  Category
                </NavLink>
                
                <ul className="dropdown-menu">
                  <li>
                    <NavLink 
                      className="dropdown-item"
                      to={"/categories"}
                      style={dropdownItemStyle}
                    >
                      All Categories
                    </NavLink>
                  </li>
                  {categories.map((c , i) => (
                    <li key={i}>
                      <NavLink 
                        className="dropdown-item"
                        to={`/category/${c.slug}`}
                        style={dropdownItemStyle}
                      >
                        {c.name} 
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link" style={navLinkStyle}>
                      REGISTER
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link" style={navLinkStyle}>
                      LOGIN
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={navLinkStyle}
                    >
                      {auth.user.name}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`} className="dropdown-item" style={dropdownItemStyle}>
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                          style={dropdownItemStyle}
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}
              <li className="nav-item">
                <NavLink to="/cart" className="nav-link" style={navLinkStyle}>
                  <Badge count={cart && cart.length} showZero>
                    CART 
                  </Badge>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
