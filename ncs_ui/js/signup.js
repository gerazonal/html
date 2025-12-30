const $ = (id) => document.getElementById(id);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setError(id, msg){
  const el = $(id);
  if (el) el.textContent = msg || "";
}

function togglePassword(targetId, btn){
  const input = $(targetId);
  if (!input) return;
  const isPw = input.type === "password";
  input.type = isPw ? "text" : "password";
  btn.textContent = isPw ? "숨김" : "보기";
}

window.addEventListener("DOMContentLoaded", () => {
  // 비밀번호 보기 토글
  document.querySelectorAll(".pw-toggle").forEach((btn) => {
    btn.addEventListener("click", () => togglePassword(btn.dataset.target, btn));
  });

  // 로그인 화면으로
  $("toLoginBtn").addEventListener("click", () => {
    window.location.href = "login.html";
  });

  $("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();

    setError("errName");
    setError("errEmail");
    setError("errPassword");
    setError("errPassword2");

    const name = $("name").value.trim();
    const email = $("email").value.trim();
    const pw = $("password").value;
    const pw2 = $("password2").value;

    let ok = true;

    if (!name){
      setError("errName", "이름을 입력해주세요.");
      ok = false;
    }

    if (!email){
      setError("errEmail", "이메일을 입력해주세요.");
      ok = false;
    } else if (!emailRegex.test(email)){
      setError("errEmail", "이메일 형식이 올바르지 않아요.");
      ok = false;
    }

    if (!pw){
      setError("errPassword", "비밀번호를 입력해주세요.");
      ok = false;
    } else if (pw.length < 8){
      setError("errPassword", "비밀번호는 8자 이상이어야 해요.");
      ok = false;
    }

    if (!pw2){
      setError("errPassword2", "비밀번호 확인을 입력해주세요.");
      ok = false;
    } else if (pw !== pw2){
      setError("errPassword2", "비밀번호가 일치하지 않아요.");
      ok = false;
    }

    if (!ok) return;

    // 데모 동작: 실제 서비스에선 API 연동으로 교체
    alert("회원가입 완료(데모)");
    window.location.href = "login.html";
  });
});
