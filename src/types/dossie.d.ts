type Descricao = {
    titulo: string;
  };
  
type Categoria = {
    nome: string;
    descricoes: Descricao[];
  };
  
type Dossie = {
    titulo: string;
    descricao: string;
    area_avaliacao: string;
    categorias: Categoria[];
  };