type Criterion = {
  id: number;
  title: string;
  descriptionId: string;
};

type Description = {
  id: number;
  title: string;
  criteria: Criterion[];
  categoryId: string;
};

type Category = {
  id: number;
  title: string;
  weight: number;
  descriptions: Descricao[];
  dossierTemplateId: string;
};

type Concept = "A,B,C" | "A,B,C,D" | "A,B,C,D,E"

type Dossier = {
  id: number;
  title: string;
  description: string;
  evaluationArea: string;
  concepts: Concept;
  categories: Category[];
  teacherId: string;
};

type DossierInput = {
  templateData: TemplateDossie;
};

type TemplateDossier = {
  id: number;
  title: string;
  description: string;
  evaluation_area: string;
  concept: string;
};

type DossierListItem = {
  id: number;
  title: string;
  description: string;
  evaluationArea: string;
  concepts: string;
  categories: any[];
  teacherId: number;
};
