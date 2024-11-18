import {
  Container,
  Row,
  Col,
  Table,
  Card,
} from "react-bootstrap";
import {FaCheckCircle } from "react-icons/fa";
import visa from "../assets/visa.jpg";

const VisaPolicyInfo = () => {
  return (
    <Container className="mt-4">
      {/* Title Section */}
      <img
        src={visa}
        style={{
          width: "100%",
          maxWidth: "100%",
          height: "180px",
          borderRadius: "5px",
        }}
      />

      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.6",
        }}
      >
        <h1
          style={{
            color: "#1546ac",
            borderBottom: "2px solid #ccc",
            paddingBottom: "25px",
            textAlign: "center",
          }}
        >
          China Visa-Free Transit Policy
        </h1>

        <section style={{ marginBottom: "20px" }}>
          <h2
            className="visa-h2"
            style={{ color: "#333", fontSize: "25px", marginTop: "20px" }}
          >
            24-hour Visa-Free Transit Policy
          </h2>
          <p>
            China has implemented a{" "}
            <strong>24-hour visa-free transit policy</strong> for foreign
            nationals from all other countries around the world at all its
            accessible exit-entry ports.
          </p>
          <p>
            Foreign nationals holding valid international travel documents and
            connecting tickets with confirmed seats, who intend to transit via
            China by international flights, ships, or trains to third countries
            or regions, are exempt from visa applications, provided that:
          </p>
          <ul style={{ marginLeft: "20px", listStyleType: "disc" }}>
            <li>Their stay period in China will not exceed 24 hours.</li>
            <li>They remain within the corresponding ports.</li>
          </ul>
          <p>
            Those who plan to leave the ports must apply for temporary entry
            permits at the exit-entry border inspection authorities of the
            corresponding ports.
          </p>
        </section>

        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ color: "#333", fontSize: "25px", marginTop: "20px" }}>
            72-hour or 144-hour Visa-Free Transit Policy
          </h2>
          <p>
            Currently, <strong>41 exit-entry ports</strong> in{" "}
            <strong>
              19 provinces, autonomous regions, and municipalities
            </strong>{" "}
            directly under the Central Government of China have implemented the
            72-hour or 144-hour visa-free transit policy for foreign nationals
            from <strong>54 countries</strong>.
          </p>
          <h3 style={{ color: "#333", fontSize: "25px", marginTop: "20px" }}>
            54 Eligible Countries:
          </h3>
          <p style={{ marginLeft: "20px" }}>
            Albania, Argentina, Australia, Austria, Belarus, Belgium, Bosnia and
            Herzegovina, Brazil, Brunei, Bulgaria, Canada, Chile, Croatia,
            Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Germany,
            Greece, Hungary, Iceland, Ireland, Italy, Japan, Latvia, Lithuania,
            Luxembourg, Malta, Mexico, Monaco, Montenegro, the Netherlands, New
            Zealand, North Macedonia, Norway, Poland, Portugal, Qatar, the
            Republic of Korea, Romania, Russia, Serbia, Singapore, Slovakia,
            Slovenia, Spain, Sweden, Switzerland, Ukraine, the United Arab
            Emirates, the United Kingdom, and the United States.
          </p>
        </section>
      </div>
      {/* Eligibility Criteria */}
      <Row>
        <Col>
          <h2 style={{ color: "#333", fontSize: "25px" }}>
            Eligibility Criteria
          </h2>
          <Card className="mb-4">
            <Card.Body>
              <ul>
                <li>
                  <FaCheckCircle className="me-2 text-success" />
                  Travelers must hold valid passports from 53 eligible countries
                  (e.g., United States, United Kingdom, Australia, Germany).
                </li>
                <li>
                  <FaCheckCircle className="me-2 text-success" />
                  Must have confirmed tickets to a third country or region with
                  a departure within 144 hours.
                </li>
                <li>
                  <FaCheckCircle className="me-2 text-success" />
                  Must enter and exit through the designated ports in the
                  applicable cities.
                </li>
                <li>
                  <FaCheckCircle className="me-2 text-success" />
                  Cannot leave the applicable cities or regions during the
                  144-hour period.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Notes and Recommendations */}
      <Row>
        <Col>
          <h2 style={{ color: "#333", fontSize: "25px" }}>Important Notes</h2>
          <ul>
            <li>
              <strong>Ensure Validity:</strong> Confirm that your travel
              itinerary meets the requirements of the visa-free transit policy.
            </li>
            <li>
              <strong>Document Verification:</strong> Immigration officials may
              check return tickets, hotel reservations, and other supporting
              documents.
            </li>
            <li>
              <strong>Entry Stamp:</strong> Make sure to receive the 144-hour
              visa-free stamp at the port of entry.
            </li>
          </ul>
        </Col>
      </Row>

      {/* Example Travel Itineraries */}
      <Row>
        <Col>
          <h2 style={{ color: "#333", fontSize: "25px", marginTop: "20px" }}>
            Example Travel Itineraries
          </h2>
          <p>
            Here are examples of travel plans that qualify for the 144-hour
            visa-free transit policy:
          </p>
          <ul>
            <li>New York → Shanghai → Tokyo (Eligible)</li>
            <li>Los Angeles → Guangzhou → Singapore (Eligible)</li>
            <li>
              Berlin → Beijing → Berlin (Not Eligible, as this is a round trip)
            </li>
          </ul>
        </Col>
      </Row>
      {/* Applicable Cities and Ports */}
      <Row>
        <Col>
          <h2 style={{ color: "#333", fontSize: "25px", marginTop: "20px" }}>
            Applicable Cities and Ports of Entry
          </h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>City</th>
                <th>Entry Ports</th>
                <th>Scope of Permitted Travel</th>
                <th>Exit Ports</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Beijing</td>
                <td>
                  Beijing Capital International Airport, Beijing Daxing
                  International Airport
                </td>
                <td>
                  Beijing Municipality, Tianjin Municipality, and Hebei Province
                </td>
                <td>
                  Any port applicable to the 144-hour visa-free transit policy
                  within the Beijing-Tianjin-Hebei region
                </td>
              </tr>
              <tr>
                <td>Tianjin</td>
                <td>
                  Tianjin Binhai International Airport, Tianjin International
                  Cruise Home Port
                </td>
                <td>
                  Beijing Municipality, Tianjin Municipality, and Hebei Province
                </td>
                <td>
                  Any port applicable to the 144-hour visa-free transit policy
                  within the Beijing-Tianjin-Hebei region
                </td>
              </tr>
              <tr>
                <td>Shijiazhuang (Hebei Province)</td>
                <td>Shijiazhuang Zhengding International Airport</td>
                <td>Hebei Province</td>
                <td>Shijiazhuang Zhengding International Airport</td>
              </tr>
              <tr>
                <td>Qinhuangdao (Hebei Province)</td>
                <td>Port of Qinhuangdao (Passenger transport)</td>
                <td>Hebei Province</td>
                <td>Port of Qinhuangdao (Passenger transport)</td>
              </tr>
              <tr>
                <td>Shanghai</td>
                <td>
                  Shanghai Pudong International Airport, Shanghai Hongqiao
                  International Airport, Shanghai Port (Passenger transport,
                  including Shanghai Port International Cruise Terminal and
                  Wusongkou International Cruise Terminal)
                </td>
                <td>
                  Jiangsu Province, Zhejiang Province, and Shanghai Municipality
                </td>
                <td>
                  Any port applicable to the 144-hour visa-free transit policy
                  within the Jiangsu-Zhejiang-Shanghai region
                </td>
              </tr>
              <tr>
                <td>Hangzhou (Zhejiang Province)</td>
                <td>Hangzhou Xiaoshan International Airport</td>
                <td>Zhejiang Province</td>
                <td>Hangzhou Xiaoshan International Airport</td>
              </tr>
              <tr>
                <td>Ningbo (Zhejiang Province)</td>
                <td>Ningbo Lishe International Airport</td>
                <td>Zhejiang Province</td>
                <td>Ningbo Lishe International Airport</td>
              </tr>
              <tr>
                <td>Wenzhou (Zhejiang Province)</td>
                <td>Wenzhou Port (Passenger transport)</td>
                <td>Zhejiang Province</td>
                <td>Wenzhou Port (Passenger transport)</td>
              </tr>
              <tr>
                <td>Zhoushan (Zhejiang Province)</td>
                <td>Zhoushan Port (Passenger transport)</td>
                <td>Zhejiang Province</td>
                <td>Zhoushan Port (Passenger transport)</td>
              </tr>
              <tr>
                <td>Nanjing (Jiangsu Province)</td>
                <td>Nanjing Lukou International Airport</td>
                <td>Jiangsu Province</td>
                <td>Nanjing Lukou International Airport</td>
              </tr>
              <tr>
                <td>Lianyungang (Jiangsu Province)</td>
                <td>Lianyungang Port (Passenger transport)</td>
                <td>Jiangsu Province</td>
                <td>Lianyungang Port (Passenger transport)</td>
              </tr>
              <tr>
                <td>Guangzhou (Guangdong Province)</td>
                <td>
                  Guangzhou Baiyun International Airport, Nansha Port (Passenger
                  transport)
                </td>
                <td>Guangdong Province</td>
                <td>
                  Any of the 36 entry/exit ports in Guangdong Province (land,
                  sea, and air)
                </td>
              </tr>
              <tr>
                <td>Shenzhen (Guangdong Province)</td>
                <td>
                  Shenzhen Baoan International Airport, Shekou Port (Passenger
                  transport)
                </td>
                <td>Guangdong Province</td>
                <td>
                  Any of the 36 entry/exit ports in Guangdong Province (land,
                  sea, and air)
                </td>
              </tr>
              <tr>
                <td>Jieyang (Guangdong Province)</td>
                <td>Jieyang Chaoshan International Airport</td>
                <td>Guangdong Province</td>
                <td>Jieyang Chaoshan International Airport</td>
              </tr>
              <tr>
                <td>Shenyang (Liaoning Province)</td>
                <td>Shenyang Taoxian International Airport</td>
                <td>Liaoning Province</td>
                <td>Shenyang Taoxian International Airport</td>
              </tr>
              <tr>
                <td>Dalian (Liaoning Province)</td>
                <td>
                  Dalian Zhoushuizi International Airport, Dalian Port
                  (Passenger transport)
                </td>
                <td>Liaoning Province</td>
                <td>
                  Any port applicable to the 144-hour visa-free transit policy
                  within Liaoning
                </td>
              </tr>
              <tr>
                <td>Qingdao (Shandong Province)</td>
                <td>
                  Qingdao Jiaodong International Airport, Qingdao Port (Qingdao
                  International Cruise Home Port)
                </td>
                <td>Shandong Province</td>
                <td>
                  Any port applicable to the 144-hour visa-free transit policy
                  within Shandong
                </td>
              </tr>
              <tr>
                <td>Zhengzhou (Henan Province)</td>
                <td>Zhengzhou Xinzheng International Airport</td>
                <td>Henan Province</td>
                <td>Zhengzhou Xinzheng International Airport</td>
              </tr>
              <tr>
                <td>Chongqing</td>
                <td>Chongqing Jiangbei International Airport</td>
                <td>Chongqing Municipality</td>
                <td>Chongqing Jiangbei International Airport</td>
              </tr>
              <tr>
                <td>Kunming (Yunnan Province)</td>
                <td>Kunming Changshui International Airport</td>
                <td>
                  9 cities in Yunnan: Kunming, Lijiang, Yuxi, Pu’er, Chuxiong,
                  Dali, Xishuangbanna, Honghe, and Wenshan
                </td>
                <td>
                  Any port applicable to the 144-hour visa-free transit policy
                  within Yunnan
                </td>
              </tr>
              <tr>
                <td>Lijiang (Yunnan Province)</td>
                <td>Lijiang Sanyi International Airport</td>
                <td>Yunnan Province</td>
                <td>Lijiang Sanyi International Airport</td>
              </tr>
              <tr>
                <td>Xishuangbanna (Yunnan Province)</td>
                <td>Mohan Railway Port</td>
                <td>Yunnan Province</td>
                <td>Mohan Railway Port</td>
              </tr>
              <tr>
                <td>Chengdu (Sichuan Province)</td>
                <td>Chengdu Shuangliu International Airport</td>
                <td>
                  11 cities in Sichuan: Chengdu, Leshan, Deyang, Suining,
                  Meishan, Ya’an, Ziyang, Neijiang, Zigong, Luzhou, and Yibin
                </td>
                <td>Chengdu Shuangliu International Airport</td>
              </tr>
              <tr>
                <td>Xi’an (Shaanxi Province)</td>
                <td>Xi’an Xianyang International Airport</td>
                <td>2 cities in Shaanxi: Xi’an and Xiangyang</td>
                <td>Xi’an Xianyang International Airport</td>
              </tr>
              <tr>
                <td>Xiamen (Fujian Province)</td>
                <td>
                  Xiamen Gaoqi International Airport, Xiamen Port (Passenger
                  transport, including Xiamen Wutong Passenger Terminal and
                  Xiamen International Cruise Center Port)
                </td>
                <td>Xiamen city only</td>
                <td>
                  Any port applicable to the 144-hour visa-free transit policy
                  within Xiamen
                </td>
              </tr>
              <tr>
                <td>Wuhan (Hubei Province)</td>
                <td>Wuhan Tianhe International Airport</td>
                <td>Wuhan city only</td>
                <td>Wuhan Tianhe International Airport</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Contact Information */}
      <Row>
        <Col style={{ marginBottom: "20px" }}>
          <h2 style={{ color: "#333", fontSize: "25px", marginTop: "20px" }}>
            Contact Information
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              color: "#666",
              //   paddingBottom: "50px",
              display: "inline",
            }}
          >
            For more details or inquiries, visit the official immigration
            website or contact the Chinese Embassy in your country.
            <a
              href="http://us.china-embassy.gov.cn/eng/lsfw/zj/qz2021/202407/t20240705_11449052.htm"
              target="_blank"
              style={{
                color: "#0066cc",
                fontSize: "16px",
                fontWeight: "600",
                textDecoration: "none",
                marginLeft: "5px",
              }}
            >
              Learn More
            </a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default VisaPolicyInfo;
