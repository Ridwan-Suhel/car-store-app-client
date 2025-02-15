/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Col, Descriptions, Row, Modal, Form, Input } from "antd";
import { useParams } from "react-router-dom";
import { useGetSingleUserQuery, useUpdateSingleUserMutation, useUpdateSingleUserByPasswordMutation } from "../redux/features/auth/authApi";
import { useState } from "react";
import { toast } from "sonner"; // Import Sonner for toast notifications

const MtAccount = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetSingleUserQuery(id);
  const [updateSingleUser, { isLoading: isUpdating }] = useUpdateSingleUserMutation();
  const [updateSingleUserByPassword, { isLoading: isUpdatingPassword }] = useUpdateSingleUserByPasswordMutation();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [updateForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Open update user modal
  const handleOpenUpdateModal = () => {
    updateForm.setFieldsValue({
      name: data?.data.name,
      email: data?.data.email,
      phone: data?.data.phone,
      address: data?.data.address,
      city: data?.data.city,
    });
    setIsUpdateModalOpen(true);
  };

  // Open change password modal
  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  // Close modals
  const handleCancelUpdate = () => setIsUpdateModalOpen(false);
  const handleCancelPassword = () => setIsPasswordModalOpen(false);

  // Update user info
  const handleUpdate = async (values: any) => {
    try {
      await updateSingleUser({ userId: id, payload: values }).unwrap();
      toast.success("User updated successfully!");
      setIsUpdateModalOpen(false);
      refetch();
    } catch (error) {
      console.log(error)
      toast.error("Failed to update user!");
    }
  };

  // Change user password
  const handleChangePassword = async (values: any) => {
    try {
      await updateSingleUserByPassword({ userId: id, payload: values }).unwrap();
      toast.success("Password updated successfully!",
        {
          position: 'bottom-center',
          style: {
            backgroundColor: 'green',
            color: 'white',
          }, 
        }
      );
      setIsPasswordModalOpen(false);
      passwordForm.resetFields(); // Clear form fields after success
    } catch (error) {
      console.log(error)
      toast.error("Incorrect current password. Please try again.",
        {
          position: 'bottom-center',
          style: {
            backgroundColor: 'red',
            color: 'white',
          }, 
        }
      );
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "16px" }}>
      {/* User Details Card */}
      <Card style={{ marginBottom: "20px" }}>
        <Row gutter={16}>
          <Col xs={24} md={14}>
            <Descriptions title="User Details" bordered column={1}>
              <Descriptions.Item label="User name">{data?.data.name}</Descriptions.Item>
              <Descriptions.Item label="User email">{data?.data.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{data?.data.phone}</Descriptions.Item>
              <Descriptions.Item label="Address">{data?.data.address}</Descriptions.Item>
              <Descriptions.Item label="City">{data?.data.city}</Descriptions.Item>
            </Descriptions>
            <Button
              style={{
                marginTop: "16px",
                borderRadius: "3px",
                backgroundImage: "linear-gradient(180deg, #12b447, #10a140)",
                color: "#fff",
                borderColor: "#0c7c31",
              }}
              block
              size="large"
              onClick={handleOpenUpdateModal}
            >
              Update User Info
            </Button>

            <label style={{ width: "100%", paddingTop: "16px", display: "block", textAlign: "center" }}>
              Or
            </label>

            <Button
              color="purple"
              variant="solid"
              style={{ marginTop: "16px", borderRadius: "3px" }}
              block
              size="large"
              onClick={handleOpenPasswordModal}
            >
              Change password
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Update User Modal */}
      <Modal title="Update User Info" open={isUpdateModalOpen} onCancel={handleCancelUpdate} footer={null}>
        <Form form={updateForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Enter name" }]}>
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Enter email" }]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Enter phone number" }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input placeholder="Enter address" />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input placeholder="Enter city" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={isUpdating}>
            Update
          </Button>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal title="Change Password" open={isPasswordModalOpen} onCancel={handleCancelPassword} footer={null}>
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="oldPassword"
            label="Current Password"
            rules={[{ required: true, message: "Enter current password" }]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: "Enter new password" }]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={isUpdatingPassword}>
            Change Password
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default MtAccount;
