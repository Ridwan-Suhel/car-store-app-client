/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Row, Col, Select, Divider, Image } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hook";
import { useCurrentUser } from "../redux/features/auth/authSlice";
import { TUser } from "../utils/Type";
import { useCreateOrderMutation } from "../redux/features/Products/productApi";
import { toast } from "sonner";

const { Option } = Select;

const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const data = location.state?.product;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const user = useAppSelector(useCurrentUser) as TUser;

  const [createOrder, {error}] = useCreateOrderMutation();
  const onFinish = async (values: any) => {
    try{
      const payload = {
        ...values,
        car: data?._id,
        user: user?.id,
        quantity: 1,
        totalPrice: Number(data?.price)
      }
      setLoading(true);
      const res = await createOrder(payload).unwrap();
      const result = res?.data;
      console.log(result)
      if(res.success){
        console.log(result)
        const paymentUrl = result.payment?.checkout_url;
        console.log(paymentUrl)
        setTimeout(() => {
          window.location.href = paymentUrl;
        }, 1000);
      }else{
        toast.error("Something went wrong", {
          duration: 5000,
          position: 'bottom-center',
          style: {
            backgroundColor: 'red',
            color: 'white',
          },  
        });
        console.log(error)
        setLoading(false);
      }
      console.log(res)
    }
    catch(error: any){

      toast.error( error?.data?.message || "Something went wrong", {
        duration: 5000,
        position: 'bottom-center',
        style: {
          backgroundColor: 'red',
          color: 'white',
        },  
      });
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div style={{ maxWidth: "1000px", margin: "auto", padding: "16px" }}>
        <Row gutter={24}>
          {/* Left Side - Form */}
          <Col xs={24} md={14}>
            <Card title="Billing & Shipping Information">
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[{ required: true, message: "Please enter your full name" }]}
                >
                  <Input placeholder="John Doe" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
                >
                  <Input placeholder="example@mail.com" />
                </Form.Item>

                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[{ required: true, message: "Enter your phone number" }]}
                >
                  <Input placeholder="+8801XXXXXXXXX" />
                </Form.Item>

                <Form.Item
                  label="Shipping Address"
                  name="address"
                  rules={[{ required: true, message: "Enter your shipping address" }]}
                >
                  <Input placeholder="123, Street Name, City" />
                </Form.Item>

                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true, message: "Enter your city" }]}
                >
                  <Input placeholder="Dhaka" />
                </Form.Item>

                <Form.Item
                  label="Country"
                  name="country"
                >
                  <Select placeholder="Select Country">
                    <Option value="Bangladesh">Bangladesh</Option>
                    <Option value="India">India</Option>
                    <Option value="USA">USA</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Right Side - Order Summary */}
          <Col xs={24} md={10}>
            <Card title="Order Summary">
                <Image 
                  alt={data.model} 
                  src={data.image} 
                  style={{ width: "100%", height: "auto", objectFit: "cover",
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }} 
                />
              <div>
                <span style={{ fontSize: "18px" }}>{data?.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Model</span>
                <span>{data?.model}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                <span>Price</span>
                <span>$ {data?.price}</span>
              </div>
              <Divider />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <span>Total</span>
                <span>$ {data?.price}</span>
              </div>
            </Card>
            
            <Button
              size="large"
              block
              icon={<CreditCardOutlined />}
              style={{ marginTop: "20px", borderRadius: '3px', 
                backgroundImage: 'linear-gradient(180deg, #12b447, #10a140)',
                color: '#fff',
                borderColor: '#0c7c31',
              }}
              onClick={() => form.submit()} 
              loading={loading}
            >
              PROCEED TO PAYMENT
            </Button>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Checkout;
