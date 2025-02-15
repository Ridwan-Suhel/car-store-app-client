/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Form, Input, InputNumber, Button, Table, message, Modal, Row, Col, Select, Tag } from "antd";
import { useCreateProductMutation, useDeleteOrderMutation, useGetOrdersQuery, useUpdateOrderMutation } from "../../redux/features/Products/productApi";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";

const ManageOrder = () => {
  const { data: orders, refetch } = useGetOrdersQuery(undefined);
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [updateOrder] = useUpdateOrderMutation(); 
  const [deleteOrder] = useDeleteOrderMutation();
  const [editingProduct, setEditingProduct] = useState<any>(null);


  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditState, setEditState] = useState(false);


//   const category = ["Sedan", "SUV", "Truck", "Hatchback", "Electric SUV", "Coupe", "Convertible"];
//   const brands = ["Ford", "Audi", "Nissan", "Tesla", "Mercedes-Benz", "BMW", "Jeep", "Peugeot", "Leapmotor"];
//   const models = ["1 Series", "G-Class", "Avenger", "208 GT", "C10"];

const statuses = ["Pending", "Paid", "Shipped", "Completed", "Cancelled"]
  // Open the modal
   // Open the modal for editing an existing product
   const showModal = (product: any) => {
    setEditState(false)
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  // Close modal & reset form
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setEditingProduct(null); 
  };

  // Handle form submission
  const onFinish = async (values: any) => {
      try {
          if (editingProduct || isEditState) {
          console.log(editingProduct);
        // Update existing product
        await updateOrder({ id: editingProduct?._id, payload: values }).unwrap();
        message.success('Product updated successfully!');
      } else {
        // Create a new product
        await createProduct(values).unwrap();
        message.success('Product added successfully!');
      }
      handleCancel();
      refetch(); // Refresh product list
    } catch (error) {
        console.log(error)
      message.error('Failed to save product.');
    }
  };

const handleDelete = (id: any) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      content: 'Once deleted, this product cannot be recovered.',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          // Proceed with deletion if the user confirms
          await deleteOrder(id).unwrap();
          message.success('Product deleted successfully!');
          refetch(); // Refresh product list
        } catch (error) {
          console.error(error);
          message.error('Failed to delete product.');
        }
      },
      onCancel: () => {
        // Optionally log or handle cancel action here
        console.log('Delete action cancelled');
      },
    });
  };

//   showModal(record)
  const editProductClick = (record: any) => {
    console.log(record);

    form.setFieldsValue({
        name: record?.car?.name,
        status: record?.status,
        email: record?.email,
        price: record?.totalPrice,
        quantity: record.quantity,
    });
    setEditingProduct(record);
    showModal(record);
    setEditState(true)
  }

  const columns = [
    { 
      title: "User Name", 
      dataIndex: ["user", "name"], 
      key: "userName",
      render: (text: any)  => text || "N/A"
    },
    { 
      title: "User email", 
      dataIndex: ["email"], 
      key: "userEmail",
      render: (text: any)  => 
        typeof text === "string" ? text.slice(0, 15).concat("...") : "N/A",
    },
    { 
      title: "Car Name", 
      dataIndex: ["car", "name"], 
      key: "carName",
      render: (text: any)  => 
        typeof text === "string" ? text.slice(0, 7).concat("...") : "N/A",
    },
    { 
      title: "Trx Status", 
      dataIndex: ["transaction", "bank_status"], 
      key: "transactionStatus",
      render: (text: any)  => text || "N/A"
    },
    { 
      title: "Order Status", 
      dataIndex: ["status"], 
      key: "orderStatus",
    //   render: (text: any)  => text || "N/A"
      render: (text: any) => (
        <>
        {/* "Pending", "Paid", "Shipped", "Completed", "Cancelled" */}
          {(typeof text === "string" && text === 'Paid') &&(
            <Tag color="blue" style={{ fontSize: "16px", padding: "8px 16px",textAlign: 'center', width: '115px'}}>
              {text}
            </Tag>
          )}
          {(typeof text === "string" && text === 'Cancelled') &&(
            <Tag color="red" style={{ fontSize: "16px", padding: "8px 16px",textAlign: 'center', width: '115px'}}>
              {text}
            </Tag>
          )}
          {(typeof text === "string" && text === 'Pending') &&(
            <Tag color="orange" style={{ fontSize: "16px", padding: "8px 16px",textAlign: 'center', width: '115px'}}>
              {text}
            </Tag>
          )}
          {(typeof text === "string" && text === 'Shipped') &&(
            <Tag color="green" style={{ fontSize: "16px", padding: "8px 16px",textAlign: 'center', width: '115px'}}>
              {text}
            </Tag>
          )}
          {(typeof text === "string" && text === 'Completed') &&(
            <Tag color="green" style={{ fontSize: "16px", padding: "8px 16px",textAlign: 'center', width: '115px'}}>
              {text}
            </Tag>
          )}
        </>
      ),
    },
    { 
      title: "Car Brand", 
      dataIndex: ["car", "brand"], 
      key: "carBrand",
      render: (text: any)  => text || "N/A"
    },
    { 
      title: "Total Price ($)", 
      dataIndex: "totalPrice", 
      key: "totalPrice",
      render: (text: any)  => text || "N/A"
    },
    { 
      title: "Quantity", 
      dataIndex: "quantity", 
      key: "quantity",
      render: (text: any)  => text || "N/A"
    },
    { 
      title: "Created At", 
      dataIndex: "createdAt", 
      key: "createdAt",
      render: (text: any) =>
        text ? new Date(text).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "N/A",
    },
    {
      title: "Actions", // Action column for Edit and Delete
      key: "actions",
      render: (_: any, record: any) => (
        <span>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => editProductClick(record)} 
            style={{ marginRight: 8 }}
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record._id)} 
            danger 
          />
        </span>
      ),
    },
  ];
  
  
  

  return (
    <div style={{ padding: "20px 0px" }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px'}}>
        <h2>Manage orders</h2>
      </div>

      {/* Modal for Adding a Product */}
      <Modal
        className="add-product-modal"
        title={isEditState ? 'Edit Order' : 'Add New Order'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        >
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={[16, 16]}>
            <Col xs={24} sm={24}  lg={12}>
                <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true, message: "Enter product name" }]}
                >
                <Input placeholder="Enter product name" disabled />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24}  lg={12}>
                <Form.Item
                        label="Status"
                        name="status"
                        >
                        <Select placeholder="Select status">
                            {
                                statuses.map((item) => 
                                    <Option key={item} value={item}>{item}</Option>
                                )
                            }
                        </Select>
                        </Form.Item>
                </Col>

            <Col xs={24} sm={24}  lg={12}>
                <Form.Item
                name="email"
                label="User email"
                rules={[{ required: true, message: "Enter user email" }]}
                >
                <Input placeholder="Enter user email" />
                </Form.Item>
            </Col>

            <Col xs={24} sm={24}  lg={12}>
                <Form.Item name="price" label="Price"  rules={[{ required: true }]}>
                <InputNumber placeholder="Enter price" disabled style={{ width: "100%" }} />
                </Form.Item>
            </Col>

            <Col xs={24} sm={24}  lg={12}>
                <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <InputNumber placeholder="Enter quantity" disabled style={{ width: "100%" }} />
                </Form.Item>
            </Col>

            <Col xs={24} sm={24}  lg={24}>
                <Form.Item>
                <Button type="primary" size="large" block htmlType="submit" loading={isLoading}>
                    {isEditState ? 'Update' : 'Add'} Order
                </Button>
                </Form.Item>
            </Col>
            </Row>
        </Form>
        </Modal>


      {/* Product Table */}
      <h3 style={{marginBottom: '30px'}}>Product List</h3>
      <Table dataSource={orders?.data} columns={columns} rowKey="_id" 
      scroll={{ x: 'max-content' }}
      pagination={{
            pageSize: 15,
        }}
 />
    </div>
  );
};

export default ManageOrder;
