import * as XLSX from "xlsx";
import Papa, { PapaParseError } from "papaparse"; 

interface Student {
  name: string;
  registration: string;
}

interface RawStudent {
  [key: string]: any;
}

type ShowMessageFn = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;

export const processStudentData = (
  rawData: RawStudent[],
  handleOpenImportModal: () => void,
  setExcelData: React.Dispatch<React.SetStateAction<Student[]>>,
  showMessage: ShowMessageFn
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

  const isValid = jsonData.every(
    (item) =>
      typeof item.name === "string" &&
      item.name.trim() !== "" &&
      (typeof item.registration === "string" ||
        typeof item.registration === "number") &&
      `${item.registration}`.trim() !== ""
  );

  if (!isValid) {
    showMessage( 
      'Formato inválido. Certifique-se de que cada linha contenha "nome" e "matricula".',
      'error'
    );
    setExcelData([]);
    return;
  }

  setExcelData(jsonData);
  showMessage("Arquivo validado e pronto para importação!", 'success'); 
  handleOpenImportModal();
};

export const detectDelimiter = (csvText: string): string => {
  const firstLine = csvText.split("\n")[0];
  const commaCount = firstLine.split(",").length;
  const semicolonCount = firstLine.split(";").length;
  return commaCount >= semicolonCount ? "," : ";";
};

export const handleExcelParse = (
  file: File,
  handleOpenImportModal: () => void,
  setExcelData: React.Dispatch<React.SetStateAction<Student[]>>,
  showMessage: ShowMessageFn 
) => {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".csv")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      if (!csvText) {
        showMessage("Não foi possível ler o conteúdo do arquivo CSV.", "error");
        return;
      }
      const delimiter = detectDelimiter(csvText);

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        delimiter,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("Erros de parse do CSV:", results.errors);
            const firstErrorMessage = results.errors[0]?.message || "Erro desconhecido ao fazer o parse do CSV.";
            showMessage(`Erro ao fazer o parse do CSV: ${firstErrorMessage}`, "error");
            return;
          }
          const rawData = results.data as RawStudent[];
          processStudentData(rawData, handleOpenImportModal, setExcelData, showMessage);
        },
        error: (papaparseError: PapaParseError) => {
          console.error("Erro no Papa.parse:", papaparseError);
          showMessage(papaparseError.message || "Erro ao processar o arquivo CSV.", "error");
        },
      });
    };
    reader.onerror = () => { 
        showMessage("Erro ao tentar ler o arquivo CSV.", "error");
    };
    reader.readAsText(file, "utf-8");
  } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) { 
        showMessage("Não foi possível ler o conteúdo do arquivo Excel.", "error");
        return;
      }
      try {
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json<RawStudent>(worksheet, {
          defval: "",
        });
        processStudentData(rawData, handleOpenImportModal, setExcelData, showMessage);
      } catch (err: any) {
        console.error("Erro no processamento do Excel:", err);
        showMessage(err.message || "Erro ao processar o arquivo Excel.", "error"); 
      }
    };
    reader.onerror = () => { 
        showMessage("Erro ao tentar ler o arquivo Excel.", "error");
    };
    reader.readAsArrayBuffer(file);
  } else {
    showMessage("Formato de arquivo não suportado. Use .csv, .xlsx ou .xls.", "warning");
  }
};