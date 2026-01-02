let map;
let marker;

function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof kakao === "undefined" || !kakao.maps) return;

  const defaultPos = new kakao.maps.LatLng(33.4996, 126.5312);

  map = new kakao.maps.Map(mapEl, {
    center: defaultPos,
    level: 8,
  });

  marker = new kakao.maps.Marker({ position: defaultPos });
  marker.setMap(map);
}

function bindCards() {
  document.querySelectorAll(".course-card").forEach((card) => {
    card.addEventListener("click", () => {
      const lat = Number(card.dataset.lat);
      const lng = Number(card.dataset.lng);
      if (!lat || !lng || !map) return;

      const pos = new kakao.maps.LatLng(lat, lng);
      map.setCenter(pos);
      marker.setPosition(pos);
    });
  });
}

window.addEventListener("load", () => {
  initMap();
  bindCards();
});

document.querySelectorAll(".course-card").forEach(c => c.classList.remove("active"));
card.classList.add("active");

