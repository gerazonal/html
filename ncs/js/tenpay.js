const barcodeEl = document.getElementById("barcode");

function generateBarcode() {
  barcodeEl.innerHTML = "";

  const bars = 48;

  for (let i = 0; i < bars; i++) {
    const bar = document.createElement("span");

    const width = Math.random() > 0.7 ? 3 : 1; // 굵기 랜덤
    bar.style.width = `${width}px`;
    bar.style.height = "48px";

    barcodeEl.appendChild(bar);

    // 여백 추가 (실제 바코드 느낌)
    if (Math.random() > 0.85) {
      const space = document.createElement("span");
      space.style.width = "2px";
      space.style.height = "48px";
      space.style.background = "transparent";
      barcodeEl.appendChild(space);
    }
  }
}

generateBarcode();
