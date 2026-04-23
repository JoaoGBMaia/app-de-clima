const featuredCities = [
  {
    label: "Sao Paulo, BR",
    name: "Sao Paulo",
    country: "Brasil",
    countryCode: "BR",
    latitude: -23.5505,
    longitude: -46.6333
  },
  {
    label: "Lisboa, PT",
    name: "Lisboa",
    country: "Portugal",
    countryCode: "PT",
    latitude: 38.7167,
    longitude: -9.1333
  },
  {
    label: "Tokyo, JP",
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    latitude: 35.6764,
    longitude: 139.65
  },
  {
    label: "Vancouver, CA",
    name: "Vancouver",
    country: "Canada",
    countryCode: "CA",
    latitude: 49.2497,
    longitude: -123.1193
  }
];

const state = {
  selectedLocation: featuredCities[0],
  dailyForecast: [],
  hourlyByDay: {},
  airQualityByDay: {},
  dayIndex: 0,
  cityResults: [...featuredCities],
  searchToken: 0
};

const elements = {
  city: document.getElementById("currentCity"),
  date: document.getElementById("currentDate"),
  temp: document.getElementById("currentTemp"),
  condition: document.getElementById("currentCondition"),
  range: document.getElementById("currentRange"),
  wind: document.getElementById("windInfo"),
  humidity: document.getElementById("humidityInfo"),
  pressure: document.getElementById("pressureInfo"),
  visibility: document.getElementById("visibilityInfo"),
  uv: document.getElementById("uvInfo"),
  sunrise: document.getElementById("sunriseTime"),
  sunset: document.getElementById("sunsetTime"),
  moonPhase: document.getElementById("moonPhase"),
  dayHighlight: document.getElementById("dayHighlight"),
  chartSubtitle: document.getElementById("chartSubtitle"),
  forecastCards: document.getElementById("forecastCards"),
  citySuggestions: document.getElementById("citySuggestions"),
  hourlyChart: document.getElementById("hourlyChart"),
  hourlyLegend: document.getElementById("hourlyLegend"),
  aqiValue: document.getElementById("aqiValue"),
  aqiLabel: document.getElementById("aqiLabel"),
  aqiDescription: document.getElementById("aqiDescription"),
  aqiPollutant: document.getElementById("aqiPollutant"),
  humidityValue: document.getElementById("humidityValue"),
  humidityLabel: document.getElementById("humidityLabel"),
  humidityDescription: document.getElementById("humidityDescription"),
  dewPoint: document.getElementById("dewPoint"),
  aqiRing: document.getElementById("aqiRing"),
  humidityRing: document.getElementById("humidityRing"),
  citySearch: document.getElementById("citySearch"),
  toggleTheme: document.getElementById("toggleTheme"),
  statusMessage: document.getElementById("statusMessage")
};

const weekdayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });
const fullDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long"
});
const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit"
});

let searchTimeout = null;

function iconMarkup(type) {
  const icons = {
    sun: `
      <svg class="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
        <circle class="sun-core" cx="32" cy="32" r="11"></circle>
        <path class="sun-ray" d="M32 9v8M32 47v8M9 32h8M47 32h8M16 16l5.6 5.6M42.4 42.4 48 48M16 48l5.6-5.6M42.4 21.6 48 16"></path>
      </svg>
    `,
    partly: `
      <svg class="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
        <circle class="sun-core" cx="24" cy="24" r="10"></circle>
        <path class="sun-ray" d="M24 7v6M24 35v6M7 24h6M35 24h6M12.4 12.4l4.2 4.2M31.4 31.4l4.2 4.2"></path>
        <path class="cloud-shape" d="M41.7 47H20.4a8.4 8.4 0 1 1 2.2-16.6A10.5 10.5 0 0 1 42 26.8a8.1 8.1 0 0 1-.3 20.2Z"></path>
      </svg>
    `,
    cloud: `
      <svg class="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
        <path class="cloud-shape" d="M45.2 47H19.5a9.4 9.4 0 1 1 2.4-18.5 12.3 12.3 0 0 1 22.4-3.4A8.9 8.9 0 0 1 45.2 47Z"></path>
      </svg>
    `,
    rain: `
      <svg class="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
        <path class="cloud-shape" d="M45.2 39H19.5a9.4 9.4 0 1 1 2.4-18.5 12.3 12.3 0 0 1 22.4-3.4A8.9 8.9 0 0 1 45.2 39Z"></path>
        <path class="rain-drop" d="M24 45c2 0 3.5 1.4 3.5 3.2S26 52 24 52s-3.5-1.5-3.5-3.3S22 45 24 45Zm8 4c2 0 3.5 1.4 3.5 3.2S34 56 32 56s-3.5-1.5-3.5-3.3S30 49 32 49Zm8-4c2 0 3.5 1.4 3.5 3.2S42 52 40 52s-3.5-1.5-3.5-3.3S38 45 40 45Z"></path>
      </svg>
    `,
    storm: `
      <svg class="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
        <path class="cloud-shape" d="M45.2 39H19.5a9.4 9.4 0 1 1 2.4-18.5 12.3 12.3 0 0 1 22.4-3.4A8.9 8.9 0 0 1 45.2 39Z"></path>
        <path d="M31 42h7l-4 8h5l-9 12 2-9h-5Z" fill="#ffd06c"></path>
      </svg>
    `,
    snow: `
      <svg class="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
        <path class="cloud-shape" d="M45.2 39H19.5a9.4 9.4 0 1 1 2.4-18.5 12.3 12.3 0 0 1 22.4-3.4A8.9 8.9 0 0 1 45.2 39Z"></path>
        <path d="M24 45v10M19 50h10M22 47l6 6M28 47l-6 6M38 45v10M33 50h10M36 47l6 6M42 47l-6 6" stroke="#dff4ff" stroke-width="1.6" stroke-linecap="round"></path>
      </svg>
    `,
    moon: `
      <svg class="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
        <path class="moon-shape" d="M40.7 11c-9.7 1.5-17 9.9-17 20s7.3 18.5 17 20a20 20 0 1 1 0-40Z"></path>
      </svg>
    `,
    sunrise: `
      <svg class="weather-icon" viewBox="0 0 64 64" aria-hidden="true">
        <path class="sun-ray" d="M12 47h40M18 39h4M42 39h4M25 18l3 4M39 18l-3 4"></path>
        <path class="sun-core" d="M20 39a12 12 0 0 1 24 0"></path>
      </svg>
    `
  };

  return icons[type] || icons.partly;
}

function normalizeLocation(location) {
  return {
    name: location.name,
    country: location.country,
    countryCode: location.countryCode || location.country_code || "",
    latitude: Number(location.latitude),
    longitude: Number(location.longitude),
    admin1: location.admin1 || "",
    label:
      location.label ||
      `${location.name}${location.admin1 ? `, ${location.admin1}` : ""}${location.countryCode || location.country_code ? `, ${location.countryCode || location.country_code}` : ""}`
  };
}

function setStatus(message, type) {
  elements.statusMessage.textContent = message || "";
  elements.statusMessage.dataset.state = type || "";
}

function degreesToCompass(degrees) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % 8;
  return directions[index];
}

function getWeatherPresentation(code, isDay) {
  if (code === 0) {
    return { label: isDay ? "Ceu limpo" : "Noite limpa", icon: isDay ? "sun" : "moon" };
  }

  if ([1, 2].includes(code)) {
    return { label: "Parcialmente nublado", icon: "partly" };
  }

  if (code === 3 || [45, 48].includes(code)) {
    return { label: "Nublado", icon: "cloud" };
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { label: "Chuva", icon: "rain" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { label: "Neve", icon: "snow" };
  }

  if ([95, 96, 99].includes(code)) {
    return { label: "Tempestade", icon: "storm" };
  }

  return { label: "Tempo variavel", icon: "partly" };
}

function getMoonPhase(date) {
  const knownNewMoon = Date.UTC(2024, 0, 11);
  const cycleLength = 29.530588853;
  const diffDays = (Date.parse(date) - knownNewMoon) / 86400000;
  const phase = ((diffDays % cycleLength) + cycleLength) % cycleLength;

  if (phase < 1.5 || phase > cycleLength - 1.5) return "Lua nova";
  if (phase < 7.4) return "Lua crescente";
  if (phase < 9.4) return "Quarto crescente";
  if (phase < 14.8) return "Lua gibosa";
  if (phase < 16.8) return "Lua cheia";
  if (phase < 22.1) return "Lua minguante";
  if (phase < 24.1) return "Quarto minguante";
  return "Lua minguante";
}

function getAqiLabel(value) {
  if (value <= 20) return "Excelente";
  if (value <= 40) return "Boa";
  if (value <= 60) return "Moderada";
  if (value <= 80) return "Ruim";
  if (value <= 100) return "Muito ruim";
  return "Critica";
}

function getAqiDescription(value) {
  if (value <= 20) return "Ar muito limpo e ideal para atividades ao ar livre.";
  if (value <= 40) return "Qualidade do ar boa para a maioria das pessoas.";
  if (value <= 60) return "Pessoas sensiveis podem preferir esforco moderado.";
  if (value <= 80) return "Vale reduzir exercicios intensos por longos periodos.";
  if (value <= 100) return "Melhor evitar exposicao prolongada em ambientes externos.";
  return "Condicao delicada; priorize ambientes internos sempre que possivel.";
}

function getHumidityLabel(value) {
  if (value < 35) return "Seca";
  if (value < 60) return "Equilibrada";
  if (value < 75) return "Confortavel";
  if (value < 85) return "Alta";
  return "Muito alta";
}

function formatDateLabel(dateString) {
  const parts = fullDateFormatter.formatToParts(new Date(`${dateString}T12:00:00`));
  const weekday = parts.find((part) => part.type === "weekday")?.value || "";
  const day = parts.find((part) => part.type === "day")?.value || "";
  const month = parts.find((part) => part.type === "month")?.value || "";
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} de ${month}`;
}

function formatDayShort(dateString) {
  const weekday = weekdayFormatter.format(new Date(`${dateString}T12:00:00`));
  return weekday.slice(0, 3).replace(".", "");
}

function formatTime(dateString) {
  return timeFormatter.format(new Date(dateString));
}

function buildHourlyBuckets(hourly) {
  const buckets = {};

  hourly.time.forEach((time, index) => {
    const dateKey = time.split("T")[0];

    if (!buckets[dateKey]) {
      buckets[dateKey] = [];
    }

    buckets[dateKey].push({
      time,
      hourLabel: time.split("T")[1],
      temp: Math.round(hourly.temperature_2m[index]),
      code: hourly.weather_code[index],
      humidity: Math.round(hourly.relative_humidity_2m[index]),
      dewPoint: Math.round(hourly.dew_point_2m[index]),
      uv: Math.round(hourly.uv_index[index] || 0)
    });
  });

  return buckets;
}

function buildAirQualityBuckets(airQuality) {
  const hourly = airQuality.hourly;
  const buckets = {};

  hourly.time.forEach((time, index) => {
    const dateKey = time.split("T")[0];

    if (!buckets[dateKey]) {
      buckets[dateKey] = [];
    }

    buckets[dateKey].push({
      time,
      aqi: Math.round(hourly.european_aqi[index] || 0),
      pm2_5: Math.round(hourly.pm2_5[index] || 0),
      pm10: Math.round(hourly.pm10[index] || 0),
      ozone: Math.round(hourly.ozone[index] || 0),
      nitrogenDioxide: Math.round(hourly.nitrogen_dioxide[index] || 0)
    });
  });

  return buckets;
}

function getDominantPollutant(reading) {
  const pollutantPairs = [
    ["PM2.5", reading.pm2_5 || 0],
    ["PM10", reading.pm10 || 0],
    ["O3", reading.ozone || 0],
    ["NO2", reading.nitrogenDioxide || 0]
  ];

  pollutantPairs.sort((left, right) => right[1] - left[1]);
  return pollutantPairs[0][0];
}

function buildDayHighlight(dayWeather, airQualityReading) {
  const weather = getWeatherPresentation(dayWeather.code, true).label.toLowerCase();
  const aqiLabel = getAqiLabel(airQualityReading.aqi).toLowerCase();
  return `Dia com ${weather}, maxima de ${dayWeather.maxTemp}° e ar ${aqiLabel}.`;
}

function renderCities(results) {
  elements.citySuggestions.innerHTML = results
    .map((location) => {
      const isSelected =
        location.latitude === state.selectedLocation.latitude &&
        location.longitude === state.selectedLocation.longitude;
      const classes = isSelected ? "city-pill is-selected" : "city-pill";

      return `
        <button
          class="${classes}"
          type="button"
          data-lat="${location.latitude}"
          data-lon="${location.longitude}"
          data-name="${location.name}"
          data-country="${location.country || ""}"
          data-country-code="${location.countryCode || ""}"
          data-label="${location.label}"
        >
          ${location.label}
        </button>
      `;
    })
    .join("");
}

function renderForecast() {
  elements.forecastCards.innerHTML = state.dailyForecast
    .map((item, index) => {
      const classes = index === state.dayIndex ? "forecast-card is-selected" : "forecast-card";

      return `
        <button class="${classes}" type="button" data-day-index="${index}">
          <span class="day-name">${item.dayLabel}</span>
          <span class="icon">${iconMarkup(item.icon)}</span>
          <span>${item.summary}</span>
          <span class="temps"><strong>${item.maxTemp}°</strong><span>${item.minTemp}°</span></span>
        </button>
      `;
    })
    .join("");
}

function buildChart(hourlyItems) {
  const width = 640;
  const height = 260;
  const padding = { top: 28, right: 30, bottom: 56, left: 28 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const temps = hourlyItems.map((item) => item.temp);
  const min = Math.min.apply(null, temps) - 1;
  const max = Math.max.apply(null, temps) + 1;

  const points = hourlyItems.map((item, index) => {
    const x = padding.left + (chartWidth / Math.max(hourlyItems.length - 1, 1)) * index;
    const y = padding.top + ((max - item.temp) / Math.max(max - min, 1)) * chartHeight;
    return { item, x, y };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const lastPoint = points[points.length - 1];
  const areaPath = `${linePath} L ${lastPoint.x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

  elements.hourlyChart.innerHTML = `
    <defs>
      <linearGradient id="lineFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(255, 181, 100, 0.35)"></stop>
        <stop offset="100%" stop-color="rgba(255, 181, 100, 0.02)"></stop>
      </linearGradient>
    </defs>
    ${points
      .map(
        (point) => `
          <line x1="${point.x}" y1="${padding.top}" x2="${point.x}" y2="${height - padding.bottom}" stroke="rgba(255,255,255,0.08)" />
        `
      )
      .join("")}
    <path d="${areaPath}" fill="url(#lineFade)"></path>
    <path d="${linePath}" fill="none" stroke="#ffb564" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
    ${points
      .map(
        (point) => `
          <circle cx="${point.x}" cy="${point.y}" r="5" fill="#ffd5ab" stroke="#ffb564" stroke-width="2"></circle>
          <text x="${point.x}" y="${point.y - 14}" text-anchor="middle" fill="#edf4ff" font-size="16">${point.item.temp}°</text>
        `
      )
      .join("")}
  `;

  elements.hourlyLegend.innerHTML = hourlyItems
    .map(
      (item) => `
        <div class="hourly-item">
          <strong>${item.hourShort}</strong>
          <span>${item.temp}°</span>
        </div>
      `
    )
    .join("");
}

function updateDetailPanels() {
  const selectedDay = state.dailyForecast[state.dayIndex];
  const airQualityReading = state.airQualityByDay[selectedDay.date];
  const humiditySamples = state.hourlyByDay[selectedDay.date] || [];
  const humidityAverage =
    humiditySamples.reduce((total, item) => total + item.humidity, 0) / Math.max(humiditySamples.length, 1);
  const dewPointAverage =
    humiditySamples.reduce((total, item) => total + item.dewPoint, 0) / Math.max(humiditySamples.length, 1);

  elements.chartSubtitle.textContent = selectedDay.summary;
  elements.sunrise.textContent = selectedDay.sunrise;
  elements.sunset.textContent = selectedDay.sunset;
  elements.moonPhase.textContent = getMoonPhase(selectedDay.date);
  elements.dayHighlight.textContent = buildDayHighlight(selectedDay, airQualityReading);

  elements.aqiValue.textContent = airQualityReading.aqi;
  elements.aqiLabel.textContent = getAqiLabel(airQualityReading.aqi);
  elements.aqiDescription.textContent = getAqiDescription(airQualityReading.aqi);
  elements.aqiPollutant.textContent = getDominantPollutant(airQualityReading);

  elements.humidityValue.textContent = `${Math.round(humidityAverage)}%`;
  elements.humidityLabel.textContent = getHumidityLabel(Math.round(humidityAverage));
  elements.humidityDescription.textContent = `Pico de umidade entre ${selectedDay.minTemp}° e ${selectedDay.maxTemp}° ao longo do dia.`;
  elements.dewPoint.textContent = `${Math.round(dewPointAverage)}°C`;

  elements.aqiRing.style.setProperty("--ring-angle", `${Math.min(airQualityReading.aqi, 100) * 3.6}deg`);
  elements.humidityRing.style.setProperty("--ring-angle", `${Math.min(Math.round(humidityAverage), 100) * 3.6}deg`);

  buildChart(selectedDay.chartPoints);
}

function renderWeather() {
  const today = state.dailyForecast[state.dayIndex];
  const currentPresentation = getWeatherPresentation(today.currentCode, today.isDay);

  elements.city.textContent = state.selectedLocation.label;
  elements.date.textContent = formatDateLabel(today.date);
  elements.temp.textContent = today.currentTemp;
  elements.condition.textContent = currentPresentation.label;
  elements.range.textContent = `Sensacao de ${today.feelsLike}° • Max ${today.maxTemp}° • Min ${today.minTemp}°`;
  elements.wind.textContent = `${today.windSpeed} km/h ${degreesToCompass(today.windDirection)}`;
  elements.humidity.textContent = `${today.currentHumidity}%`;
  elements.pressure.textContent = `${today.pressure} hPa`;
  elements.visibility.textContent = `${today.visibilityKm} km`;
  elements.uv.textContent = `${today.uvIndex} ${today.uvIndex >= 6 ? "alto" : today.uvIndex >= 3 ? "moderado" : "baixo"}`;

  renderForecast();
  updateDetailPanels();
}

function hydrateDailyForecast(weatherPayload, airQualityPayload) {
  const daily = weatherPayload.daily;
  const hourlyByDay = buildHourlyBuckets(weatherPayload.hourly);
  const airQualityByDay = buildAirQualityBuckets(airQualityPayload);
  const current = weatherPayload.current;

  state.hourlyByDay = hourlyByDay;
  state.airQualityByDay = {};

  state.dailyForecast = daily.time.map((date, index) => {
    const presentation = getWeatherPresentation(daily.weather_code[index], true);
    const hourlyItems = hourlyByDay[date] || [];
    const selectedPoints = hourlyItems
      .filter((_, hourlyIndex) => hourlyIndex % Math.max(Math.floor(hourlyItems.length / 6), 1) === 0)
      .slice(0, 6)
      .map((item) => ({
        ...item,
        hourShort: item.hourLabel.slice(0, 2) + "h"
      }));

    const airSamples = airQualityByDay[date] || [];
    const middayReading = airSamples[Math.min(Math.floor(airSamples.length / 2), Math.max(airSamples.length - 1, 0))] || {
      aqi: 0,
      pm2_5: 0,
      pm10: 0,
      ozone: 0,
      nitrogenDioxide: 0
    };

    state.airQualityByDay[date] = middayReading;

    const currentHumidity =
      date === current.time.split("T")[0]
        ? Math.round(current.relative_humidity_2m)
        : selectedPoints.length
          ? selectedPoints[0].humidity
          : 0;

    return {
      date,
      dayLabel: formatDayShort(date),
      summary: presentation.label,
      icon: presentation.icon,
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
      sunrise: formatTime(daily.sunrise[index]),
      sunset: formatTime(daily.sunset[index]),
      chartPoints: selectedPoints.length ? selectedPoints : [{ temp: Math.round(current.temperature_2m), hourShort: "Agora" }],
      currentTemp: date === current.time.split("T")[0] ? Math.round(current.temperature_2m) : Math.round(daily.temperature_2m_max[index]),
      feelsLike: date === current.time.split("T")[0] ? Math.round(current.apparent_temperature) : Math.round(daily.temperature_2m_max[index] - 1),
      currentCode: date === current.time.split("T")[0] ? current.weather_code : daily.weather_code[index],
      isDay: date === current.time.split("T")[0] ? Boolean(current.is_day) : true,
      windSpeed: date === current.time.split("T")[0] ? Math.round(current.wind_speed_10m) : Math.round(current.wind_speed_10m),
      windDirection: date === current.time.split("T")[0] ? Math.round(current.wind_direction_10m) : Math.round(current.wind_direction_10m),
      currentHumidity,
      pressure: Math.round(current.surface_pressure),
      visibilityKm: Math.max(1, Math.round((current.visibility || 10000) / 1000)),
      uvIndex: Math.round(current.uv_index || 0),
      code: daily.weather_code[index]
    };
  });
}

async function fetchWeatherBundle(location) {
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility,uv_index",
    hourly: "temperature_2m,relative_humidity_2m,dew_point_2m,weather_code,uv_index",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7"
  }).toString();

  const airUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  airUrl.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    hourly: "european_aqi,pm2_5,pm10,ozone,nitrogen_dioxide",
    timezone: "auto",
    forecast_days: "5"
  }).toString();

  const [weatherResponse, airResponse] = await Promise.all([fetch(weatherUrl), fetch(airUrl)]);

  if (!weatherResponse.ok || !airResponse.ok) {
    throw new Error("Nao foi possivel buscar os dados do clima agora.");
  }

  return Promise.all([weatherResponse.json(), airResponse.json()]);
}

async function loadLocation(location) {
  const normalizedLocation = normalizeLocation(location);

  setStatus(`Carregando dados de ${normalizedLocation.label}...`, "loading");

  try {
    const [weatherPayload, airQualityPayload] = await fetchWeatherBundle(normalizedLocation);
    state.selectedLocation = normalizedLocation;
    state.dayIndex = 0;

    hydrateDailyForecast(weatherPayload, airQualityPayload);
    renderWeather();
    renderCities(state.cityResults);

    setStatus(`Dados atualizados com Open-Meteo para ${normalizedLocation.label}.`, "success");
  } catch (error) {
    setStatus(error.message || "Erro ao carregar dados do clima.", "error");
  }
}

async function searchCities(term) {
  const trimmedTerm = term.trim();
  state.searchToken += 1;
  const token = state.searchToken;

  if (trimmedTerm.length < 2) {
    state.cityResults = [...featuredCities];
    renderCities(state.cityResults);
    setStatus("Selecione uma cidade sugerida ou digite pelo menos 2 letras.", "");
    return;
  }

  setStatus(`Buscando cidades para "${trimmedTerm}"...`, "loading");

  try {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.search = new URLSearchParams({
      name: trimmedTerm,
      count: "6",
      language: "pt",
      format: "json"
    }).toString();

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Nao foi possivel consultar cidades agora.");
    }

    const payload = await response.json();

    if (token !== state.searchToken) {
      return;
    }

    state.cityResults = (payload.results || []).map((result) =>
      normalizeLocation({
        name: result.name,
        admin1: result.admin1,
        country: result.country,
        countryCode: result.country_code,
        latitude: result.latitude,
        longitude: result.longitude
      })
    );

    if (!state.cityResults.length) {
      state.cityResults = [...featuredCities];
      setStatus("Nenhuma cidade encontrada. Tente outro termo.", "error");
      renderCities(state.cityResults);
      return;
    }

    renderCities(state.cityResults);
    setStatus(`Escolha uma das cidades encontradas para "${trimmedTerm}".`, "success");
  } catch (error) {
    if (token !== state.searchToken) {
      return;
    }

    state.cityResults = [...featuredCities];
    renderCities(state.cityResults);
    setStatus(error.message || "Erro ao buscar cidades.", "error");
  }
}

elements.citySuggestions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lat]");

  if (!button) return;

  loadLocation({
    name: button.dataset.name,
    country: button.dataset.country,
    countryCode: button.dataset.countryCode,
    latitude: Number(button.dataset.lat),
    longitude: Number(button.dataset.lon),
    label: button.dataset.label
  });
});

elements.forecastCards.addEventListener("click", (event) => {
  const button = event.target.closest("[data-day-index]");

  if (!button) return;

  state.dayIndex = Number(button.dataset.dayIndex);
  renderWeather();
});

elements.citySearch.addEventListener("input", (event) => {
  window.clearTimeout(searchTimeout);
  searchTimeout = window.setTimeout(() => {
    searchCities(event.target.value);
  }, 320);
});

elements.toggleTheme.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "twilight" ? "daybreak" : "twilight";
  document.body.dataset.theme = nextTheme === "daybreak" ? "" : nextTheme;
});

renderCities(state.cityResults);
loadLocation(state.selectedLocation);
