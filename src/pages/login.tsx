/* eslint-disable @typescript-eslint/no-explicit-any */
import '../styles/login.css';
import { Form, Input, Button, Typography, Card } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../redux/features/auth/authApi';
import { useAppDispatch } from '../redux/hook';
import { setUser } from '../redux/features/auth/authSlice';
import { verifyToken } from '../utils/verifyToken';
import { TUser } from '../utils/Type';
import { toast } from 'sonner'; // Import sonner for toast notifications

const { Title, Text } = Typography;

export default function LoginForm () {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const onFinish = async (values: any) => {
    try {
      const res = await login(values).unwrap();
      const user = verifyToken(res?.data?.token) as TUser;
      dispatch(setUser({user, token: res.data.token}));
      navigate(`${user?.role === 'user' ? '/' : '/admin/dashboard'}`);
    } catch (err: any) {
      console.log(err)
      // Error handling
      if (err?.data || err?.data?.message) {
        console.log(err?.data?.message)
        toast.error(err?.data?.message || "An unexpected error occurred.", {
          duration: 5000,
          position: 'bottom-center',
          style: {
            backgroundColor: 'red',
            color: 'white',
          },  
        });
      } else {
        toast.error("Login failed. Please try again.", {
          duration: 5000,
          position: 'bottom-center',
          style: {
            backgroundColor: 'red',
            color: 'white',
          },  
        });
      }
    }
  };

  return (
    <div className="card-container">
      <Card className="form-card">
        {/* Logo */}
        <NavLink to='/' className="logo-container">
          <img src="carnest-logo-2.png" alt="Logo" className="logo" />
        </NavLink>

        {/* Headline */}
        <Title level={2} className="title">Welcome</Title>
        <Text type="secondary">Log in with your carnest account to continue.</Text>

        {/* Login Form */}
        <Form layout="vertical" onFinish={onFinish} className="login-form">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          {/* Forgot Password */}
          <Form.Item>
            <a className="forgot-password" href="/forgot-password">
              Forgot password?
            </a>
          </Form.Item>

          {/* Login Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in securely
            </Button>
          </Form.Item>

          {/* Signup Link */}
          <Text>
            Don't have an account? <NavLink to="/signup">Sign up</NavLink>
          </Text>
        </Form>
      </Card>
    </div>
  );
};
