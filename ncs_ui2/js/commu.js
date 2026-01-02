// js/community.js
// 탭바 이동 (main 페이지와 동일한 방식)
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabbar .tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const link = tab.dataset.link;
      if (!link) return;
      window.location.href = link;
    });
  });

  // (선택) 만들기 버튼 동작 예시
  const makeBtn = document.querySelector(".make-btn");
  if (makeBtn) {
    makeBtn.addEventListener("click", () => {
      alert("작성 화면으로 이동(예정)");
    });
  }
});
