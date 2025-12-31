document.addEventListener("DOMContentLoaded", () => {
  const socialButtons = document.querySelectorAll(".social");

  socialButtons.forEach(button => {
    button.addEventListener("click", () => {
      const provider = button.dataset.provider;

      // 지금은 동작 확인용
      console.log(`${provider} 로그인 버튼 클릭`);

      // 추후 실제 인증 연결 위치
      // 예:
      // if (provider === "kakao") startKakaoLogin();
      // if (provider === "naver") startNaverLogin();
      // if (provider === "facebook") startFacebookLogin();

      alert(`${provider} 로그인 준비 중입니다.`);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector(".login-btn");
  const idInput = document.querySelector(".id-input");
  const pwInput = document.querySelector(".pw-input");

  loginBtn.addEventListener("click", () => {
    const idValue = idInput.value.trim();
    const pwValue = pwInput.value.trim();

    if (!idValue) {
      alert("아이디를 입력해주세요");
      idInput.focus();
      return;
    }

    if (!pwValue) {
      alert("비밀번호를 입력해주세요");
      pwInput.focus();
      return;
    }

    // 진위 여부는 확인하지 않음
    window.location.href = "main.html";
  });
});
