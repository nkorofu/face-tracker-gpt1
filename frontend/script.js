const video = document.getElementById("video");
const canvas = document.getElementById("output");
const ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;

// カメラ起動
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}
startCamera();

// MediaPipeセットアップ
const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

faceMesh.onResults((results) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];

    // 描画
    for (let i = 0; i < landmarks.length; i++) {
      const x = landmarks[i].x * canvas.width;
      const y = landmarks[i].y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
      ctx.fillStyle = "#0f0";
      ctx.fill();
    }

    // TODO: GPTに座標送信する処理をここに追加
    // fetch('/api/analyze', { method: 'POST', body: JSON.stringify(landmarks) })
  }
});

// WebカメラをMediaPipeに接続
const camera = new Camera(video, {
  onFrame: async () => await faceMesh.send({ image: video }),
  width: 640,
  height: 480,
});
camera.start();
