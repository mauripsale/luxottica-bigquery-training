    // -------------------------------------------------------------------------
    // GAME 1 ENGINE: SQL PROMPT DJ (Procedural Web Audio API Sequencer)
    // -------------------------------------------------------------------------
    const QueryBeats = (function() {
      let audioCtx = null;
      let isPlaying = false;
      let currentStep = 0;
      let bpm = 116;
      let intervalId = null;

      const TRACKS = [
        { id: 'select', name: 'SELECT (808 Kick)', emoji: '🥁', color: 'amber' },
        { id: 'from',   name: 'FROM (Snare)',      emoji: '👏', color: 'blue' },
        { id: 'join',   name: 'JOIN (Hi-Hat)',     emoji: '✨', color: 'emerald' },
        { id: 'order',  name: 'ORDER BY (Bass)',   emoji: '🎸', color: 'rose' }
      ];

      // 4 tracks x 16 steps matrix
      let grid = {
        select: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        from:   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        join:   [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        order:  [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1]
      };

      function getAudioContext() {
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        return audioCtx;
      }

      function playSound(trackId) {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        if (trackId === 'select') {
          // Deep 808 Kick: sine oscillator pitch dropped quickly + gain envelope
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);
          gain.gain.setValueAtTime(1.0, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
        } else if (trackId === 'from') {
          // Snare: noise buffer + body oscillator
          const bufferSize = ctx.sampleRate * 0.15;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(800, now);
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.7, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
          whiteNoise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(ctx.destination);
          whiteNoise.start(now);

          // Snare tone body
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(180, now);
          oscGain.gain.setValueAtTime(0.5, now);
          oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
          osc.connect(oscGain);
          oscGain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (trackId === 'join') {
          // Hi-Hat: highpassed noise
          const bufferSize = ctx.sampleRate * 0.05;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(7000, now);
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          whiteNoise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          whiteNoise.start(now);
        } else if (trackId === 'order') {
          // Sub Synth Bass: sawtooth filter
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          const notes = [55, 65.4, 73.4, 82.4];
          const chosenNote = notes[Math.floor(Math.random() * notes.length)];
          osc.frequency.setValueAtTime(chosenNote, now);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(350, now);
          gain.gain.setValueAtTime(0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
        }
      }

      function step() {
        TRACKS.forEach(track => {
          if (grid[track.id][currentStep]) {
            playSound(track.id);
          }
        });

        // Update step UI highlight
        document.querySelectorAll('.qb-step-cell').forEach(el => {
          const stepIdx = parseInt(el.dataset.step, 10);
          if (stepIdx === currentStep) {
            el.classList.add('ring-2', 'ring-amber-400', 'scale-105');
          } else {
            el.classList.remove('ring-2', 'ring-amber-400', 'scale-105');
          }
        });

        currentStep = (currentStep + 1) % 16;
      }

      function render() {
        const container = document.getElementById('qb-grid-container');
        if (!container) return;
        container.innerHTML = '';

        TRACKS.forEach(track => {
          const row = document.createElement('div');
          row.className = "flex items-center space-x-2";

          const label = document.createElement('div');
          label.className = "w-44 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 shrink-0";
          label.innerHTML = `<span>${track.emoji}</span><span>${track.name}</span>`;
          row.appendChild(label);

          const stepBox = document.createElement('div');
          stepBox.className = "flex-1 grid grid-cols-16 gap-1 sm:gap-1.5";

          for (let i = 0; i < 16; i++) {
            const isActive = grid[track.id][i] === 1;
            const btn = document.createElement('button');
            btn.dataset.step = i;
            btn.dataset.track = track.id;
            const isBarStart = (i % 4 === 0);
            
            let bgClass = isActive 
              ? 'bg-amber-500 shadow-sm text-slate-950 font-bold' 
              : (isBarStart ? 'bg-slate-200 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-950');

            btn.className = `qb-step-cell h-8 rounded-lg ${bgClass} border border-slate-300 dark:border-slate-800/80 transition flex items-center justify-center text-[10px] cursor-pointer hover:border-amber-400`;
            btn.innerHTML = isActive ? '•' : '';

            btn.onclick = function() {
              grid[track.id][i] = grid[track.id][i] ? 0 : 1;
              if (grid[track.id][i]) playSound(track.id);
              render();
            };

            stepBox.appendChild(btn);
          }

          row.appendChild(stepBox);
          container.appendChild(row);
        });
      }

      function togglePlay() {
        getAudioContext();
        isPlaying = !isPlaying;
        const btn = document.getElementById('qb-btn-play');
        const icon = document.getElementById('qb-play-icon');
        const text = document.getElementById('qb-play-text');
        const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'it';

        if (isPlaying) {
          if (icon) icon.innerText = '⏸';
          if (text) text.innerText = lang === 'it' ? 'PAUSA BEAT' : 'PAUSE BEAT';
          if (btn) btn.className = "px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs transition flex items-center space-x-2 shadow-md cursor-pointer animate-pulse";
          const stepIntervalMs = (60 / bpm / 4) * 1000;
          intervalId = setInterval(step, stepIntervalMs);

          // Classroom Competition Hook: Check if sequencer has >= 8 active notes
          let totalActive = 0;
          TRACKS.forEach(tr => {
            if (grid[tr.id]) {
              totalActive += grid[tr.id].filter(x => x === 1).length;
            }
          });
          if (totalActive >= 8 && typeof awardCoffeeBadge === 'function') {
            awardCoffeeBadge('dj', 50, '🎛️ Query DJ Beat Master');
          }
        } else {
          if (icon) icon.innerText = '▶';
          if (text) text.innerText = lang === 'it' ? 'AVVIA BEAT' : 'PLAY BEAT';
          if (btn) btn.className = "px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center space-x-2 shadow-sm cursor-pointer";
          if (intervalId) clearInterval(intervalId);
          currentStep = 0;
          document.querySelectorAll('.qb-step-cell').forEach(el => el.classList.remove('ring-2', 'ring-amber-400', 'scale-105'));
        }
      }

      function setBpm(val) {
        bpm = parseInt(val, 10);
        const readout = document.getElementById('qb-bpm-display');
        if (readout) readout.innerText = `${bpm} BPM`;
        if (isPlaying) {
          clearInterval(intervalId);
          const stepIntervalMs = (60 / bpm / 4) * 1000;
          intervalId = setInterval(step, stepIntervalMs);
        }
      }

      function loadPreset(name) {
        if (name === 'agordo') {
          grid = {
            select: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
            from:   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            join:   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            order:  [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1]
          };
          setBpm(124);
        } else if (name === 'datalake') {
          grid = {
            select: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            from:   [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            join:   [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
            order:  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
          };
          setBpm(88);
        } else if (name === 'funk') {
          grid = {
            select: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            from:   [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
            join:   [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
            order:  [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0]
          };
          setBpm(110);
        }
        render();
        const slider = document.getElementById('qb-bpm-slider');
        if (slider) slider.value = bpm;
      }

      function clear() {
        grid = {
          select: Array(16).fill(0),
          from:   Array(16).fill(0),
          join:   Array(16).fill(0),
          order:  Array(16).fill(0)
        };
        render();
      }

      return {
        init: render,
        render,
        togglePlay,
        setBpm,
        loadPreset,
        clear
      };
    })();

