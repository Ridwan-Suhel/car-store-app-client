/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Products from "../components/ui/Products"
import { Input, Button, Space, Drawer, Row, Col, InputNumber, Select, Radio } from "antd";
import { ControlOutlined, DeleteOutlined } from "@ant-design/icons";
import { useFilterProductQuery } from "../redux/features/Products/productApi";

const { Option } = Select;

const Shop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const category = ["Sedan", "SUV", "Truck", "Hatchback", "Electric SUV", "Coupe", "Convertible"];
  const brands = ["Ford", "Audi", "Nissan", "Tesla", "Mercedes-Benz", "BMW", "Jeep", "Peugeot", "Leapmotor"];
  const models = ["1 Series", "G-Class", "Avenger", "208 GT", "C10"];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [clearFiltedClicked, setClearFiltedClicked] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 0],
    model: "",
    brand: "",
    category: "",
    availability: "",
  });
  const [searchParams, setSearchParams] = useState<null | object>(null);

  // Clear all filters and reset search params
  const clearFilter = () => {
    setFilters({
      priceRange: [0, 0],
      model: "",
      brand: "",
      category: "",
      availability: "",
    });
    setSearchTerm("");
    setSearchParams(null); // Reset to null
    setVisible(false);
    setClearFiltedClicked(true)
  };

  const { data: filteredProducts, isLoading } = useFilterProductQuery(searchParams || {}, { skip: !searchParams });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchParams({ searchTerm: searchTerm.trim() });
    } else {
      setSearchParams(null); // Revert to default data
    }
  };

  const showDrawer = () => {
    setVisible(true);
    setClearFiltedClicked(false);
  };

  const onClose = () => {
    setVisible(false);
    setClearFiltedClicked(true);
  };

  const handleFilterChange = (key: any, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    const queryParams: any = {
      ...(filters.model && { model: filters.model }),
      ...(filters.brand && { brand: filters.brand }),
      ...(filters.category && { category: filters.category }),
      ...(filters.availability && { availability: filters.availability }),
      ...(filters.priceRange[1] > 0 && {
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
      }),
    };

    setSearchParams(queryParams);
    setVisible(false);
  };

  return (
    <main style={{ padding: '50px 0px' }}>
      <div className="top-wrapper">
        <div className="container">
          <div className="d-flex-space-between-items-center">
            <Space.Compact size="large" style={{ width: "350px" }}>
              <Input
                placeholder="Enter search text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                type="default"
                style={{ backgroundColor: "black", color: "white" }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Space.Compact>

            <div className="filter">
              <Button onClick={showDrawer} type="default" size="large" style={{ position: 'relative', paddingRight: '6px' }}>
                <ControlOutlined style={{ position: 'absolute', top: '12px', left: '12px' }} />
                <span style={{ paddingLeft: '18px', paddingRight: '6px' }}>
                  Filter results
                  {(filteredProducts?.data?.length > 0 && !clearFiltedClicked)&& (
                    <>
                      &nbsp;<strong style={{ color: '#0349bb' }}>{filteredProducts?.data?.length}</strong>
                    </>
                  )}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Drawer
        title="Filter Results"
        width={400}
        open={visible}
        onClose={onClose}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button size="large" onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              size="large"
              type="default"
              style={{ backgroundColor: "black", color: "white", paddingBottom: '8px', paddingTop: '5px' }}
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        }
      >
        {searchParams && (
          <label
            onClick={clearFilter}
            title="Clear filter"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              border: '1px solid #ddd',
              background: '#d5262645',
              color: '#c40d0d',
              fontSize: '20px',
              padding: '3px 8px',
              display: 'block',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            <DeleteOutlined />
          </label>
        )}

        {/* Price Range */}
        <Row style={{ marginBottom: "16px" }}>
          <Col span={24}>
            <span style={{ fontWeight: "500", marginRight: '10px' }}>Price Range</span>
            <InputNumber
              style={{ width: "33%", marginRight: "5%" }}
              min={0}
              value={filters.priceRange[0]}
              onChange={(value) => handleFilterChange("priceRange", [value, filters.priceRange[1]])}
              placeholder="Min"
            />
            <InputNumber
              style={{ width: "33%" }}
              min={0}
              value={filters.priceRange[1]}
              onChange={(value) => handleFilterChange("priceRange", [filters.priceRange[0], value])}
              placeholder="Max"
            />
          </Col>
        </Row>

        {/* Model */}
        <Row style={{ marginBottom: "16px" }}>
          <Col span={24}>
            <span style={{ fontWeight: "500", marginBottom: "10px", display: 'block' }}>Model</span>
            <Select
              style={{ width: "100%" }}
              value={filters.model}
              onChange={(value) => handleFilterChange("model", value)}
              placeholder="Select Model"
            >
              <Option value="null" disabled>
                Choose
              </Option>
              {models.map((item: string, index: number) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* Brand */}
        <Row style={{ marginBottom: "16px" }}>
          <Col span={24}>
            <span style={{ fontWeight: "500", marginBottom: "10px", display: 'block' }}>Brand</span>
            <Select
              style={{ width: "100%" }}
              value={filters.brand}
              onChange={(value) => handleFilterChange("brand", value)}
              placeholder="Select Brand"
            >
              <Option value="null" disabled>
                Choose
              </Option>
              {brands.map((item: string, index: number) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* Category */}
        <Row style={{ marginBottom: "16px" }}>
          <Col span={24}>
            <span style={{ fontWeight: "500", marginBottom: "10px", display: 'block' }}>Category</span>
            <Select
              style={{ width: "100%" }}
              value={filters.category}
              onChange={(value) => handleFilterChange("category", value)}
              placeholder="Select Category"
            >
              <Option value="null" disabled>
                Choose
              </Option>
              {category.map((item: string, index: number) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* Availability */}
        <Row style={{ marginBottom: "16px" }}>
          <Col span={24}>
            <span style={{ fontWeight: "500", marginBottom: "10px", display: 'block' }}>Availability</span>
            <Radio.Group value={filters.availability} onChange={(e) => handleFilterChange("availability", e.target.value)}>
              <Space direction="vertical">
                <Radio value="In Stock">In Stock</Radio>
                <Radio value="Out of Stock">Out of Stock</Radio>
              </Space>
            </Radio.Group>
          </Col>
        </Row>
      </Drawer>

      <Products heading={'All products'} isLoading={isLoading} filteredProducts={clearFiltedClicked ? null : filteredProducts} />
    </main>
  );
};

export default Shop;
