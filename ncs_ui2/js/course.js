let map;
let startMarker = null;
let endMarker = null;

function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof kakao === "undefined" || !kakao.maps) return;

  const defaultPos = new kakao.maps.LatLng(33.4996, 126.5312);

  map = new kakao.maps.Map(mapEl, {
    center: defaultPos,
    level: 8,
  });
}

function clearMarkers() {
  if (startMarker) startMarker.setMap(null);
  if (endMarker) endMarker.setMap(null);
  startMarker = null;
  endMarker = null;
}

function setActiveCard(activeCard) {
  document.querySelectorAll(".course-card").forEach((c) => {
    c.classList.remove("active");
  });
  activeCard.classList.add("active");
}

function showStartEnd(sLat, sLng, eLat, eLng) {
  if (!map) return;

  clearMarkers();

  const startPos = new kakao.maps.LatLng(sLat, sLng);
  const endPos = new kakao.maps.LatLng(eLat, eLng);

  startMarker = new kakao.maps.Marker({ position: startPos, title: "출발" });
  endMarker = new kakao.maps.Marker({ position: endPos, title: "도착" });

  startMarker.setMap(map);
  endMarker.setMap(map);

  const bounds = new kakao.maps.LatLngBounds();
  bounds.extend(startPos);
  bounds.extend(endPos);
  map.setBounds(bounds);
}

function bindCards() {
  document.querySelectorAll(".course-card").forEach((card) => {
    card.addEventListener("click", () => {
      // ✅ 선택 UI
      setActiveCard(card);

      // ✅ HTML에 있는 start/end 데이터 읽기
      const sLat = Number(card.dataset.startLat);
      const sLng = Number(card.dataset.startLng);
      const eLat = Number(card.dataset.endLat);
      const eLng = Number(card.dataset.endLng);

      if (!sLat || !sLng || !eLat || !eLng) return;

      showStartEnd(sLat, sLng, eLat, eLng);
    });
  });
}

window.addEventListener("load", () => {
  initMap();
  bindCards();
});
