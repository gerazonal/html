const $ = (id) => document.getElementById(id);

const el = {
  date: $('date'),
  location: $('location'),
  status: $('status'),
  sunrise: $('sunrise'),
  sunset: $('sunset'),
  moonrise: $('moonrise'),
  moonset: $('moonset'),
  btnSearch: $('btnSearch'),
};

function today() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

async function fetchRiseSet() {
  const date = el.date.value.replaceAll('-', '');
  const location = el.location.value;

  el.status.textContent = '조회 중...';

  try {
    const res = await fetch(`/api/riseset?date=${date}&location=${encodeURIComponent(location)}`);
    const json = await res.json();

    const item = json?.response?.body?.items?.item?.[0];
    if (!item) throw new Error('결과 없음');

    el.sunrise.textContent = item.sunrise;
    el.sunset.textContent = item.sunset;
    el.moonrise.textContent = item.moonrise;
    el.moonset.textContent = item.moonset;

    el.status.textContent = '조회 완료';
  } catch (e) {
    el.status.textContent = '조회 실패';
  }
}

el.date.value = today();
el.btnSearch.addEventListener('click', fetchRiseSet);
