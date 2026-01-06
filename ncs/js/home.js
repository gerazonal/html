const track = document.querySelector(".banner-track");
const dots = document.querySelectorAll(".banner-indicator .dot");

let index = 0;
const total = dots.length;
const INTERVAL = 7000;

/* ===== 배너 업데이트 ===== */
function updateBanner() {
  track.style.transform = `translateX(-${index * 100}vw)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* ===== 자동 반복 슬라이드 ===== */
setInterval(() => {
  index = (index + 1) % total;   // 반복 자동 슬라이드
  updateBanner();
}, INTERVAL);

/* ===== 가상 클릭 동작 ===== */

// 바코드 클릭
const barcodeBtn = document.querySelector(".js-barcode");
if (barcodeBtn) {
  barcodeBtn.addEventListener("click", () => {
    alert("바코드 화면으로 이동합니다. (가상 동작)");
  });
}

// 쿠폰 아이콘 클릭
const couponBtn = document.querySelector(".js-coupon");
if (couponBtn) {
  couponBtn.addEventListener("click", () => {
    alert("쿠폰함으로 이동합니다. (가상 동작)");
  });
}

// 스탬프 / 쿠폰 카드 클릭
const stampCard = document.querySelector(".js-stamp-card");
if (stampCard) {
  stampCard.addEventListener("click", () => {
    alert("스탬프 · 쿠폰 상세 화면으로 이동합니다. (가상 동작)");
  });
}

/* ===== Tab Bar Virtual Action (주문하기 제외) ===== */
const tabs = document.querySelectorAll(".tab-bar .tab");
const tabOrder = tabs[1]; // 주문하기 탭 (2번째)

tabs.forEach((tab, idx) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();

    // ✅ 홈 탭(0번째) → 새로고침
    if (idx === 0) {
      window.location.reload();
      return;
    }

    // 주문하기 탭은 오버레이 로직에서 처리
    if (idx === 1) return;

    // 🔽 여기부터 수정
    if (idx === 2) {
      // 텐페이카드
      window.location.href = "./tenpay.html";
      return;
    }

    if (idx === 3) {
      window.location.href = "./my.html";
      return;
    }
  });
});



/* ===== Order Overlay (iframe) ===== */
const overlayWrap = document.querySelector(".order-overlay-wrap");
const overlayDim = document.querySelector(".order-dim");
const orderFrame = document.querySelector(".order-frame");

function openOrderOverlay() {
  if (!overlayWrap || !orderFrame) return;

  orderFrame.src = "./order.html";
  overlayWrap.setAttribute("aria-hidden", "false");
  document.body.classList.add("order-open");

  // 탭 active를 주문하기로 맞추기
  tabs.forEach(t => t.classList.remove("active"));
  if (tabOrder) tabOrder.classList.add("active");
}

// dim 클릭하면 닫기
if (overlayDim) overlayDim.addEventListener("click", closeOrderOverlay);

// 최근 주문내역 "바로 주문하기" 버튼들
document.querySelectorAll(".order-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openOrderOverlay();
  });
});

// 탭바 "주문하기" 누르면 열기 (기존 active 토글이 preventDefault 하므로 여기서도 열어줌)
if (tabOrder) {
  tabOrder.addEventListener("click", (e) => {
    e.preventDefault();
    openOrderOverlay();
  });
}

// order.html에서 닫기 호출 가능하게 공개
window.closeOrderOverlay = closeOrderOverlay;

// ===== payment에서 돌아온 경우: 오버레이 닫기 =====
window.addEventListener("DOMContentLoaded", () => {
  const shouldCloseOverlay = sessionStorage.getItem("CLOSE_ORDER_OVERLAY");

  if (shouldCloseOverlay === "true") {
    sessionStorage.removeItem("CLOSE_ORDER_OVERLAY");

    closeOrderOverlay(); // ✅ 기존에 쓰던 오버레이 닫기 함수
  }
});

function closeOrderOverlay() {
  if (!overlayWrap) return; // 가드

  document.body.classList.remove("order-open");
  overlayWrap.setAttribute("aria-hidden", "true");

  setTimeout(() => {
    if (orderFrame) orderFrame.src = "";
  }, 300);

  tabs.forEach(t => t.classList.remove("active"));
  tabs[0].classList.add("active");
}

function updateBanner() {
  if (!track) return;
  track.style.transform = `translateX(-${index * 100}vw)`;
}
if (total > 0) {
  setInterval(() => {
    index = (index + 1) % total;
    updateBanner();
  }, INTERVAL);
}

