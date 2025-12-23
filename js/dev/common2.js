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
  const navvControls = document.querySelector(".nav-video");
  const videoPlayer = document.getElementById("video-player");
  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");
  const muteButton = document.getElementById("mute");
  const fullscreenButton = document.getElementById("fullscreen");
  const videoContainer = document.querySelector(".video");
  let hideControlsTimeout;
  videoPlayer.muted = true;
  videoPlayer.pause();
  updatePlayPauseButtons();
  function updatePlayPauseButtons() {
    if (videoPlayer.paused) {
      playButton.style.display = "block";
      pauseButton.style.display = "none";
    } else {
      playButton.style.display = "none";
      pauseButton.style.display = "block";
    }
  }
  playButton.addEventListener("click", () => {
    videoPlayer.play();
    updatePlayPauseButtons();
  });
  pauseButton.addEventListener("click", () => {
    videoPlayer.pause();
    updatePlayPauseButtons();
  });
  videoPlayer.addEventListener("play", updatePlayPauseButtons);
  videoPlayer.addEventListener("pause", updatePlayPauseButtons);
  muteButton.addEventListener("click", () => {
    videoPlayer.muted = !videoPlayer.muted;
    muteButton.innerHTML = videoPlayer.muted ? '<img src="assets/img/icons/sound-off.svg" alt="Mute">' : '<img src="assets/img/icons/sound-on.svg" alt="Sound-on">';
  });
  fullscreenButton.addEventListener("click", () => {
    if (videoPlayer.webkitEnterFullscreen) {
      videoPlayer.webkitEnterFullscreen();
    } else if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.msRequestFullscreen) {
      videoContainer.msRequestFullscreen();
    }
  });
  function showControls() {
    navvControls.classList.remove("hidden");
    navvControls.style.opacity = "1";
    navvControls.style.pointerEvents = "auto";
    clearTimeout(hideControlsTimeout);
    hideControlsTimeout = setTimeout(hideControls, 3e3);
  }
  function hideControls() {
    navvControls.classList.add("hidden");
    navvControls.style.opacity = "0";
    navvControls.style.pointerEvents = "none";
  }
  let lastTap = 0;
  videoContainer.addEventListener("touchstart", (e) => {
    const now = Date.now();
    if (now - lastTap < 300) return;
    lastTap = now;
    if (navvControls.classList.contains("hidden")) showControls();
    else hideControls();
  });
});
