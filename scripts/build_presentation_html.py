import base64
import os

def get_b64(path):
    with open(path, 'rb') as f:
        return 'data:image/png;base64,' + base64.b64encode(f.read()).decode('utf-8')

cwd = '/Users/maurizio.ipsale/Code/my-agy-projects/projectA'
hero_b64 = get_b64(os.path.join(cwd, 'slides/assets/luxottica_hero_banner_1791467759147.png'))
cmo_b64 = get_b64(os.path.join(cwd, 'slides/assets/cmo_budget_leakage_1791467800384.png'))
eyewear_b64 = get_b64(os.path.join(cwd, 'slides/assets/eyewear_brand_collection_1791467863205.png'))
roas_b64 = get_b64(os.path.join(cwd, 'slides/assets/google_ads_roas_growth_1791467826535.png'))

html_content = f'''<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Luxottica BigQuery Masterclass - Visual Presentation</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800;900&family=JetBrains+Mono:wght@700&display=swap');
    
    body {{
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #060913;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }}

    .font-mono {{
      font-family: 'JetBrains Mono', monospace;
    }}

    .glass-card {{
      background: rgba(17, 24, 39, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }}

    .glass-card-glow {{
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(66, 133, 244, 0.4);
      box-shadow: 0 0 30px rgba(66, 133, 244, 0.2);
    }}

    .gradient-text-google {{
      background: linear-gradient(135deg, #4285f4 0%, #34a853 40%, #fbbc05 75%, #ea4335 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}

    .slide {{
      display: none;
    }}

    .slide.active {{
      display: flex;
    }}
  </style>
</head>
<body class="bg-[#060913] text-white p-4 md:p-6 flex flex-col justify-center items-center min-h-screen">

  <div class="w-full max-w-5xl bg-[#0b0f19] border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col justify-between space-y-6">

    <!-- HEADER BRANDING -->
    <header class="flex flex-wrap justify-between items-center pb-4 border-b border-gray-800 gap-3">
      <div class="flex items-center gap-3">
        <span class="px-3 py-1 bg-blue-500/20 border border-blue-400/40 rounded-full text-blue-400 font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
          Google Cloud & Luxottica
        </span>
        <span class="text-gray-400 text-xs font-mono font-bold hidden sm:inline">QWIKLABS-GCP-04-9EFAA47F1D21</span>
      </div>
      
      <div class="flex items-center gap-3 text-xs font-bold text-gray-300">
        <span id="current-slide-title" class="text-gray-200 uppercase tracking-wide">Executive Overview</span>
        <span class="text-gray-600">|</span>
        <span class="font-mono text-blue-400 text-sm"><span id="slide-num">1</span> / <span id="slide-total">8</span></span>
      </div>
    </header>

    <!-- SLIDES CONTENT -->
    <main class="w-full">

      <!-- SLIDE 1: COVER -->
      <div class="slide active flex-col md:flex-row gap-8 items-center">
        <div class="flex-1 space-y-6 text-left">
          <span class="px-4 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/50 text-blue-300 text-xs font-bold tracking-wide uppercase">
            🕶️ Masterclass Executive Briefing
          </span>

          <h1 class="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Mastering Marketing Data with <br>
            <span class="gradient-text-google">BigQuery SQL & Studio</span>
          </h1>

          <p class="text-base md:text-lg text-gray-300 font-medium leading-relaxed">
            Unlocking High-ROAS Google Ads Growth & Capturing Ray-Ban Meta Search Demand
          </p>

          <div class="grid grid-cols-3 gap-3 pt-2">
            <div class="glass-card p-3 rounded-2xl border-l-4 border-l-blue-500">
              <div class="text-lg font-black text-white">180 Mins</div>
              <div class="text-[10px] text-gray-400 font-bold uppercase">Workshop</div>
            </div>
            <div class="glass-card p-3 rounded-2xl border-l-4 border-l-green-500">
              <div class="text-lg font-black text-white">116,000+</div>
              <div class="text-[10px] text-gray-400 font-bold uppercase">Records</div>
            </div>
            <div class="glass-card p-3 rounded-2xl border-l-4 border-l-amber-500">
              <div class="text-lg font-black text-white">Gemini AI</div>
              <div class="text-[10px] text-gray-400 font-bold uppercase">BigQuery</div>
            </div>
          </div>
        </div>

        <div class="w-full md:w-1/2 rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl">
          <img src="{hero_b64}" alt="Ray-Ban Meta Smart Glasses" class="w-full h-auto object-cover max-h-[360px]">
        </div>
      </div>

      <!-- SLIDE 2: CMO EMERGENCY BRIEFING -->
      <div class="slide flex-col md:flex-row gap-8 items-center">
        <div class="flex-1 space-y-6">
          <span class="px-3.5 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black uppercase tracking-wider">
            🚨 CMO Emergency Briefing
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-white leading-tight">Where is Marketing Budget Leaking?</h2>

          <div class="grid grid-cols-2 gap-4 pt-2">
            <div class="glass-card p-4 rounded-2xl border-l-4 border-l-red-500">
              <div class="text-xs font-bold text-gray-400 uppercase">Ad Budget Increase</div>
              <div class="text-3xl font-black text-red-400 mt-1">+35%</div>
              <div class="text-xs text-gray-300 mt-1">€4.8M Total Spend</div>
            </div>

            <div class="glass-card p-4 rounded-2xl border-l-4 border-l-amber-500">
              <div class="text-xs font-bold text-gray-400 uppercase">E-Commerce Growth</div>
              <div class="text-3xl font-black text-amber-400 mt-1">FLAT (+2%)</div>
              <div class="text-xs text-gray-300 mt-1">€21.5M Revenue</div>
            </div>
          </div>

          <div class="glass-card-glow p-4 rounded-2xl text-xs md:text-sm font-bold text-blue-300">
            🕵️ Mission: Analyze 116,000+ records in BigQuery Studio to uncover budget waste on 3rd-party social networks.
          </div>
        </div>

        <div class="w-full md:w-1/2 rounded-2xl overflow-hidden border-2 border-red-500/40 shadow-2xl">
          <img src="{cmo_b64}" alt="CMO Dashboard" class="w-full h-auto object-cover max-h-[360px]">
        </div>
      </div>

      <!-- SLIDE 3: GAMIFICATION -->
      <div class="slide flex-col md:flex-row gap-8 items-center">
        <div class="flex-1 space-y-6">
          <span class="px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
            🏆 Competition Rules
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-white">4 Brand Detective Teams</h2>

          <div class="grid grid-cols-2 gap-3">
            <div class="glass-card p-3 rounded-xl border-l-4 border-l-red-500 font-bold text-sm text-white flex items-center gap-2">
              <span>🕶️</span> Team Ray-Ban
            </div>
            <div class="glass-card p-3 rounded-xl border-l-4 border-l-blue-500 font-bold text-sm text-white flex items-center gap-2">
              <span>🕶️</span> Team Oakley
            </div>
            <div class="glass-card p-3 rounded-xl border-l-4 border-l-green-500 font-bold text-sm text-white flex items-center gap-2">
              <span>🕶️</span> Team Persol
            </div>
            <div class="glass-card p-3 rounded-xl border-l-4 border-l-amber-500 font-bold text-sm text-white flex items-center gap-2">
              <span>🕶️</span> Team Oliver Peoples
            </div>
          </div>

          <div class="glass-card p-4 rounded-2xl flex justify-between items-center text-center">
            <div>
              <div class="text-xl font-black text-amber-400">+100 PTS</div>
              <div class="text-[10px] text-gray-400 font-bold">First Query</div>
            </div>
            <div class="h-6 w-px bg-gray-700"></div>
            <div>
              <div class="text-xl font-black text-blue-400">+50 PTS</div>
              <div class="text-[10px] text-gray-400 font-bold">Best Insight</div>
            </div>
            <div class="h-6 w-px bg-gray-700"></div>
            <div>
              <div class="text-xl font-black text-green-400">+100 PTS</div>
              <div class="text-[10px] text-gray-400 font-bold">Looker Dashboard</div>
            </div>
          </div>
        </div>

        <div class="w-full md:w-1/2 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl">
          <img src="{eyewear_b64}" alt="Luxury Eyewear Collection" class="w-full h-auto object-cover max-h-[360px]">
        </div>
      </div>

      <!-- SLIDE 4: BIGQUERY STUDIO DATA CANVAS -->
      <div class="slide flex-col gap-6">
        <div class="text-center space-y-2">
          <span class="px-3.5 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-black uppercase tracking-wider">
            🤖 AI Visual Canvas
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-white">BigQuery Studio Data Canvas & Gemini AI</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div class="glass-card p-6 rounded-3xl border-2 border-blue-500/40 space-y-4">
            <div class="text-sm font-bold text-blue-400 flex items-center gap-2">
              <span>💬 Prompt in Linguaggio Naturale</span>
            </div>
            <div class="p-4 bg-gray-950 rounded-2xl border border-gray-800 font-mono text-xs text-green-400 leading-relaxed">
              "Calcola il totale ordini, il fatturato in Euro e lo scontrino medio per brand nel dataset luxottica_marketing_analytics"
            </div>
            <div class="text-xs text-gray-300 font-medium leading-relaxed">
              I Business Analyst non scrivono SQL da zero: Gemini genera automaticamente il Grafo Visivo (DAG), le query e le visualizzazioni!
            </div>
          </div>

          <div class="glass-card-glow p-6 rounded-3xl space-y-3">
            <div class="text-sm font-bold text-amber-400">💡 Insights AI di Business</div>
            <div class="space-y-3 text-xs font-semibold">
              <div class="p-3 bg-green-500/20 text-green-300 rounded-xl border border-green-500/30">
                🟢 <b>Oliver Peoples & Arnette:</b> Dominano per AOV (> €350 scontrino medio).
              </div>
              <div class="p-3 bg-red-500/20 text-red-300 rounded-xl border border-red-500/30">
                🔴 <b>Vogue Eyewear:</b> AOV più basso (€129) a causa dell'eccesso di sconti.
              </div>
              <div class="p-3 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30">
                🔵 <b>Ray-Ban Smart Glasses:</b> Domanda altissima ma vendite strozzate!
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SLIDE 5: HIGH MARGIN DISCOVERY -->
      <div class="slide flex-col gap-6">
        <div class="text-center space-y-2">
          <span class="px-3.5 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/40 text-xs font-black uppercase tracking-wider">
            🔎 Chapter 1 Discovery
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-white">High Margin Discovery & AOV Analysis</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div class="glass-card p-6 rounded-3xl border-t-8 border-t-green-500 text-center space-y-2">
            <div class="text-xs font-mono font-bold text-gray-400 uppercase">LUXURY LEADER</div>
            <div class="text-xl font-black text-white">Oliver Peoples</div>
            <div class="text-4xl font-black text-green-400">€396</div>
            <div class="text-xs text-gray-300 font-medium">Scontrino Medio (AOV)</div>
          </div>

          <div class="glass-card-glow p-6 rounded-3xl text-center space-y-2 transform scale-105">
            <div class="text-xs font-mono font-bold text-blue-400 uppercase">🚀 GROWTH ENGINE</div>
            <div class="text-xl font-black text-white">Ray-Ban Meta</div>
            <div class="text-4xl font-black text-blue-400">> €320</div>
            <div class="text-xs text-gray-200 font-bold">Domanda Google alle stelle!</div>
          </div>

          <div class="glass-card p-6 rounded-3xl border-t-8 border-t-red-500 text-center space-y-2">
            <div class="text-xs font-mono font-bold text-gray-400 uppercase">MARGIN LEAKAGE</div>
            <div class="text-xl font-black text-white">Vogue Eyewear</div>
            <div class="text-4xl font-black text-red-400">€129</div>
            <div class="text-xs text-gray-300 font-medium">Troppi sconti svalutano il brand</div>
          </div>
        </div>

        <div class="glass-card-glow p-4 rounded-2xl text-center text-xs md:text-sm font-extrabold text-blue-300">
          💡 Plot Twist #1: C'è un'intenzione d'acquisto altissima su Google Search per i Ray-Ban Meta, ma il budget giornaliero di Google Ads si esaurisce troppo presto!
        </div>
      </div>

      <!-- SLIDE 6: THE GOOGLE ROAS REVELATION -->
      <div class="slide flex-col md:flex-row gap-8 items-center">
        <div class="flex-1 space-y-6">
          <span class="px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black uppercase tracking-wider">
            📊 Chapter 2 Revelation
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-white">The Google Ads ROAS Revelation</h2>

          <div class="space-y-3">
            <div class="glass-card p-4 rounded-2xl border-l-8 border-l-red-500 flex justify-between items-center">
              <div>
                <div class="text-base font-black text-red-400">TikTok & Criteo (Social Terzi)</div>
                <div class="text-xs text-gray-400 font-bold">€2,200/giorno | Solo 8 conversioni</div>
              </div>
              <div class="text-2xl font-black text-red-400">0.7x ROAS ❌</div>
            </div>

            <div class="glass-card-glow p-4 rounded-2xl border-l-8 border-l-green-500 flex justify-between items-center">
              <div>
                <div class="text-lg font-black text-green-400">Google Search & Shopping</div>
                <div class="text-xs text-gray-200 font-bold">€450/giorno | 120 conversioni</div>
              </div>
              <div class="text-3xl font-black text-green-400">6.8x - 8.2x 🚀</div>
            </div>
          </div>

          <div class="text-xs font-bold text-amber-300 bg-amber-950/40 p-3 rounded-xl border border-amber-800">
            💡 Plot Twist #2: I social terzi assorbono il 40% del budget in perdita. Riallocando i fondi su Google Ads si cattura il 100% della ricerca Ray-Ban Meta!
          </div>
        </div>

        <div class="w-full md:w-1/2 rounded-2xl overflow-hidden border-2 border-green-500/40 shadow-2xl">
          <img src="{roas_b64}" alt="Google Ads High ROAS Victory" class="w-full h-auto object-cover max-h-[360px]">
        </div>
      </div>

      <!-- SLIDE 7: CUSTOMER MATCH DATA WRANGLING -->
      <div class="slide flex-col gap-6">
        <div class="text-center space-y-2">
          <span class="px-3.5 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs font-black uppercase tracking-wider">
            🧹 Chapter 3 Action
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-white">Data Wrangling & Google Ads Customer Match</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div class="glass-card p-6 rounded-3xl border-l-4 border-l-red-500 space-y-2">
            <div class="text-xs font-mono font-bold text-gray-400 uppercase">1. RAW DATA</div>
            <div class="text-2xl font-black text-white">1,000 Leads</div>
            <div class="text-xs text-gray-300 font-medium">Lead disordinati con email sporche e formati valuta misti.</div>
          </div>

          <div class="glass-card p-6 rounded-3xl border-l-4 border-l-blue-500 space-y-2">
            <div class="text-xs font-mono font-bold text-blue-400 uppercase">2. VISUAL PREP</div>
            <div class="text-2xl font-black text-blue-400">No-Code</div>
            <div class="text-xs text-gray-300 font-medium">BigQuery Visual Data Prep pulisce i dati in automatico.</div>
          </div>

          <div class="glass-card-glow p-6 rounded-3xl border-l-4 border-l-green-500 space-y-2">
            <div class="text-xs font-mono font-bold text-green-400 uppercase">3. CUSTOMER MATCH</div>
            <div class="text-2xl font-black text-green-400">350+ VIPs</div>
            <div class="text-xs text-gray-200 font-bold">Lead VIP sbloccati per retargeting su YouTube & Search!</div>
          </div>
        </div>

        <div class="glass-card p-4 rounded-2xl flex justify-between items-center text-xs md:text-sm font-bold text-gray-200">
          <span>📊 La vista pulita `v_clean_marketing_leads` si connette direttamente a Looker Studio!</span>
          <span class="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-xs">Apri Dashboard ➔</span>
        </div>
      </div>

      <!-- SLIDE 8: THE Q4 GOOGLE GROWTH PLAN -->
      <div class="slide flex-col gap-6">
        <div class="text-center space-y-2">
          <span class="px-3.5 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/40 text-xs font-black uppercase tracking-wider">
            📊 Executive Strategy
          </span>
          <h2 class="text-3xl md:text-4xl font-black text-white">The Q4 Google Growth Plan for CMO</h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="glass-card-glow p-5 rounded-3xl space-y-2 text-left">
            <div class="text-2xl font-black text-blue-400 font-mono">01</div>
            <div class="text-base font-black text-white">Riallocare 60%</div>
            <div class="text-xs text-gray-300 font-medium">Spostare il budget dai social terzi a Google Search & PMax.</div>
          </div>

          <div class="glass-card-glow p-5 rounded-3xl space-y-2 text-left">
            <div class="text-2xl font-black text-green-400 font-mono">02</div>
            <div class="text-base font-black text-white">100% Search Share</div>
            <div class="text-xs text-gray-300 font-medium">Coprire sempre la domanda Ray-Ban Meta Smart Glasses.</div>
          </div>

          <div class="glass-card-glow p-5 rounded-3xl space-y-2 text-left">
            <div class="text-2xl font-black text-amber-400 font-mono">03</div>
            <div class="text-base font-black text-white">Customer Match</div>
            <div class="text-xs text-gray-300 font-medium">Attivare i 350+ lead VIP recuperati su YouTube.</div>
          </div>

          <div class="glass-card-glow p-5 rounded-3xl space-y-2 text-left">
            <div class="text-2xl font-black text-purple-400 font-mono">04</div>
            <div class="text-base font-black text-white">Looker Studio</div>
            <div class="text-xs text-gray-300 font-medium">Monitorare il ROAS in tempo reale per il CMO.</div>
          </div>
        </div>

        <div class="text-center pt-2">
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 via-green-600 to-amber-500 text-white font-extrabold text-sm rounded-2xl shadow-2xl cursor-pointer">
            🏆 Premiazione Brand Detective Team Vincitore!
          </div>
        </div>
      </div>

    </main>

    <!-- FOOTER CONTROLS -->
    <footer class="flex justify-between items-center pt-4 border-t border-gray-800 gap-3">
      <div class="flex items-center gap-2">
        <button id="prev-btn" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 active:scale-95 text-white font-bold text-xs rounded-xl transition border border-gray-700 flex items-center gap-1">
          <span>←</span> Precedente
        </button>
        <button id="next-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center gap-1">
          Successiva <span>→</span>
        </button>
      </div>

      <!-- PROGRESS BAR -->
      <div class="w-1/3 bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
        <div id="progress-bar" class="bg-gradient-to-r from-blue-500 via-green-500 to-amber-400 h-full w-1/8 transition-all duration-300"></div>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs text-gray-400 font-mono font-bold hidden md:inline">Usa [←] [→] o [F]</span>
        <button id="fullscreen-btn" class="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-bold border border-gray-700 transition">
          🖥️ Fullscreen
        </button>
      </div>
    </footer>

  </div>

  <script>
    const slides = document.querySelectorAll('.slide');
    const slideNum = document.getElementById('slide-num');
    const slideTotal = document.getElementById('slide-total');
    const currentSlideTitle = document.getElementById('current-slide-title');
    const progressBar = document.getElementById('progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    const slideTitles = [
      "Executive Overview",
      "CMO Emergency Briefing",
      "Gamification & Brand Teams",
      "BigQuery Studio & Gemini AI",
      "Chapter 1: AOV & Margin Discovery",
      "Chapter 2: Google Ads High ROAS",
      "Chapter 3: Customer Match Action",
      "The Q4 Google Growth Plan"
    ];

    let currentSlide = 0;
    slideTotal.textContent = slides.length;

    function updateSlide() {{
      slides.forEach((slide, idx) => {{
        slide.classList.toggle('active', idx === currentSlide);
      }});

      slideNum.textContent = currentSlide + 1;
      currentSlideTitle.textContent = slideTitles[currentSlide] || "";
      progressBar.style.width = `${{((currentSlide + 1) / slides.length) * 100}}%`;

      prevBtn.disabled = currentSlide === 0;
      prevBtn.style.opacity = currentSlide === 0 ? "0.4" : "1";
      nextBtn.disabled = currentSlide === slides.length - 1;
      nextBtn.style.opacity = currentSlide === slides.length - 1 ? "0.4" : "1";
    }}

    prevBtn.addEventListener('click', () => {{
      if (currentSlide > 0) {{
        currentSlide--;
        updateSlide();
      }}
    }});

    nextBtn.addEventListener('click', () => {{
      if (currentSlide < slides.length - 1) {{
        currentSlide++;
        updateSlide();
      }}
    }});

    document.addEventListener('keydown', (e) => {{
      if (e.key === 'ArrowRight' || e.key === 'Space') {{
        if (currentSlide < slides.length - 1) {{
          currentSlide++;
          updateSlide();
        }}
      }} else if (e.key === 'ArrowLeft') {{
        if (currentSlide > 0) {{
          currentSlide--;
          updateSlide();
        }}
      }} else if (e.key === 'f' || e.key === 'F') {{
        toggleFullscreen();
      }}
    }});

    function toggleFullscreen() {{
      if (!document.fullscreenElement) {{
        document.documentElement.requestFullscreen();
      }} else {{
        if (document.exitFullscreen) {{
          document.exitFullscreen();
        }}
      }}
    }}

    fullscreenBtn.addEventListener('click', toggleFullscreen);

    updateSlide();
  </script>
</body>
</html>
'''

target_artifact = '/Users/maurizio.ipsale/.gemini/antigravity/brain/62589854-6166-49a1-af7c-3ea1ce5ea5c3/luxottica_bigquery_presentation_modern.html'
target_workspace = '/Users/maurizio.ipsale/Code/my-agy-projects/projectA/slides/luxottica_bigquery_presentation.html'

with open(target_artifact, 'w') as f:
    f.write(html_content)

with open(target_workspace, 'w') as f:
    f.write(html_content)

print("SUCCESS: HTML slide presentation generated with embedded Base64 images and responsive CSS container!")
