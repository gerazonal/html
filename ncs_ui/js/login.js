// 데모용 동작: 실제 서비스에서는 API 연동/라우팅으로 교체하세요.
const $ = (id) => document.getElementById(id);

window.addEventListener("DOMContentLoaded", () => {
  $("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = $("username").value.trim();
    const password = $("password").value;

    if (!username || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    alert("로그인(데모)\n아이디: " + username);
  });

  $("signupBtn").addEventListener("click", () => alert("회원가입(데모)"));

  $("findId").addEventListener("click", (e) => {
    e.preventDefault();
    alert("아이디 찾기(데모)");
  });

  $("findPw").addEventListener("click", (e) => {
    e.preventDefault();
    alert("비밀번호 찾기(데모)");
  });

  $("browse").addEventListener("click", (e) => {
    e.preventDefault();
    alert("둘러보기(데모)");
  });

  for (const id of ["kakao", "naver", "facebook", "google"]) {
    $(id).addEventListener("click", () => alert(id + " 로그인(데모)"));
  }

  $("startBtn").addEventListener("click", () => alert("시작하기(데모)"));

  // iOS 키보드 올라올 때 하단 버튼이 가려지는 느낌 완화
  if (window.visualViewport) {
    const wrap = document.querySelector(".start-wrap");
    const baseBottom = parseFloat(getComputedStyle(wrap).bottom) || 0;

    const onResize = () => {
      const vv = window.visualViewport;
      const keyboard = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      wrap.style.bottom = `calc(${baseBottom}px + ${keyboard}px)`;
    };

    window.visualViewport.addEventListener("resize", onResize);
    window.visualViewport.addEventListener("scroll", onResize);
  }
});
