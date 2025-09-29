export interface CaracteristicasImovel {
  quartos: number;
  banheiros: number;
  tamanho: number;
  vagas: number;
  mobilia: string;
  pet: string;
}

export class Imovel {
[x: string]: any;
total: string | number | undefined;
public interesseId?: string | number; 
  constructor(
    public id: number,
    public titulo: string,
    public corretorId: string,
    public tipoImovel: string,
    public cidade: string,
    public preco: number,
    public aluguel: number,
    public descricao: string,
    public endereco: string,
    public imagemUrl: string,
    public condominio: string,
    public iptu: string,
    public seguroincendio: string,
    public taxaservico: string,
    public caracteristicas: CaracteristicasImovel
  ) {}
}
