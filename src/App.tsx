import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface Location {
  name?: string;
  country?: string;
  localtime?: string;
}

interface CurrentWeather {
  feelslike_c?: number;
  condition?: {
    icon?: string;
  };
}

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const [location, setLocation] = useState<Location>({});
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>({});
  const [search, setSearch] = useState("Lagos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      console.log("Fetching Api key:", API_KEY, "for search:", search);
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${search}`
        );

        setCurrentWeather(res.data.current);
        setLocation(res.data.location);
      } catch (err) {
        setError("Unable to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [search]);

  // 🔥 Derived Values (no need to store in state)
  const localTime = location?.localtime
    ? location.localtime.substring(11)
    : new Date().toLocaleTimeString().substring(0, 5);

  const hour = location?.localtime
    ? Number(location.localtime.substring(11, 13))
    : new Date().getHours();

  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 17) greeting = "Good Afternoon";
  // else (hour < 20) greeting = "Good night";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex p-5 flex-col items-center gap-10 text-black w-screen h-screen">
      
      {/* Top Section */}
      <div className="flex justify-between w-full items-start">

        {/* Search */}
        <div className="flex items-center gap-3">
          <input
            className="border rounded-full bg-transparent p-1 pl-5"
            placeholder="Search Location"
            onChange={handleChange}
          />
        </div>

        {/* Weather Info */}
        <div className="flex flex-col items-end gap-2">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="flex items-center">
                <img
                  className="w-10"
                  src={currentWeather?.condition?.icon}
                  alt="weather icon"
                />
                <h1 className="text-lg font-semibold">
                  {currentWeather?.feelslike_c}°
                </h1>
              </div>

              <p>
                {location?.name}, {location?.country}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="gap-10 flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-[10rem] shadow-xl">{localTime}</h1>
          <h3 className="text-5xl font-semibold shadow-xl">
            Hey You! {greeting}
          </h3>
        </div>

        <div className="flex flex-col gap-10">
          <p className="text-3xl shadow-xl">
            What is your main focus for today?
          </p>
          <hr className="border w-full" />
        </div>

        <div className="mt-5">
          Embrace the day with a smile, and let positivity guide your path.
        </div>
      </div>
    </div>
  );
}

export default App;