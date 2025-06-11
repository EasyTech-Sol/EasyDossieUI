type EvaluatedConcept = {
  criterionId: number;
  concept: string;
};

type Evaluation = {
  studentId: number;
  studentName: string;
  evaluation: EvaluatedConcept[];
  grade: number;
};
