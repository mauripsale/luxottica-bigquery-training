import os
import subprocess

# Python script to generate official Google Cloud style presentation slides in 100% English.

google_cloud_svg = '''<svg width="160" height="36" viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <text x="0" y="26" font-family="'Google Sans', 'Plus Jakarta Sans', Roboto, sans-serif" font-weight="700" font-size="24" fill="#4285F4">G</text>
  <text x="18" y="26" font-family="'Google Sans', 'Plus Jakarta Sans', Roboto, sans-serif" font-weight="700" font-size="24" fill="#EA4335">o</text>
  <text x="32" y="26" font-family="'Google Sans', 'Plus Jakarta Sans', Roboto, sans-serif" font-weight="700" font-size="24" fill="#FBBC05">o</text>
  <text x="46" y="26" font-family="'Google Sans', 'Plus Jakarta Sans', Roboto, sans-serif" font-weight="700" font-size="24" fill="#4285F4">g</text>
  <text x="61" y="26" font-family="'Google Sans', 'Plus Jakarta Sans', Roboto, sans-serif" font-weight="700" font-size="24" fill="#34A853">l</text>
  <text x="68" y="26" font-family="'Google Sans', 'Plus Jakarta Sans', Roboto, sans-serif" font-weight="700" font-size="24" fill="#EA4335">e</text>
  <text x="88" y="26" font-family="'Google Sans', 'Plus Jakarta Sans', Roboto, sans-serif" font-weight="500" font-size="24" fill="#5F6368">Cloud</text>
</svg>'''

html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exploring and Preparing Your Data with BigQuery - Google Cloud & Luxottica</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;700&display=swap');
    
    body {{
      font-family: 'Google Sans', 'Plus Jakarta Sans', sans-serif;
      background-color: #ffffff;
      color: #202124;
      margin: 0;
      padding: 0;
    }}

    .font-mono {{
      font-family: 'Roboto Mono', monospace;
    }}

    .g-blue {{ color: #4285F4; }}
    .g-red {{ color: #EA4335; }}
    .g-yellow {{ color: #FBBC05; }}
    .g-green {{ color: #34A853; }}

    .bg-g-blue {{ background-color: #4285F4; }}
    .bg-g-red {{ background-color: #EA4335; }}
    .bg-g-yellow {{ background-color: #FBBC05; }}
    .bg-g-green {{ background-color: #34A853; }}

    .slide {{
      display: none;
    }}

    .slide.active {{
      display: flex;
    }}

    .code-box {{
      background-color: #f8f9fa;
      border: 1px solid #dadce0;
      border-radius: 12px;
      font-family: 'Roboto Mono', monospace;
    }}
  </style>
</head>
<body class="bg-white text-[#202124] min-h-screen flex flex-col justify-between p-4 md:p-8 select-none">

  <!-- MAIN SLIDE CONTAINER -->
  <div class="w-full max-w-6xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-xl flex flex-col justify-between min-h-[620px]">

    <!-- HEADER -->
    <header class="flex justify-between items-center pb-4 border-b border-gray-100">
      <div class="flex items-center gap-3">
        {google_cloud_svg}
        <span class="text-xs font-semibold text-gray-500 pl-4 border-l border-gray-300">Luxottica Data Masterclass</span>
      </div>
      
      <div class="text-xs font-bold text-gray-500 uppercase tracking-wider">
        <span id="current-slide-title">Exploring and Preparing Your Data</span>
        <span class="px-2 text-gray-300">|</span>
        <span class="font-mono text-blue-600 text-sm"><span id="slide-num">1</span> / <span id="slide-total">13</span></span>
      </div>
    </header>

    <!-- SLIDES CONTENT -->
    <main class="w-full my-6 flex-1 flex items-center justify-center">

      <!-- SLIDE 1: COVER -->
      <div class="slide active w-full flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex-1 space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-bold">
            <span>🎓</span> Luxottica Executive Data Workshop
          </div>
          <h1 class="text-4xl md:text-5xl font-extrabold text-[#202124] leading-tight tracking-tight">
            Exploring and Preparing Your Data with <span class="g-blue">BigQuery SQL</span> & <span class="g-green">Studio</span>
          </h1>
          <p class="text-lg text-gray-600 font-medium">
            Unlocking High-ROAS Google Ads Growth & Capturing Ray-Ban Meta Search Demand
          </p>
        </div>

        <!-- OFFICIAL GOOGLE GEOMETRIC ART WORK -->
        <div class="relative w-72 h-72 flex-shrink-0 flex items-center justify-center">
          <div class="w-36 h-36 bg-g-blue rounded-none absolute top-4 left-4 shadow-lg"></div>
          <div class="w-36 h-36 bg-g-yellow rounded-tr-full rounded-br-full absolute bottom-4 right-4 shadow-lg"></div>
          <div class="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[40px] border-b-[#EA4335] absolute bottom-2 right-24 shadow-md"></div>
          <div class="flex gap-2 absolute top-8 right-8">
            <div class="w-3 h-3 rounded-full bg-g-green"></div>
            <div class="w-3 h-3 rounded-full bg-g-green"></div>
            <div class="w-3 h-3 rounded-full bg-g-green"></div>
          </div>
        </div>
      </div>

      <!-- SLIDE 2: AGENDA -->
      <div class="slide w-full flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex-1 space-y-6">
          <h2 class="text-3xl font-bold text-[#202124]">Agenda</h2>
          <div class="space-y-3">
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span class="w-8 h-8 rounded-lg bg-g-blue text-white font-bold flex items-center justify-center text-sm">01</span>
              <span class="text-base font-semibold text-gray-800">CMO Emergency Briefing & Data Exploration</span>
            </div>
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span class="w-8 h-8 rounded-lg bg-g-red text-white font-bold flex items-center justify-center text-sm">02</span>
              <span class="text-base font-semibold text-gray-800">AI SQL Generation with Gemini & BigQuery Studio</span>
            </div>
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span class="w-8 h-8 rounded-lg bg-g-yellow text-white font-bold flex items-center justify-center text-sm">03</span>
              <span class="text-base font-semibold text-gray-800">High-Margin Discovery (AOV & Revenue Analysis)</span>
            </div>
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span class="w-8 h-8 rounded-lg bg-g-green text-white font-bold flex items-center justify-center text-sm">04</span>
              <span class="text-base font-semibold text-gray-800">Cross-Channel Campaign Performance & Google ROAS</span>
            </div>
            <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span class="w-8 h-8 rounded-lg bg-g-blue text-white font-bold flex items-center justify-center text-sm">05</span>
              <span class="text-base font-semibold text-gray-800">Data Wrangling & Customer Match Activation</span>
            </div>
          </div>
        </div>

        <div class="w-64 h-64 bg-gray-50 border border-gray-200 rounded-3xl p-6 flex flex-col justify-center items-center text-center space-y-4 shadow-sm">
          <div class="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">📊</div>
          <div class="text-2xl font-extrabold text-[#202124]">116,000+</div>
          <div class="text-xs font-bold text-gray-500 uppercase tracking-wider">Live E-Commerce Records</div>
        </div>
      </div>

      <!-- SLIDE 3: SECTION 01 DIVIDER -->
      <div class="slide w-full flex-col md:flex-row items-center gap-8">
        <div class="w-32 h-32 bg-g-blue text-white font-black text-6xl flex items-center justify-center rounded-2xl shadow-xl flex-shrink-0">
          01
        </div>
        <div class="space-y-2">
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600">Section 01</span>
          <h2 class="text-4xl font-extrabold text-[#202124]">CMO Emergency Briefing & Data Exploration</h2>
          <p class="text-base text-gray-600">Investigating marketing budget allocation across e-commerce channels.</p>
        </div>
      </div>

      <!-- SLIDE 4: CMO DILEMMA -->
      <div class="slide w-full flex-col space-y-6">
        <h2 class="text-3xl font-bold text-[#202124]">Marketing Performance vs. Budget Growth</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 bg-red-50 border-l-8 border-l-g-red rounded-2xl space-y-2">
            <span class="text-xs font-bold uppercase text-red-600">Ad Budget Growth</span>
            <div class="text-4xl font-extrabold text-[#202124]">+35% (€4.8M Total)</div>
            <p class="text-sm text-gray-700">Heavy ad spend allocated to unverified 3rd-party social channels (TikTok, Criteo).</p>
          </div>

          <div class="p-6 bg-yellow-50 border-l-8 border-l-g-yellow rounded-2xl space-y-2">
            <span class="text-xs font-bold uppercase text-yellow-700">E-Commerce Revenue</span>
            <div class="text-4xl font-extrabold text-[#202124]">FLAT (+2% to €21.5M)</div>
            <p class="text-sm text-gray-700">Online revenue stagnant despite aggressive marketing spend increases.</p>
          </div>
        </div>

        <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm font-semibold text-blue-800 flex items-center gap-3">
          <span>💡</span> <b>Workshop Task:</b> Query 116,000+ session logs in BigQuery Studio to identify channel budget leakage.
        </div>
      </div>

      <!-- SLIDE 5: SECTION 02 DIVIDER -->
      <div class="slide w-full flex-col md:flex-row items-center gap-8">
        <div class="w-32 h-32 bg-g-red text-white font-black text-6xl flex items-center justify-center rounded-2xl shadow-xl flex-shrink-0">
          02
        </div>
        <div class="space-y-2">
          <span class="text-xs font-bold uppercase tracking-widest text-red-600">Section 02</span>
          <h2 class="text-4xl font-extrabold text-[#202124]">AI SQL Generation with Gemini & BigQuery Studio</h2>
          <p class="text-base text-gray-600">Accelerating analytics workflows using natural language prompts.</p>
        </div>
      </div>

      <!-- SLIDE 6: CODE SLIDE -->
      <div class="slide w-full flex-col space-y-6">
        <h2 class="text-3xl font-bold text-[#202124]">BigQuery Studio Data Canvas & Gemini AI</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <span class="text-xs font-bold uppercase text-blue-600">1. Natural Language Prompt</span>
            <div class="code-box p-4 text-xs text-gray-800 leading-relaxed">
              "Calculate total orders, total revenue in EUR, and average order value (AOV) grouped by brand in luxottica_marketing_analytics."
            </div>
            <p class="text-xs text-gray-600">Business Analysts use plain prompts to generate precise BigQuery SQL without syntax errors.</p>
          </div>

          <div class="space-y-3">
            <span class="text-xs font-bold uppercase text-green-600">2. Generated BigQuery SQL</span>
            <div class="code-box p-4 text-xs text-blue-800 leading-relaxed font-mono">
              <span class="text-blue-600 font-bold">SELECT</span> brand_name,<br>
              &nbsp;&nbsp;<span class="text-blue-600 font-bold">COUNT</span>(order_id) <span class="text-blue-600 font-bold">AS</span> total_orders,<br>
              &nbsp;&nbsp;<span class="text-blue-600 font-bold">ROUND</span>(<span class="text-blue-600 font-bold">SUM</span>(order_value_eur), 2) <span class="text-blue-600 font-bold">AS</span> total_revenue_eur,<br>
              &nbsp;&nbsp;<span class="text-blue-600 font-bold">ROUND</span>(<span class="text-blue-600 font-bold">AVG</span>(order_value_eur), 2) <span class="text-blue-600 font-bold">AS</span> average_order_value_eur<br>
              <span class="text-blue-600 font-bold">FROM</span> `luxottica_marketing_analytics.orders`<br>
              <span class="text-blue-600 font-bold">GROUP BY</span> brand_name<br>
              <span class="text-blue-600 font-bold">ORDER BY</span> total_revenue_eur <span class="text-blue-600 font-bold">DESC</span>;
            </div>
          </div>
        </div>
      </div>

      <!-- SLIDE 7: SECTION 03 DIVIDER -->
      <div class="slide w-full flex-col md:flex-row items-center gap-8">
        <div class="w-32 h-32 bg-g-yellow text-white font-black text-6xl flex items-center justify-center rounded-2xl shadow-xl flex-shrink-0">
          03
        </div>
        <div class="space-y-2">
          <span class="text-xs font-bold uppercase tracking-widest text-yellow-600">Section 03</span>
          <h2 class="text-4xl font-extrabold text-[#202124]">High-Margin Discovery & Brand Performance</h2>
          <p class="text-base text-gray-600">Evaluating Average Order Value (AOV) across luxury eyewear portfolios.</p>
        </div>
      </div>

      <!-- SLIDE 8: DATA TABLE -->
      <div class="slide w-full flex-col space-y-6">
        <h2 class="text-3xl font-bold text-[#202124]">Brand Revenue & Average Order Value (AOV)</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 bg-green-50 border-t-4 border-t-g-green rounded-2xl text-center space-y-2 shadow-sm">
            <span class="text-xs font-bold text-green-700 uppercase">Luxury Margin Leader</span>
            <div class="text-xl font-bold text-[#202124]">Oliver Peoples</div>
            <div class="text-4xl font-extrabold text-g-green">€396.00</div>
            <div class="text-xs text-gray-600">Average Order Value (AOV)</div>
          </div>

          <div class="p-6 bg-blue-50 border-t-4 border-t-g-blue rounded-2xl text-center space-y-2 shadow-sm">
            <span class="text-xs font-bold text-blue-700 uppercase">High Search Demand</span>
            <div class="text-xl font-bold text-[#202124]">Ray-Ban Meta</div>
            <div class="text-4xl font-extrabold text-g-blue">> €320.00</div>
            <div class="text-xs text-gray-600">Search Interest Surging</div>
          </div>

          <div class="p-6 bg-red-50 border-t-4 border-t-g-red rounded-2xl text-center space-y-2 shadow-sm">
            <span class="text-xs font-bold text-red-700 uppercase">Margin Leakage</span>
            <div class="text-xl font-bold text-[#202124]">Vogue Eyewear</div>
            <div class="text-4xl font-extrabold text-g-red">€129.00</div>
            <div class="text-xs text-gray-600">Excessive Discounting</div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800">
          💡 <b>Key Finding:</b> Ray-Ban Meta Smart Glasses generate massive high-intent Google Search volume, but campaign daily budgets deplete before peak evening hours!
        </div>
      </div>

      <!-- SLIDE 9: SECTION 04 DIVIDER -->
      <div class="slide w-full flex-col md:flex-row items-center gap-8">
        <div class="w-32 h-32 bg-g-green text-white font-black text-6xl flex items-center justify-center rounded-2xl shadow-xl flex-shrink-0">
          04
        </div>
        <div class="space-y-2">
          <span class="text-xs font-bold uppercase tracking-widest text-green-600">Section 04</span>
          <h2 class="text-4xl font-extrabold text-[#202124]">Cross-Channel Campaign Performance & Google ROAS</h2>
          <p class="text-base text-gray-600">Uncovering Return on Ad Spend (ROAS) across paid advertising channels.</p>
        </div>
      </div>

      <!-- SLIDE 10: COMPARISON SLIDE -->
      <div class="slide w-full flex-col space-y-6">
        <h2 class="text-3xl font-bold text-[#202124]">Comparing Cross-Channel Advertising ROAS</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 bg-red-50 border-l-8 border-l-g-red rounded-2xl space-y-3">
            <span class="text-xs font-bold uppercase text-red-600">3rd-Party Social Networks (TikTok / Criteo)</span>
            <div class="flex justify-between items-center">
              <span class="text-sm font-semibold text-gray-700">Daily Spend: €2,200/day</span>
              <span class="text-sm font-semibold text-gray-700">Conversions: 8/day</span>
            </div>
            <div class="text-4xl font-extrabold text-g-red">0.7x ROAS ❌</div>
            <p class="text-xs text-gray-600">40% of ad budget wasted on non-converting social impressions.</p>
          </div>

          <div class="p-6 bg-green-50 border-l-8 border-l-g-green rounded-2xl space-y-3">
            <span class="text-xs font-bold uppercase text-green-700">Google Search & Shopping</span>
            <div class="flex justify-between items-center">
              <span class="text-sm font-semibold text-gray-700">Daily Spend: €450/day (Capped)</span>
              <span class="text-sm font-semibold text-gray-700">Conversions: 120/day</span>
            </div>
            <div class="text-4xl font-extrabold text-g-green">6.8x - 8.2x ROAS 🚀</div>
            <p class="text-xs text-gray-600">High-intent search traffic driving profitable e-commerce orders.</p>
          </div>
        </div>

        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm font-medium text-yellow-800">
          💡 <b>Action Plan:</b> Reallocate budget from 0.7x ROAS social campaigns to capture 100% of Ray-Ban Meta Google Search demand!
        </div>
      </div>

      <!-- SLIDE 11: SECTION 05 DIVIDER -->
      <div class="slide w-full flex-col md:flex-row items-center gap-8">
        <div class="w-32 h-32 bg-g-blue text-white font-black text-6xl flex items-center justify-center rounded-2xl shadow-xl flex-shrink-0">
          05
        </div>
        <div class="space-y-2">
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600">Section 05</span>
          <h2 class="text-4xl font-extrabold text-[#202124]">Data Wrangling & Customer Match Activation</h2>
          <p class="text-base text-gray-600">Preparing clean first-party lead lists for Google Ads Customer Match.</p>
        </div>
      </div>

      <!-- SLIDE 12: PROCESS SLIDE -->
      <div class="slide w-full flex-col space-y-6">
        <h2 class="text-3xl font-bold text-[#202124]">Preparing Leads for Google Ads Customer Match</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 bg-gray-50 border-t-4 border-t-g-blue rounded-2xl space-y-2">
            <div class="w-8 h-8 rounded-full bg-g-blue text-white font-bold flex items-center justify-center text-xs">01</div>
            <div class="text-lg font-bold text-[#202124]">Raw Lead Ingestion</div>
            <p class="text-xs text-gray-600">1,000 uncleaned customer records with malformed emails and mixed currency symbols.</p>
          </div>

          <div class="p-6 bg-gray-50 border-t-4 border-t-g-yellow rounded-2xl space-y-2">
            <div class="w-8 h-8 rounded-full bg-g-yellow text-white font-bold flex items-center justify-center text-xs">02</div>
            <div class="text-lg font-bold text-[#202124]">Visual Data Prep</div>
            <p class="text-xs text-gray-600">No-code cleaning rules in BigQuery to standardize emails, currencies, and timestamps.</p>
          </div>

          <div class="p-6 bg-gray-50 border-t-4 border-t-g-green rounded-2xl space-y-2">
            <div class="w-8 h-8 rounded-full bg-g-green text-white font-bold flex items-center justify-center text-xs">03</div>
            <div class="text-lg font-bold text-[#202124]">Customer Match</div>
            <p class="text-xs text-gray-600">350+ verified VIP leads activated for retargeting across YouTube Ads & Search!</p>
          </div>
        </div>

        <div class="p-4 bg-gray-100 rounded-xl flex justify-between items-center text-sm font-semibold text-gray-800">
          <span>📊 Clean view <code>v_clean_marketing_leads</code> connects directly to Looker Studio!</span>
          <span class="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Open Dashboard ➔</span>
        </div>
      </div>

      <!-- SLIDE 13: STRATEGY SUMMARY -->
      <div class="slide w-full flex-col space-y-6">
        <h2 class="text-3xl font-bold text-[#202124]">The Q4 Google Growth Strategy for CMO</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
            <div class="text-2xl font-black text-g-blue">01</div>
            <div class="text-base font-bold text-[#202124]">Reallocate 60% Budget</div>
            <p class="text-xs text-gray-600">Shift budget from 0.7x ROAS social ads to Google Search & Performance Max.</p>
          </div>

          <div class="p-5 bg-green-50 border border-green-200 rounded-2xl space-y-2">
            <div class="text-2xl font-black text-g-green">02</div>
            <div class="text-base font-bold text-[#202124]">100% Search Share</div>
            <p class="text-xs text-gray-600">Capture all Ray-Ban Meta Smart Glasses search queries without daily budget caps.</p>
          </div>

          <div class="p-5 bg-yellow-50 border border-yellow-200 rounded-2xl space-y-2">
            <div class="text-2xl font-black text-yellow-700">03</div>
            <div class="text-base font-bold text-[#202124]">Customer Match</div>
            <p class="text-xs text-gray-600">Re-engage 350+ VIP leads on YouTube using clean BigQuery lists.</p>
          </div>

          <div class="p-5 bg-red-50 border border-red-200 rounded-2xl space-y-2">
            <div class="text-2xl font-black text-g-red">04</div>
            <div class="text-base font-bold text-[#202124]">Looker Studio</div>
            <p class="text-xs text-gray-600">Monitor real-time campaign ROAS with executive Looker dashboards.</p>
          </div>
        </div>

        <div class="text-center pt-4">
          <span class="inline-block px-8 py-3 bg-g-blue text-white text-sm font-bold rounded-xl shadow-md">
            🏆 Congratulations to the Winning Brand Detective Team!
          </span>
        </div>
      </div>

    </main>

    <!-- FOOTER CONTROLS -->
    <footer class="flex justify-between items-center pt-4 border-t border-gray-100 gap-3">
      <div class="flex items-center gap-2">
        <button id="prev-btn" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg transition flex items-center gap-1">
          <span>←</span> Previous
        </button>
        <button id="next-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-md flex items-center gap-1">
          Next <span>→</span>
        </button>
      </div>

      <!-- PROGRESS BAR -->
      <div class="w-1/3 bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
        <div id="progress-bar" class="bg-blue-600 h-full w-1/13 transition-all duration-300"></div>
      </div>

      <div class="flex items-center gap-3">
        <span class="text-xs text-gray-400 font-mono hidden md:inline">Use [←] [→] or [F]</span>
        <button id="fullscreen-btn" class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition">
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
      "Exploring and Preparing Your Data",
      "Agenda",
      "Section 01: CMO Briefing",
      "Marketing Performance vs. Budget",
      "Section 02: AI SQL Generation",
      "BigQuery Studio & Gemini AI",
      "Section 03: High-Margin Discovery",
      "Brand Revenue & Average Order Value",
      "Section 04: Cross-Channel ROAS",
      "Comparing Advertising ROAS",
      "Section 05: Customer Match",
      "Preparing Leads for Customer Match",
      "The Q4 Google Growth Strategy"
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

print("SUCCESS: Official Google Cloud White Presentation created in 100% English!")
