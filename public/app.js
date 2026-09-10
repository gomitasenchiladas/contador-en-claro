const form = document.querySelector('#consultation-form');
const result = document.querySelector('#result');
const button = document.querySelector('#generate');
const waitlist = document.querySelector('#waitlist-form');
const waitlistMessage = document.querySelector('#waitlist-message');

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[c])); }
function render(item) {
  const a = item.answer;
  result.classList.remove('empty');
  const mode = a.demo ? '<span class="mode">modo demo</span>' : (a.aiFallback ? '<span class="mode fallback">modo contingencia</span>' : '<span class="mode live">IA conectada</span>');
  result.innerHTML = `${mode}<span class="risk ${a.riskLevel}">riesgo ${escapeHtml(a.riskLevel)} · revisar antes de enviar</span>
    <div class="result-block"><h4>Mensaje para el cliente</h4><p>${escapeHtml(a.clientMessage)}</p><button class="copy-button" data-copy="${encodeURIComponent(a.clientMessage)}">Copiar mensaje</button></div>
    <div class="result-block"><h4>Nota interna</h4><p>${escapeHtml(a.internalNote)}</p></div>
    <div class="result-block"><h4>Documentos a pedir</h4><ul>${a.documentChecklist.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>
    <div class="result-block"><h4>Advertencia</h4><p>${escapeHtml(a.warnings.join(' '))}</p></div>
    <div class="result-block"><h4>Fuente de referencia</h4><p><a href="${a.sources[0].url}" target="_blank" rel="noreferrer">${escapeHtml(a.sources[0].title)} ↗</a></p></div>`;
  result.querySelector('[data-copy]').addEventListener('click', async e => { await navigator.clipboard.writeText(decodeURIComponent(e.currentTarget.dataset.copy)); e.currentTarget.textContent = 'Copiado ✓'; });
}
form.addEventListener('submit', async e => {
  e.preventDefault(); button.disabled = true; button.innerHTML = 'Generando…';
  try { const res = await fetch('/api/consultations', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ question:document.querySelector('#question').value, regime:document.querySelector('#regime').value, category:document.querySelector('#category').value }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); render(data); } catch (err) { result.classList.remove('empty'); result.innerHTML = `<p class="error">${escapeHtml(err.message)}</p>`; } finally { button.disabled = false; button.innerHTML = 'Generar borrador <span>→</span>'; }
});
waitlist.addEventListener('submit', async e => { e.preventDefault(); const email = document.querySelector('#email').value; try { const res = await fetch('/api/waitlist', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); waitlistMessage.textContent = data.message; waitlist.reset(); } catch (err) { waitlistMessage.textContent = err.message; } });
