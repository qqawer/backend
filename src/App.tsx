import './App.css'
import Header from './views/home/Header';
import SideBar from './views/home/SideBar';
import { Outlet } from 'react-router-dom';


function App() {
  return (
    <div className="d-flex flex-column">
      <Header />
      <div className="d-flex flex-grow-1 overflow-hidden">
        <SideBar />                       {/* 始终存在 */}
        <main className="flex-grow-1 overflow-auto">
          <Outlet />                      {/* 只替换这里 */}
        </main>
      </div>
    </div>
  );
}

export default App
