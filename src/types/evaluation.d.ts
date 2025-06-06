export interface Evaluation {
  studentId: number;
  evaluation: {
    criterionId: number;
    concept: string;
  }[];
}
