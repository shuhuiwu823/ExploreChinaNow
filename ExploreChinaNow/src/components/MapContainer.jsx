import { GoogleMap, LoadableMap } from '@vis.gl/react-google-maps';

function MapContainer() {
  return (
    <LoadableMap
      apiKey="AIzaSyAgYOfrSVMN-4qquy9cI_ZSM6SjhvF_cW0"
      renderMap={(mapProps) => (
        <GoogleMap {...mapProps} center={{ lat: 39.9042, lng: 116.4074 }} zoom={10} />
      )}
    />
  );
}

export default MapContainer;
