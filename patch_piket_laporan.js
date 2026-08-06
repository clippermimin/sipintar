const fs = require('fs');
let code = fs.readFileSync('/Users/agung5s7/Desktop/SIPINTAR/js/pages/piket-laporan.js', 'utf8');

// 1. Add let editId
code = code.replace("let blockCounter = 0;", "let blockCounter = 0;\n  let editId = null;\n  let editLaporan = null;");

// 2. Add Prefill Logic to render()
const renderLogic = `const { data: guruData } = await window.supabase.from('profiles').select('*').eq('role', 'guru').order('nama');
    allGuru = guruData || [];

    const urlParams = new URLSearchParams(window.location.search);
    editId = urlParams.get('id');
    let prefillCatatan = '';
    let prefillP2 = '';
    let prefillP1 = guru.id;
    let prefillSesi = 'Pagi';

    if (editId) {
      try {
        editLaporan = await window.APP_DATA.getLaporanPiketById(editId);
        prefillSesi = editLaporan.sesi || 'Pagi';
        prefillP1 = editLaporan.guru_id;
        const petugasMatch = (editLaporan.catatan || '').match(/^\\[(.*?)\\]\\s*/);
        if (petugasMatch) {
          const namesStr = petugasMatch[1]; 
          const p2Match = namesStr.match(/Petugas 2: (.*?)$/);
          if (p2Match) {
             const guru2 = allGuru.find(g => g.nama === p2Match[1]);
             if (guru2) prefillP2 = guru2.id;
          }
          prefillCatatan = editLaporan.catatan.substring(petugasMatch[0].length);
        } else {
          prefillCatatan = editLaporan.catatan || '';
        }
      } catch (e) {
        console.error("Gagal load edit", e);
        window.Components.toast("Gagal memuat data laporan", "error");
      }
    }

    window.Components.hideLoading();`;

code = code.replace(/const \{ data: guruData \} = await window\.supabase[^]+?window\.Components\.hideLoading\(\);/, renderLogic);

// 3. Update HTML Strings
code = code.replace('<h1 class="ios-nav-title">Laporan Piket</h1>', '<h1 class="ios-nav-title">${editId ? "Edit Laporan" : "Laporan Piket"}</h1>');

code = code.replace('<input type="radio" name="sesi" id="sesi-pagi" value="Pagi" checked>', '<input type="radio" name="sesi" id="sesi-pagi" value="Pagi" ${prefillSesi === "Pagi" ? "checked" : ""}>');
code = code.replace('<input type="radio" name="sesi" id="sesi-siang" value="Siang">', '<input type="radio" name="sesi" id="sesi-siang" value="Siang" ${prefillSesi === "Siang" ? "checked" : ""}>');

code = code.replace('<textarea id="catatan" class="ios-input" rows="4" placeholder="Tulis catatan kejadian, kondisi, atau hal penting lainnya..." required></textarea>', '<textarea id="catatan" class="ios-input" rows="4" placeholder="Tulis catatan kejadian, kondisi, atau hal penting lainnya..." required>${prefillCatatan}</textarea>');

code = code.replace(/Simpan Laporan\s*<\/button>/g, '${editId ? "Perbarui" : "Simpan"} Laporan\n            </button>');

// 4. Modify logic after render
const afterRenderOld = `// Auto set Petugas 1 to current user
    if (guru.id) {
      setTimeout(() => {
        const p1 = document.getElementById('petugas-1');
        if (p1) p1.value = guru.id;
      }, 100);
    }
    
    setTimeout(() => {
      bindEvents();
      addKelasBlock(); // Add first block by default
    }, 200);`;

const afterRenderNew = `
    setTimeout(() => {
      if (editId && editLaporan) {
        document.getElementById('petugas-1').value = prefillP1 || '';
        if (prefillP2) document.getElementById('petugas-2').value = prefillP2;
      } else if (guru.id) {
        document.getElementById('petugas-1').value = guru.id;
      }
    }, 100);
    
    setTimeout(() => {
      bindEvents();
      if (editId && editLaporan && editLaporan.absensi_piket && editLaporan.absensi_piket.length > 0) {
        const grouped = {};
        editLaporan.absensi_piket.forEach(a => {
          if (!a.siswa) return;
          const kId = a.siswa.kelas_id;
          if (!grouped[kId]) grouped[kId] = [];
          grouped[kId].push(a);
        });
        Object.keys(grouped).forEach(kId => {
          const blockId = addKelasBlock(kId);
          setTimeout(() => {
             const list = document.getElementById(\`siswa-list-\${blockId}\`);
             if (list) {
                grouped[kId].forEach(a => {
                   const cb = list.querySelector(\`.absen-checkbox[data-id="\${a.siswa_id}"]\`);
                   if (cb) {
                      cb.checked = true;
                      const idx = cb.getAttribute('data-idx');
                      const sel = document.getElementById(\`status-\${blockId}-\${idx}\`);
                      if (sel) sel.value = a.status;
                   }
                });
             }
          }, 800);
        });
      } else {
        addKelasBlock();
      }
    }, 200);`;

code = code.replace(afterRenderOld, afterRenderNew);

// 5. Update addKelasBlock
code = code.replace('function addKelasBlock() {', 'function addKelasBlock(prefillKelasId = null) {');
code = code.replace("document.getElementById('kelas-blocks-container').insertAdjacentHTML('beforeend', blockHtml);", `document.getElementById('kelas-blocks-container').insertAdjacentHTML('beforeend', blockHtml);
    if (prefillKelasId) {
       const sel = document.querySelector(\`#\${blockId} .select-kelas-dinamis\`);
       if (sel) {
          sel.value = prefillKelasId;
          sel.dispatchEvent(new Event('change'));
       }
    }
    return blockId;`);

// 6. Update bindEvents submit
const submitOld = `await window.APP_DATA.submitLaporanPiket(data);
        window.Components.toast('Laporan berhasil disimpan!', 'success');`;
const submitNew = `if (editId) {
          await window.APP_DATA.updateLaporanPiket(editId, data);
          window.Components.toast('Laporan berhasil diperbarui!', 'success');
        } else {
          await window.APP_DATA.submitLaporanPiket(data);
          window.Components.toast('Laporan berhasil disimpan!', 'success');
        }`;
code = code.replace(submitOld, submitNew);

fs.writeFileSync('/Users/agung5s7/Desktop/SIPINTAR/js/pages/piket-laporan.js', code);
console.log('piket-laporan.js patched successfully');
