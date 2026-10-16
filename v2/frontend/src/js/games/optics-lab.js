    // -------------------------------------------------------------------------
    // GAME 2 ENGINE: LUXOTTICA VIRTUAL OPTICS LAB (Canvas Ray Simulator)
    // -------------------------------------------------------------------------
    const OpticsLab = (function() {
      let n = 1.60;
      let diopters = 2.5;
      let tint = 'g15';
      let polarized = true;

      function draw() {
        const canvas = document.getElementById('optics-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;

        // Clear canvas dark optical bench
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, W, H);

        // Optical Bench Axis (dashed horizontal line)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(20, H / 2);
        ctx.lineTo(W - 20, H / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Lens Parameters
        const lensX = W / 2 - 30;
        const lensW = 28;
        const lensH = 220;
        const lensTop = (H - lensH) / 2;

        // Draw Lens Surface & Tint
        ctx.save();
        if (tint === 'g15') {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.28)'; // Ray-Ban G-15 Green
          ctx.strokeStyle = '#10b981';
        } else if (tint === 'b15') {
          ctx.fillStyle = 'rgba(217, 119, 6, 0.32)'; // Ray-Ban B-15 Brown
          ctx.strokeStyle = '#f59e0b';
        } else {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.18)'; // Clear anti-reflective
          ctx.strokeStyle = '#38bdf8';
        }

        ctx.lineWidth = 2;
        ctx.beginPath();
        // Convex / Concave profile depending on diopters
        const curveOffset = diopters * 4;
        ctx.moveTo(lensX, lensTop);
        ctx.quadraticCurveTo(lensX - curveOffset, H / 2, lensX, lensTop + lensH);
        ctx.lineTo(lensX + lensW, lensTop + lensH);
        ctx.quadraticCurveTo(lensX + lensW + curveOffset, H / 2, lensX + lensW, lensTop);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Calculate focal length F (in pixels from lens center)
        // Lensmaker approximation: 1/f = (n - 1) * (diopters / scale)
        const scaleFactor = 0.015;
        const power = diopters * (n - 1.0) * scaleFactor;
        const focalDist = power === 0 ? 9999 : (1 / power);
        const focalPointX = (lensX + lensW / 2) + focalDist;

        // Trace 7 incident light rays from left to right
        const numRays = 7;
        const raySpacing = 24;
        const startY = (H / 2) - ((numRays - 1) * raySpacing) / 2;

        for (let i = 0; i < numRays; i++) {
          const rayY = startY + i * raySpacing;
          const distFromAxis = rayY - (H / 2);

          // Incident ray color
          ctx.beginPath();
          ctx.strokeStyle = polarized ? '#38bdf8' : '#f59e0b';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 6;
          ctx.shadowColor = polarized ? '#0284c7' : '#d97706';

          // 1) From light source to lens front
          ctx.moveTo(25, rayY);
          ctx.lineTo(lensX, rayY);

          // 2) Through the lens to back surface
          ctx.lineTo(lensX + lensW, rayY);

          // 3) Refracted ray exiting lens towards focal point
          if (Math.abs(power) > 0.001) {
            // Ray angles converge or diverge
            const slope = -distFromAxis / focalDist;
            const exitX = W - 30;
            const exitY = rayY + slope * (exitX - (lensX + lensW));
            ctx.lineTo(exitX, exitY);
          } else {
            // Parallel ray
            ctx.lineTo(W - 30, rayY);
          }

          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Draw Focal Point Marker if inside canvas
        if (focalPointX > lensX + lensW && focalPointX < W - 20) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(focalPointX, H / 2, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f87171';
          ctx.font = '10px monospace';
          ctx.fillText('F', focalPointX - 3, (H / 2) - 8);
        }

        // Update readouts
        const fReadout = document.getElementById('optics-focal-readout');
        const gReadout = document.getElementById('optics-glare-readout');
        const mmVal = Math.round(focalDist * 0.8);
        if (fReadout) {
          fReadout.innerText = diopters >= 0 ? `+${mmVal} mm` : `${mmVal} mm (Virtuale)`;
        }
        if (gReadout) {
          gReadout.innerText = polarized ? '99.8% (P3 Plus)' : '42.0% (Standard)';
        }

        // Classroom Competition Hook: Target Calibration achieved (+120mm focal and polarized filter active)
        if (diopters > 0 && Math.abs(mmVal - 120) <= 15 && polarized && typeof awardCoffeeBadge === 'function') {
          awardCoffeeBadge('optics', 50, '🔬 Master Lens Crafter');
        }
      }

      function setN(val) {
        n = parseFloat(val);
        const readout = document.getElementById('optics-n-val');
        if (readout) readout.innerText = n.toFixed(2);
        draw();
      }

      function setDiopters(val) {
        diopters = parseFloat(val);
        const readout = document.getElementById('optics-d-val');
        if (readout) {
          const sign = diopters > 0 ? '+' : '';
          readout.innerText = `${sign}${diopters.toFixed(2)} D`;
        }
        draw();
      }

      function setTint(tintKey) {
        tint = tintKey;
        ['g15', 'b15', 'clear'].forEach(t => {
          const btn = document.getElementById(`optics-tint-${t}`);
          if (!btn) return;
          if (t === tintKey) {
            btn.className = "py-1.5 rounded-lg border-2 border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] cursor-pointer";
          } else {
            btn.className = "py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-[10px] cursor-pointer";
          }
        });
        draw();
      }

      function setPolarized(isPol) {
        polarized = isPol;
        draw();
      }

      function loadPreset(name) {
        if (name === 'aviator') {
          n = 1.50;
          diopters = 0.0;
          setTint('g15');
          setPolarized(false);
          const cb = document.getElementById('optics-polar-cb');
          if (cb) cb.checked = false;
        } else if (name === 'wayfarer') {
          n = 1.59;
          diopters = 1.5;
          setTint('b15');
          setPolarized(true);
          const cb = document.getElementById('optics-polar-cb');
          if (cb) cb.checked = true;
        }
        const nSlider = document.getElementById('optics-n-slider');
        const dSlider = document.getElementById('optics-d-slider');
        if (nSlider) nSlider.value = n;
        if (dSlider) dSlider.value = diopters;
        const nReadout = document.getElementById('optics-n-val');
        if (nReadout) nReadout.innerText = n.toFixed(2);
        const dReadout = document.getElementById('optics-d-val');
        if (dReadout) dReadout.innerText = (diopters > 0 ? '+' : '') + diopters.toFixed(2) + ' D';
        draw();
      }

      return {
        draw,
        setN,
        setDiopters,
        setTint,
        setPolarized,
        loadPreset
      };
    })();

