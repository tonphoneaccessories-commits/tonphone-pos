// Mfumo wa HQ: Stoo za Wakala & Duka la Nje, Kamisheni na Madeni (Tonphone POS Module)
(function() {
  const STOO_KEY = 'tonphone_hq_stoo_v1';
  const MADENI_KEY = 'tonphone_hq_madeni_v1';
  const WAKALA_KEY = 'tonphone_wakala_mauzo_v1';

  // Kitufe cha kuelea juu ya vile viwili vya kwanza (bottom: 130px)
  const btn = document.createElement('button');
  btn.innerHTML = '🏢 HQ: Stoo & Madeni';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '130px',
    right: '20px',
    zIndex: '9999',
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50px',
    padding: '12px 18px',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    cursor: 'pointer'
  });

  // Dirisha Kuu (Modal) la HQ
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    display: 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.65)',
    zIndex: '10000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px',
    boxSizing: 'border-box'
  });

  modal.innerHTML = `
    <div style="background:#fff; width:100%; max-width:480px; border-radius:12px; padding:16px; max-height:88vh; overflow-y:auto; font-family:sans-serif; color:#1f2937;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e5e7eb; padding-bottom:10px; margin-bottom:12px;">
        <h3 style="margin:0; font-size:17px;">🏢 HQ: Stoo, Kamisheni & Madeni</h3>
        <button id="close-hq-modal" style="background:#ef4444; color:#fff; border:none; border-radius:6px; padding:5px 10px; cursor:pointer; font-weight:bold;">Funga ✕</button>
      </div>

      <!-- Menyu ya Vichupo (Tabs) -->
      <div style="display:flex; gap:5px; overflow-x:auto; padding-bottom:8px; margin-bottom:12px; border-bottom:1px solid #e5e7eb;">
        <button class="hq-tab" data-tab="weka-stoo" style="background:#7c3aed; color:#fff; border:none; border-radius:6px; padding:8px 10px; font-size:12px; font-weight:bold; white-space:nowrap; cursor:pointer;">+ Weka Stoo</button>
        <button class="hq-tab" data-tab="ona-stoo" style="background:#f3f4f6; color:#374151; border:none; border-radius:6px; padding:8px 10px; font-size:12px; font-weight:bold; white-space:nowrap; cursor:pointer;">📦 Stoo (Wakala/Duka)</button>
        <button class="hq-tab" data-tab="kamisheni" style="background:#f3f4f6; color:#374151; border:none; border-radius:6px; padding:8px 10px; font-size:12px; font-weight:bold; white-space:nowrap; cursor:pointer;">💵 Kamisheni</button>
        <button class="hq-tab" data-tab="madeni" style="background:#f3f4f6; color:#374151; border:none; border-radius:6px; padding:8px 10px; font-size:12px; font-weight:bold; white-space:nowrap; cursor:pointer;">📋 Madeni (HQ)</button>
      </div>

      <!-- KICHUPO 1: KUWEKA STOO KWA WAKALA AU DUKA LA NJE -->
      <div id="tab-weka-stoo" class="hq-section">
        <form id="hq-stoo-form" style="display:flex; flex-direction:column; gap:10px;">
          <select id="stoo-mlengwa-aina" style="padding:10px; border:1px solid #d1d5db; border-radius:6px; font-weight:bold;">
            <option value="Wakala">👤 Weka Stoo kwa Wakala wa Mauzo</option>
            <option value="Duka la Nje">🏪 Weka Stoo Duka la Nje</option>
          </select>
          <input type="text" id="stoo-mlengwa-jina" placeholder="Jina la Wakala au Duka (mfano: Juma / Duka Kariakoo)" required style="padding:10px; border:1px solid #d1d5db; border-radius:6px;">
          <input type="text" id="stoo-bidhaa" placeholder="Jina la Bidhaa (mfano: Nokia 106, Betri BL-5C)" required style="padding:10px; border:1px solid #d1d5db; border-radius:6px;">
          <div style="display:flex; gap:8px;">
            <input type="number" id="stoo-idadi" placeholder="Idadi (Pcs)" required min="1" style="width:45%; padding:10px; border:1px solid #d1d5db; border-radius:6px;">
            <input type="number" id="stoo-bei" placeholder="Bei ya Kimoja (TZS)" required min="1" style="width:55%; padding:10px; border:1px solid #d1d5db; border-radius:6px;">
          </div>
          <button type="submit" style="background:#16a34a; color:#fff; border:none; border-radius:6px; padding:12px; font-weight:bold; cursor:pointer;">+ Kabidhi Stoo Kutoka HQ</button>
        </form>
      </div>

      <!-- KICHUPO 2: KUONA STOO ZA WAKALA NA DUKA LA NJE -->
      <div id="tab-ona-stoo" class="hq-section" style="display:none;">
        <div id="stoo-summary" style="background:#f5f3ff; border:1px solid #ddd6fe; padding:10px; border-radius:8px; margin-bottom:12px; font-size:13px;"></div>
        <div id="stoo-list" style="display:flex; flex-direction:column; gap:8px;"></div>
      </div>

      <!-- KICHUPO 3: KUONA KAMISHENI ZA WAKALA WA MAUZO -->
      <div id="tab-kamisheni" class="hq-section" style="display:none;">
        <div id="kamisheni-summary" style="background:#ecfdf5; border:1px solid #a7f3d0; padding:10px; border-radius:8px; margin-bottom:12px; font-size:13px;"></div>
        <div id="kamisheni-list" style="display:flex; flex-direction:column; gap:8px;"></div>
      </div>

      <!-- KICHUPO 4: HQ KUONA NA KUREKODI MADENI -->
      <div id="tab-madeni" class="hq-section" style="display:none;">
        <form id="hq-deni-form" style="display:flex; flex-direction:column; gap:8px; margin-bottom:15px; background:#fffbeb; padding:10px; border-radius:8px; border:1px solid #fde68a;">
          <input type="text" id="deni-mdaiwa" placeholder="Jina la Mdaiwa (Mteja / Wakala / Duka)" required style="padding:8px; border:1px solid #d1d5db; border-radius:6px;">
          <input type="text" id="deni-maelezo" placeholder="Bidhaa alizokopa / Sababu" required style="padding:8px; border:1px solid #d1d5db; border-radius:6px;">
          <input type="number" id="deni-kiasi" placeholder="Kiasi anachodaiwa (TZS)" required min="1" style="padding:8px; border:1px solid #d1d5db; border-radius:6px;">
          <button type="submit" style="background:#d97706; color:#fff; border:none; border-radius:6px; padding:10px; font-weight:bold; cursor:pointer;">+ Rekodi Deni Jipya (HQ)</button>
        </form>
        <div id="madeni-summary" style="background:#fef2f2; border:1px solid #fecaca; padding:10px; border-radius:8px; margin-bottom:12px; font-size:13px;"></div>
        <div id="madeni-list" style="display:flex; flex-direction:column; gap:8px;"></div>
      </div>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(modal);

  // Kubadilisha Vichupo (Tabs)
  document.querySelectorAll('.hq-tab').forEach(tabBtn => {
    tabBtn.onclick = function() {
      document.querySelectorAll('.hq-tab').forEach(b => {
        b.style.background = '#f3f4f6';
        b.style.color = '#374151';
      });
      this.style.background = '#7c3aed';
      this.style.color = '#fff';

      document.querySelectorAll('.hq-section').forEach(sec => sec.style.display = 'none');
      const target = this.getAttribute('data-tab');
      document.getElementById('tab-' + target).style.display = 'block';
      refreshAllHQ();
    };
  });

  // 1. Kazi za Stoo (Wakala & Duka la Nje)
  function getStoo() { return JSON.parse(localStorage.getItem(STOO_KEY) || '[]'); }
  function saveStoo(data) { localStorage.setItem(STOO_KEY, JSON.stringify(data)); refreshAllHQ(); }

  document.getElementById('hq-stoo-form').onsubmit = (e) => {
    e.preventDefault();
    const list = getStoo();
    list.unshift({
      aina: document.getElementById('stoo-mlengwa-aina').value,
      mlengwa: document.getElementById('stoo-mlengwa-jina').value.trim(),
      bidhaa: document.getElementById('stoo-bidhaa').value.trim(),
      idadi: Number(document.getElementById('stoo-idadi').value),
      bei: Number(document.getElementById('stoo-bei').value),
      tarehe: new Date().toLocaleDateString('sw-TZ')
    });
    saveStoo(list);
    e.target.reset();
    alert('Stoo imeingizwa kikamilifu!');
  };

  function renderStoo() {
    const list = getStoo();
    const listEl = document.getElementById('stoo-list');
    const sumEl = document.getElementById('stoo-summary');
    let thamaniWakala = 0, thamaniDuka = 0;

    listEl.innerHTML = list.length ? '' : '<p style="font-size:13px; color:#6b7280;">Hakuna stoo iliyowekwa bado.</p>';
    list.forEach((item, idx) => {
      const thamani = item.idadi * item.bei;
      if (item.aina === 'Wakala') thamaniWakala += thamani;
      else thamaniDuka += thamani;

      const card = document.createElement('div');
      card.style.cssText = 'border:1px solid #e5e7eb; border-radius:8px; padding:10px; font-size:13px; background:#fafafa;';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between;">
          <span style="background:${item.aina === 'Wakala' ? '#059669' : '#2563eb'}; color:#fff; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:bold;">${item.aina.toUpperCase()}: ${item.mlengwa}</span>
          <button onclick="window._delHQStoo(${idx})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:12px;">Futa</button>
        </div>
        <div style="font-weight:bold; margin-top:5px;">${item.bidhaa} — Idadi: ${item.idadi} pcs</div>
        <div style="color:#374151; margin-top:2px;">Thamani: <b>${thamani.toLocaleString()} TZS</b> (@ ${item.bei.toLocaleString()}) • ${item.tarehe}</div>
      `;
      listEl.appendChild(card);
    });

    sumEl.innerHTML = `
      <div><b>👤 Thamani Stoo za Mawakala:</b> ${thamaniWakala.toLocaleString()} TZS</div>
      <div><b>🏪 Thamani Stoo Maduka ya Nje:</b> ${thamaniDuka.toLocaleString()} TZS</div>
      <div style="border-top:1px solid #ddd6fe; margin-top:4px; padding-top:4px;"><b>📦 Jumla Stoo Zote za Nje:</b> ${(thamaniWakala + thamaniDuka).toLocaleString()} TZS</div>
    `;
  }
  window._delHQStoo = (idx) => { const d = getStoo(); d.splice(idx, 1); saveStoo(d); };

  // 2. Kazi za Kuona Kamisheni za Mawakala (Inasoma kutoka mfumo wa wakala_mauzo)
  function renderKamisheni() {
    const wakalaRecords = JSON.parse(localStorage.getItem(WAKALA_KEY) || '[]');
    const listEl = document.getElementById('kamisheni-list');
    const sumEl = document.getElementById('kamisheni-summary');
    const perAgent = {};
    let jumlaKuuKamisheni = 0;

    wakalaRecords.forEach(rec => {
      const jina = (rec.jina || 'Asiyejulikana').trim();
      const kam = Number(rec.kamisheni || 0);
      const mauzo = Number(rec.kiasi || 0);
      jumlaKuuKamisheni += kam;
      if (!perAgent[jina]) perAgent[jina] = { kamisheni: 0, mauzo: 0, idadi: 0 };
      perAgent[jina].kamisheni += kam;
      perAgent[jina].mauzo += mauzo;
      perAgent[jina].idadi += 1;
    });

    listEl.innerHTML = Object.keys(perAgent).length ? '' : '<p style="font-size:13px; color:#6b7280;">Hakuna rekodi za kamisheni za mawakala bado.</p>';
    Object.keys(perAgent).forEach(agent => {
      const info = perAgent[agent];
      const card = document.createElement('div');
      card.style.cssText = 'border:1px solid #d1fae5; border-radius:8px; padding:10px; font-size:13px; background:#f0fdf4;';
      card.innerHTML = `
        <div style="font-weight:bold; font-size:14px; color:#065f46;">👤 ${agent} (${info.idadi} miamala)</div>
        <div style="margin-top:4px;">Jumla ya Mauzo Yake: <b>${info.mauzo.toLocaleString()} TZS</b></div>
        <div style="margin-top:2px; color:#047857;">Kamisheni Anayostahili: <b>${info.kamisheni.toLocaleString()} TZS</b></div>
      `;
      listEl.appendChild(card);
    });

    sumEl.innerHTML = `<b>💵 Jumla ya Kamisheni Zote za Mawakala:</b> ${jumlaKuuKamisheni.toLocaleString()} TZS`;
  }

  // 3. Kazi za HQ Kuona na Kusimamia Madeni Yote
  function getMadeni() { return JSON.parse(localStorage.getItem(MADENI_KEY) || '[]'); }
  function saveMadeni(data) { localStorage.setItem(MADENI_KEY, JSON.stringify(data)); refreshAllHQ(); }

  document.getElementById('hq-deni-form').onsubmit = (e) => {
    e.preventDefault();
    const list = getMadeni();
    list.unshift({
      mdaiwa: document.getElementById('deni-mdaiwa').value.trim(),
      maelezo: document.getElementById('deni-maelezo').value.trim(),
      kiasi: Number(document.getElementById('deni-kiasi').value),
      limelipwa: false,
      tarehe: new Date().toLocaleDateString('sw-TZ')
    });
    saveMadeni(list);
    e.target.reset();
  };

  function renderMadeni() {
    const madeniHQ = getMadeni();
    const wakalaRecords = JSON.parse(localStorage.getItem(WAKALA_KEY) || '[]');
    const listEl = document.getElementById('madeni-list');
    const sumEl = document.getElementById('madeni-summary');

    let deniHQTotal = 0;
    let deniWakalaTotal = 0;

    listEl.innerHTML = '';

    // Onyesha kwanza madeni ya Mawakala ambao hawajakabidhi fedha
    wakalaRecords.forEach(rec => {
      if (rec.hali && rec.hali.includes('Anadaiwa')) {
        deniWakalaTotal += Number(rec.kiasi || 0);
        const wCard = document.createElement('div');
        wCard.style.cssText = 'border:1px solid #fde68a; border-radius:8px; padding:10px; font-size:13px; background:#fffbeb;';
        wCard.innerHTML = `
          <div style="font-weight:bold; color:#b45309;">⏳ Deni la Wakala: ${rec.jina}</div>
          <div>Mzigo: ${rec.bidhaa} • Kiasi: <b>${Number(rec.kiasi).toLocaleString()} TZS</b> (${rec.tarehe})</div>
        `;
        listEl.appendChild(wCard);
      }
    });

    // Onyesha madeni yaliyorekodiwa moja kwa moja HQ
    madeniHQ.forEach((d, idx) => {
      if (!d.limelipwa) deniHQTotal += d.kiasi;
      const card = document.createElement('div');
      card.style.cssText = `border:1px solid ${d.limelipwa ? '#d1fae5' : '#fecaca'}; border-radius:8px; padding:10px; font-size:13px; background:${d.limelipwa ? '#f0fdf4' : '#fef2f2'};`;
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:bold; color:${d.limelipwa ? '#15803d' : '#b91c1c'};">${d.limelipwa ? '✅ LIMELIPWA:' : '🚨 DENI:'} ${d.mdaiwa}</span>
          <div>
            ${!d.limelipwa ? `<button onclick="window._lipaDeniHQ(${idx})" style="background:#16a34a; color:#fff; border:none; border-radius:4px; padding:3px 7px; font-size:11px; cursor:pointer; margin-right:5px;">Lipwa</button>` : ''}
            <button onclick="window._delDeniHQ(${idx})" style="background:none; border:none; color:#6b7280; cursor:pointer; font-size:11px;">Futa</button>
          </div>
        </div>
        <div style="margin-top:4px;">${d.maelezo} — <b>${d.kiasi.toLocaleString()} TZS</b> (${d.tarehe})</div>
      `;
      listEl.appendChild(card);
    });

    sumEl.innerHTML = `
      <div><b>🚨 Madeni ya Wateja/Maduka (HQ):</b> ${deniHQTotal.toLocaleString()} TZS</div>
      <div><b>⏳ Fedha Zilizo kwa Mawakala:</b> ${deniWakalaTotal.toLocaleString()} TZS</div>
      <div style="border-top:1px solid #fecaca; margin-top:4px; padding-top:4px;"><b>💰 Jumla Kuu ya Madeni Yote:</b> ${(deniHQTotal + deniWakalaTotal).toLocaleString()} TZS</div>
    `;
  }
  window._lipaDeniHQ = (idx) => { const d = getMadeni(); d[idx].limelipwa = true; saveMadeni(d); };
  window._delDeniHQ = (idx) => { const d = getMadeni(); d.splice(idx, 1); saveMadeni(d); };

  function refreshAllHQ() {
    renderStoo();
    renderKamisheni();
    renderMadeni();
  }

  btn.onclick = () => { modal.style.display = 'flex'; refreshAllHQ(); };
  document.getElementById('close-hq-modal').onclick = () => { modal.style.display = 'none'; };
})();
