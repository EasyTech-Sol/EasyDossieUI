import * as XLSX from "xlsx";
import Papa from "papaparse";

export const processStudentData = (
  rawData: RawStudent[],
  handleOpenImportModal: () => void,
  setExcelData: React.Dispatch<React.SetStateAction<Student[]>>
) => {
  const jsonData: Student[] = rawData.map((item) => {
    const keys = Object.keys(item);
    let name = "";
    let registration: string | number = "";

    keys.forEach((key) => {
      const normalizedKey = key
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .replace(/[^\w]/g, "");

      if (normalizedKey.includes("nome")) name = String(item[key]);
      if (normalizedKey.includes("matricula")) registration = item[key];
    });

    return { name, registration: String(registration) };
  });

  // Verifica se todos os registros são válidos
  const isValid = jsonData.every(
    (item) =>
      typeof item.name === "string" &&
      item.name.trim() !== "" &&
      (typeof item.registration === "string" ||
        typeof item.registration === "number") &&
      `${item.registration}`.trim() !== ""
  );

  if (!isValid) {
    alert(
      'Formato inválido. Certifique-se de que cada linha contenha "nome" e "matricula".'
    );
    setExcelData([]);
    return;
  }

  setExcelData(jsonData);
  alert("Arquivo carregado com sucesso!");
  handleOpenImportModal();
};

export const detectDelimiter = (csvText: string): string => {
  const firstLine = csvText.split("\n")[0];
  const commaCount = firstLine.split(",").length;
  const semicolonCount = firstLine.split(";").length;
  return commaCount >= semicolonCount ? "," : ";";
};

// Lógica para processar os arquivos CSV ou Excel
export const handleExcelParse = (
  file: File,
  handleOpenImportModal: () => void,
  setExcelData: React.Dispatch<React.SetStateAction<Student[]>>
) => {
  const fileName = file.name.toLowerCase();

  // Se for CSV
  if (fileName.endsWith(".csv")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const delimiter = detectDelimiter(csvText);

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        delimiter,
        complete: (results) => {
          const rawData = results.data as RawStudent[];
          processStudentData(rawData, handleOpenImportModal, setExcelData);
        },
        error: () => {
          alert("Erro ao processar o arquivo CSV.");
        },
      });
    };
    reader.readAsText(file, "utf-8");
    // Se for Excel
  } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    const reader = new FileReader();

    // Quando o arquivo for carregado, processa os dados
    reader.onload = (e) => {
      const data = e.target?.result;
      try {
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json<RawStudent>(worksheet, {
          defval: "",
        });
        processStudentData(rawData, handleOpenImportModal, setExcelData);
      } catch (err) {
        console.error(err);
        alert("Erro ao processar o arquivo Excel.");
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert("Formato de arquivo não suportado.");
  }
};
