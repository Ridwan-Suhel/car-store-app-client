import { Button, Card, Carousel, Col, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSlider() {
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

      type THeroItem = {
        title: string;
        description: string;
      };


      const heroItems: THeroItem[] = [
        {
          title: 'Drive Your Future Today 🔥',
          description: 'Browse thousands of cars near you and drive home your dream vehicle today.',
        },
        {
            title: 'Your Car, Your Way 😍',
            description: 'Fast, simple, and secure. Your next car is just a few clicks away.',
        },
      ];

      const goToShop = () => {
        navigate('/shop')
      }
      
  return (
    <Carousel arrows={false} dots={false} infinite={true} autoplay={true} autoplaySpeed={5500}
    beforeChange={() => {
        setAnimate(false); // Reset animation
        setTimeout(() => setAnimate(true), 50); // Reapply animation
      }}
      className="slider-main"
      >
        {heroItems.map((item, index) => (
            <div key={index}>
                <div className={`slider ${index === 1 ? "slider-2" : "slider-1"}`}>
                    <div className="container">
                    <Row>
                        <Col sm={24} md={24} lg={12}>
                            <div className="content-wrapper" style={{marginTop: '50px'}}>
                                <div>
                                <h2 className="headline">{item.title}</h2>
                                <p className="sub-headline">{item.description}</p>
                                <Card style={{ width: 350 }}>
                                    <p style={{fontSize: '18px',marginBottom: '10px', textAlign: 'center'}}>Find your next car, nationwide.</p>
                                    <Button color="purple" variant="solid" size="large" block
                                    onClick={() => goToShop()}
                                    style={{ fontSize: '17px', fontWeight: '400' }}>
                                        Shop now
                                    </Button>
                                </Card>
                                </div>
                            </div>
                        </Col>
                        <Col className="right-col" sm={24} md={24} lg={12}>
                            <div className={`slider-object ${animate ? "animate-img" : ""}`}>
                                <img src="car-1.png" alt="Car" />
                            </div>
                        </Col>
                    </Row>
                    </div>
                </div>
            </div>
        ))}
    </Carousel>
  )
}
