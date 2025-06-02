import html2pdf from 'html2pdf.js';

/**
 * 
 * @param elementRef - PASSE A REFERENCIA DO HTML PRA PODER EXPORTAR.
 * @param filename - NONME DO ARQUIVO EXPORTADO.
 */
export function exportToPdf(elementRef: React.RefObject<HTMLElement>, filename: string) {
  if (!elementRef.current) return;

  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().set(options).from(elementRef.current).save();
}
