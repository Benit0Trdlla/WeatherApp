import { useState, useEffect } from "react"

const defaultCityUrl = `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=rosario&aqi=no`;

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState({});


  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchDataAndSetWeatherData = async () => {
      try {
        const response = await fetch(defaultCityUrl, { signal });
        const data = await response.json();
        if (!signal.aborted) {
          setWeatherData(data);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Solicitud cancelada');
        } else {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchDataAndSetWeatherData();

    return () => {
      abortController.abort();
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const { query } = Object.fromEntries(new FormData(e.target)); // new window.FormData(event.target);
    // const city = field.get('query').trim();
    // const test = field.get('test');
    console.log(query);
    if (!query) return
    const cityUrl = `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${query}&aqi=no`;
    fetchData(cityUrl)
      .then(data => {
        if (data) {
          setWeatherData(data);
          document.title = `Weather | ${data.location.name}`
        }
      });
  }

  return (
    <>
      <>
        <h1 style={{ textAlign: 'center', color: '#f9f9f9', fontFamily: 'system-ui' }}>WeatherApp</h1>
        <h5 style={{ textAlign: 'center', color: '#f9f9f9', fontFamily: 'system-ui' }} className="description">Busca ciudades y conoce el clima en tiempo real.</h5>

        <div className="form-container" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form className="form" style={{ display: 'flex', gap: '10px' }} onSubmit={handleSubmit}>
            <input name="query" type="text" style={{ width: '100%', fontFamily: 'system-ui', padding: '10px', borderRadius: '10px', border: 'none', color: '#333', fontWeight: 'bold', fontSize: '16px' }} />
            <button style={{ fontFamily: 'system-ui', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', color: '#333', fontWeight: 'bold', fontSize: '16px' }} type="submit">Search</button>
          </form>
        </div>
      </>
      <div>
        {weatherData.location && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '80px' }}>
              <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
                <p style={{ color: '#f9f9f9', fontFamily: 'system-ui', fontSize: '20px' }}>{weatherData.location.name}</p>
                <p style={{ color: '#f9f9f9', fontFamily: 'system-ui', fontSize: '20px' }}>{weatherData.location.country}</p>
              </div>
              {weatherData.current && (
                <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p style={{ color: '#f9f9f9', fontFamily: 'system-ui', fontSize: '20px' }}>{weatherData.current.condition.text}</p>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <p style={{ color: '#f9f9f9', fontFamily: 'system-ui', fontSize: '20px' }}>{weatherData.current.temp_c}°C</p>
                      <img style={{ width: '40px', height: '40px' }} src={`http:${weatherData.current.condition.icon}`} alt={weatherData.current.condition.text} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d53569.68794867837!2d${weatherData.location.lon}!3d${weatherData.location.lat}99996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1706655906595!5m2!1ses-419!2sar`}
              width="400"
              height="300"
              style={{ border: '0', display: 'block', margin: '0 auto' }}
              allowFullScreen
              loading="async"
              referrerPolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </>
        )}
      </div>
    </>
  )
}