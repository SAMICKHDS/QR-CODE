
function postToGoogleSheet(data) {
  document.getElementById("status").innerText = "📡 저장 중...";
  fetch("https://script.google.com/macros/s/AKfycbyWvB7Jkd26F8KPEj3Z7g-23elU1vVzrkkVdIPFgl-zusl_1iPuQC36JJFdj4GXgDVI/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(txt => {
    document.getElementById("status").innerText = "✅ 저장 완료: " + data.receipt_no;
    setTimeout(() => document.getElementById("status").innerText = "카메라를 QR 코드에 맞춰주세요...", 3000);
  })
  .catch(err => {
    document.getElementById("status").innerText = "❌ 오류 발생: " + err;
  });
}

function onScanSuccess(decodedText) {
  document.getElementById('status').innerText = "📥 스캔됨: " + decodedText;
  let parts = decodedText.split("|");
  if (parts.length >= 4) {
    const data = {
      part_no: parts[0],
      part_name: parts[1],
      receipt_no: parts[2],
      lot_no: parts[3]
    };
    postToGoogleSheet(data);
  } else {
    document.getElementById('status').innerText = "❗ QR 코드 형식 오류 (4개 항목 필요)";
  }
}

window.addEventListener("load", () => {
  new Html5Qrcode("qr-reader").start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 300, height: 300 } },
    onScanSuccess
  );
});
