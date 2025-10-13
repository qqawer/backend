function Header() {
  return (
        <header className=" d-flex flex-wrap justify-content-center py-3 border-bottom">
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
            <svg className="bi me-2" width="40" height="32" aria-hidden="true">
              <use xlinkHref="#bootstrap"></use>
            </svg>
            <span className="fs-4">Back-end management system</span>
          </a>
        </header>

  );
}
export default Header;