import { Layout, Menu, MenuProps } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { logOut, useCurrentToken } from '../../redux/features/auth/authSlice';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export default function AdminLayout() {

  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logOut())
  }

  const token = useAppSelector(useCurrentToken);

  const items: MenuItem[] = [
    {
      label: <NavLink to={'/admin/dashboard'}>Dashboard</NavLink>,
      key: 'dashboard',
    },
    {
      label: <NavLink to={'/admin/manage-user'}>Manage user</NavLink>,
        key: 'manageuser',
    },
    {
      label: <NavLink to={'/admin/manage-product'}>Manage product</NavLink>,
        key: 'manageproduct',
    },
    {
      label: <NavLink to={'/admin/manage-order'}>Manage order</NavLink>,
        key: 'manageorder',
    },
    // {
    //   label: <NavLink to={'/shop'}>Shop</NavLink>,
    //     key: 'shop',
    // }
  ];

  if (!token) {
    items.push(
      {
        label: <NavLink to={'/login'}>Login</NavLink>,
        key: 'login',
      },
      {
        label: <NavLink to={'/signup'}>Signup</NavLink>,
        key: 'signup',
      }
    );
  }
  if (token) {
    items.push(
      {
        label: <span onClick={handleLogout}>Logout</span>,
          key: 'logout',
      },
    );
  }

  

  return (
    <Layout style={{height: '100%'}}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={{ height: '100vh', position: 'sticky', top: '0', left: '0' }}
      >
        
        <div className="top-header" style={{
          width: '100%',
          background: '#722ed1',
          height: '120px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <NavLink to={'/home'} style={{ cursor: 'pointer' }}>
              <img src="/carnest-logo.png" alt="Logo" style={{ width: '100%',filter: 'invert(1)', objectFit: 'cover' }} />
          </NavLink>
        </div>
        
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0}} onClick={handleLogout} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 8,
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
