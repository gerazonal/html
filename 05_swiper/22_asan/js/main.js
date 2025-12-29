    const swiper = new Swiper('.swiper', {
    // Optional parameters
    // effect: 'fade',
    direction: 'horizontal',
    loop: true,
    // 자동실행
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter:true,
    },

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
        clickable:true,
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
    });