$(function(){
    $('.slickslide').slick({
        // 슬라이드 자동실행
    autoplay: true,
        // 페이지 버튼 보이게
    dots: true,
        // 자동실행 시간 조절
    autoplaySpeed: 2000,
        // 좌우버튼 false 안보이게, true 보이게
    arrows:false,
        // 사진 넘어갈 때 fade 효과
    // fade: true,
    // 마우스를 가져다 대도 멈추지 않고 계속 진행되도록
    pauseOnHover:false,
    // 슬라이드 상하 효과
    // vertical:true,
    // 슬라이드 2개씩 건너뛰어 가도록
    slidesToScroll:1,
    // 반복하지않고 한번만 실행
    // infinite:false,
    });
});