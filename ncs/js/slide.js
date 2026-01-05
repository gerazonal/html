const slides = document.getElementById("slides");
const dots = document.querySelectorAll(".dot");
const button = document.getElementById("actionBtn");
const skipBtn = document.querySelector(".skip");

let currentIndex = 0;
const totalSlides = 3;
const AUTO_DELAY = 3000;
let autoSlideTimer = null;

function updateSlide() {
  slides.style.transform = `translateX(-${currentIndex * 100}vw)`;

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });

  button.textContent =
    currentIndex === totalSlides - 1 ? "시작하기" : "다음";
}

// 자동 슬라이드 (1회)
function startAutoSlide() {
  autoSlideTimer = setInterval(() => {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
      updateSlide();
    } else {
      clearInterval(autoSlideTimer);
    }
  }, AUTO_DELAY);
}

startAutoSlide();

// 버튼 클릭
button.addEventListener("click", () => {
  if (currentIndex < totalSlides - 1) {
    currentIndex++;
    updateSlide();
  } else {
    // ✅ login.html로 이동
    window.location.href = "login.html";
  }
});


// 인디케이터 클릭
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    updateSlide();
  });
});

// ✅ SKIP 버튼
skipBtn.addEventListener("click", () => {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer);
  }
  currentIndex = totalSlides - 1;
  updateSlide();
});
