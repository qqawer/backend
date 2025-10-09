
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { NavLink } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
function SideBar() {


  const menuItems = [
    // { name: "Home", icon: "home", path: "/" ,end:true},
    { name: "Products", icon: "grid", path: "/products" ,end:true},
    { name: "AddProduct", icon: "people-circle", path: "/products/add" ,end:true},
  ];

  return (
      <Fragment>
      {/* 左侧 Sidebar */}
      <div
        className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark min-vh-100"
        style={{ width: "280px" }}
      >
        {/* <a
          href="#"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <svg className="bi pe-none me-2" width="40" height="32">
            <use xlinkHref="#bootstrap"></use>
          </svg>
          <span className="fs-4">Sidebar</span>
        </a>
        <hr /> */}

        <ul className="nav nav-pills flex-column mb-auto">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.name}>
              <NavLink
                to={item.path}
                end={item.end}   // 首页只在完全匹配时高亮
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : "text-white"}`
                }
              >
                <svg
                  className="bi pe-none me-2"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <use xlinkHref={`#${item.icon}`} />
                </svg>
                {item.name}
                </NavLink>
            </li>
          ))}
        </ul>

      </div>
      </Fragment>
  );
};

export default SideBar;
