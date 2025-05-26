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

type Dossier = {
  id: number;
  title: string;
  description: string;
  evaluationArea: string;
  concepts: string;
  categories: Category[];
  teacherId: string;
};

type DossierInput = {
  templateData: TemplateDossie;
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
