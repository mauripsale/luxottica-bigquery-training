    // -------------------------------------------------------------------------
    // GAME 3 ENGINE: PROMPT ARENA • THE AI TURING ROAST
    // -------------------------------------------------------------------------
    const TuringRoast = (function() {
      const ROAST_RULES = [
        {
          regex: /SELECT\s+\*/i,
          spiciness: "🌶️🌶️🌶️🌶️🌶️",
          it: {
            badge: "SELECT * Criminale 🚨",
            quote: "SELECT * su BigQuery? Hai intenzione di far bruciare il budget annuale di Google Cloud prima del secondo espresso, o volevi solo essere sicuro che il data warehouse ricordasse tutte le sue colonne?",
            bytes: "4.8 TB (Terrore puro)",
            grade: "F (Lettera di richiamo)",
            advice: "Non usare MAI SELECT * su tabelle analitiche: specifica le colonne esatte necessarie alla CTE!"
          },
          en: {
            badge: "Criminal SELECT * 🚨",
            quote: "SELECT * on BigQuery? Planning to burn through our annual Google Cloud quota before your second espresso, or just making sure the data warehouse remembers all its columns?",
            bytes: "4.8 TB (Pure Terror)",
            grade: "F (Formal Warning)",
            advice: "NEVER use SELECT * on analytical tables: specify the exact columns required by your CTE!"
          }
        },
        {
          regex: /CROSS\s+JOIN/i,
          spiciness: "🌶️🌶️🌶️🌶️",
          it: {
            badge: "Cartesian Explosion 💣",
            quote: "Una CROSS JOIN non protetta? Complimenti, hai appena generato 84 miliardi di combinazioni per confrontare due paia di Ray-Ban. I server di Agordo stanno chiedendo asilo politico in Svizzera.",
            bytes: "18.2 TB (Supernova)",
            grade: "E (Pericolo Pubblico)",
            advice: "Utilizza clausole ON ben definite o subquery pre-aggregate prima della JOIN."
          },
          en: {
            badge: "Cartesian Explosion 💣",
            quote: "An unconstrained CROSS JOIN? Congratulations, you just multiplied 84 billion combinations comparing two pairs of Ray-Bans. The Agordo datacenter is seeking political asylum in Switzerland.",
            bytes: "18.2 TB (Supernova)",
            grade: "E (Public Hazard)",
            advice: "Use strict ON join conditions or pre-aggregated CTEs prior to joining."
          }
        },
        {
          regex: /WHERE\s+1\s*=\s*1/i,
          spiciness: "🌶️🌶️",
          it: {
            badge: "Pigrizia da Backend 😴",
            quote: "WHERE 1=1... Si vede che hai programmato in PHP nel 2007 e ti porti ancora dentro quel trauma della concatenazione delle stringhe. Lascialo andare, qui siamo su BigQuery Studio.",
            bytes: "120 MB (Nessun danno, ma tanto imbarazzo)",
            grade: "C- (Nostalgico)",
            advice: "Rimuovi costrutti fittizi quando scrivi query di reportistica per il management."
          },
          en: {
            badge: "Backend Sloth 😴",
            quote: "WHERE 1=1... We can tell you were string-concatenating SQL in PHP back in 2007 and still carry that trauma. Let it go, you are on BigQuery Studio now.",
            bytes: "120 MB (No financial harm, just emotional damage)",
            grade: "C- (Nostalgic)",
            advice: "Purge dummy predicates when writing business-grade analytical queries."
          }
        },
        {
          regex: /ORDER\s+BY[^\n]+LIMIT/i,
          spiciness: "🌶️",
          it: {
            badge: "Ordinamento Top-N Pulito ✨",
            quote: "Un ORDER BY con LIMIT... incredibile, qualcuno che rispetta le code di esecuzione distribuite di Google! Quasi mi dispiace doverti fare un complimento durante un roast.",
            bytes: "2.1 GB (Gestibile)",
            grade: "A- (Esemplare)",
            advice: "Ottimo uso! Se puoi, unisci un filtro di partizione temporale nel WHERE per abbattere ulteriormente lo scan."
          },
          en: {
            badge: "Clean Top-N Sort ✨",
            quote: "ORDER BY accompanied by LIMIT... incredible, an engineer who actually respects Google's distributed execution slots! I almost regret complimenting you during a roast.",
            bytes: "2.1 GB (Lean & Mean)",
            grade: "A- (Exemplary)",
            advice: "Great pattern! Couple this with partition pruning in WHERE to drive byte scan even lower."
          }
        },
        {
          regex: /WITH\s+[a-zA-Z0-9_]+\s+AS/i,
          spiciness: "🌶️🌶️",
          it: {
            badge: "Architetto delle CTE 🏗️",
            quote: "Usi le CTE per rendere il codice leggibile. Bellissimo, ti senti raffinato vero? Ricordati solo che se fai una sub-CTE con fan-out per ogni canale social, alla fine i conti del ROAS li paghi tu.",
            bytes: "450 MB (Ben isolato)",
            grade: "B+ (Strutturato)",
            advice: "Assicurati di raggruppare sempre per channel prima del JOIN di attribuzione."
          },
          en: {
            badge: "CTE Architect 🏗️",
            quote: "Using CTEs to keep logic pristine. Looking sophisticated, aren't we? Just remember: if your sub-CTE duplicates rows across marketing channels, the CFO will personally audit your desk.",
            bytes: "450 MB (Well isolated)",
            grade: "B+ (Structured)",
            advice: "Always aggregate metrics by channel inside the CTE before joining."
          }
        }
      ];

      const DEFAULT_ROASTS = [
        {
          spiciness: "🌶️🌶️",
          it: {
            badge: "Query Neutra & Timida 🥱",
            quote: "Query sintatticamente accettabile, ma priva di anima. Il tuo codice assomiglia a un manuale d'uso in tedesco di una macchina del caffè degli anni '80: funziona, ma non entusiasma nessuno.",
            bytes: "640 MB (Modesto)",
            grade: "B- (Impiegatizio)",
            advice: "Aggiungi qualche funzione analitica di finestra (OVER / PARTITION BY) per fare il salto di qualità."
          },
          en: {
            badge: "Timid Vanilla Query 🥱",
            quote: "Syntactically acceptable, yet completely devoid of passion. Your code reads like a 1980s German appliance manual: functional, yet deeply uninspiring.",
            bytes: "640 MB (Modest)",
            grade: "B- (Bureaucratic)",
            advice: "Add analytical window functions (OVER / PARTITION BY) to step up your engineering game."
          }
        },
        {
          spiciness: "🌶️🌶️🌶️",
          it: {
            badge: "Codice Zen / Mistero Ermetico 🧘",
            quote: "Questo prompt o query è così minimalista che neppure Gemini in persona sa se vuoi analizzare le vendite di occhiali o calcolare l'orbita di Marte. Più contesto la prossima volta!",
            bytes: "Sconosciuto",
            grade: "C (Nebuloso)",
            advice: "Fornisci sempre schema di partenza, obiettivo di business e vincoli attesi."
          },
          en: {
            badge: "Hermetic Zen Code 🧘",
            quote: "This prompt is so cryptic that Gemini himself cannot tell if you are analyzing luxury eyewear sales or calculating planetary orbits. Give us some context next time!",
            bytes: "Unknown",
            grade: "C (Nebulous)",
            advice: "Always specify the target schema, commercial objective, and constraints."
          }
        }
      ];

      function roast() {
        const inputEl = document.getElementById('roast-input');
        const text = (inputEl ? inputEl.value : '').trim();

        const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'it';

        if (!text) {
          showToast(lang === 'it' 
            ? "Inserisci prima una query SQL o un prompt da roostare! 🌶️" 
            : "Enter a SQL query or prompt to roast first! 🌶️");
          return;
        }

        let selected = null;
        for (const rule of ROAST_RULES) {
          if (rule.regex.test(text)) {
            selected = rule;
            break;
          }
        }

        if (!selected) {
          selected = DEFAULT_ROASTS[Math.floor(Math.random() * DEFAULT_ROASTS.length)];
        }

        const data = (lang === 'en' && selected.en) ? selected.en : (selected.it || selected);

        // Populate Result Card
        const badgeEl = document.getElementById('roast-badge');
        const spiceEl = document.getElementById('roast-spiciness-rating');
        const quoteEl = document.getElementById('roast-quote');
        const bytesEl = document.getElementById('roast-bytes-metric');
        const gradeEl = document.getElementById('roast-grade-metric');
        const adviceEl = document.getElementById('roast-advice');

        const spiceLabel = lang === 'it' ? 'Piccantezza:' : 'Spiciness:';
        const advicePrefix = lang === 'it' ? 'Consiglio Salva-Vita: ' : 'Life-Saving Tip: ';

        if (badgeEl) badgeEl.innerText = data.badge;
        if (spiceEl) {
          spiceEl.innerHTML = `<span class="text-xs font-bold text-rose-600 dark:text-rose-400">${spiceLabel}</span><span>${selected.spiciness}</span>`;
        }
        if (quoteEl) quoteEl.innerText = `"${data.quote}"`;
        if (bytesEl) bytesEl.innerText = data.bytes;
        if (gradeEl) gradeEl.innerText = data.grade;
        if (adviceEl) adviceEl.innerText = `${advicePrefix}${data.advice}`;

        // Shake visual effect
        const card = document.getElementById('roast-result-card');
        if (card) {
          card.classList.add('ring-2', 'ring-rose-500', 'animate-pulse');
          setTimeout(() => card.classList.remove('ring-2', 'ring-rose-500', 'animate-pulse'), 800);
        }

        // Classroom Competition Award Hook: +50 pt for surviving the AI roast!
        awardCoffeeBadge('roast', 50, lang === 'it' ? '🌶️ AI Roast Survivor' : '🌶️ AI Roast Survivor');
      }

      function loadSample() {
        const inputEl = document.getElementById('roast-input');
        if (inputEl) {
          inputEl.value = "SELECT * \nFROM `luxottica_orders` \nCROSS JOIN `luxottica_marketing_spend`\nWHERE 1=1;";
          roast();
        }
      }

      return {
        roast,
        loadSample
      };
    })();

    // Expose game modules globally on window
    window.QueryBeats = QueryBeats;
    window.OpticsLab = OpticsLab;
    window.TuringRoast = TuringRoast;

