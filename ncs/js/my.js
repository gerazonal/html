document.querySelectorAll(".setting-item").forEach(item => {
  item.addEventListener("click", () => {
    alert(`${item.innerText} (가상 동작)`);
  });
});
