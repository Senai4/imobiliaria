export interface CaracteristicasImovel {
  quartos: number;
  tamanho: number;
}

export class Imovel {
total: string | number | undefined;
  constructor(
    public id: string,
    public titulo: string,
    public corretorId: string,
    public tipo: 'Apartamento' | 'Casa' | 'Terreno',
    public cidade: string,
    public preco: number,
    public aluguel: number,
    public descricao: string,
    public endereco: string,
    public imagemUrl: string,
    public caracteristicas: CaracteristicasImovel
  ) {}
}
