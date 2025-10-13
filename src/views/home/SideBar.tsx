
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { NavLink } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
function SideBar() {


  const menuItems = [
    { name: "Products", icon: "grid", path: "/products" ,end:true},
    { name: "AddProduct", icon: "people-circle", path: "/products/add" ,end:true},
  ];

  return (
      <Fragment>
      {/* Left Sidebar */}
      <div
        className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark min-vh-100"
        style={{ width: "280px" }}
      >
        <ul className="nav nav-pills flex-column mb-auto">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.name}>
              <NavLink
                to={item.path}
                end={item.end}   
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
