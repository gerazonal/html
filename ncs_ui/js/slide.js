const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const startBtn = document.getElementById('startBtn');

let currentIndex = 0;
let autoSlideTimer = null;
const SLIDE_DURATION = 2500; // 2.5초

function showSlide(index) {
    slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    dots[i].classList.toggle('active', i === index);
    });

  // 마지막 슬라이드 도달 시 버튼 활성화 + 자동 실행 중지
    if (index === slides.length - 1) {
    startBtn.disabled = false;
    clearInterval(autoSlideTimer);
    }
}

function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
    if (currentIndex < slides.length - 1) {
        currentIndex++;
        showSlide(currentIndex);
    }
    }, SLIDE_DURATION);
}

// 초기 실행
showSlide(currentIndex);
startAutoSlide();
