import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DossiePDF from './DossiePDF';
import { Dossier } from '../types/dossier.d';
import { Student } from '../types/student.d';
import { Evaluation } from '../types/evaluation.d';

interface ExportDossiesPDFProps {
  dossier: Dossier;
  students: Student[];
  evaluations: Evaluation[];
  disabled?: boolean;
}

const ExportDossiesPDF: React.FC<ExportDossiesPDFProps> = ({
  dossier,
  students,
  evaluations,
  disabled = false
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
    `,
  });

  return (
    <>
      <Button
        onClick={handlePrint}
        variant="contained"
        color="secondary"
        startIcon={<PrintIcon />}
        disabled={disabled}
      >
        Exportar Dossiês em PDF
      </Button>

      <div style={{ display: 'none' }}>
        <div ref={contentRef}>
          {students.map((student) => {
            const studentEvaluation = evaluations.find(
              (ev) => ev.studentId === student.id
            );
            if (!studentEvaluation) return null;

            return (
              <DossiePDF
                key={student.id}
                dossier={dossier}
                student={student}
                evaluation={studentEvaluation}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ExportDossiesPDF; 