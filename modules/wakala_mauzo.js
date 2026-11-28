// Mfumo wa Nje: Wakala wa Mauzo (Tonphone POS Module)
(function() {
  const STORAGE_KEY = 'tonphone_wakala_mauzo_v1';

  // Tengeneza kitufe cha kuelea (Floating Button) bila kugusa menyu za zamani
  const btn = document.createElement('button');
  btn.innerHTML = '👤 Wakala wa Mauzo';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    backgroundColor: '#16a34a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50px',
    padding: '12px 18px',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    cursor: 'pointer'
  });

  // Tengeneza dirisha (Modal) la kusimamia mawakala na mauzo yao
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    display: 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: '10000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px',
    boxSizing: 'border-box'
  });

  modal.innerHTML = `
    <div style="background:#fff; width:100%; max-width:450px; border-radius:12px; padding:20px; max-height:85vh; overflow-y:auto; font-family:sans-serif; color:#1f2937;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e5e7eb; padding-bottom:10px; margin-bottom:15px;">
        <h3 style="margin:0; font-size:18px;">👤 Mfumo wa Wakala wa Mauzo</h3>
        <button id="close-wakala-modal" style="background:#ef4444; color:#fff; border:none; border-radius:6px; padding:5px 10px; cursor:pointer; font-weight:bold;">Funga ✕</button>
      </div>

      <form id="wakala-form" style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
        <input type="text" id="wakala-jina" placeholder="Jina la Wakala (mfano: Juma)" required style="padding:10px; border:1px solid #d1d5db; border-radius:6px;">
        <input type="text" id="wakala-bidhaa" placeholder="Bidhaa aliyochukua / kuuza (mfano: Charger 10)" required style="padding:10px; border:1px solid #d1d5db; border-radius:6px;">
        <input type="number" id="wakala-kiasi" placeholder="Thamani ya Mauzo (TZS)" required style="padding:10px; border:1px solid #d1d5db; border-radius:6px;">
        <input type="number" id="wakala-kamisheni" placeholder="Kamisheni ya Wakala (TZS)" required style="padding:10px; border:1px solid #d1d5db; border-radius:6px;">
        <select id="wakala-hali" style="padding:10px; border:1px solid #d1d5db; border-radius:6px;">
          <option value="Amekabidhi Fedha">✅ Amekabidhi Fedha</option>
          <option value="Bado Anadaiwa">⏳ Bado Anadaiwa (Mzigo wa Nje)</option>
        </select>
        <button type="submit" style="background:#2563eb; color:#fff; border:none; border-radius:6px; padding:12px; font-weight:bold; cursor:pointer;">+ Hifadhi Rekodi ya Wakala</button>
      </form>

      <div id="wakala-summary" style="background:#f3f4f6; padding:10px; border-radius:8px; margin-bottom:15px; font-size:13px;"></div>
      <div id="wakala-list" style="display:flex; flex-direction:column; gap:10px;"></div>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(modal);

  // Kazi za kuhifadhi na kuonyesha data (LocalStorage)
  function getRecords() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  function saveRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    renderRecords();
  }

  function renderRecords() {
    const records = getRecords();
    const listEl = document.getElementById('wakala-list');
    const summaryEl = document.getElementById('wakala-summary');

    let jumlaMauzo = 0;
    let jumlaKamisheni = 0;
    let zinazodaiwa = 0;

    listEl.innerHTML = '';
    records.forEach((rec, index) => {
      jumlaMauzo += Number(rec.kiasi);
      jumlaKamisheni += Number(rec.kamisheni);
      if (rec.hali.includes('Anadaiwa')) zinazodaiwa += Number(rec.kiasi);

      const card = document.createElement('div');
      card.style.cssText = 'border:1px solid #e5e7eb; border-radius:8px; padding:10px; font-size:13px; background:#fafafa;';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-weight:bold;">
          <span>${rec.jina} — ${rec.bidhaa}</span>
          <button data-idx="${index}" class="del-wakala" style="background:none; border:none; color:#ef4444; cursor:pointer;">Futa</button>
        </div>
        <div style="margin-top:4px; color:#374151;">Mauzo: <b>${Number(rec.kiasi).toLocaleString()} TZS</b> | Kamisheni: <b>${Number(rec.kamisheni).toLocaleString()} TZS</b></div>
        <div style="margin-top:4px; font-size:12px; color:${rec.hali.includes('Anadaiwa') ? '#d97706' : '#16a34a'};">${rec.hali} • ${rec.tarehe}</div>
      `;
      listEl.appendChild(card);
    });

    summaryEl.innerHTML = `
      <div><b>Jumla ya Mauzo ya Nje:</b> ${jumlaMauzo.toLocaleString()} TZS</div>
      <div><b>Fedha Zinazodaiwa Nje:</b> <span style="color:#d97706;">${zinazodaiwa.toLocaleString()} TZS</span></div>
      <div><b>Jumla ya Kamisheni:</b> ${jumlaKamisheni.toLocaleString()} TZS</div>
    `;

    document.querySelectorAll('.del-wakala').forEach(delBtn => {
      delBtn.onclick = function() {
        const idx = this.getAttribute('data-idx');
        const updated = getRecords();
        updated.splice(idx, 1);
        saveRecords(updated);
      };
    });
  }

  btn.onclick = () => { modal.style.display = 'flex'; renderRecords(); };
  document.getElementById('close-wakala-modal').onclick = () => { modal.style.display = 'none'; };

  document.getElementById('wakala-form').onsubmit = (e) => {
    e.preventDefault();
    const records = getRecords();
    records.unshift({
      jina: document.getElementById('wakala-jina').value,
      bidhaa: document.getElementById('wakala-bidhaa').value,
      kiasi: document.getElementById('wakala-kiasi').value,
      kamisheni: document.getElementById('wakala-kamisheni').value,
      hali: document.getElementById('wakala-hali').value,
      tarehe: new Date().toLocaleDateString('sw-TZ')
    });
    saveRecords(records);
    e.target.reset();
  };
})();
