/* ===== Elements ===== */
const listEl = document.getElementById("storeList");
const loadingEl = document.getElementById("loading");
const toastEl = document.getElementById("toast");

const btnBack = document.getElementById("btnBack");
const tabNear = document.getElementById("tabNear");
const tabFav = document.getElementById("tabFav");
const btnSearch = document.getElementById("btnSearch");

/* ===== Config ===== */
const KEYWORD = "텐퍼센트";            // 기본: 텐퍼센트만
const KEYWORD_STRICT = true;          // place_name에 "텐퍼센트" 포함 필터 강제
const RADIUS_M = 6000;

/*
  ✅ 매장 썸네일 자동은 “카카오 API만으로는 불가” (사진 URL 제공 X)
  → 여기 매핑만 채우면 해당 매장은 자동으로 사진이 들어갑니다.
  키는 place.id(카카오 place id)를 추천하지만, 우선 name도 가능.
*/
const STORE_THUMBNAILS = {
  // "카카오 place id": "이미지URL"
"123456789": "./assets/loca.jpg",
};

/* ===== Favorites (localStorage) ===== */
const FAV_KEY = "tenpercent_favs_v1";
function loadFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); }
  catch { return []; }
}
function saveFavs(arr) {
  localStorage.setItem(FAV_KEY, JSON.stringify(arr));
}
function isFav(id) {
  return loadFavs().includes(id);
}
function toggleFav(id) {
  const favs = loadFavs();
  const idx = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(id);
  saveFavs(favs);
  return favs.includes(id);
}

/* ===== UI helpers ===== */
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 1200);
}

function closeOverlayToHome() {
  if (window.parent && window.parent.closeOrderOverlay) {
    window.parent.closeOrderOverlay();
  }
}
btnBack.addEventListener("click", closeOverlayToHome);

btnSearch.addEventListener("click", () => {
  showToast("검색 UI는 다음 단계에서 연결합니다.");
});

tabNear.addEventListener("click", () => {
  tabNear.classList.add("active");
  tabFav.classList.remove("active");
  searchNearbyTenPercent();
});

tabFav.addEventListener("click", () => {
  tabFav.classList.add("active");
  tabNear.classList.remove("active");
  renderFavorites();
});

function setLoading(msg) {
  loadingEl.style.display = "block";
  loadingEl.textContent = msg;
}
function hideLoading() {
  loadingEl.style.display = "none";
}
function clearItems() {
  listEl.querySelectorAll(".store-item").forEach(n => n.remove());
}

/* ===== Location ===== */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

/* ===== Thumbnail resolver ===== */
function resolveThumb(place) {
  // 1) id 매핑 우선
  if (place.id && STORE_THUMBNAILS[place.id]) return STORE_THUMBNAILS[place.id];

  // 2) name 매핑(임시)
  if (place.place_name && STORE_THUMBNAILS[place.place_name]) return STORE_THUMBNAILS[place.place_name];

  // 3) 기본 placeholder
  return "./assets/store-placeholder.jpg"; // ← 없으면 본인 placeholder 추가
}

/* ===== Render ===== */
function esc(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDistance(metersStr) {
  const m = Number(metersStr);
  if (!Number.isFinite(m)) return "";
  if (m < 1000) return `${Math.round(m)}m`;
  const km = m / 1000;
  return `${km.toFixed(2)}km`;
}

function renderList(stores) {
  clearItems();

  if (!stores || stores.length === 0) {
    setLoading("근처에서 텐퍼센트 매장을 찾지 못했어요.");
    return;
  }

  hideLoading();

  stores.forEach((p, idx) => {
    const id = p.id;
    const name = p.place_name || "텐퍼센트 매장";
    const addr = p.road_address_name || p.address_name || "";
    const dist = formatDistance(p.distance);

    // ✅ 첫 번째만 매장 이미지, 나머지는 placeholder 고정
    const thumbSrc = (idx === 0) ? "./images/loca.png" : "./images/icon-logo.png";

    // ✅ 첫 번째만 준비중 OFF, 나머지는 준비중 ON
    const isReady = (idx === 0);

    const item = document.createElement("article");
    item.className = "store-item";

    const favOn = isFav(id);

    item.innerHTML = `
      <div class="thumb-wrap">
        <div class="thumb">
          <img src="${esc(thumbSrc)}" alt="${esc(name)} 썸네일" />
        </div>

        ${isReady ? "" : `<div class="status">준비중</div>`}

        <button class="fav-over ${favOn ? "active" : ""}" type="button" aria-label="즐겨찾기">
          <span>★</span>
        </button>
      </div>

      <div class="info">
        <p class="name">${esc(name)}</p>
        <p class="addr">${esc(addr)}</p>
        <p class="dist">${esc(dist)}</p>
      </div>
    `;

    // 즐겨찾기 토글
    const favBtn = item.querySelector(".fav-over");
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const nowOn = toggleFav(id);
      favBtn.classList.toggle("active", nowOn);
      showToast(nowOn ? "즐겨찾는 매장에 등록했어요" : "즐겨찾기 해제했어요");
    });

    // ✅ 준비중 매장은 클릭 막기(원하면)
    if (!isReady) {
      item.style.opacity = "0.98";
      item.addEventListener("click", () => {
        showToast("준비중인 매장입니다.");
      });
    } else {
  item.addEventListener("click", () => {
    // ✅ 맨 위 매장 선택 → payment.html로 이동
    window.location.href = "payment.html";
  });
}


    listEl.appendChild(item);
  });
}

/* ===== Search (Nearby) ===== */
async function searchNearbyTenPercent() {
  clearItems();
  setLoading("현재 위치 기반으로 매장을 불러오는 중…");

  if (!window.kakao || !kakao.maps || !kakao.maps.services) {
    setLoading("카카오맵 SDK가 로드되지 않았어요.");
    return;
  }

  let pos;
  try {
    pos = await getCurrentPosition();
  } catch {
    setLoading("위치 권한이 필요해요.");
    return;
  }

  const ps = new kakao.maps.services.Places();
  const loc = new kakao.maps.LatLng(pos.lat, pos.lng);

  ps.keywordSearch(
    KEYWORD,
    (data, status) => {
      if (status !== kakao.maps.services.Status.OK) {
        setLoading("매장을 찾지 못했어요.");
        return;
      }

      let filtered = data;
      if (KEYWORD_STRICT) {
        filtered = data.filter(p =>
          (p.place_name || "").includes(KEYWORD)
        );
      }

      // 거리순 정렬 (안전)
      filtered.sort(
        (a, b) => Number(a.distance || 999999) - Number(b.distance || 999999)
      );

      renderList(filtered);
    },
    {
      location: loc,
      radius: RADIUS_M,
      sort: kakao.maps.services.SortBy.DISTANCE
    }
  );
}

/* ===== Favorites tab ===== */
function renderFavorites() {
  clearItems();

  const favs = loadFavs();
  if (favs.length === 0) {
    setLoading("즐겨찾는 매장이 아직 없어요.");
    return;
  }

  // 즐겨찾기 탭은: 현재 화면에 있는 검색 결과가 없을 수도 있어서
  // 1) 먼저 주변 검색을 한번 하고
  // 2) 결과에서 fav id만 보여줌 (간단/실용)
  setLoading("즐겨찾는 매장을 불러오는 중…");

  if (!window.kakao || !kakao.maps || !kakao.maps.services) {
    setLoading("카카오맵 SDK가 로드되지 않았어요. appkey를 확인해 주세요.");
    return;
  }

  getCurrentPosition().then(({lat,lng}) => {
    const ps = new kakao.maps.services.Places();
    const loc = new kakao.maps.LatLng(lat, lng);

    ps.keywordSearch(
      KEYWORD,
      (data, status) => {
        if (status !== kakao.maps.services.Status.OK) {
          setLoading("즐겨찾기 로드에 실패했어요.");
          return;
        }

        let filtered = data;
        if (KEYWORD_STRICT) filtered = data.filter(p => (p.place_name || "").includes(KEYWORD));

        const onlyFav = filtered.filter(p => favs.includes(p.id));
        onlyFav.sort((a, b) => Number(a.distance || 999999) - Number(b.distance || 999999));

        renderList(onlyFav);
      },
      { location: loc, radius: RADIUS_M, sort: kakao.maps.services.SortBy.DISTANCE }
    );
  }).catch(() => {
    setLoading("위치 권한이 필요해요.");
  });
}

/* ===== Init ===== */
searchNearbyTenPercent();
