type Criteria = {
  id: number;
  titulo: string;
  descriptionId: string;
};

type Description = {
  id: number;
  title: string;
  criteria: Criteria[];
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
  evaluation_area: string;
  concept: string;
  categories: Category[];
  teacherId: string;
};

type DossierInput = {
  templateData: TemplateDossie;
  categories: Category[];
};

type TemplateDossier = {
  id: number;
  title: string;
  description: string;
  evaluation_area: string;
  concept: string;
};

type Template = {
  id: number;
  titulo: string;
  descricao: string;
  conceito: string;
  areaAvaliacao: string;
};

type DossierListItem = {
  id: number; // ID da associação entre o dossiê e a turma
  classId: number;
  dossierTemplateId: number;
  dossierTemplate: {
    id: number;
    title: string;
    description: string;
    evaluationArea: string;
    concepts: string;
    categories: any[];
    teacherId: number;
  };
};

