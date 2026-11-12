/* ==========================================================================
   Pink Apology Quest — Interactive Gamified Engine, WebAudio SFX & Particles
   ========================================================================== */

(() => {
  "use strict";

  // -------------------- 1. PHOTO MEMORIES DATA --------------------
  const MEMORIES = [
    {
      id: 0,
      src: "./assets/photo1_playful_cap.jpg",
      badge: "Memory #1 • The Playful Cap Moment",
      caption: '"I only ever want to mess with your cap to make you laugh — never scold you."',
      note: "Seeing you act dramatic while I steal or flip your cap is honestly one of my favorite things ever.",
      tilt: "tilt-left"
    },
    {
      id: 1,
      src: "./assets/photo2_car_puppies.jpg",
      badge: "Memory #2 • Silly Backseat Puppies",
      caption: '"Us being silly puppies together is my whole happy place 🐶💕"',
      note: "Even an ordinary car ride becomes a core memory the second you smile next to me.",
      tilt: "tilt-right"
    },
    {
      id: 2,
      src: "./assets/photo3_bus_hug.jpg",
      badge: "Memory #3 • Beside the College Bus",
      caption: '"Standing right next to you like this is where I always belong."',
      note: "No matter how chaotic the day is, putting my arm around you makes everything calm.",
      tilt: "tilt-left"
    },
    {
      id: 3,
      src: "./assets/photo4_sweet_gaze.jpg",
      badge: "Memory #4 • Eyes Only for You",
      caption: '"The only way I ever want to look at you — full of admiration and love."',
      note: "I'm sorry for ever letting impatience cloud this warmth. You deserve gentle eyes always.",
      tilt: "tilt-right"
    },
    {
      id: 4,
      src: "./assets/photo5_her_smile.jpg",
      badge: "Memory #5 • My Favorite Smile",
      caption: '"My favorite smile in the whole universe ✨"',
      note: "This smile is worth protecting every single day. Thank you for being mine.",
      tilt: "tilt-left"
    }
  ];

  // -------------------- 2. WEB AUDIO API SFX + MUSIC BOX --------------------
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.sfxEnabled = true;
      this.musicEnabled = false;
      this.musicTimer = null;
      this.chordIdx = 0;
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    playTone({ freq = 523.25, freqEnd = null, type = "sine", duration = 0.2, gainPeak = 0.14, delay = 0 }) {
      if (!this.sfxEnabled) return;
      const ctx = this.ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (freqEnd !== null) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + duration);
      }

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(gainPeak, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.03);
    }

    playPop() {
      this.playTone({ freq: 360, freqEnd: 760, type: "sine", duration: 0.12, gainPeak: 0.16 });
      this.playTone({ freq: 920, freqEnd: 1240, type: "triangle", duration: 0.08, gainPeak: 0.07, delay: 0.03 });
    }

    playScaleNote(stepIndex) {
      const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5];
      const freq = scale[stepIndex % scale.length];
      this.playTone({ freq, type: "triangle", duration: 0.28, gainPeak: 0.15 });
      this.playTone({ freq: freq * 2, type: "sine", duration: 0.18, gainPeak: 0.05, delay: 0.02 });
    }

    playSparkle() {
      const notes = [659.25, 783.99, 987.77, 1318.51];
      notes.forEach((n, i) => {
        this.playTone({ freq: n, type: "sine", duration: 0.24, gainPeak: 0.09, delay: i * 0.055 });
      });
    }

    playChime() {
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
      notes.forEach((n, i) => {
        this.playTone({ freq: n, type: "triangle", duration: 0.42, gainPeak: 0.11, delay: i * 0.07 });
      });
    }

    playBoop() {
      this.playTone({ freq: 440, freqEnd: 210, type: "sine", duration: 0.16, gainPeak: 0.13 });
    }

    playKiss() {
      this.playTone({ freq: 620, freqEnd: 1180, type: "sine", duration: 0.11, gainPeak: 0.14 });
      this.playTone({ freq: 1046.5, freqEnd: 1567.98, type: "triangle", duration: 0.16, gainPeak: 0.08, delay: 0.07 });
    }

    playFanfare() {
      const melody = [
        { f: 523.25, d: 0.0 },
        { f: 659.25, d: 0.09 },
        { f: 783.99, d: 0.18 },
        { f: 1046.5, d: 0.28 },
        { f: 987.77, d: 0.40 },
        { f: 1046.5, d: 0.52 },
        { f: 1318.51, d: 0.65 }
      ];
      melody.forEach((m) => {
        this.playTone({ freq: m.f, type: "triangle", duration: 0.48, gainPeak: 0.13, delay: m.d });
        this.playTone({ freq: m.f * 0.5, type: "sine", duration: 0.5, gainPeak: 0.07, delay: m.d });
      });
    }

    // Gentle Romantic Music Box Loop
    startMusic() {
      const ctx = this.ensureContext();
      if (!ctx || this.musicTimer) return;
      this.musicEnabled = true;

      // Warm progression: Fmaj7 -> G6 -> Em7 -> Am7
      const chords = [
        [349.23, 440.0, 523.25, 659.25],
        [392.0, 493.88, 587.33, 659.25],
        [329.63, 392.0, 493.88, 587.33],
        [440.0, 523.25, 659.25, 783.99]
      ];

      const playMusicBoxStep = () => {
        if (!this.musicEnabled) return;
        const chord = chords[this.chordIdx % chords.length];
        chord.forEach((freq, i) => {
          this.playMusicBoxNote(freq, i * 0.28);
        });
        this.chordIdx++;
      };

      playMusicBoxStep();
      this.musicTimer = setInterval(playMusicBoxStep, 1900);
    }

    playMusicBoxNote(freq, delay) {
      const ctx = this.ctx;
      if (!ctx) return;
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.042, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    }

    stopMusic() {
      this.musicEnabled = false;
      if (this.musicTimer) {
        clearInterval(this.musicTimer);
        this.musicTimer = null;
      }
    }
  }

  const sfx = new SoundEngine();

  // -------------------- 3. AMBIENT PETALS + BURST PARTICLES --------------------
  const bgCanvas = document.getElementById("bgCanvas");
  const bgCtx = bgCanvas.getContext("2d");
  const fxCanvas = document.getElementById("fxCanvas");
  const fxCtx = fxCanvas.getContext("2d");

  let vw = window.innerWidth;
  let vh = window.innerHeight;

  function resizeCanvases() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    bgCanvas.width = vw;
    bgCanvas.height = vh;
    fxCanvas.width = vw;
    fxCanvas.height = vh;
  }
  resizeCanvases();
  window.addEventListener("resize", resizeCanvases);

  // Ambient floating petals / soft hearts
  const ambientItems = Array.from({ length: 28 }, () => createAmbientItem(true));
  function createAmbientItem(randomY = false) {
    return {
      x: Math.random() * vw,
      y: randomY ? Math.random() * vh : vh + 24,
      size: 6 + Math.random() * 10,
      speedY: 0.35 + Math.random() * 0.75,
      swayAmp: 0.4 + Math.random() * 1.1,
      swayFreq: 0.008 + Math.random() * 0.015,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.2 + Math.random() * 0.38,
      isHeart: Math.random() > 0.45,
      color: ["#ff7fb3", "#ff9ec4", "#ff5c9d", "#ffc6de"][Math.floor(Math.random() * 4)]
    };
  }

  // Burst confetti / heart sparks
  const burstParticles = [];
  function spawnBurst(x, y, count = 24, colors = ["#ff5599", "#ff8fc0", "#ffd06b", "#ffffff", "#e12672"]) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2.4 + Math.random() * 6.4;
      burstParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.2,
        gravity: 0.16,
        size: 5 + Math.random() * 7,
        alpha: 1,
        decay: 0.014 + Math.random() * 0.012,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.18,
        isHeart: Math.random() > 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function drawHeartShape(ctx, x, y, size, rot, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = color;
    ctx.beginPath();
    const s = size * 0.55;
    ctx.moveTo(0, s * 0.45);
    ctx.bezierCurveTo(-s, -s * 0.35, -s * 1.1, -s * 1.25, 0, -s * 0.55);
    ctx.bezierCurveTo(s * 1.1, -s * 1.25, s, -s * 0.35, 0, s * 0.45);
    ctx.fill();
    ctx.restore();
  }

  function animateCanvases() {
    bgCtx.clearRect(0, 0, vw, vh);
    for (let i = 0; i < ambientItems.length; i++) {
      const p = ambientItems[i];
      p.y -= p.speedY;
      p.phase += p.swayFreq;
      const drawX = p.x + Math.sin(p.phase) * 26 * p.swayAmp;

      if (p.isHeart) {
        drawHeartShape(bgCtx, drawX, p.y, p.size, Math.sin(p.phase) * 0.2, p.color, p.alpha);
      } else {
        bgCtx.save();
        bgCtx.globalAlpha = p.alpha;
        bgCtx.fillStyle = p.color;
        bgCtx.translate(drawX, p.y);
        bgCtx.rotate(p.phase);
        bgCtx.beginPath();
        bgCtx.ellipse(0, 0, p.size * 0.65, p.size * 0.38, 0, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.restore();
      }

      if (p.y < -30) {
        ambientItems[i] = createAmbientItem(false);
      }
    }

    fxCtx.clearRect(0, 0, vw, vh);
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const b = burstParticles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += b.gravity;
      b.vx *= 0.985;
      b.rot += b.rotSpeed;
      b.alpha -= b.decay;

      if (b.alpha <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }

      if (b.isHeart) {
        drawHeartShape(fxCtx, b.x, b.y, b.size * 1.25, b.rot, b.color, b.alpha);
      } else {
        fxCtx.save();
        fxCtx.globalAlpha = b.alpha;
        fxCtx.fillStyle = b.color;
        fxCtx.translate(b.x, b.y);
        fxCtx.rotate(b.rot);
        fxCtx.fillRect(-b.size / 2, -b.size / 3, b.size, b.size * 0.65);
        fxCtx.restore();
      }
    }

    requestAnimationFrame(animateCanvases);
  }
  animateCanvases();

  // Cursor glow follow
  const cursorGlow = document.getElementById("cursorGlow");
  window.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = e.clientX + "px";
    cursorGlow.style.top = e.clientY + "px";
  });

  // -------------------- 4. APP STATE & HUD HELPERS --------------------
  const state = {
    currentStage: 0,
    loveMeter: 0,
    unlockedMemories: new Set(),
    cloudsPopped: 0,
    heartsCaught: 0,
    heartSpawner: null,
    promisesUnsealed: new Set(),
    dodgeCount: 0,
    kissCount: 0,
    modalPhotoIndex: 0
  };

  const STAGE_NAMES = [
    "Prologue",
    "Quest 1: Clouds",
    "Quest 2: Hearts",
    "Quest 3: Promises",
    "Final Boss",
    "Forever Loved ♥"
  ];

  const loveFill = document.getElementById("loveFill");
  const lovePct = document.getElementById("lovePct");
  const stageLabel = document.getElementById("stageLabel");
  const memoriesCount = document.getElementById("memoriesCount");

  function setLoveMeter(targetPct) {
    state.loveMeter = Math.min(100, Math.max(state.loveMeter, targetPct));
    loveFill.style.width = state.loveMeter + "%";
    lovePct.textContent = Math.round(state.loveMeter) + "%";
  }

  function unlockMemory(index) {
    if (!state.unlockedMemories.has(index)) {
      state.unlockedMemories.add(index);
      memoriesCount.textContent = state.unlockedMemories.size;
    }
  }

  function showToast(msg) {
    const container = document.getElementById("toastContainer");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transition = "opacity 0.3s ease";
      setTimeout(() => el.remove(), 320);
    }, 2200);
  }

  function goToStage(num) {
    if (state.heartSpawner) {
      clearInterval(state.heartSpawner);
      state.heartSpawner = null;
    }

    document.querySelectorAll(".stage").forEach((s) => s.classList.remove("active"));
    const target = document.getElementById(`stage-${num}`);
    if (target) {
      target.classList.add("active");
    }
    state.currentStage = num;
    stageLabel.textContent = STAGE_NAMES[num] || "Quest";
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (num === 1) initCloudGame();
    if (num === 2) initHeartGame();
    if (num === 4) resetBossArena();
    if (num === 5) initFinale();
  }

  // -------------------- 5. HUD CONTROLS (SFX, MUSIC, ALBUM) --------------------
  const sfxBtn = document.getElementById("sfxBtn");
  const sfxIcon = document.getElementById("sfxIcon");
  const sfxLabel = document.getElementById("sfxLabel");

  sfxBtn.addEventListener("click", () => {
    sfx.sfxEnabled = !sfx.sfxEnabled;
    sfxBtn.classList.toggle("active", sfx.sfxEnabled);
    sfxIcon.textContent = sfx.sfxEnabled ? "🔊" : "🔇";
    sfxLabel.textContent = sfx.sfxEnabled ? "SFX: On" : "SFX: Off";
    if (sfx.sfxEnabled) sfx.playPop();
  });

  const musicBtn = document.getElementById("musicBtn");
  const musicIcon = document.getElementById("musicIcon");
  const musicLabel = document.getElementById("musicLabel");

  musicBtn.addEventListener("click", () => {
    if (sfx.musicEnabled) {
      sfx.stopMusic();
      musicBtn.classList.remove("active");
      musicLabel.textContent = "Music: Off";
      musicIcon.textContent = "🎵";
    } else {
      sfx.startMusic();
      musicBtn.classList.add("active");
      musicLabel.textContent = "Music: On";
      musicIcon.textContent = "🎶";
      showToast("Soft romantic music box turned on 🎶");
    }
  });

  // -------------------- 6. STAGE 0: PROLOGUE --------------------
  function startQuest(e) {
    sfx.ensureContext();
    sfx.playSparkle();
    const rect = e.currentTarget.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 26);
    setLoveMeter(10);
    goToStage(1);
  }

  document.getElementById("startQuestBtn").addEventListener("click", startQuest);
  document.getElementById("startEnvelope").addEventListener("click", startQuest);

  // -------------------- 7. STAGE 1: CLEAR GRUMPY CLOUDS --------------------
  const CLOUD_APOLOGIES = [
    { bad: "Raising my tone 😔", good: "Soft & patient voice always 🌸" },
    { bad: "Being impatient 🌩️", good: "Listening with all my heart 💗" },
    { bad: "Making you upset 🌧️", good: "Protecting your peace ✨" },
    { bad: "Forgetting to breathe 💨", good: "Pausing to hug you first 🫂" },
    { bad: "Stubborn attitude 😤", good: "You > any silly argument 👑" },
    { bad: "Not appreciating you 🥺", good: "Loving you endlessly 💖" }
  ];

  function initCloudGame() {
    const arena = document.getElementById("cloudArena");
    const leftText = document.getElementById("cloudsLeftText");
    const revealBox = document.getElementById("memory1Reveal");

    if (state.cloudsPopped === CLOUD_APOLOGIES.length) return;

    arena.innerHTML = "";
    state.cloudsPopped = 0;
    leftText.innerHTML = `Clouds left to pop: <strong>${CLOUD_APOLOGIES.length}</strong>`;
    revealBox.classList.add("hidden");

    CLOUD_APOLOGIES.forEach((item) => {
      const btn = document.createElement("button");
      btn.className = "grumpy-cloud";
      btn.innerHTML = `
        <span class="cloud-emoji">🌧️</span>
        <span class="cloud-label">${item.bad}</span>
        <span class="cloud-tap">Tap to apologize</span>
      `;

      btn.addEventListener("click", () => {
        if (btn.classList.contains("popped")) return;
        btn.classList.add("popped");
        btn.innerHTML = `
          <span class="cloud-emoji">🌷</span>
          <span class="cloud-label">${item.good}</span>
          <span class="cloud-tap">Cleared ♥</span>
        `;

        state.cloudsPopped++;
        sfx.playScaleNote(state.cloudsPopped - 1);

        const rect = btn.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);

        const remaining = CLOUD_APOLOGIES.length - state.cloudsPopped;
        leftText.innerHTML = remaining > 0
          ? `Clouds left to pop: <strong>${remaining}</strong>`
          : `All grumpy clouds cleared! ✨`;

        setLoveMeter(10 + Math.round((state.cloudsPopped / CLOUD_APOLOGIES.length) * 20));

        if (state.cloudsPopped === CLOUD_APOLOGIES.length) {
          setTimeout(() => {
            sfx.playChime();
            unlockMemory(0);
            revealBox.classList.remove("hidden");
            showToast("Memory #1 Unlocked! 📸");
          }, 320);
        }
      });

      arena.appendChild(btn);
    });
  }

  document.getElementById("toStage2Btn").addEventListener("click", () => {
    sfx.playSparkle();
    goToStage(2);
  });

  // -------------------- 8. STAGE 2: CATCH MY HEARTBEATS --------------------
  const HEART_WORDS = ["Sorry ♥", "Love You", "Hug Me", "My Queen", "Forehead Kiss", "Cutie", "Forever", "Smile!"];

  function initHeartGame() {
    const arena = document.getElementById("heartArena");
    const caughtEl = document.getElementById("heartsCaught");
    const fillEl = document.getElementById("heartsProgressFill");
    const hintEl = document.getElementById("heartArenaHint");
    const revealBox = document.getElementById("memory23Reveal");

    if (state.heartsCaught >= 8) return;

    // Clear old floating hearts
    arena.querySelectorAll(".floating-heart-btn").forEach((el) => el.remove());
    state.heartsCaught = 0;
    caughtEl.textContent = "0";
    fillEl.style.width = "0%";
    hintEl.style.opacity = "1";
    revealBox.classList.add("hidden");

    const spawnFloatingHeart = () => {
      if (state.currentStage !== 2 || state.heartsCaught >= 8) return;

      const btn = document.createElement("button");
      btn.className = "floating-heart-btn";
      const isGold = Math.random() > 0.68;
      const word = HEART_WORDS[Math.floor(Math.random() * HEART_WORDS.length)];
      const leftPct = 12 + Math.random() * 76;

      btn.style.left = leftPct + "%";
      btn.innerHTML = `
        <div class="heart-orb ${isGold ? "gold" : ""}">${isGold ? "💛" : "💖"}</div>
        <span class="heart-word">${word}</span>
      `;

      let y = -60;
      const speed = 1.65 + Math.random() * 1.25;
      const driftPhase = Math.random() * Math.PI * 2;
      let alive = true;

      const step = () => {
        if (!alive || state.currentStage !== 2) {
          btn.remove();
          return;
        }
        y += speed;
        const sway = Math.sin(y * 0.025 + driftPhase) * 16;
        btn.style.bottom = y + "px";
        btn.style.marginLeft = sway + "px";

        if (y > 390) {
          alive = false;
          btn.remove();
          return;
        }
        requestAnimationFrame(step);
      };

      const catchHandler = (ev) => {
        ev.preventDefault();
        if (!alive || state.heartsCaught >= 8) return;
        alive = false;

        const rect = btn.getBoundingClientRect();
        spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
        btn.remove();

        state.heartsCaught++;
        hintEl.style.opacity = "0";
        caughtEl.textContent = String(state.heartsCaught);
        fillEl.style.width = (state.heartsCaught / 8) * 100 + "%";
        sfx.playScaleNote(state.heartsCaught - 1);
        setLoveMeter(30 + Math.round((state.heartsCaught / 8) * 25));

        if (state.heartsCaught >= 8) {
          clearInterval(state.heartSpawner);
          state.heartSpawner = null;
          arena.querySelectorAll(".floating-heart-btn").forEach((el) => el.remove());

          setTimeout(() => {
            sfx.playChime();
            unlockMemory(1);
            unlockMemory(2);
            revealBox.classList.remove("hidden");
            showToast("Memories #2 & #3 Unlocked! 📸✨");
          }, 300);
        }
      };

      btn.addEventListener("pointerdown", catchHandler);
      arena.appendChild(btn);
      requestAnimationFrame(step);
    };

    // Spawn a couple right away so she doesn't wait
    spawnFloatingHeart();
    setTimeout(spawnFloatingHeart, 420);
    state.heartSpawner = setInterval(spawnFloatingHeart, 760);
  }

  document.getElementById("toStage3Btn").addEventListener("click", () => {
    sfx.playSparkle();
    goToStage(3);
  });

  // -------------------- 9. STAGE 3: PEEL & REVEAL PROMISES --------------------
  document.querySelectorAll(".promise-card").forEach((card) => {
    card.addEventListener("click", () => {
      const idx = card.dataset.index;
      if (card.classList.contains("unsealed")) return;

      card.classList.add("unsealed");
      state.promisesUnsealed.add(idx);
      sfx.playPop();

      const rect = card.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
      setLoveMeter(55 + Math.round((state.promisesUnsealed.size / 3) * 20));

      if (state.promisesUnsealed.size === 3) {
        setTimeout(() => {
          sfx.playChime();
          unlockMemory(3);
          document.getElementById("memory4Reveal").classList.remove("hidden");
          showToast("Memory #4 Unlocked! 💌");
        }, 420);
      }
    });
  });

  document.getElementById("toStage4Btn").addEventListener("click", () => {
    sfx.playSparkle();
    goToStage(4);
  });

  // -------------------- 10. STAGE 4: FINAL BOSS DODGING BUTTON --------------------
  const DODGE_TAUNTS = [
    "Wait no, think about my cute puppy face in photo #2! 🐶",
    "Nice try! Staying mad at me is temporarily out of stock 😌",
    "Oops, my guilt just teleported that button away!",
    "Come onnn, give your silly boy a hug already 🥺💗",
    "Error 404: Grumpiness not found. Please press the pink button!"
  ];

  const yesBtn = document.getElementById("forgiveYesBtn");
  const noBtn = document.getElementById("forgiveNoBtn");
  const bossArena = document.getElementById("bossArena");
  const dodgeTaunt = document.getElementById("dodgeTaunt");

  function resetBossArena() {
    state.dodgeCount = 0;
    noBtn.style.position = "relative";
    noBtn.style.left = "auto";
    noBtn.style.top = "auto";
    noBtn.style.transform = "scale(1)";
    yesBtn.style.transform = "scale(1)";
    dodgeTaunt.textContent = "Choose wisely, cutie 🥺👉👈";
    unlockMemory(4);
  }

  function dodgeNoButton(e) {
    if (e) e.preventDefault();
    state.dodgeCount++;
    sfx.playBoop();

    const arenaRect = bossArena.getBoundingClientRect();
    const btnW = noBtn.offsetWidth || 120;
    const btnH = noBtn.offsetHeight || 44;

    const maxX = Math.max(20, arenaRect.width - btnW - 12);
    const maxY = Math.max(20, arenaRect.height - btnH - 12);

    const newX = 6 + Math.random() * maxX;
    const newY = 6 + Math.random() * maxY;

    noBtn.style.position = "absolute";
    noBtn.style.left = newX + "px";
    noBtn.style.top = newY + "px";

    const shrink = Math.max(0.68, 1 - state.dodgeCount * 0.06);
    noBtn.style.transform = `scale(${shrink})`;

    const grow = Math.min(1.28, 1 + state.dodgeCount * 0.05);
    yesBtn.style.transform = `scale(${grow})`;

    dodgeTaunt.textContent = DODGE_TAUNTS[(state.dodgeCount - 1) % DODGE_TAUNTS.length];
  }

  noBtn.addEventListener("mouseenter", dodgeNoButton);
  noBtn.addEventListener("pointerdown", dodgeNoButton);

  yesBtn.addEventListener("click", (e) => {
    sfx.playFanfare();
    setLoveMeter(100);
    for (let i = 0; i < 5; i++) unlockMemory(i);

    const rect = e.currentTarget.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 48);
    setTimeout(() => spawnBurst(vw * 0.25, vh * 0.35, 36), 180);
    setTimeout(() => spawnBurst(vw * 0.75, vh * 0.35, 36), 340);

    goToStage(5);
  });

  // -------------------- 11. STAGE 5: GRAND FINALE --------------------
  function initFinale() {
    renderScrapbook();
    showToast("100% Forgiven! Happy Ending Unlocked 💖");
  }

  function renderScrapbook() {
    const grid = document.getElementById("scrapbookGrid");
    grid.innerHTML = "";
    MEMORIES.forEach((m) => {
      const card = document.createElement("div");
      card.className = `polaroid ${m.tilt}`;
      card.dataset.photo = String(m.id);
      card.innerHTML = `
        <div class="polaroid-tape"></div>
        <img src="${m.src}" alt="${m.badge}" />
        <p class="polaroid-caption">${m.caption}</p>
      `;
      card.addEventListener("click", () => openPhotoModal(m.id));
      grid.appendChild(card);
    });
  }

  document.getElementById("kissBurstBtn").addEventListener("click", (e) => {
    state.kissCount++;
    document.getElementById("kissCount").textContent = String(state.kissCount);
    sfx.playKiss();
    const rect = e.currentTarget.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top, 26);
    if (state.kissCount % 5 === 0) {
      spawnBurst(vw * Math.random(), vh * 0.35, 34);
      showToast(`${state.kissCount} kisses received! 🥰💋`);
    }
  });

  document.querySelectorAll(".coupon-card").forEach((coupon) => {
    coupon.addEventListener("click", () => {
      if (coupon.classList.contains("claimed")) return;
      coupon.classList.add("claimed");
      coupon.querySelector(".coupon-stamp").textContent = "CLAIMED ✓";
      sfx.playChime();
      const rect = coupon.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
      showToast("Voucher claimed! Screenshot & redeem anytime 🎟️💕");
    });
  });

  document.getElementById("replayBtn").addEventListener("click", () => {
    sfx.playPop();
    state.cloudsPopped = 0;
    state.heartsCaught = 0;
    state.promisesUnsealed.clear();
    document.querySelectorAll(".promise-card").forEach((c) => c.classList.remove("unsealed"));
    document.getElementById("memory4Reveal").classList.add("hidden");
    goToStage(0);
  });

  // -------------------- 12. LIGHTBOX MODAL & POLAROID CLICKS --------------------
  const photoModal = document.getElementById("photoModal");
  const modalImg = document.getElementById("modalImg");
  const modalBadge = document.getElementById("modalBadge");
  const modalCaption = document.getElementById("modalCaption");
  const modalNote = document.getElementById("modalNote");

  function openPhotoModal(index) {
    const safeIdx = ((index % MEMORIES.length) + MEMORIES.length) % MEMORIES.length;
    state.modalPhotoIndex = safeIdx;
    const item = MEMORIES[safeIdx];
    modalImg.src = item.src;
    modalBadge.textContent = item.badge;
    modalCaption.textContent = item.caption;
    modalNote.textContent = item.note;
    photoModal.classList.remove("hidden");
    sfx.playSparkle();
  }

  // Click any inline polaroid in stages 1-4 to zoom
  document.addEventListener("click", (e) => {
    const polaroid = e.target.closest(".polaroid[data-photo]");
    if (polaroid && !polaroid.closest("#scrapbookGrid")) {
      openPhotoModal(Number(polaroid.dataset.photo));
    }
  });

  document.getElementById("galleryShortcutBtn").addEventListener("click", () => {
    if (state.unlockedMemories.size === 0) {
      sfx.playBoop();
      showToast("Complete quests to unlock our photos first! 📸");
      return;
    }
    const firstUnlocked = Array.from(state.unlockedMemories)[0];
    openPhotoModal(firstUnlocked);
  });

  document.getElementById("modalCloseBtn").addEventListener("click", () => {
    sfx.playPop();
    photoModal.classList.add("hidden");
  });

  photoModal.addEventListener("click", (e) => {
    if (e.target === photoModal) {
      photoModal.classList.add("hidden");
    }
  });

  document.getElementById("modalPrevBtn").addEventListener("click", () => {
    openPhotoModal(state.modalPhotoIndex - 1);
  });

  document.getElementById("modalNextBtn").addEventListener("click", () => {
    openPhotoModal(state.modalPhotoIndex + 1);
  });

  document.getElementById("modalHeartBtn").addEventListener("click", (e) => {
    sfx.playKiss();
    const rect = e.currentTarget.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top, 20);
    showToast("Sent a huge ♥ to this memory!");
  });
})();

