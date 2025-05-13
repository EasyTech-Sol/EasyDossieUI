type Quesito = {
  id: number;
  titulo: string;
}

type Descricao = {
  id: number;
  titulo: string;
  quesitos: Quesito[];
}

type Categoria = {
  id: number;
  titulo: string;
  peso: number;
  descricoes: Descricao[];
}

type Dossie = {
  id: number;
  titulo: string;
  descricao: string;
  area_avaliacao: string;
  conceitos: string[];
  categorias: Categoria[];
}