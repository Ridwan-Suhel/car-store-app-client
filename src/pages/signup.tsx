/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Button, Typography, Card } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../redux/features/auth/authApi";
// import { useAppDispatch } from "../redux/hook";
import { toast } from "sonner";
// import { setUser } from "../redux/features/auth/authSlice";
// import { TUser } from "../utils/Type";

const { Title, Text } = Typography;

const SignupForm = () => {

  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const [signup] = useSignupMutation();

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    try {
      const res = await signup(values).unwrap();
      console.log(res);
      if(res.success){
        toast.success(res?.message, {
          duration: 500,
          position: 'bottom-center',  
        });
        setTimeout(() => {
          navigate('/login');
          toast.success('Please login now to continue session', {
            duration: 5000,
            position: 'bottom-center', 
            style: {
              backgroundColor: 'green',
              color: 'white',
            },  
          });
        }, 500);
      }
      // dispatch(setUser({user, token: res.data.token}));
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
        toast.error("Signup failed. Please try again.", {
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
        <Title level={2} className="title">Create an Account</Title>
        <Text type="secondary">Sign up to get started.</Text>

        {/* Signup Form */}
        <Form layout="vertical" onFinish={onFinish} className="signup-form">
          {/* Name Field */}
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your full name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your name" />
          </Form.Item>

          {/* Email Field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters long!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
          </Form.Item>

          {/* Signup Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign Up
            </Button>
          </Form.Item>

          {/* Login Link */}
          <Text>
            Already have an account? <NavLink to="/login">Log in</NavLink>
          </Text>
        </Form>
      </Card>
    </div>
  );
};

export default SignupForm;
