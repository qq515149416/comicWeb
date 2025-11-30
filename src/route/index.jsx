import { createHashRouter, Navigate, RouterProvider } from 'react-router'
import Home from '../view/display/home'
import Detail from '../view/display/detail'
import Reader from '../view/display/reader'

const router = createHashRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/detail/:comicId',
        element: <Detail />
    },
    {
        path: '/reader/:comicId/:pageIndex',
        element: <Reader />
    },
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
])

export default function Routes() {
    return <RouterProvider router={router} />
}