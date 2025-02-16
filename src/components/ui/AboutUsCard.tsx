import { Card } from 'antd'
const AboutUsCard = () => {
  return (
    <section className='container section'>
        <h2 className="heading">About us</h2>
        <div className="about-wrapper">
        <Card style={{ width: '100%' }}>
            <p style={{fontSize: '18px', fontWeight: '500'}}>Welcome to Carnest</p>
            <p style={{fontSize: '16px', fontWeight: '400'}}>your trusted destination for both new and used cars. At Carnest, we pride ourselves on offering a wide selection of top-quality vehicles at the most affordable prices. Whether you're looking for a brand-new car or a reliable pre-owned vehicle, we ensure each car meets high standards for quality, safety, and performance.</p>
            <p style={{fontSize: '16px', fontWeight: '400'}}>
                Our mission is simple: to make your car buying experience smooth, transparent, and enjoyable. We believe that everyone deserves to drive their dream car without breaking the bank, and we’re here to help make that happen.
                With a customer-first approach, we provide expert advice, flexible financing options, and exceptional after-sales service to ensure you drive away with confidence. Explore our collection of cars and find the perfect match for your needs at the best value. At Carnest, your satisfaction is our priority.
            </p>
        </Card>
        </div>
    </section>
  )
}

export default AboutUsCard
