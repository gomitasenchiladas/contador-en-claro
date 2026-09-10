const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
let Pool;
try { ({ Pool } = require('pg')); } catch { Pool = null; }

const root = __dirname;
const publicDir = path.join(root, 'public');
const dataDir = path.join(root, 'data');
const storeFile = path.join(dataDir, 'store.json');
const port = Number(process.env.PORT || 3000);
fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(storeFile)) fs.writeFileSync(storeFile, JSON.stringify({ consultations: [], waitlist: [] }, null, 2));
let db = null;

function readStore() { try { return JSON.parse(fs.readFileSync(storeFile, 'utf8')); } catch { return { consultations: [], waitlist: [] }; } }
function writeStore(value) { fs.writeFileSync(storeFile, JSON.stringify(value, null, 2)); }
async function initDb() {
  if (!process.env.DATABASE_URL) return;
  if (!Pool) throw new Error('DATABASE_URL está configurada pero falta la dependencia pg');
  db = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL !== 'false' ? { rejectUnauthorized: false } : undefined });
  await db.query(`CREATE TABLE IF NOT EXISTS consultations (id text PRIMARY KEY, question text NOT NULL, category text, regime text, answer jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()); CREATE TABLE IF NOT EXISTS waitlist (email text PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now());`);
}
async function listConsultations() {
  if (db) { const { rows } = await db.query('SELECT id, question, category, regime, answer, created_at AS "createdAt" FROM consultations ORDER BY created_at DESC LIMIT 20'); return rows; }
  return readStore().consultations.slice(-20).reverse();
}
async function saveConsultation(item) {
  if (db) { await db.query('INSERT INTO consultations (id, question, category, regime, answer, created_at) VALUES ($1,$2,$3,$4,$5,$6)', [item.id, item.question, item.category, item.regime, item.answer, item.createdAt]); return; }
  const store = readStore(); store.consultations.push(item); writeStore(store);
}
async function saveWaitlist(email) {
  if (db) { await db.query('INSERT INTO waitlist (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email]); return; }
  const store = readStore(); if (!store.waitlist.some(x => x.email === email)) store.waitlist.push({ email, createdAt: new Date().toISOString() }); writeStore(store);
}
function json(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)); }
function body(req) { return new Promise((resolve, reject) => { let raw = ''; req.on('data', c => { raw += c; if (raw.length > 200000) req.destroy(); }); req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('JSON inválido')); } }); req.on('error', reject); }); }
function clean(value, max = 3000) { return String(value || '').trim().slice(0, max); }

function generateDemoAnswer(input) {
  const question = clean(input.question);
  const category = clean(input.category, 40) || 'general';
  const regime = clean(input.regime, 80) || 'No especificado';
  const highRisk = /multa|auditor|devoluci|embargo|demanda|fraude|e\.firma|contraseñ|cálculo|calculo|cuánto|cuanto/i.test(question);
  const risk = highRisk ? 'alto' : (regime === 'No especificado' ? 'medio' : 'bajo');
  const needs = regime === 'No especificado' ? ['Constancia de Situación Fiscal', 'Fecha de la operación', 'CFDI o comprobante relacionado'] : ['CFDI o comprobante relacionado', 'Fecha de la operación'];
  const topic = category === 'facturacion' ? 'la factura y la operación relacionada' : category === 'declaraciones' ? 'la obligación declarativa correspondiente' : 'la situación fiscal que comentas';
  const warning = risk === 'alto'
    ? 'La consulta puede tener consecuencias fiscales. No envíes una conclusión definitiva sin revisar el expediente y la fuente normativa aplicable.'
    : 'Revisa los datos del cliente y la fuente oficial antes de enviar la respuesta.';
  return {
    riskLevel: risk,
    requiresHumanReview: true,
    clientMessage: `Hola. Para revisar correctamente ${topic}, necesito validar algunos datos de tu caso. Por favor compárteme ${needs.join(' y ')}. Con esa información te confirmaré el siguiente paso. Esta revisión debe hacerse con base en tu situación particular.`,
    internalNote: `Régimen indicado: ${regime}. Categoría: ${category}. ${warning}`,
    documentChecklist: needs,
    warnings: [warning, 'No solicitar ni compartir contraseñas, e.firma, certificados digitales o datos bancarios.'],
    sources: [{ title: 'Portal oficial del SAT: Declaración Anual de Personas', url: 'https://www.gob.mx/sat/articulos/declaracion-anual-2025-de-personas' }],
    generatedAt: new Date().toISOString(),
    demo: true
  };
}

function parseModelJson(text) {
  const cleaned = String(text || '').replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const first = cleaned.indexOf('{'); const last = cleaned.lastIndexOf('}');
  return JSON.parse(first >= 0 && last >= first ? cleaned.slice(first, last + 1) : cleaned);
}

async function generateAnswer(input) {
  const demo = generateDemoAnswer(input);
  if (!process.env.AI_API_KEY) return demo;
  const endpoint = process.env.AI_BASE_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.AI_MODEL || 'gpt-4o-mini';
  const system = `Eres un asistente de apoyo para contadores mexicanos. Devuelve únicamente JSON válido con estas claves: clientMessage (string), internalNote (string), documentChecklist (array de strings), warnings (array de strings), riskLevel (bajo|medio|alto), requiresHumanReview (boolean). Usa sólo la fuente entregada como referencia; no inventes leyes, tasas, fechas ni obligaciones. Si faltan datos, pide verificarlos. Nunca pidas contraseñas, e.firma, certificados ni datos bancarios. No presentes declaraciones ni des conclusiones definitivas.`;
  const user = `Pregunta: ${clean(input.question)}\nRégimen: ${clean(input.regime, 80) || 'No especificado'}\nCategoría: ${clean(input.category, 40) || 'general'}\nFuente: Portal oficial del SAT, https://www.gob.mx/sat/articulos/declaracion-anual-2025-de-personas`;
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.AI_API_KEY}` }, body: JSON.stringify({ model, temperature: 0.1, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }) });
    if (!response.ok) throw new Error(`Proveedor IA respondió ${response.status}`);
    const payload = await response.json();
    const ai = parseModelJson(payload.choices?.[0]?.message?.content);
    return { ...demo, ...ai, demo: false, model };
  } catch (error) {
    return { ...demo, warnings: [`No se pudo consultar el proveedor de IA (${error.message}). Se muestra un borrador de contingencia que requiere revisión.`, ...demo.warnings], aiFallback: true };
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { ok: true, app: 'contador-en-claro' });
    if (req.method === 'GET' && url.pathname === '/api/consultations') return json(res, 200, { consultations: await listConsultations() });
    if (req.method === 'POST' && url.pathname === '/api/consultations') {
      const input = await body(req);
      if (clean(input.question).length < 8) return json(res, 400, { error: 'Escribe una consulta de al menos 8 caracteres.' });
      const answer = await generateAnswer(input);
      const item = { id: crypto.randomUUID(), question: clean(input.question), category: clean(input.category, 40), regime: clean(input.regime, 80), answer, createdAt: new Date().toISOString() };
      await saveConsultation(item);
      return json(res, 201, item);
    }
    if (req.method === 'POST' && url.pathname === '/api/waitlist') {
      const input = await body(req); const email = clean(input.email, 160).toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) return json(res, 400, { error: 'Introduce un correo válido.' });
      await saveWaitlist(email);
      return json(res, 201, { ok: true, message: 'Te agregamos a la lista de acceso anticipado.' });
    }
    if (req.method === 'GET') {
      const file = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
      const filePath = path.resolve(publicDir, file);
      if (!filePath.startsWith(path.resolve(publicDir)) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return json(res, 404, { error: 'No encontrado' });
      const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
      res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' }); return fs.createReadStream(filePath).pipe(res);
    }
    return json(res, 404, { error: 'No encontrado' });
  } catch (error) { return json(res, 500, { error: error.message || 'Error interno' }); }
});
initDb().then(() => server.listen(port, () => console.log(`Contador en Claro listo en http://localhost:${port}`))).catch(error => { console.error(error); process.exit(1); });
