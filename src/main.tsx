import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.scss'
import { router } from './router.tsx'


// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />
//   },
//   {
//     path: '/products',
//     element: <ProductList />
//   },
//   {
//     path:"*",
//     element:<NotFoundPage/>
//   }
// ])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
