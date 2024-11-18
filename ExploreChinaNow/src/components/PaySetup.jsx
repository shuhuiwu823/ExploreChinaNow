
import { Container, Row, Col, Card, Accordion } from "react-bootstrap";

const PaySetup = () => {
  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">How to Pay in China</h1>
      <p>
        China has become a global leader in mobile payments, leaving cash and
        traditional cards behind. Understanding how to pay in China is crucial
        for a smooth travel experience or everyday life as a resident. This
        guide explores the different payment methods in China, focusing on
        mobile wallets and offering solutions for tourists.
      </p>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header
              className="bg-primary text-white"
              style={{ marginLeft: "unset" }}
            >
              Alipay
            </Card.Header>
            <Card.Body>
              <p>
                Alipay, created by Alibaba, allows users to connect their bank
                accounts and add funds to their virtual wallets. Payments are
                made by scanning unique QR codes. Alipay can also handle bills,
                money transfers, and online shopping. However, international
                bank cards cannot be used for some financial services like red
                packets or insurance.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header className="bg-success text-white">
              WeChat Pay
            </Card.Header>
            <Card.Body>
              <p>
                Part of the popular WeChat messaging app, WeChat Pay offers QR
                code-based payments and features like booking rides and
                reservations. International cards can be used for everyday
                purchases, but certain features, like red packets, are not
                supported.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Other Payment Methods</Card.Header>
            <Card.Body>
              <ul>
                <li>
                  <strong>UnionPay:</strong> Widely accepted, but foreign-issued
                  cards may have limited usability.
                </li>
                <li>
                  <strong>Cash:</strong> Still used in smaller towns and rural
                  areas but less common in cities.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>QR Code Payments</Card.Header>
            <Card.Body>
              <ul>
                <li>
                  <strong>Scan to Pay:</strong> Use the "Scan" function in your
                  app to scan the merchant's QR code, enter the payment amount,
                  and confirm.
                </li>
                <li>
                  <strong>Show to Pay:</strong> Display your payment code in the
                  app for the merchant to scan.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <style>
        {`
          .accordion-button:focus {
            outline: none !important;
            box-shadow: none !important; /* 可选 */
          }
        `}
      </style>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ outline: "none", boxShadow: "none" }}>
            Online Shopping
          </Accordion.Header>
          <Accordion.Body>
            Mobile wallets integrate seamlessly with platforms like Taobao,
            Tmall, and JD.com, making online shopping fast and easy.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Transferring Money</Accordion.Header>
          <Accordion.Body>
            Splitting bills or casual payments is simple with Alipay and WeChat
            Pay. Note that international cards cannot be used for money
            transfers.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Fees and Limits</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col>
                <h5>WeChat Pay</h5>
                <ul>
                  <li>
                    <strong>Transaction Limits:</strong> RMB 6,500 per
                    transaction, RMB 50,000 monthly, and RMB 65,000 annually.
                  </li>
                  <li>
                    <strong>Transaction Fees:</strong> Free for amounts under
                    RMB 200, 3% for amounts above. Refund fees are proportional.
                  </li>
                </ul>
              </Col>
              <Col>
                <h5>Alipay</h5>
                <ul>
                  <li>
                    <strong>Transaction Limits:</strong> RMB 3,000 per
                    transaction, RMB 50,000 monthly, and RMB 60,000 annually.
                  </li>
                  <li>
                    <strong>Transaction Fees:</strong> Free for amounts under
                    RMB 200, 3% for amounts above. Refund fees are proportional.
                  </li>
                </ul>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* <img
        src={pay}
        style={{
          width: "100%",
          maxWidth: "100%",
          height: "auto",
          borderRadius: "5px",
          marginTop: "40px",
          marginBottom: "20px",
        }}
      /> */}
    </Container>
  );
};

export default PaySetup;
