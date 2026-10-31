// 10 demo tracks hosted by SoundHelix. Internet connection is required for these tracks.
const songs = [
  { title: "SoundHelix Song 1", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: "—" },
  { title: "SoundHelix Song 2", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", duration: "—" },
  { title: "SoundHelix Song 3", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", duration: "—" },
  { title: "SoundHelix Song 4", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", duration: "—" },
  { title: "SoundHelix Song 5", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", duration: "—" },
  { title: "SoundHelix Song 6", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", duration: "—" },
  { title: "SoundHelix Song 7", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3", duration: "—" },
  { title: "SoundHelix Song 8", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", duration: "—" },
  { title: "SoundHelix Song 9", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3", duration: "—" },
  { title: "SoundHelix Song 10", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", duration: "—" }
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist");
const titleEl = document.getElementById("song-title");
const artistEl = document.getElementById("song-artist");
const currentEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const cover = document.getElementById("cover");
let currentIndex = 0;
let shuffle = false;
let repeat = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function renderPlaylist() {
  playlist.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.className = "track" + (index === currentIndex ? " active" : "");
    li.innerHTML = `<span class="track-number">${index === currentIndex && !audio.paused ? "♫" : String(index + 1).padStart(2, "0")}</span>
      <span class="track-info"><div class="track-title"></div><div class="track-artist"></div></span>
      <span class="track-duration">${song.duration}</span>`;
    li.querySelector(".track-title").textContent = song.title;
    li.querySelector(".track-artist").textContent = song.artist;
    li.addEventListener("click", () => loadSong(index, true));
    playlist.appendChild(li);
  });
  document.getElementById("track-count").textContent = `${songs.length} TRACKS`;
}

function loadSong(index, autoplay = false) {
  currentIndex = (index + songs.length) % songs.length;
  const song = songs[currentIndex];
  audio.src = song.src;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  progress.value = 0;
  currentEl.textContent = "0:00";
  durationEl.textContent = song.duration;
  renderPlaylist();
  if (autoplay) playSong();
}

function playSong() {
  if (!audio.src) loadSong(currentIndex);
  audio.play().then(() => {
    playBtn.textContent = "Ⅱ";
    playBtn.setAttribute("aria-label", "Pause");
    cover.classList.add("playing");
    renderPlaylist();
  }).catch(() => {
    titleEl.textContent = "Could not load track";
    artistEl.textContent = "Check your internet connection and try again";
  });
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶";
  playBtn.setAttribute("aria-label", "Play");
  cover.classList.remove("playing");
  renderPlaylist();
}

function nextSong() {
  if (shuffle && songs.length > 1) {
    let next;
    do { next = Math.floor(Math.random() * songs.length); } while (next === currentIndex);
    loadSong(next, true);
  } else {
    loadSong(currentIndex + 1, true);
  }
}
function previousSong() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  loadSong(currentIndex - 1, true);
}

playBtn.addEventListener("click", () => audio.paused ? playSong() : pauseSong());
document.getElementById("next").addEventListener("click", nextSong);
document.getElementById("previous").addEventListener("click", previousSong);
document.getElementById("shuffle").addEventListener("click", (e) => {
  shuffle = !shuffle; e.currentTarget.classList.toggle("active", shuffle);
});
document.getElementById("repeat").addEventListener("click", (e) => {
  repeat = !repeat; audio.loop = repeat; e.currentTarget.classList.toggle("active", repeat);
});
volume.addEventListener("input", () => audio.volume = Number(volume.value));
progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
});
audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration)) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentEl.textContent = formatTime(audio.currentTime);
});
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
  songs[currentIndex].duration = formatTime(audio.duration);
  renderPlaylist();
});
audio.addEventListener("ended", () => { if (!repeat) nextSong(); });
audio.addEventListener("play", () => { playBtn.textContent = "Ⅱ"; cover.classList.add("playing"); });
audio.addEventListener("pause", () => { playBtn.textContent = "▶"; cover.classList.remove("playing"); });
audio.volume = Number(volume.value);
loadSong(0);
