const API_KEY = "8d60483ae15f6f3d9ad6ecbf199738b3";

/* =====================
   DOM 요소
===================== */
const overlay = document.getElementById("overlay");
const cityEl = document.getElementById("city");
const weatherTypeEl = document.getElementById("desc"); // weather-type
const tempEl = document.getElementById("temp");
const windEl = document.getElementById("wind");
const humidityEl = document.getElementById("humidity");
const graphicEl = document.getElementById("graphic");
const errorEl = document.getElementById("error");
const cityInput = document.getElementById("cityInput");

/* =====================
   API URL
===================== */
const WEATHER_URL = (lat, lon) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=en`;

const GEO_URL = city =>
  `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

/* =====================
   공통 유틸
===================== */
function setLoading(show) {
  overlay.style.display = show ? "flex" : "none";
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("API 요청 실패");
  return res.json();
}

/* =====================
   그래픽 렌더링
===================== */
function renderGraphic(type) {
  let svg = "";

  if (type === "Clear") {
    svg = `
      <svg width="220" height="220" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="70" fill="#FFD400"/>
      </svg>`;
  }

  else if (type === "Snow") {
    svg = `
      <svg width="220" height="220" viewBox="0 0 200 200">
        <circle cx="100" cy="80" r="45" fill="#FFD400"/>
        <g stroke="#1F3C88" stroke-width="6">
          <line x1="30" y1="70" x2="170" y2="70"/>
          <line x1="30" y1="90" x2="170" y2="90"/>
        </g>
        <g fill="#1F3C88">
          <circle cx="80" cy="140" r="4"/>
          <circle cx="120" cy="150" r="4"/>
        </g>
      </svg>`;
  }

  else {
    // Fog / Clouds / Mist
    svg = `
      <svg width="220" height="220" viewBox="0 0 200 200">
        <g stroke="#1F3C88" stroke-width="6">
          <line x1="30" y1="60" x2="170" y2="60"/>
          <line x1="30" y1="90" x2="170" y2="90"/>
          <line x1="30" y1="120" x2="170" y2="120"/>
        </g>
      </svg>`;
  }

  graphicEl.innerHTML = svg;
}

/* =====================
   데이터 렌더
===================== */
function render(data) {
  const weatherMain = data.weather[0].main;
  const weatherDesc = data.weather[0].description.toUpperCase();

  cityEl.textContent = data.name.toUpperCase();
  weatherTypeEl.textContent = weatherDesc;

  tempEl.textContent = `${Math.round(data.main.temp)}°`;
  windEl.textContent = `${data.wind.speed} m/s`;
  humidityEl.textContent = `${data.main.humidity}%`;

  renderGraphic(weatherMain);
}

/* =====================
   위치 기반 로딩
===================== */
async function loadByLocation() {
  setLoading(true);
  errorEl.textContent = "";

  try {
    const position = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );

    const { latitude, longitude } = position.coords;
    const data = await fetchJSON(WEATHER_URL(latitude, longitude));
    render(data);

  } catch (e) {
    errorEl.textContent = "위치 정보를 불러올 수 없습니다.";
  } finally {
    setLoading(false);
  }
}

/* =====================
   도시 검색
===================== */
async function loadByCity(city) {
  if (!city) return;

  setLoading(true);
  errorEl.textContent = "";

  try {
    const geo = await fetchJSON(GEO_URL(city));
    if (!geo.length) throw new Error("도시 없음");

    const { lat, lon } = geo[0];
    const data = await fetchJSON(WEATHER_URL(lat, lon));
    render(data);

  } catch (e) {
    errorEl.textContent = "도시를 찾을 수 없습니다.";
  } finally {
    setLoading(false);
  }
}

/* =====================
   이벤트
===================== */
cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    loadByCity(cityInput.value.trim());
  }
});

/* =====================
   초기 실행
===================== */
loadByLocation();
