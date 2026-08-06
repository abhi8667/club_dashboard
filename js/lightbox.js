const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
let currentIndex = 0;

// 取得圖片與說明資料
// 假設 items 已經在 HTML 中定義好
window.items = window.items || [];

const images = items.map(item => item.src);
const captions = items.map(item => item.caption);


// 點擊縮圖開啟 Lightbox
document.querySelectorAll('.thumb').forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    showImage();
    lightbox.classList.remove('hidden');
  });
});

// 顯示目前圖片
function showImage() {
  lightboxImg.src = images[currentIndex];
  lightboxCaption.textContent = captions[currentIndex];
}

// 關閉 lightbox
document.querySelector('.close').addEventListener('click', () => lightbox.classList.add('hidden'));
document.querySelector('.overlay').addEventListener('click', () => lightbox.classList.add('hidden'));

// 按鈕切換
document.querySelector('.prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage();
});
document.querySelector('.next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage();
});

// -------- 手機觸控滑動支援 --------
let touchStartX = 0;
let touchEndX = 0;

lightboxImg.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

lightboxImg.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
}, false);

function handleSwipeGesture() {
  const threshold = 30;
  if (touchEndX < touchStartX - threshold) {
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
  } else if (touchEndX > touchStartX + threshold) {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
  }
}

// -------- 滑鼠拖曳滑動支援 --------
let mouseDownX = 0;
let mouseUpX = 0;
let isDragging = false;

lightboxImg.addEventListener('mousedown', (e) => {
  isDragging = true;
  mouseDownX = e.clientX;
});

lightboxImg.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
});

lightboxImg.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  mouseUpX = e.clientX;
  isDragging = false;
  handleMouseSwipe();
});

lightboxImg.addEventListener('mouseleave', () => {
  isDragging = false;
});

function handleMouseSwipe() {
  const threshold = 30;
  if (mouseUpX < mouseDownX - threshold) {
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
  } else if (mouseUpX > mouseDownX + threshold) {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
  }
}

// 當彈出視窗顯示時，防止滑鼠穿透與觸發聲音
// 1. 開啟 Awards 面板的函式
function openAwardsModal() {
    // 讓你的 Lightbox 顯示... (你原本的 code)
    document.getElementById("news-lightbox").classList.add("active"); 

    // 🌟 新增：鎖定背景卡片的滑鼠事件（請依實際情況選擇綁在 #ui-container 或 body 上的主要容器）
    const uiContainer = document.getElementById("ui-container");
    if (uiContainer) {
        uiContainer.classList.add("no-pointer-events");
    }
}

// 2. 關閉 Awards 面板的函式
function closeNews() {
    // 關閉你的 Lightbox... (你原本的 code)
    document.getElementById("news-lightbox").classList.remove("active");

    // 🌟 新增：解除鎖定，讓背景卡片的滑鼠事件與聲音恢復正常
    const uiContainer = document.getElementById("ui-container");
    if (uiContainer) {
        uiContainer.classList.remove("no-pointer-events");
    }
}