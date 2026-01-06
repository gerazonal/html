// order-detail.js

// 1) 하단 고정 영역 높이만큼 content padding-bottom 자동 보정
function syncContentPadding(){
  const footer = document.getElementById("bottomFixed");
  const content = document.getElementById("content");
  if(!footer || !content) return;

  const h = footer.getBoundingClientRect().height;
  content.style.paddingBottom = `${h + 16}px`; // 여유 16px
}

window.addEventListener("load", syncContentPadding);
window.addEventListener("resize", syncContentPadding);

// 2) 상단 버튼 동작(가상)
document.getElementById("btnBack")?.addEventListener("click", () => {
  // 실제 앱처럼: 이전 화면으로
  history.back();
});

document.getElementById("btnStore")?.addEventListener("click", () => {
  // “매장 선택 창(order.html)”로 이동 (원하면 URL만 바꾸면 됨)
  location.href = "order.html";
});

document.getElementById("btnCart")?.addEventListener("click", () => {
  alert("장바구니(가상)");
});

// document.getElementById("btnPay")?.addEventListener("click", () => {
//   alert("결제하기(가상)");
// });

document.getElementById("btnCharge")?.addEventListener("click", () => {
  alert("충전하기(가상)");
});

// 3) 옵션 버튼 토글(선택된 옵션은 active 유지/해제 가능)
document.querySelectorAll(".option-chip").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("is-active");
  });
});

// ===== 초기 선택 옵션: ICED만 활성화 =====
document.querySelectorAll(".option-chip").forEach((btn) => {
  const isIced = btn.textContent.trim().toUpperCase() === "ICED";
  btn.classList.toggle("is-active", isIced);
});

// ===== 결제수단 단일 선택 (라디오 동작) =====
const methods = document.querySelectorAll(".method");

methods.forEach((method) => {
  method.addEventListener("click", () => {
    // 모든 결제수단 비활성화
    methods.forEach((m) => m.classList.remove("is-on"));

    // 클릭한 결제수단만 활성화
    method.classList.add("is-on");
  });
});

// 결제하기 버튼 → 홈으로 이동
document.getElementById("btnPay")?.addEventListener("click", () => {
  window.location.href = "home.html";
});
