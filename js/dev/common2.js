(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
document.documentElement.classList.add("loaded");
document.addEventListener("DOMContentLoaded", function() {
  const btn = document.querySelector(".page-fixed-btn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 1e3) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });
});
document.addEventListener("DOMContentLoaded", function() {
  const forms = document.querySelectorAll(".contacts__form");
  forms.forEach((form) => {
    const inputs = form.querySelectorAll("input");
    form.addEventListener("submit", function(e) {
      let hasError = false;
      inputs.forEach((input) => {
        const line = input.closest(".form__line");
        const validMsg = line.parentElement.querySelector(".form__valid");
        line.classList.remove("error", "success");
        validMsg.style.display = "none";
        if (input.value.trim() === "") {
          line.classList.add("error");
          validMsg.style.display = "block";
          hasError = true;
          return;
        }
        if (input.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            line.classList.add("error");
            validMsg.style.display = "block";
            hasError = true;
            return;
          }
        }
        line.classList.add("success");
      });
      if (hasError) {
        e.preventDefault();
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  let time = 30 * 60;
  const timers = document.querySelectorAll(".timer");
  function updateAllTimers() {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor(time % 3600 / 60);
    let seconds = time % 60;
    timers.forEach((timer) => {
      const hoursEl = timer.querySelector(".timer__hours");
      const minutesEl = timer.querySelector(".timer__minutes");
      const secondsEl = timer.querySelector(".timer__seconds");
      if (!hoursEl || !minutesEl || !secondsEl) return;
      hoursEl.innerHTML = `<div class="timer__item">${hours}</div><div class="timer__label">год.</div>`;
      minutesEl.innerHTML = `<div class="timer__item">${minutes}</div><div class="timer__label">хв.</div>`;
      secondsEl.innerHTML = `<div class="timer__item">${seconds}</div><div class="timer__label">сек.</div>`;
    });
    if (time > 0) {
      time--;
    } else {
      clearInterval(timerInterval);
    }
  }
  updateAllTimers();
  const timerInterval = setInterval(updateAllTimers, 1e3);
});
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video-player");
  const controls = document.querySelector(".nav-video");
  const btnPlay = document.getElementById("play");
  const btnPause = document.getElementById("pause");
  const btnMute = document.getElementById("mute");
  const btnFull = document.getElementById("fullscreen");
  let hideTimer = null;
  video.muted = true;
  video.playsInline = true;
  video.controls = false;
  btnPause.style.display = "none";
  controls.classList.remove("hidden");
  function syncButtons() {
    if (video.paused) {
      btnPlay.style.display = "block";
      btnPause.style.display = "none";
    } else {
      btnPlay.style.display = "none";
      btnPause.style.display = "block";
    }
  }
  btnPlay.addEventListener("click", () => {
    video.play().catch(() => {
    });
    syncButtons();
    showControls();
  });
  btnPause.addEventListener("click", () => {
    video.pause();
    syncButtons();
    showControls();
  });
  video.addEventListener("play", syncButtons);
  video.addEventListener("pause", syncButtons);
  btnMute.addEventListener("click", () => {
    video.muted = !video.muted;
    btnMute.innerHTML = video.muted ? '<img src="assets/img/icons/sound-off.svg" alt="Mute">' : '<img src="assets/img/icons/sound-on.svg" alt="Sound">';
    showControls();
  });
  btnFull.addEventListener("click", () => {
    if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    } else if (video.requestFullscreen) {
      video.requestFullscreen();
    }
    showControls();
  });
  function showControls() {
    controls.classList.remove("hidden");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!video.paused) controls.classList.add("hidden");
    }, 2500);
  }
  video.addEventListener("touchstart", () => {
    showControls();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const photos = document.querySelectorAll(".review-slide__photo img");
  const gallery = document.getElementById("customGallery");
  const galleryImg = gallery.querySelector(".custom-gallery__img");
  const btnClose = gallery.querySelector(".custom-gallery__close");
  const btnPrev = gallery.querySelector(".custom-gallery__arrow--prev");
  const btnNext = gallery.querySelector(".custom-gallery__arrow--next");
  let currentIndex = 0;
  let images = [];
  photos.forEach((img, i) => {
    images.push(img.src);
    img.addEventListener("click", () => openGallery(i));
  });
  function showImage(src) {
    galleryImg.classList.remove("show");
    setTimeout(() => {
      galleryImg.src = src;
      galleryImg.onload = () => {
        galleryImg.classList.add("show");
      };
    }, 150);
  }
  function openGallery(index) {
    currentIndex = index;
    showImage(images[currentIndex]);
    gallery.classList.add("active");
  }
  function closeGallery() {
    gallery.classList.remove("active");
  }
  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(images[currentIndex]);
  }
  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(images[currentIndex]);
  }
  btnClose.addEventListener("click", closeGallery);
  btnNext.addEventListener("click", nextImage);
  btnPrev.addEventListener("click", prevImage);
  gallery.addEventListener("click", (e) => {
    if (e.target.classList.contains("custom-gallery__overlay")) closeGallery();
  });
  let startX = 0;
  gallery.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });
  gallery.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    let diff = endX - startX;
    if (Math.abs(diff) > 50) {
      diff < 0 ? nextImage() : prevImage();
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector(".popup");
  const openButtons = document.querySelectorAll(".btn-popup");
  const closeButton = popup.querySelector(".popup__close");
  if (!popup || !openButtons.length) return;
  const openPopup = () => {
    popup.classList.add("active");
    document.body.classList.add("popup-open");
    document.body.style.touchAction = "none";
  };
  const closePopup = () => {
    popup.classList.remove("active");
    document.body.classList.remove("popup-open");
    document.body.style.touchAction = "";
  };
  openButtons.forEach((btn) => {
    btn.addEventListener("click", openPopup);
    btn.addEventListener("touchend", openPopup);
  });
  closeButton.addEventListener("click", closePopup);
  closeButton.addEventListener("touchend", closePopup);
  popup.addEventListener("click", (e) => {
    if (!e.target.closest(".popup__wrapper")) {
      closePopup();
    }
  });
  popup.querySelector(".popup__wrapper").addEventListener("click", (e) => {
    e.stopPropagation();
  });
});
