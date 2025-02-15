import About from "../pages/about";
import ManageOrder from "../pages/adminPages/manageOrder";
import ManageProduct from "../pages/adminPages/manageProduct";
import ManageUser from "../pages/adminPages/manageUser";
import Contact from "../pages/contact";
import Dashboard from "../pages/Dashboard";

const adminRoutes = [
    {
        index: true,
        element: <Dashboard />
    },
    {
        path: 'dashboard',
        element: <Dashboard />
    },
    {
        path: 'manage-user',
        element: <ManageUser />
    },
    {
        path: 'manage-product',
        element: <ManageProduct />
    },
    {
        path: 'manage-order',
        element: <ManageOrder />
    },
    {
        path: 'about',
        element: <About />
    },
    {
        path: 'contact',
        element: <Contact />
    },
]



export default adminRoutes ;