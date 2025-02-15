/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Drawer, Layout, Menu, MenuProps } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { logOut, useCurrentToken, useCurrentUser } from "../../redux/features/auth/authSlice";
import FooterSection from "../ui/FooterSection";

const { Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];


export default function MainLayout() {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logOut());
    navigate('/login')
  }

  const user: any = useAppSelector(useCurrentUser);
  const myAccount = () => {
    navigate(`/my-account/${user?.id}`)
  }

  const items: MenuItem[] = [
    {
      label: <NavLink to={'/home'}>Home</NavLink>,
      key: 'home',
    },
    {
      label: <NavLink to={'/about'}>About</NavLink>,
      key: 'about',
    },
    {
      label: <NavLink to={'/blog'}>Blog</NavLink>,
        key: 'blog',
    },
    {
      label: <NavLink to={'/shop'}>Shop</NavLink>,
        key: 'shop',
    },
  ];

  const token = useAppSelector(useCurrentToken);
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
      label: <span onClick={myAccount}>My account</span>,
        key: 'my-account',
    },
    {
      label: <span onClick={handleLogout}>Logout</span>,
        key: 'logout',
    }
  );
}

    const [current, setCurrent] = useState('mail');

    const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };


  const onClick = (e: any) => {
    setCurrent(e.key);
  };


  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header for User */}
        <Layout>
            {/* header navigation for desktop  */}
            <div className="lg-screen-nav" style={{ }}>
                <div style={{  background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{maxWidth: '1400px',margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px', }}>
                        <NavLink to={'/home'} style={{ cursor: 'pointer' }}>
                            <img src="/carnest-logo.png" alt="Logo" style={{ height: '40px' }} />
                        </NavLink>
                        
                        <Menu onClick={onClick} selectedKeys={[current]} 
                        mode="horizontal" items={items}
                        style={{ borderBottom: 'none', minWidth: '500px', justifyContent: 'flex-end' }}
                        />
                    </div>
                </div>
            </div>
            {/* header navigation for mobile  */}
            <div className="mb-screen-nav">
            
            <div className="mb-screen-wrapper">
            <NavLink to={'/home'} style={{ cursor: 'pointer' }}>
                            <img src="/carnest-logo.png" alt="Logo" style={{ height: '40px' }} />
                        </NavLink>
                        
                  <Button color="purple" variant="solid" onClick={showDrawer}>
                      <UnorderedListOutlined />
                  </Button>
            </div>

                  <Drawer title="Carnest" onClose={onClose} className="mb-drawer" open={open}>
                  {items.map((item: any, index) => (
                      <p onClick={onClose} key={index}>{item.label}</p>
                  ))}
                  </Drawer>
            </div>

            <Content style={{ padding: 0 }}>
              <Outlet />
            </Content>

            <FooterSection />
        </Layout>
    </Layout>
  )
}
