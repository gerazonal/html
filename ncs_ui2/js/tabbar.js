// ./js/tabbar.js
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabbar .tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const link = tab.dataset.link;

      // active UI 처리(현재 페이지 내에서만 의미)
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // 페이지 이동
      if (link) window.location.href = link;
    });
  });
});
