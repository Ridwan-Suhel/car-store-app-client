/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Form, Input, InputNumber, Button, Switch, Table, message, Modal, Row, Col, Select, Upload, UploadProps } from "antd";
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from "../../redux/features/Products/productApi";
import { DeleteOutlined, EditOutlined, PlusSquareOutlined, ShoppingCartOutlined, UploadOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { useNavigate } from "react-router-dom";

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/du6ohxizn/upload`;

const ManageProduct = () => {
  const navigate = useNavigate();
  const { data: products, refetch } = useGetProductsQuery(undefined);
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation(); 
  const [deleteProduct] = useDeleteProductMutation();
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditState, setEditState] = useState(false);


  const category = ["Sedan", "SUV", "Truck", "Hatchback", "Electric SUV", "Coupe", "Convertible"];
  const brands = ["Ford", "Audi", "Nissan", "Tesla", "Mercedes-Benz", "BMW", "Jeep", "Peugeot", "Leapmotor"];
  const models = ["1 Series", "G-Class", "Avenger", "208 GT", "C10"];

  
  const props: UploadProps = {
    name: "file",
    action: CLOUDINARY_UPLOAD_URL,
    data: {
      upload_preset: "carnest",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        setFileUrl(info?.file?.response?.secure_url);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
   // Open the modal for editing an existing product
   const showModal = () => {
    // form.setFieldsValue({ inStock: true });
    setEditState(false)
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
        const formData = {
          ...values,
          image: fileUrl, // Include uploaded file URL
        };

        if (editingProduct || isEditState) {
        // Update existing product
        await updateProduct({ id: editingProduct?._id, payload: formData }).unwrap();
        message.success('Product updated successfully!');
        setFileUrl(null);
      } else {
        // Create a new product
        await createProduct(formData).unwrap();
        message.success('Product added successfully!');
        setFileUrl(null);
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
          await deleteProduct(id).unwrap();
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
    setEditingProduct(record);
    form.setFieldsValue(record);
    showModal();
    setEditState(true)
  }


  const buyNow = (data: any) => {
    navigate(`/checkout`, { state: { product: data } });
    }
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Model", dataIndex: "model", key: "model" },
    { title: "Year", dataIndex: "year", key: "year" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Price ($)", dataIndex: "price", key: "price" },
    { title: "Stock", dataIndex: "quantity", key: "quantity" },
    { title: "On Sale", dataIndex: "isOnSale", key: "isOnSale", render: (val: any) => (val ? "Yes" : "No") },
    {
        title: "Actions", // Action column for Edit and Delete
        key: "actions",
        render: (_: any, record: any) => (
          <span>
            <Button 
              icon={<EditOutlined />} 
              onClick={() =>  editProductClick(record)} 
              style={{ marginRight: 8 }}
            />
            <Button 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record._id)} 
              danger 
              style={{ marginRight: 8 }}
            />
            <Button 
              icon={<ShoppingCartOutlined />} 
              onClick={() => buyNow(record)} 
              style={{color: 'purple', borderColor: 'purple'}} 
            />
          </span>
        ),
      },
  ];

  return (
    <div style={{ padding: "20px 0px" }}>
      <div className="flex-column" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px'}}>
      <h2>Manage Products</h2>

        {/* Open Modal Button */}
        <Button type="primary" onClick={showModal} style={{ marginBottom: 20 }}>
        <PlusSquareOutlined /> Add New Product
        </Button>
      </div>

      {/* Modal for Adding a Product */}
      <Modal 
       className="add-product-modal"
      title={isEditState ? 'Edit Product' : 'Add New Product' } open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical"
         initialValues={{ inStock: true }} 
         onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} lg={12}>
                <Form.Item name="name" label="Product Name" rules={[{ required: true, message: "Enter product name" }]}>
                    <Input placeholder="Enter product name" />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} lg={12}>
                <Form.Item name="description" label="Product Description" rules={[{ required: true, message: "Enter product description" }]}>
                    <Input placeholder="Enter product name" />
                </Form.Item>
            </Col>

        <Col xs={24} sm={24} lg={12}>
        <Form.Item
                  label="Brand"
                  name="brand"
                >
                  <Select placeholder="Select brand">
                    {
                        brands.map((item) => 
                            <Option key={item} value={item}>{item}</Option>
                        )
                    }
                  </Select>
                </Form.Item>
        </Col>
          

          <Col xs={24} sm={24} lg={12}>
                <Form.Item
                  label="Model"
                  name="model"
                >
                  <Select placeholder="Select model">
                    {
                        models.map((item) => 
                            <Option key={item} value={item}>{item}</Option>
                        )
                    }
                  </Select>
                </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                <InputNumber placeholder="Enter year" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={12}>
          <Form.Item
                  label="Category"
                  name="category"
                >
                  <Select placeholder="Select brand">
                    {
                        category.map((item) => 
                            <Option key={item} value={item}>{item}</Option>
                        )
                    }
                  </Select>
                </Form.Item>
            </Col>
          <Col xs={24} sm={24} lg={12}>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber placeholder="Enter price" style={{ width: "100%" }} />
          </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={12}>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber placeholder="Enter quantity" style={{ width: "100%" }} />
          </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={4}>
          <Form.Item name="featured" label="is Featured" valuePropName="checked">
            <Switch />
          </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={4}>
          <Form.Item name="inStock" label="In Stock" valuePropName="checked">
            <Switch />
          </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} lg={4}>
          <Form.Item name="isOnSale" label="On Sale" valuePropName="checked">
            <Switch />
          </Form.Item>
          </Col>
          
          <Col xs={24} sm={24} lg={12}>
          {/* <Form.Item name="image" label="Image URL">
            <Input placeholder="Enter image URL" />
          </Form.Item> */}
          <p style={{marginBottom: '8px'}}>Upload Product Image</p>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          </Col>
          
          <Col xs={24} sm={24} lg={24}>
          <Form.Item>
            <Button type="primary" size="large" block htmlType="submit" loading={isLoading}>
              {isEditState ? 'Update' : 'Add'} Product
            </Button>
          </Form.Item>
          </Col>
          
          
          </Row>
        </Form>
      </Modal>

      {/* Product Table */}
      <h3 style={{marginBottom: '30px'}}>Product List</h3>
      <Table dataSource={products?.data} columns={columns} rowKey="_id" 
      scroll={{ x: 'max-content' }}
      pagination={{
            pageSize: 15,
        }}
 />
    </div>
  );
};

export default ManageProduct;
