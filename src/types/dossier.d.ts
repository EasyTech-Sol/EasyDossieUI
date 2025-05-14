export interface Dossier {
    id: number;
    title: string;
    description: string;
    assessmentArea: string;
    concepts: string;
    professorId: number;
}
  
export interface DossierListItem {
    id: number;
    title: string;
    description: string;
}
  
export interface DossierListProps {
    dossiers: DossierListItem[];
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    onAssociate?: (id: number) => void;
}