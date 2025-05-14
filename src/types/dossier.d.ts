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
  
type DossierListItem = {
    id: number;
    title: string;
    description: string;
}
  
type DossierListProps = {
    dossiers: DossierListItem[];
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onAssociate?: (id: number) => void;

}