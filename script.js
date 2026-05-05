// Konfigurasi Editor menggunakan CodeMirror
const editorConfig = {
    theme: "monokai",
    lineNumbers: true,
    lineWrapping: true,
    autoCloseTags: true,
    autoCloseBrackets: true
};

// Inisialisasi Editor HTML, CSS, JS
const htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlCode"), {
    ...editorConfig, mode: "xml"
});
const cssEditor = CodeMirror.fromTextArea(document.getElementById("cssCode"), {
    ...editorConfig, mode: "css"
});
const jsEditor = CodeMirror.fromTextArea(document.getElementById("jsCode"), {
    ...editorConfig, mode: "javascript"
});

// Sistem Tab Mobile-Friendly
function switchTab(tabName) {
    document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`${tabName}-container`).classList.add('active');
    event.currentTarget.classList.add('active');

    // Refresh CodeMirror agar ukuran menyesuaikan
    setTimeout(() => {
        if(tabName === 'html') htmlEditor.refresh();
        if(tabName === 'css') cssEditor.refresh();
        if(tabName === 'js') jsEditor.refresh();
    }, 10);
}

// Fitur Penyimpanan (Local Storage)
function saveCode() {
    localStorage.setItem('ghos_html', htmlEditor.getValue());
    localStorage.setItem('ghos_css', cssEditor.getValue());
    localStorage.setItem('ghos_js', jsEditor.getValue());
    
    const currentLang = localStorage.getItem('ghos_lang') || 'id';
    alert(currentLang === 'id' ? 'Kode berhasil disimpan ke memori!' : 'Code saved to memory!');
}

function loadCode() {
    htmlEditor.setValue(localStorage.getItem('ghos_html') || "\n<div class=\"box\">Hello GHOS~VG</div>");
    cssEditor.setValue(localStorage.getItem('ghos_css') || "/* Tulis CSS disini */\n.box {\n  color: #00f0ff;\n  text-align: center;\n  margin-top: 50px;\n  font-family: sans-serif;\n  font-size: 24px;\n}");
    jsEditor.setValue(localStorage.getItem('ghos_js') || "// Tulis JS disini\nconsole.log('GHOS~VG Berjalan Mulus');");
}

// Fitur Hapus Semua Code
function clearAll() {
    const currentLang = localStorage.getItem('ghos_lang') || 'id';
    const msg = currentLang === 'id' ? 'Yakin hapus semua kode?' : 'Are you sure to clear all code?';
    
    if(confirm(msg)) {
        htmlEditor.setValue("");
        cssEditor.setValue("");
        jsEditor.setValue("");
    }
}

// Fitur Run Code (Buka Fullscreen dan Render)
function runCode() {
    const html = htmlEditor.getValue();
    const css = `<style>${cssEditor.getValue()}</style>`;
    const js = `<script>${jsEditor.getValue()}<\/script>`;
    
    const outputFrame = document.getElementById('outputFrame');
    const documentFrame = outputFrame.contentDocument || outputFrame.contentWindow.document;
    
    // Buka Layar Penuh
    document.getElementById('outputScreen').classList.add('show');
    
    // Render Kode
    documentFrame.open();
    documentFrame.write(html + css + js);
    documentFrame.close();
}

// Fitur Tutup Output (Kembali ke Editor)
function closeOutput() {
    document.getElementById('outputScreen').classList.remove('show');
}

// Fitur 2 Bahasa (Indonesia & Inggris)
let isEnglish = false;

function toggleLanguage() {
    isEnglish = !isEnglish;
    localStorage.setItem('ghos_lang', isEnglish ? 'en' : 'id');
    updateLanguageUI();
}

function updateLanguageUI() {
    const lang = isEnglish ? 'en' : 'id';
    document.querySelectorAll('span[data-id]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
}

// Event Listeners Utama
document.getElementById('saveBtn').addEventListener('click', saveCode);
document.getElementById('clearBtn').addEventListener('click', clearAll);
document.getElementById('runBtn').addEventListener('click', runCode);
document.getElementById('backBtn').addEventListener('click', closeOutput);
document.getElementById('langToggle').addEventListener('click', toggleLanguage);

// Inisialisasi Saat Halaman Dimuat
window.onload = () => {
    loadCode(); 
    
    const savedLang = localStorage.getItem('ghos_lang');
    if(savedLang === 'en') {
        isEnglish = true;
        updateLanguageUI();
    }
    
    setTimeout(() => {
        htmlEditor.refresh();
    }, 200);
};
