const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

window.addEventListener("DOMContentLoaded", () => {
  // 카테고리/퀵 버튼: 데모 동작
  $$(".cat").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert(`카테고리: ${btn.querySelector(".label")?.textContent || ""} (데모)`);
    });
  });

  $$(".pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert(`${btn.textContent.trim()} (데모)`);
    });
  });

  // 랭킹 카드 클릭 -> 아래 featured로 스크롤
  $$(".rank-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.getElementById("featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // 탭바: 데모(실서비스에서는 라우팅/탭 컨텐츠 전환으로 교체)
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      alert(`탭: ${tab.dataset.tab} (데모)`);
    });
  });

  // 하단 액션: 데모
  document.getElementById("routeBtn")?.addEventListener("click", () => alert("길찾기 (데모)"));
  document.getElementById("dismissBtn")?.addEventListener("click", () => alert("해제하기 (데모)"));
});
