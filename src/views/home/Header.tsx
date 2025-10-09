function Header() {
  return (
        <header className=" d-flex flex-wrap justify-content-center py-3 border-bottom">
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            <svg className="bi me-2" width="40" height="32" aria-hidden="true">
              <use xlinkHref="#bootstrap"></use>
            </svg>
            <span className="fs-4">Back-end management system</span>
          </a>
          {/* <ul className="nav nav-pills">
            <li className="nav-item">
              <a href="#" className="nav-link active" aria-current="page">Home</a>
            </li>
            <li className="nav-item"><a href="#" className="nav-link">Features</a></li>
            <li className="nav-item"><a href="#" className="nav-link">Pricing</a></li>      
            <li className="nav-item"><a href="#" className="nav-link">FAQs</a></li>
            <li className="nav-item"><a href="#" className="nav-link">About</a></li>
          </ul> */}
          <div className="dropdown text-end">
              <a
                href="#"
                className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://github.com/mdo.png"
                  alt="mdo"
                  width="32"
                  height="32"
                  className="rounded-circle"
                />
              </a>
              <ul className="dropdown-menu text-small">
                <li><a className="dropdown-item" href="#">New project...</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Sign out</a></li>
              </ul>
            </div>
        </header>

  );
}
export default Header;