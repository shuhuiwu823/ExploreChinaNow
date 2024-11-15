import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin
} from '@vis.gl/react-google-maps';
import 'bootstrap/dist/css/bootstrap.min.css';

const locations = [
  { key: 'beijing', location: { lat: 39.9042, lng: 116.4074 } },
  { key: 'tianjin', location: { lat: 39.0851, lng: 117.1902 } },
    { key: 'hebei', location: { lat: 38.0435, lng: 114.5149 } },
  { key: 'shannxi', location: { lat: 37.8705, lng: 112.5480 } },
  { key: 'neimenggu', location: { lat: 40.8173, lng: 111.7652 } },
  { key: 'liaoning', location: { lat: 41.7954, lng: 123.4328 } },
  { key: 'jilin', location: { lat: 43.8868, lng: 125.3245 } },
  { key: 'heilongjiang', location: { lat: 45.7489, lng: 126.6424 } },
  { key: 'shanghai', location: { lat: 31.2304, lng: 121.4737 } },
  { key: 'jiangsu', location: { lat: 32.0603, lng: 118.7969 } },
  { key: 'zhejiang', location: { lat: 30.2741, lng: 120.1551 } },
  { key: 'anhui', location: { lat: 31.8206, lng: 117.2272 } },
  { key: 'fujian', location: { lat: 26.0745, lng: 119.2965 } },
  { key: 'jiangxi', location: { lat: 28.6747, lng: 115.8262 } },
  { key: 'shandong', location: { lat: 36.6758, lng: 117.0009 } },
  { key: 'henan', location: { lat: 34.7466, lng: 113.6254 } },
  { key: 'hubei', location: { lat: 30.5844, lng: 114.2986 } },
  { key: 'hunan', location: { lat: 28.2282, lng: 112.9388 } },
  { key: 'guangdong', location: { lat: 23.1291, lng: 113.2644 } },
  { key: 'guangxi', location: { lat: 22.8155, lng: 108.3275 } },
  { key: 'hainan', location: { lat: 20.0317, lng: 110.3312 } },
  { key: 'chongqing', location: { lat: 29.5630, lng: 106.5516 } },
  { key: 'sichuan', location: { lat: 30.6570, lng: 104.0657 } },
  { key: 'guizhou', location: { lat: 26.5982, lng: 106.7135 } },
  { key: 'yunnan', location: { lat: 25.0389, lng: 102.7186 } },
  { key: 'xizang', location: { lat: 29.6520, lng: 91.1721 } },
  { key: 'shaanxi', location: { lat: 37.8705, lng: 112.5480 } },
  { key: 'ningxia', location: { lat: 38.4713, lng: 106.2782 } },
  { key: 'xinjiang', location: { lat: 43.7930, lng: 87.6177 } },
  { key: 'taipei', location: { lat: 25.032969, lng: 121.565418 } },
  { key: 'xining', location: { lat: 35.7604, lng: 103.8324 } }
];
const popularCities = [
  { key: 'beijing', name: 'Beijing', location: { lat: 39.9042, lng: 116.4074 } },
  { key: 'shanghai', location: { lat: 31.2304, lng: 121.4737 } },
  { key: 'guangdong', location: { lat: 23.1291, lng: 113.2644 } },
];

const MapContainer = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [showMarkers, setShowMarkers] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenInfo = (cityName) => {
    setSelectedCity(cityName);
    if (showMarkers === 'all') {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCity('');
  };

  const toggleMarkers = (type) => {
    setShowMarkers(prev => (prev === type ? 'none' : type));
  };

  return (
    <div className="map-container">
      <APIProvider apiKey={'AIzaSyAgYOfrSVMN-4qquy9cI_ZSM6SjhvF_cW0'}>
        <Map
          style={{ width: '100vw', height: '100vh' }}
          defaultCenter={{ lat: 35.7604, lng: 103.8324 }}
          mapId='57cb306711be27bb'
          defaultZoom={4}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {showMarkers === 'all' && <PoiMarkers pois={locations} onPoiClick={handleOpenInfo} />}
          {showMarkers === 'popular' && <PoiMarkers pois={popularCities} onPoiClick={handleOpenInfo} />}
        </Map>
      </APIProvider>

      <Button
        variant="primary"
        onClick={() => toggleMarkers('all')}
        style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000 }}
      >
        {showMarkers === 'all' ? 'Hide Markers' : 'Show All Markers'}
      </Button>

      <Button
        variant="primary"
        onClick={() => toggleMarkers('popular')}
        style={{ position: 'absolute', bottom: '60px', right: '20px', zIndex: 1000 }}
      >
        {showMarkers === 'popular' ? 'Hide Popular Cities' : 'Show Popular Cities'}
      </Button>

      {modalOpen && (
        <Modal
          show={modalOpen}
          onHide={handleCloseModal}
          className="custom-modal"
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>City Information: {selectedCity}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Here are some details about {selectedCity}.</p>
            <Button
              variant="primary"
              onClick={() => window.open(`https://www.youtube.com/results?search_query=${selectedCity} travel introduction`, '_blank')}
              style={{ width: '100%', marginBottom: '10px' }}
            >
              Find Travel Video for {selectedCity}
            </Button>
            <Button
              variant="primary"
              onClick={() => window.open(`https://www.ai-generated-travel-guide.com/${selectedCity}`, '_blank')}
              style={{ width: '100%' }}
            >
              Generate AI Travel Guide for {selectedCity}
            </Button>
          </Modal.Body>
        </Modal>
      )}

      {showMarkers === 'popular' && selectedCity && (
        <div className="info-sidebar">
          <Button 
          className="delete-btn"
  variant="link" 
  onClick={() => setSelectedCity('')} 
  style={{ color: 'black', textDecoration: 'none' }}
>
  X
</Button>
          <img src="../assets/greatWall.svg" alt="Great Wall"></img>
          <h5>Beijing</h5>
              <p>Beijing, the capital city of China, is a cultural and historical hub known for its rich heritage, traditional architecture, and vibrant modern life. From ancient temples to the bustling cityscape, Beijing offers a unique blend of the past and present.</p>

              <h5>Popular Attractions</h5>
              <ul>
                <li><strong>The Great Wall:</strong> One of the Seven Wonders of the World, this iconic landmark is a must-see.</li>
                <li><strong>Forbidden City:</strong> A grand palace complex that served as the imperial palace for centuries.</li>
                <li><strong>Temple of Heaven:</strong> A spiritual complex famous for its architecture and religious history.</li>
                <li><strong>Summer Palace:</strong> A stunning garden and palace on the outskirts of Beijing.</li>
              </ul>
          {/* <Button
            variant="primary"
            onClick={() => window.open(`https://www.youtube.com/results?search_query=${selectedCity} travel introduction`, '_blank')}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            Find Travel Video for {selectedCity}
          </Button>
          <Button
            variant="primary"
            onClick={() => window.open(`https://www.ai-generated-travel-guide.com/${selectedCity}`, '_blank')}
            style={{ width: '100%' }}
          >
            Generate AI Travel Guide for {selectedCity}
          </Button> */}
        </div>
      )}

    </div>
  );
};

const PoiMarkers = ({ pois, onPoiClick }) => {
  const handleClick = useCallback(
    (ev, cityName) => {
      if (!ev.latLng) return;
      onPoiClick(cityName);
    },
    [onPoiClick]
  );

  return (
    <>
      {pois.map((poi) => (
        <AdvancedMarker key={poi.key} position={poi.location} onClick={(ev) => handleClick(ev, poi.key)}>
          <Pin background="#FBBC04" glyphColor="#000" borderColor="#000" />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default MapContainer;
