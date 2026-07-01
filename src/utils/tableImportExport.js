export const parseDelimitedText = (text) => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const delimiter = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(delimiter).map((header) => normalizeHeader(header));

  return lines.slice(1).map((line) => {
    const values = line.split(delimiter).map((value) => value.trim());
    return headers.reduce((row, header, index) => {
      row[header] = values[index] || '';
      return row;
    }, {});
  });
};

const normalizeHeader = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, '');

export const readImportFile = (file) => new Promise((resolve, reject) => {
  if (!file) {
    resolve([]);
    return;
  }

  const extension = file.name.split('.').pop().toLowerCase();
  if (extension === 'pdf') {
    resolve({ type: 'pdf', name: file.name, rows: [] });
    return;
  }

  if (!['csv', 'txt', 'tsv', 'xls'].includes(extension)) {
    reject(new Error('Importez un fichier CSV, TSV, XLS simple ou saisissez les lignes manuellement.'));
    return;
  }

  const reader = new FileReader();
  reader.onload = () => resolve({ type: extension, name: file.name, rows: parseDelimitedText(String(reader.result || '')) });
  reader.onerror = () => reject(new Error('Impossible de lire le fichier importe.'));
  reader.readAsText(file);
});

export const downloadTextFile = (fileName, content, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportExcelTable = (fileName, title, rows) => {
  const headers = Object.keys(rows[0] || {});
  const html = `
    <html>
      <head><meta charset="utf-8" /></head>
      <body>
        <h1>${title}</h1>
        <table border="1">
          <thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${headers.map((header) => `<td>${row[header] ?? ''}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  downloadTextFile(fileName, html, 'application/vnd.ms-excel;charset=utf-8');
};

export const printPdfReport = ({ title, learnerLabel, code, formation, period, rows, total }) => {
  const win = window.open('', '_blank', 'width=1100,height=800');
  if (!win) throw new Error('Autorisez les popups pour exporter le PDF.');

  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1f2937; padding: 28px; }
          h1 { font-size: 22px; margin: 0 0 16px; }
          .meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 24px; margin-bottom: 18px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; vertical-align: top; }
          th { background: #f1f5f9; }
          .footer { display: flex; justify-content: space-between; margin-top: 36px; font-size: 13px; }
          .signature { width: 260px; height: 80px; border-top: 1px solid #475569; padding-top: 8px; }
          @media print { button { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <button onclick="window.print()">Imprimer / Enregistrer en PDF</button>
        <h1>${title}</h1>
        <div class="meta">
          <div><strong>Apprenant :</strong> ${learnerLabel}</div>
          <div><strong>Code :</strong> ${code}</div>
          <div><strong>Formation :</strong> ${formation}</div>
          <div><strong>Periode :</strong> ${period}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Jour</th><th>Type</th><th>Heure debut</th><th>Heure fin</th><th>Duree</th><th>Statut</th><th>Commentaire</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                <td>${row.date}</td>
                <td>${row.day}</td>
                <td>${row.type}</td>
                <td>${row.startTime || row.morningLogin || '-'}</td>
                <td>${row.endTime || row.afternoonLogout || '-'}</td>
                <td>${row.duration}</td>
                <td>${row.status}</td>
                <td>${row.content || row.comment || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <strong>Total heures de connexion : ${total}</strong>
          <div class="signature">Signature responsable / cachet</div>
        </div>
      </body>
    </html>
  `);
  win.document.close();
};
