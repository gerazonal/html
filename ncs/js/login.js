const loginBtn = document.getElementById("loginBtn");
const userIdInput = document.getElementById("userId");
const passwordInput = document.getElementById("password");

loginBtn.addEventListener("click", () => {
  const userId = userIdInput.value.trim();
  const password = passwordInput.value.trim();

  if (!userId || !password) {
    alert("아이디와 비밀번호를 모두 입력해주세요.");
    return;
  }

  // ✅ 실제 검증 없이 다음 페이지로 이동
  window.location.href = "./home.html"; // 다음 페이지 경로
});

const linkButtons = document.querySelectorAll(".link-btn");

linkButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;

    switch (action) {
      case "find-id":
        alert("아이디 찾기 페이지로 이동합니다. (가상 동작)");
        break;

      case "find-pw":
        alert("비밀번호 찾기 페이지로 이동합니다. (가상 동작)");
        break;

      case "signup":
        alert("회원가입 페이지로 이동합니다. (가상 동작)");
        break;
    }
  });
});
