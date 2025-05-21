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

interface Dossier {
    id: number;
    title: string;
    description: string;
    assessmentArea: string;
    concepts: string;
    professorId: number;
}
  
interface DossierListItem {
    id: number;
    title: string;
    description: string;
}
  
 interface DossierListProps {
    dossiers: DossierListItem[];
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onAssociate?: (id: number) => void;

}