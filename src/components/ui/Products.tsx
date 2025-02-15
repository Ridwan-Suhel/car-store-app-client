/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Row, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useGetProductsQuery } from "../../redux/features/Products/productApi";

const Products = ({heading, showItem, showFeatured, filteredProducts, isLoading: filterLoading}: any) => {
  const { isLoading, data } = useGetProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const navigate = useNavigate();
  
  if (isLoading || filterLoading) {
    return (
      <section className="container section" style={{ paddingTop: 0 }}>
        <h2 className="heading">{heading}</h2>
        <Row gutter={[0, 10]}>
          {Array.from({ length: showItem || 8 }).map((_, index) => (
            <Col sm={24} md={12} lg={6} className="single-item" key={index}>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Col>
          ))}
        </Row>
      </section>
    );
  }


  console.log('filteredProducts === from shop ', filteredProducts)

  let itemsToDisplay;
  if(!filteredProducts){
    itemsToDisplay = showFeatured
    ? data?.data.filter((item: any) => item?.featured) // Only show featured items
    : data?.data;
  }else{
    itemsToDisplay = filteredProducts.data;
  }
      
  return (
    <section className="container section" style={{ paddingTop: 0 }}>
        <h2 className="heading">{heading}</h2>
        <Row gutter={[0, 10]}>
        {
                itemsToDisplay.slice(0, showItem ? showItem : data.length).map( (item: any, index: number) => (
                  
                  <Col sm={24} md={12} lg={6} className="single-item" key={index} >
                        <ProductCard item={item} />
                    </Col>
                    
                ))
            }
        </Row>
        {
          showFeatured &&
          <div style={{textAlign: 'center', paddingTop: '50px'}}>
                <Button variant="solid" size="large" onClick={() => navigate('/shop')} className="custom-button" >View All</Button>
          </div>
        }
    </section>
  )
}

export default Products
