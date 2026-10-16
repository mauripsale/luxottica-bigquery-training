    // -------------------------------------------------------------------------
    // GAME 3 ENGINE: PROMPT ARENA • THE AI TURING ROAST
    // -------------------------------------------------------------------------
    const TuringRoast = (function() {
      const ROAST_RULES = [
        {
          regex: /SELECT\s+\*/i,
          badge: "SELECT * Criminale 🚨",
          spiciness: "🌶️🌶️🌶️🌶️🌶️",
          quote: "SELECT * su BigQuery? Hai intenzione di far bruciare il budget annuale di Google Cloud prima del secondo espresso, o volevi solo essere sicuro che il data warehouse ricordasse tutte le sue colonne?",
          bytes: "4.8 TB (Terrore puro)",
          grade: "F (Lettera di richiamo)",
          advice: "Non usare MAI SELECT * su tabelle analitiche: specifica le colonne esatte necessarie alla CTE!"
        },
        {
          regex: /CROSS\s+JOIN/i,
          badge: "Cartesian Explosion 💣",
          spiciness: "🌶️🌶️🌶️🌶️",
          quote: "Una CROSS JOIN non protetta? Complimenti, hai appena generato 84 miliardi di combinazioni per confrontare due paia di Ray-Ban. I server di Agordo stanno chiedendo asilo politico in Svizzera.",
          bytes: "18.2 TB (Supernova)",
          grade: "E (Pericolo Pubblico)",
          advice: "Utilizza clausole ON ben definite o subquery pre-aggregate prima della JOIN."
        },
        {
          regex: /WHERE\s+1\s*=\s*1/i,
          badge: "Pigrizia da Backend 😴",
          spiciness: "🌶️🌶️",
          quote: "WHERE 1=1... Si vede che hai programmato in PHP nel 2007 e ti porti ancora dentro quel trauma della concatenazione delle stringhe. Lascialo andare, qui siamo su BigQuery Studio.",
          bytes: "120 MB (Nessun danno, ma tanto imbarazzo)",
          grade: "C- (Nostalgico)",
          advice: "Rimuovi costrutti fittizi quando scrivi query di reportistica per il management."
        },
        {
          regex: /ORDER\s+BY[^\n]+LIMIT/i,
          badge: "Ordinamento Top-N Pulito ✨",
          spiciness: "🌶️",
          quote: "Un ORDER BY con LIMIT... incredibile, qualcuno che rispetta le code di esecuzione distribuite di Google! Quasi mi dispiace doverti fare un complimento durante un roast.",
          bytes: "2.1 GB (Gestibile)",
          grade: "A- (Esemplare)",
          advice: "Ottimo uso! Se puoi, unisci un filtro di partizione temporale nel WHERE per abbattere ulteriormente lo scan."
        },
        {
          regex: /WITH\s+[a-zA-Z0-9_]+\s+AS/i,
          badge: "Architetto delle CTE 🏗️",
          spiciness: "🌶️🌶️",
          quote: "Usi le CTE per rendere il codice leggibile. Bellissimo, ti senti raffinato vero? Ricordati solo che se fai una sub-CTE con fan-out per ogni canale social, alla fine i conti del ROAS li paghi tu.",
          bytes: "450 MB (Ben isolato)",
          grade: "B+ (Strutturato)",
          advice: "Assicurati di raggruppare sempre per channel prima del JOIN di attribuzione."
        }
      ];

      const DEFAULT_ROASTS = [
        {
          badge: "Query Neutra & Timida 🥱",
          spiciness: "🌶️🌶️",
          quote: "Query sintatticamente accettabile, ma priva di anima. Il tuo codice assomiglia a un manuale d'uso in tedesco di una macchina del caffè degli anni '80: funziona, ma non entusiasma nessuno.",
          bytes: "640 MB (Modesto)",
          grade: "B- (Impiegatizio)",
          advice: "Aggiungi qualche funzione analitica di finestra (OVER / PARTITION BY) per fare il salto di qualità."
        },
        {
          badge: "Codice Zen / Mistero Ermetico 🧘",
          spiciness: "🌶️🌶️🌶️",
          quote: "Questo prompt o query è così minimalista che neppure Gemini in persona sa se vuoi analizzare le vendite di occhiali o calcolare l'orbita di Marte. Più contesto la prossima volta!",
          bytes: "Sconosciuto",
          grade: "C (Nebuloso)",
          advice: "Fornisci sempre schema di partenza, obiettivo di business e vincoli attesi."
        }
      ];

      function roast() {
        const inputEl = document.getElementById('roast-input');
        const text = (inputEl ? inputEl.value : '').trim();

        if (!text) {
          showToast("Inserisci prima una query SQL o un prompt da roostare! 🌶️");
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

        // Populate Result Card
        const badgeEl = document.getElementById('roast-badge');
        const spiceEl = document.getElementById('roast-spiciness-rating');
        const quoteEl = document.getElementById('roast-quote');
        const bytesEl = document.getElementById('roast-bytes-metric');
        const gradeEl = document.getElementById('roast-grade-metric');
        const adviceEl = document.getElementById('roast-advice');

        if (badgeEl) badgeEl.innerText = selected.badge;
        if (spiceEl) {
          spiceEl.innerHTML = `<span class="text-xs font-bold text-rose-600 dark:text-rose-400">Piccantezza:</span><span>${selected.spiciness}</span>`;
        }
        if (quoteEl) quoteEl.innerText = `"${selected.quote}"`;
        if (bytesEl) bytesEl.innerText = selected.bytes;
        if (gradeEl) gradeEl.innerText = selected.grade;
        if (adviceEl) adviceEl.innerText = `Consiglio Salva-Vita: ${selected.advice}`;

        // Shake visual effect
        const card = document.getElementById('roast-result-card');
        if (card) {
          card.classList.add('ring-2', 'ring-rose-500', 'animate-pulse');
          setTimeout(() => card.classList.remove('ring-2', 'ring-rose-500', 'animate-pulse'), 800);
        }

        // Classroom Competition Award Hook: +50 pt for surviving the AI roast!
        awardCoffeeBadge('roast', 50, '🌶️ AI Roast Survivor');
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

