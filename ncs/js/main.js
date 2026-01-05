// splash → onboarding(slide) 이동
window.addEventListener("load", () => {
  // splash 애니메이션 충분히 보여준 후 이동
  setTimeout(() => {
    window.location.href = "./slide.html";
  }, 2000); // 2초 (원하면 조절)
});
