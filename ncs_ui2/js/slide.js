const slidesWrap = document.querySelector(".slides");
const slideEls = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const bottomBar = document.querySelector(".bottom-bar");
const indicator = document.querySelector(".indicator");
const skipBtn = document.querySelector(".skip");
const startBtn = document.querySelector(".start-btn");

let currentIndex = 0;
const totalSlides = slideEls.length;

/* 슬라이드 이동 + UI 갱신 */
function updateSlide(index) {
  currentIndex = index;
  slidesWrap.style.transform = `translateX(-${index * 100}%)`;

  // 인디케이터 active 처리
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  // 마지막 슬라이드 UI 전환
  if (index === totalSlides - 1) {
    indicator.style.display = "none";
    skipBtn.style.display = "none";
    startBtn.style.display = "block";
  } else {
    indicator.style.display = "flex";
    skipBtn.style.display = "block";
    startBtn.style.display = "none";
  }
}

/* 초기 상태 */
updateSlide(0);

/* 자동 슬라이드 (마지막에서 멈춤) */
const slideInterval = setInterval(() => {
  if (currentIndex < totalSlides - 1) {
    updateSlide(currentIndex + 1);
  } else {
    clearInterval(slideInterval);
  }
}, 3000);

/* ✅ 인디케이터 클릭 시 해당 슬라이드로 이동 */
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    clearInterval(slideInterval);
    updateSlide(index);
  });
});

/* ✅ SKIP → 마지막 슬라이드로 이동 */
skipBtn.addEventListener("click", () => {
  clearInterval(slideInterval);
  updateSlide(totalSlides - 1);
});

/* ✅ 바로 시작하기 → 다음 페이지 이동 */
startBtn.addEventListener("click", () => {
  window.location.href = "main.html"; // 원하는 페이지 경로
});

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.querySelector(".start-btn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      window.location.href = "login.html"; // 로그인 페이지 경로
    });
  }
});
