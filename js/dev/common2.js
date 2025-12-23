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
document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector(".contacts__form");
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
  });
  btnPause.addEventListener("click", () => {
    video.pause();
    syncButtons();
  });
  video.addEventListener("play", syncButtons);
  video.addEventListener("pause", syncButtons);
  btnMute.addEventListener("click", () => {
    video.muted = !video.muted;
    btnMute.innerHTML = video.muted ? '<img src="assets/img/icons/sound-off.svg" alt="Mute">' : '<img src="assets/img/icons/sound-on.svg" alt="Sound">';
  });
  btnFull.addEventListener("click", () => {
    if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    } else if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  });
  function showControls() {
    controls.classList.remove("hidden");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      controls.classList.add("hidden");
    }, 2500);
  }
  video.addEventListener("touchstart", () => {
    showControls();
  });
});
