type Question = {
  id: number;
  titulo: string;
}

type Description = {
  id: number;
  title: string;
  criteria: Question[];
}

type Category = {
  id: number;
  title: string;
  weight: number;
  descriptions: Descricao[];
}

type Dossier = {
  id: number;
  title: string;
  description: string;
  evaluation_area: string;
  concept: string;
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
