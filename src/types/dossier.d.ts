type Quesito = {
  id: number;
  titulo: string;
}

type Descricao = {
  id: number;
  title: string;
  quesitos: Quesito[];
}

type Categoria = {
  id: number;
  title: string;
  weight: number;
  descricoes: Descricao[];
}

type Dossie = {
  id: number;
  title: string;
  description: string;
  evaluation_area: string;
  concepts: string[];
  categories: Categoria[];
}

type DossierInput = {
  templateData: TemplateDossie;
  categories: Category[];
};

type TemplateDossie = {
  id: number;
  title: string;
  description: string;
  evaluation_area: string;
  concept: string;
}