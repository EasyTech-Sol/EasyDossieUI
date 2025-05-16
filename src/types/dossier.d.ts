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

type Dossier = {
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

type TemplateDossier = {
  id: number;
  title: string;
  description: string;
  evaluation_area: string;
  concept: string;
}

type Template = {
  id: number;
  titulo: string;
  descricao: string;
  conceito: string;
  areaAvaliacao: string;
}

  
type DossierListItem = {
    id: number;
    titulo: string;
    descricao: string;
}
