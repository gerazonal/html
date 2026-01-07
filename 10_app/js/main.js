    /**
     * 부산광역시_부산맛집 정보 서비스 (HTML/CSS/JS)
     * - 공공데이터포털 API: https://apis.data.go.kr/6260000/FoodService
     * - Kakao Map: JavaScript SDK 사용
     *
     * ✅ 필수 설정
     * 1) Kakao App Key: <script src="//dapi.kakao.com/...appkey=YOUR_KAKAO_APP_KEY"> 교체
     * 2) 공공데이터 서비스키: SERVICE_KEY 변수 교체
     */

    // ====== CONFIG ======
    const API_BASE = "https://apis.data.go.kr/6260000/FoodService";
    const SERVICE_KEY = "4d95e6487613dd61cdbf4aca7879a923109ade5a0f092666c68c1c19563c99ed"; // 공공데이터포털(Decoding) 서비스키로 교체

    // FoodService는 여러 엔드포인트가 있을 수 있어요.
    // 보통: /getFoodKr, /getFoodInfo 등 형태가 많은데, 제공 문서 기준으로 아래 후보를 순차 시도합니다.
    const ENDPOINT_CANDIDATES = [
      "getFoodKr",      // (예시) 한식
      "getFoodInfo",    // (예시) 통합
      "getFood",        // (예시) 짧은 이름
      ""                // 혹시 base가 이미 엔드포인트인 경우
    ];

    // ====== STATE ======
    let allItems = [];       // 전체 데이터
    let filteredItems = [];  // 검색/필터 반영 데이터
    let showOnlyFavorites = false;

    // ====== DOM ======
    const topbarList = document.getElementById("topbarList");
    const topbarDetail = document.getElementById("topbarDetail");

    const viewList = document.getElementById("viewList");
    const viewDetail = document.getElementById("viewDetail");

    const listEl = document.getElementById("list");
    const listState = document.getElementById("listState");

    const qEl = document.getElementById("q");

    const btnRefresh = document.getElementById("btnRefresh");
    const btnFavorites = document.getElementById("btnFavorites");

    const btnBack = document.getElementById("btnBack");
    const btnSearch = document.getElementById("btnSearch");

    const detailTitle = document.getElementById("detailTitle");
    const detailAddr = document.getElementById("detailAddr");

    const heroImg = document.getElementById("heroImg");

    const vName = document.getElementById("vName");
    const vAddr = document.getElementById("vAddr");
    const vIntro = document.getElementById("vIntro");
    const vMenu = document.getElementById("vMenu");
    const vTel  = document.getElementById("vTel");
    const vTime = document.getElementById("vTime");

    const btnFavDetail = document.getElementById("btnFavDetail");
    const favIconDetail = document.getElementById("favIconDetail");

    const btnKakaoRoute = document.getElementById("btnKakaoRoute");
    const btnHome = document.getElementById("btnHome");

    // ====== FAVORITES ======
    const LS_KEY = "busan_food_favorites_v1";

    function getFavorites() {
      try {
        return new Set(JSON.parse(localStorage.getItem(LS_KEY) || "[]"));
      } catch {
        return new Set();
      }
    }

    function setFavorites(set) {
      localStorage.setItem(LS_KEY, JSON.stringify(Array.from(set)));
    }

    function toggleFavorite(id) {
      const favs = getFavorites();
      if (favs.has(id)) favs.delete(id);
      else favs.add(id);
      setFavorites(favs);
      return favs;
    }

    function isFavorite(id) {
      return getFavorites().has(id);
    }

    function heartIconSvg(filled) {
      // filled: true -> solid 느낌(채움), false -> outline
      if (filled) {
        return `
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
        `;
      }
      return `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      `;
    }

    // ====== ROUTING ======
    function goList() {
      history.pushState({}, "", "#list");
      render();
    }

    function goDetail(id) {
      history.pushState({}, "", `#detail/${encodeURIComponent(id)}`);
      render();
    }

    function getRoute() {
      const h = (location.hash || "#list").replace(/^#/, "");
      const [name, ...rest] = h.split("/");
      return { name, rest };
    }

    window.addEventListener("popstate", render);
    window.addEventListener("hashchange", render);

    // ====== API FETCH ======
    function buildUrl(endpoint, params) {
      const base = endpoint ? `${API_BASE}/${endpoint}` : API_BASE;
      const url = new URL(base);
      Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        url.searchParams.set(k, String(v));
      });
      return url.toString();
    }

    // 공공데이터는 JSON/JSONP/XML 등 제공 형태가 다릅니다.
    // 여기서는 우선 JSON 시도 -> 실패하면 XML 파싱을 시도합니다.
    async function fetchFoodData() {
      // 흔한 파라미터: serviceKey, pageNo, numOfRows, resultType
      const commonParams = {
        serviceKey: SERVICE_KEY,
        pageNo: 1,
        numOfRows: 50,
        resultType: "json",
      };

      for (const ep of ENDPOINT_CANDIDATES) {
        const url = buildUrl(ep, commonParams);
        try {
          const res = await fetch(url);
          if (!res.ok) continue;

          const text = await res.text();
          // JSON 먼저
          try {
            const json = JSON.parse(text);
            const items = normalizeItemsFromAnyShape(json);
            if (items.length) return items;
          } catch {
            // XML 파싱
            const xml = new DOMParser().parseFromString(text, "text/xml");
            const items = normalizeItemsFromXml(xml);
            if (items.length) return items;
          }
        } catch {
          // 다음 후보로
        }
      }

      // 키가 없거나 엔드포인트가 다르면 데모 데이터 제공
      return demoData();
    }

    function normalizeItemsFromAnyShape(payload) {
      // 다양한 응답 형태 대응
      // 예: { getFoodKr: { item: [...] } }
      // 예: { response: { body: { items: { item: [...] } } } }
      // 예: { item: [...] }
      const candidates = [];

      function collect(obj) {
        if (!obj || typeof obj !== "object") return;
        if (Array.isArray(obj)) {
          candidates.push(obj);
          return;
        }
        for (const k of Object.keys(obj)) {
          const v = obj[k];
          if (Array.isArray(v)) candidates.push(v);
          else if (v && typeof v === "object") collect(v);
        }
      }
      collect(payload);

      const arr = candidates.find(a => a.length && typeof a[0] === "object") || [];
      return arr.map((x, idx) => normalizeOne(x, idx)).filter(Boolean);
    }

    function normalizeItemsFromXml(xmlDoc) {
      // <item>...</item> 형태를 추출
      const items = Array.from(xmlDoc.getElementsByTagName("item"));
      if (!items.length) return [];

      const get = (node, tag) => {
        const el = node.getElementsByTagName(tag)[0];
        return el && el.textContent ? el.textContent.trim() : "";
      };

      return items.map((node, idx) => normalizeOne({
        MAIN_TITLE: get(node, "MAIN_TITLE") || get(node, "title") || get(node, "name"),
        ADDR1: get(node, "ADDR1") || get(node, "address") || get(node, "addr"),
        ITEMCNTNTS: get(node, "ITEMCNTNTS") || get(node, "intro") || get(node, "contents"),
        RPRSNTV_MENU: get(node, "RPRSNTV_MENU") || get(node, "menu") || get(node, "representMenu"),
        CNTCT_TEL: get(node, "CNTCT_TEL") || get(node, "tel") || get(node, "phone"),
        USAGE_DAY_WEEK_AND_TIME: get(node, "USAGE_DAY_WEEK_AND_TIME") || get(node, "time") || get(node, "hours"),
        LAT: get(node, "LAT") || get(node, "lat"),
        LNG: get(node, "LNG") || get(node, "lng") || get(node, "lon"),
        MAIN_IMG_NORMAL: get(node, "MAIN_IMG_NORMAL") || get(node, "img"),
        UC_SEQ: get(node, "UC_SEQ") || get(node, "id")
      }, idx)).filter(Boolean);
    }

    function normalizeOne(raw, idx) {
      // 부산 관광/맛집 OpenAPI에서 흔히 쓰는 키들(추정):
      // UC_SEQ, MAIN_TITLE, ADDR1, ITEMCNTNTS, RPRSNTV_MENU, CNTCT_TEL, USAGE_DAY_WEEK_AND_TIME, LAT, LNG, MAIN_IMG_NORMAL
      const id = String(raw.UC_SEQ ?? raw.id ?? raw.seq ?? `${idx}`);
      const name = String(raw.MAIN_TITLE ?? raw.name ?? raw.title ?? "").trim();
      if (!name) return null;

      return {
        id,
        name,
        addr: String(raw.ADDR1 ?? raw.addr ?? raw.address ?? "").trim(),
        intro: String(raw.ITEMCNTNTS ?? raw.intro ?? raw.contents ?? "").trim(),
        menu: String(raw.RPRSNTV_MENU ?? raw.menu ?? raw.representMenu ?? "").trim(),
        tel: String(raw.CNTCT_TEL ?? raw.tel ?? raw.phone ?? "").trim(),
        time: String(raw.USAGE_DAY_WEEK_AND_TIME ?? raw.time ?? raw.hours ?? "").trim(),
        lat: toNum(raw.LAT ?? raw.lat),
        lng: toNum(raw.LNG ?? raw.lng ?? raw.lon),
        img: String(raw.MAIN_IMG_NORMAL ?? raw.img ?? "").trim(),
        raw
      };
    }

    function toNum(v) {
      const n = Number(String(v ?? "").trim());
      return Number.isFinite(n) ? n : null;
    }

    function demoData() {
      return [
        {
          id: "demo-1",
          name: "만드리곤드레밥",
          addr: "강서구 공항앞길 85번길 13",
          intro: "곤드레밥에는 일반적으로 건조 곤드레나물이 사용되는데, 이곳은 생 곤드레나물을 사용하여 돌솥밥을 만든다. 된장찌개와 함께 열 가지가 넘는 반찬이 제공되는 돌솥곤드레정식이 인기있다.",
          menu: "돌솥곤드레정식, 단호박오리훈제",
          tel: "051-941-3669",
          time: "11:00~21:00 (20:00 라스트오더)",
          lat: 35.1699,
          lng: 128.9486,
          img: ""
        },
        {
          id: "demo-2",
          name: "민물가든",
          addr: "강서구 둔치중앙길5(봉림동)",
          intro: "",
          menu: "묵은지붕어조림, 붕어찜",
          tel: "",
          time: "",
          lat: 35.171,
          lng: 128.95,
          img: ""
        },
        {
          id: "demo-3",
          name: "국제밀면본점",
          addr: "연제구 중앙대로1235번길 23-6",
          intro: "",
          menu: "물밀면, 비빔밀면",
          tel: "",
          time: "",
          lat: 35.183,
          lng: 129.079,
          img: ""
        }
      ];
    }

    // ====== RENDER ======
    function setView(which) {
      const isList = which === "list";
      topbarList.hidden = !isList;
      viewList.hidden = !isList;

      topbarDetail.hidden = isList;
      viewDetail.hidden = isList;
    }

    function applyFilter() {
      const query = (qEl.value || "").trim().toLowerCase();
      const favs = getFavorites();

      const base = showOnlyFavorites
        ? allItems.filter(x => favs.has(x.id))
        : allItems.slice();

      if (!query) {
        filteredItems = base;
        return;
      }

      filteredItems = base.filter(x => {
        const hay = `${x.name} ${x.addr} ${x.menu}`.toLowerCase();
        return hay.includes(query);
      });
    }

    function renderList() {
      setView("list");
      applyFilter();

      listEl.innerHTML = "";

      if (!allItems.length) {
        listState.textContent = "데이터가 없습니다.";
        listState.hidden = false;
        return;
      }

      listState.hidden = true;

      if (!filteredItems.length) {
        listState.textContent = showOnlyFavorites
          ? "즐겨찾기한 맛집이 없습니다."
          : "검색 결과가 없습니다.";
        listState.hidden = false;
        return;
      }

      const frag = document.createDocumentFragment();
      for (const item of filteredItems) {
        const row = document.createElement("div");
        row.className = "row";
        row.role = "button";
        row.tabIndex = 0;
        row.addEventListener("click", () => goDetail(item.id));
        row.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") goDetail(item.id);
        });

        const main = document.createElement("div");
        main.className = "row-main";

        const h = document.createElement("h3");
        h.className = "row-title";
        h.textContent = item.name;

        const addr = document.createElement("p");
        addr.className = "kv";
        addr.innerHTML = `<strong>주소:</strong> ${escapeHtml(item.addr || "-")}`;

        const menu = document.createElement("p");
        menu.className = "kv";
        menu.innerHTML = `<strong>메뉴:</strong> ${escapeHtml(item.menu || "-")}`;

        main.appendChild(h);
        main.appendChild(addr);
        main.appendChild(menu);

        const actions = document.createElement("div");
        actions.className = "row-actions";

        // 검색 아이콘(디테일 진입과 동일하게 동작)
        const btnGo = document.createElement("button");
        btnGo.className = "icon-btn";
        btnGo.title = "상세 보기";
        btnGo.ariaLabel = "상세 보기";
        btnGo.innerHTML = `<span class="i" aria-hidden="true">${
          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>`
        }</span>`;
        btnGo.addEventListener("click", (e) => {
          e.stopPropagation();
          goDetail(item.id);
        });

        // 하트(즐겨찾기)
        const btnFav = document.createElement("button");
        btnFav.className = "icon-btn";
        btnFav.title = "즐겨찾기";
        btnFav.ariaLabel = "즐겨찾기";
        btnFav.innerHTML = `<span class="i" aria-hidden="true">${heartIconSvg(isFavorite(item.id))}</span>`;
        btnFav.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleFavorite(item.id);
          renderList();
        });

        actions.appendChild(btnGo);
        actions.appendChild(btnFav);

        row.appendChild(main);
        row.appendChild(actions);
        frag.appendChild(row);
      }

      listEl.appendChild(frag);

      const count = filteredItems.length;
      const mode = showOnlyFavorites ? "즐겨찾기" : "전체";
      document.getElementById("listSubtitle").textContent = `${mode} ${count}건`;
    }

    let kakaoMap = null;
    let kakaoMarker = null;

    function renderDetail(item) {
      setView("detail");

      detailTitle.textContent = item.name;
      detailAddr.textContent = item.addr || "";

      vName.textContent = item.name;
      vAddr.textContent = item.addr || "-";
      vIntro.textContent = item.intro || "-";
      vMenu.textContent = item.menu || "-";
      vTel.textContent  = item.tel || "-";
      vTime.textContent = item.time || "-";

      // 이미지
      if (item.img) {
        heroImg.textContent = "";
        heroImg.style.backgroundImage = `url('${item.img.replace(/'/g, "\\'")}')`;
        heroImg.style.backgroundSize = "cover";
        heroImg.style.backgroundPosition = "center";
      } else {
        heroImg.style.backgroundImage = "";
        heroImg.textContent = "대표 이미지";
      }

      // 즐겨찾기 아이콘
      favIconDetail.innerHTML = heartIconSvg(isFavorite(item.id));

      // 길찾기
      btnKakaoRoute.onclick = () => openKakaoRoute(item);

      // 즐겨찾기 토글
      btnFavDetail.onclick = () => {
        toggleFavorite(item.id);
        favIconDetail.innerHTML = heartIconSvg(isFavorite(item.id));
      };

      // 지도
      drawKakaoMap(item);
    }

    function drawKakaoMap(item) {
      const mapEl = document.getElementById("map");

      // Kakao SDK 로드 체크
      if (!window.kakao || !kakao.maps) {
        mapEl.innerHTML = "<div style='padding:12px;color:#6b7280;font-size:14px;'>카카오맵 SDK가 로드되지 않았습니다. 상단 스크립트의 appkey를 설정해주세요.</div>";
        return;
      }

      // 좌표가 없으면 주소로 지오코딩
      const createMap = (lat, lng) => {
        const center = new kakao.maps.LatLng(lat, lng);
        if (!kakaoMap) {
          kakaoMap = new kakao.maps.Map(mapEl, {
            center,
            level: 3,
          });
        } else {
          kakaoMap.setCenter(center);
        }

        if (!kakaoMarker) {
          kakaoMarker = new kakao.maps.Marker({ position: center });
          kakaoMarker.setMap(kakaoMap);
        } else {
          kakaoMarker.setPosition(center);
        }
      };

      if (item.lat && item.lng) {
        createMap(item.lat, item.lng);
        return;
      }

      // 주소 지오코딩
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(item.addr, function(result, status) {
        if (status === kakao.maps.services.Status.OK && result && result[0]) {
          const lat = Number(result[0].y);
          const lng = Number(result[0].x);
          createMap(lat, lng);
        } else {
          mapEl.innerHTML = "<div style='padding:12px;color:#6b7280;font-size:14px;'>지도 좌표를 찾지 못했습니다. (주소 지오코딩 실패)</div>";
        }
      });
    }

    function openKakaoRoute(item) {
      // 카카오맵 길찾기 URL (웹)
      // 좌표가 있으면 좌표 기반, 없으면 키워드 검색 기반
      const name = encodeURIComponent(item.name);
      if (item.lat && item.lng) {
        const url = `https://map.kakao.com/link/to/${name},${item.lat},${item.lng}`;
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        const query = encodeURIComponent(`${item.name} ${item.addr}`.trim());
        const url = `https://map.kakao.com/link/search/${query}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }

    function render() {
      const r = getRoute();

      if (r.name === "detail" && r.rest[0]) {
        const id = decodeURIComponent(r.rest[0]);
        const item = allItems.find(x => x.id === id);
        if (item) {
          renderDetail(item);
        } else {
          // 데이터가 아직 없을 수 있으니 목록으로
          goList();
        }
        return;
      }

      renderList();
    }

    // ====== UTIL ======
    function escapeHtml(s) {
      return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    // ====== EVENTS ======
    qEl.addEventListener("input", () => renderList());

    btnRefresh.addEventListener("click", async () => {
      await load();
    });

    btnFavorites.addEventListener("click", () => {
      showOnlyFavorites = !showOnlyFavorites;
      btnFavorites.style.borderColor = showOnlyFavorites ? "#111" : "var(--line)";
      renderList();
    });

    btnBack.addEventListener("click", () => {
      // 상세 -> 목록
      goList();
    });

    btnHome.addEventListener("click", () => goList());

    btnSearch.addEventListener("click", () => {
      // 상세에서 검색 아이콘 누르면 목록으로 + 포커스
      goList();
      setTimeout(() => qEl.focus(), 30);
    });

    // ====== LOAD ======
    async function load() {
      listState.hidden = false;
      listState.textContent = "불러오는 중…";
      listEl.innerHTML = "";

      try {
        const items = await fetchFoodData();
        // 기본 정렬(가게명)
        allItems = items
          .filter(x => x && x.name)
          .sort((a, b) => a.name.localeCompare(b.name, "ko"));

        // 첫 로딩 시 라우트 기준 렌더
        render();
      } catch (e) {
        allItems = demoData();
        render();
      }
    }

    // ====== BOOT ======
    (function boot() {
      // default route
      if (!location.hash) location.hash = "#list";
      load();
    })();
