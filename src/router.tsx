import { createHashRouter } from 'react-router-dom'; // 换这一行
import ProductList from './views/products/ProductList';
import AddProduct from './views/products/AddProduct';
import EditProduct from './views/products/EditProduct';
import App from './App';

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'products', element: <ProductList /> },
      { path: 'products/add', element: <AddProduct /> },
      { path: 'products/:id', element: <EditProduct /> },
    ],
  },
]);