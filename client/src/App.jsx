import HomeAirQuality from './components/HomeAirQuality';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-primary mb-8">Air Quality Monitor</h1>
      <HomeAirQuality />
    </div>
  );
}

export default App;