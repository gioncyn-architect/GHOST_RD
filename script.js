// ============================================================
// GHOS~RD EDITOR — script.js (Fixed & Complete)
// ============================================================

// ===== KONFIGURASI CODEMIRROR =====
const editorConfig = {
    theme: "monokai",
    lineNumbers: true,
    lineWrapping: true,
    autoCloseTags: true,
    autoCloseBrackets: true
};

const htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlCode"), {
    ...editorConfig, mode: "xml"
});
const cssEditor = CodeMirror.fromTextArea(document.getElementById("cssCode"), {
    ...editorConfig, mode: "css"
});
const jsEditor = CodeMirror.fromTextArea(document.getElementById("jsCode"), {
    ...editorConfig, mode: "javascript"
});

// ===== SISTEM TAB =====
function switchTab(tabName) {
    document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`${tabName}-container`).classList.add('active');
    event.currentTarget.classList.add('active');

    setTimeout(() => {
        if (tabName === 'html') htmlEditor.refresh();
        if (tabName === 'css') cssEditor.refresh();
        if (tabName === 'js') jsEditor.refresh();
        if (tabName === 'files') renderFileManager();
    }, 10);
}

// ===== SIMPAN & MUAT KODE =====
function saveCode() {
    localStorage.setItem('ghos_html', htmlEditor.getValue());
    localStorage.setItem('ghos_css', cssEditor.getValue());
    localStorage.setItem('ghos_js', jsEditor.getValue());

    const lang = localStorage.getItem('ghos_lang') || 'id';
    alert(lang === 'id' ? 'Kode berhasil disimpan!' : 'Code saved successfully!');
}

function loadCode() {
    htmlEditor.setValue(
        localStorage.getItem('ghos_html') ||
        '<div class="box">Hello GHOS~RD</div>'
    );
    cssEditor.setValue(
        localStorage.getItem('ghos_css') ||
        '/* Tulis CSS disini */\n.box {\n  color: #00f0ff;\n  text-align: center;\n  margin-top: 50px;\n  font-family: sans-serif;\n  font-size: 24px;\n}'
    );
    jsEditor.setValue(
        localStorage.getItem('ghos_js') ||
        "// Tulis JS disini\nconsole.log('GHOS~RD Berjalan Mulus');"
    );
}

// ===== HAPUS SEMUA KODE =====
function clearAll() {
    const lang = localStorage.getItem('ghos_lang') || 'id';
    const msg = lang === 'id' ? 'Yakin hapus semua kode?' : 'Are you sure to clear all code?';

    if (confirm(msg)) {
        htmlEditor.setValue('');
        cssEditor.setValue('');
        jsEditor.setValue('');
    }
}

// ===== RUN CODE =====
function runCode() {
    const html = htmlEditor.getValue();
    const css = `<style>${cssEditor.getValue()}</style>`;
    const js = `<script>${jsEditor.getValue()}<\/script>`;

    const outputScreen = document.getElementById('outputScreen');
    const outputFrame = document.getElementById('outputFrame');
    const doc = outputFrame.contentDocument || outputFrame.contentWindow.document;

    // FIX: Hapus 'hidden', pakai class 'show'
    outputScreen.classList.remove('hidden');
    outputScreen.classList.add('show');

    doc.open();
    doc.write(html + css + js);
    doc.close();
}

// ===== TUTUP OUTPUT =====
function closeOutput() {
    const outputScreen = document.getElementById('outputScreen');
    outputScreen.classList.remove('show');
    // Beri delay sebelum hidden agar animasi selesai
    setTimeout(() => outputScreen.classList.add('hidden'), 400);
}

// ===== BAHASA (ID / EN) =====
let isEnglish = false;

function toggleLanguage() {
    document.getElementById('langModal').style.display = 'flex';
}
function closeLangModal() {
    document.getElementById('langModal').style.display = 'none';
}
function updateLanguageUI() {
    const lang = isEnglish ? 'en' : 'id';

    // Update semua span dengan data-id
    document.querySelectorAll('span[data-id]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });

    // Update tombol ID/EN
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.textContent = isEnglish ? 'ID / EN' : 'ID / EN';

    // Update judul modal simpan
    const saveTitle = document.querySelector('#saveModal p');
    if (saveTitle) saveTitle.textContent = isEnglish ? '💾 SAVE FILE' : '💾 SIMPAN FILE';

    const folderInput = document.getElementById('modalFolderName');
    if (folderInput) folderInput.placeholder = isEnglish ? 'Project folder name...' : 'Nama folder proyek...';

    const saveBtn = document.querySelector('#saveModal button');
    if (saveBtn) saveBtn.textContent = isEnglish ? '✅ Save' : '✅ Simpan';

    // Update label checkbox
    const labels = document.querySelectorAll('#saveModal label');
    // label tidak perlu diubah karena sudah pakai emoji
}
    });
    // Update juga output title jika ada attribute
    document.querySelectorAll('[data-id]').forEach(el => {
        if (el.tagName !== 'SPAN') {
            el.textContent = el.getAttribute(`data-${lang}`);
        }
    });
}

// ===== TEMA TERANG / GELAP =====
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('ghos_theme', isLight ? 'light' : 'dark');

    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = isLight ? '☀️' : '🌙';
}

function loadTheme() {
    const saved = localStorage.getItem('ghos_theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
        const btn = document.getElementById('themeToggle');
        if (btn) btn.textContent = '☀️';
    }
}

// ===== CO-PILOT PANEL =====
function openCopilot() {
    document.getElementById('copilotPanel').classList.add('open');
    document.getElementById('copilotOverlay').classList.add('open');
}

function closeCopilot() {
    document.getElementById('copilotPanel').classList.remove('open');
    document.getElementById('copilotOverlay').classList.remove('open');
}

// Simpan & Muat API Key per provider
function saveApiKey() {
    const provider = document.getElementById('aiProvider').value;
    const key = document.getElementById('apiKeyInput').value.trim();

    if (!provider) {
        addChatBubble('system', '⚠️ Pilih provider AI terlebih dahulu.');
        return;
    }
    if (!key) {
        addChatBubble('system', '⚠️ API Key tidak boleh kosong.');
        return;
    }

    localStorage.setItem(`ghos_key_${provider}`, key);
    addChatBubble('system', `✅ API Key untuk ${provider} berhasil disimpan.`);
}

function loadApiKeyForProvider() {
    const provider = document.getElementById('aiProvider').value;
    const saved = localStorage.getItem(`ghos_key_${provider}`);
    document.getElementById('apiKeyInput').value = saved || '';
}

// Toggle visibilitas API key
function toggleKeyVisibility() {
    const input = document.getElementById('apiKeyInput');
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Tambah bubble chat ke panel
function addChatBubble(type, text) {
    const chat = document.getElementById('copilotChat');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`;
    bubble.textContent = text;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
    return bubble;
}

// Ambil semua kode aktif sebagai konteks
function getCurrentCode() {
    return `=== HTML ===\n${htmlEditor.getValue()}\n\n=== CSS ===\n${cssEditor.getValue()}\n\n=== JS ===\n${jsEditor.getValue()}`;
}

// Kirim prompt ke AI
async function sendToCopilot(prompt) {
    const provider = document.getElementById('aiProvider').value;
    const apiKey = localStorage.getItem(`ghos_key_${provider}`);

    if (!provider) {
        addChatBubble('error', '⚠️ Pilih provider AI terlebih dahulu.');
        return;
    }
    if (!apiKey) {
        addChatBubble('error', '⚠️ API Key belum disimpan untuk provider ini.');
        return;
    }
    if (!prompt.trim()) {
        addChatBubble('error', '⚠️ Prompt tidak boleh kosong.');
        return;
    }

    addChatBubble('user', prompt);

    const thinkingBubble = addChatBubble('ai', '⏳ Sedang berpikir...');

    try {
        let responseText = '';

        if (provider === 'openai') {
            responseText = await callOpenAI(apiKey, prompt);
        } else if (provider === 'claude') {
            responseText = await callClaude(apiKey, prompt);
        } else if (provider === 'gemini') {
            responseText = await callGemini(apiKey, prompt);
        } else if (provider === 'mistral') {
            responseText = await callMistral(apiKey, prompt);
        } else if (provider === 'groq') {
            responseText = await callGroq(apiKey, prompt);
        }

        thinkingBubble.textContent = responseText;

    } catch (err) {
        thinkingBubble.className = 'chat-bubble error';
        thinkingBubble.textContent = `❌ Error: ${err.message}`;
    }
}

// ===== FUNGSI PEMANGGIL API =====

async function callOpenAI(apiKey, prompt) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Kamu adalah asisten ahli HTML, CSS, dan JavaScript. Bantu user memperbaiki atau membuat kode.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 1500
        })
    });
    if (!res.ok) throw new Error(`OpenAI: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.choices[0].message.content;
}

async function callClaude(apiKey, prompt) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1500,
            messages: [
                { role: 'user', content: prompt }
            ]
        })
    });
    if (!res.ok) throw new Error(`Claude: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.content[0].text;
}

async function callGemini(apiKey, prompt) {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );
    if (!res.ok) throw new Error(`Gemini: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
}

async function callMistral(apiKey, prompt) {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'mistral-small-latest',
            messages: [
                { role: 'system', content: 'Kamu adalah asisten ahli web development. Bantu user dengan HTML, CSS, dan JavaScript.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 1500
        })
    });
    if (!res.ok) throw new Error(`Mistral: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.choices[0].message.content;
}

async function callGroq(apiKey, prompt) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
                { role: 'system', content: 'Kamu adalah asisten ahli web development. Bantu user dengan HTML, CSS, dan JavaScript.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 1500
        })
    });
    if (!res.ok) throw new Error(`Groq: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.choices[0].message.content;
}

// ===== ANALISIS CODE =====
function analyzeCode() {
    const code = getCurrentCode();
    const prompt = `Tolong analisis kode berikut dan beri saran perbaikan:\n\n${code}`;
    sendToCopilot(prompt);
}

// ===== EVENT LISTENERS =====
document.getElementById('saveBtn').addEventListener('click', saveCode);
document.getElementById('saveFileBtn').addEventListener('click', openSaveFileModal);
document.getElementById('clearBtn').addEventListener('click', clearAll);
document.getElementById('runBtn').addEventListener('click', runCode);
document.getElementById('backBtn').addEventListener('click', closeOutput);
document.getElementById('langToggle').addEventListener('click', toggleLanguage);
document.getElementById('copilotBtn').addEventListener('click', openCopilot);
document.getElementById('closeCopilot').addEventListener('click', closeCopilot);
document.getElementById('copilotOverlay').addEventListener('click', closeCopilot);
document.getElementById('saveApiKey').addEventListener('click', saveApiKey);
document.getElementById('toggleKey').addEventListener('click', toggleKeyVisibility);
document.getElementById('aiProvider').addEventListener('change', loadApiKeyForProvider);

document.getElementById('analyzeBtn').addEventListener('click', analyzeCode);

document.getElementById('sendCopilot').addEventListener('click', () => {
    const prompt = document.getElementById('copilotPrompt').value.trim();
    const code = getCurrentCode();
    const fullPrompt = `Berikut kode saya:\n\n${code}\n\n${prompt}`;
    sendToCopilot(fullPrompt);
    document.getElementById('copilotPrompt').value = '';
});

// Kirim dengan Ctrl+Enter
document.getElementById('copilotPrompt').addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        document.getElementById('sendCopilot').click();
    }
});

// Theme toggle (jika tombol ada di HTML)
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

// ===== INISIALISASI =====
window.onload = () => {
    loadCode();
    loadTheme();

    const savedLang = localStorage.getItem('ghos_lang');
    if (savedLang === 'en') {
        isEnglish = true;
        updateLanguageUI();
    }

    // Pastikan output screen tersembunyi dengan benar
    const outputScreen = document.getElementById('outputScreen');
    outputScreen.classList.add('hidden');
    outputScreen.classList.remove('show');

    setTimeout(() => {
        htmlEditor.refresh();
        cssEditor.refresh();
        jsEditor.refresh();
    }, 200);
};
// ===== FILE MANAGER =====
let fileDB = JSON.parse(localStorage.getItem('ghos_files') || '{}');

function saveFileDB() {
    localStorage.setItem('ghos_files', JSON.stringify(fileDB));
}

function openSaveFileModal() {
    const folderName = prompt('Nama folder proyek:');
    if (!folderName) return;

    const pilihan = confirm(
        'OK = Simpan semua (HTML+CSS+JS)\nCancel = Pilih file tertentu'
    );

    if (pilihan) {
        if (!fileDB[folderName]) fileDB[folderName] = {};
        fileDB[folderName].html = htmlEditor.getValue();
        fileDB[folderName].css = cssEditor.getValue();
        fileDB[folderName].js = jsEditor.getValue();
        saveFileDB();
        alert('Semua file tersimpan di folder: ' + folderName);
    } else {
        const tipe = prompt('Simpan file apa? ketik: html / css / js');
        if (!tipe) return;
        if (!fileDB[folderName]) fileDB[folderName] = {};
        if (tipe === 'html') fileDB[folderName].html = htmlEditor.getValue();
        if (tipe === 'css') fileDB[folderName].css = cssEditor.getValue();
        if (tipe === 'js') fileDB[folderName].js = jsEditor.getValue();
        saveFileDB();
        alert(`File ${tipe} tersimpan di folder: ${folderName}`);
    }
}

function renderFileManager() {
    const ui = document.getElementById('fileManagerUI');
    if (!ui) return;
    fileDB = JSON.parse(localStorage.getItem('ghos_files') || '{}');
    const folders = Object.keys(fileDB);
    const lang = localStorage.getItem('ghos_lang') || 'id';

    const t = {
        noFile:       lang==='en' ? 'No saved files. Click 💾 File to save.' : 'Belum ada file tersimpan. Klik 💾 File untuk menyimpan.',
        edit:         lang==='en' ? '✏️ Edit'          : '✏️ Edit',
        downloadAll:  lang==='en' ? '⬇️ Download All'  : '⬇️ Download Semua',
        deleteFolder: lang==='en' ? '🗑 Delete Folder' : '🗑 Hapus Folder',
    };

    if (folders.length === 0) {
        ui.innerHTML = `<p style="color:#888;padding:20px;">${t.noFile}</p>`;
        return;
    }

    ui.innerHTML = folders.map(folder => `
        <div style="margin-bottom:16px;border:1px solid rgba(0,240,255,0.2);border-radius:8px;padding:12px;">
            <div style="color:#00f0ff;font-size:1rem;margin-bottom:8px;">📁 ${folder}</div>
            ${Object.keys(fileDB[folder]).map(type => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <span style="color:#e0e0e0;">${type==='html'?'🌐':type==='css'?'🎨':'⚙️'} ${folder}.${type}</span>
                    <div style="display:flex;gap:6px;">
                        <button onclick="editFile('${folder}','${type}')" style="background:rgba(0,240,255,0.1);color:#00f0ff;border:1px solid rgba(0,240,255,0.3);padding:4px 8px;border-radius:4px;cursor:pointer;font-size:0.75rem;">${t.edit}</button>
                        <button onclick="downloadFile('${folder}','${type}')" style="background:rgba(252,238,10,0.1);color:#fcee0a;border:1px solid rgba(252,238,10,0.3);padding:4px 8px;border-radius:4px;cursor:pointer;font-size:0.75rem;">⬇️</button>
                        <button onclick="deleteFile('${folder}','${type}')" style="background:rgba(255,0,60,0.1);color:#ff003c;border:1px solid rgba(255,0,60,0.3);padding:4px 8px;border-radius:4px;cursor:pointer;font-size:0.75rem;">🗑</button>
                    </div>
                </div>
            `).join('')}
            <div style="margin-top:8px;display:flex;gap:6px;">
                <button onclick="downloadFolder('${folder}')" style="background:rgba(180,0,255,0.1);color:#b400ff;border:1px solid rgba(180,0,255,0.3);padding:6px 10px;border-radius:4px;cursor:pointer;font-size:0.78rem;flex:1;">${t.downloadAll}</button>
                <button onclick="deleteFolder('${folder}')" style="background:rgba(255,0,60,0.1);color:#ff003c;border:1px solid rgba(255,0,60,0.3);padding:6px 10px;border-radius:4px;cursor:pointer;font-size:0.78rem;">${t.deleteFolder}</button>
            </div>
        </div>
    `).join('');
}

function editFile(folder, type) {
    const code = fileDB[folder][type];
    if (type === 'html') { htmlEditor.setValue(code); switchTabDirect('html'); }
    if (type === 'css') { cssEditor.setValue(code); switchTabDirect('css'); }
    if (type === 'js') { jsEditor.setValue(code); switchTabDirect('js'); }
}

function switchTabDirect(tabName) {
    document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tabName}-container`).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(tabName)) btn.classList.add('active');
    });
    setTimeout(() => {
        if (tabName === 'html') htmlEditor.refresh();
        if (tabName === 'css') cssEditor.refresh();
        if (tabName === 'js') jsEditor.refresh();
    }, 10);
}

function downloadFile(folder, type) {
    const code = fileDB[folder][type];
    const ext = type === 'js' ? 'js' : type;
    const blob = new Blob([code], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${folder}.${ext}`;
    a.click();
}

function downloadFolder(folder) {
    const files = fileDB[folder];
    Object.keys(files).forEach(type => {
        setTimeout(() => downloadFile(folder, type), 300);
    });
}

function deleteFile(folder, type) {
    if (!confirm(`Hapus file ${type} dari folder ${folder}?`)) return;
    delete fileDB[folder][type];
    if (Object.keys(fileDB[folder]).length === 0) delete fileDB[folder];
    saveFileDB();
    renderFileManager();
}

function deleteFolder(folder) {
    if (!confirm(`Hapus seluruh folder ${folder}?`)) return;
    delete fileDB[folder];
    saveFileDB();
    renderFileManager();
}
