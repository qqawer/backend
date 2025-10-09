import { createBrowserRouter } from 'react-router-dom';
import ProductList from './views/products/ProductList';

import App from './App';
import AddProduct from './views/products/AddProduct';
import EditProduct from './views/products/EditProduct';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,   // ① 全局布局
    children: [
        { path: 'products', element: <ProductList /> }, // ③ 商品页
      { path: 'products/add', element: <AddProduct /> }, // ④ 添加商品页
        { path: 'products/:id', element: <EditProduct /> }
    ],
  },
]);