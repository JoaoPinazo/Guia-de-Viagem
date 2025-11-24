export interface Review {
  autor: string;
  nota: number;
  comentario: string;
}

export interface Tour {
  nome: string;
  descricao: string;
  horario_funcionamento: string;
  imagem_query: string;
  endereco: string;
  destaques: string[];
  preco_ingresso: string;
  avaliacoes: Review[];
}

export interface MenuItem {
  nome: string;
  preco: string;
}

export interface Restaurant {
    nome: string;
    descricao: string;
    tipo_cozinha: string;
    faixa_preco: string;
    imagem_query: string;
    endereco: string;
    cardapio: MenuItem[];
    avaliacoes: Review[];
}

export interface Party {
  nome: string;
  descricao: string;
  data_evento: string;
  endereco: string;
  imagem_query: string;
  atracoes: string[];
  preco_ingresso: string;
  avaliacoes: Review[];
}

export interface Camping {
  nome: string;
  descricao: string;
  endereco: string;
  imagem_query: string;
  infraestrutura: string[];
  preco_diaria: string;
  avaliacoes: Review[];
}

export interface Trail {
  nome: string;
  descricao: string;
  ponto_partida: string;
  distancia: string;
  dificuldade: string;
  imagem_query: string;
  custo_acesso: string;
  avaliacoes: Review[];
}

export interface Sport {
  nome: string;
  descricao: string;
  local: string;
  nivel: string;
  imagem_query: string;
  equipamentos: string[];
  preco_aula: string;
  avaliacoes: Review[];
}

export type GuideItem = Tour | Restaurant | Party | Camping | Trail | Sport;
export type ItemType = 'tour' | 'restaurant' | 'party' | 'camping' | 'trail' | 'sport';
export type FavoriteItem = GuideItem & { itemType: ItemType };