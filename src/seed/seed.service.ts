import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
@Injectable()
export class SeedService {
  private baseURL = 'https://pokeapi.co/api/v2/pokemon?limit=1000';

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly httpService: HttpService
  ) { }
  async executeSeed() {
    await this.pokemonModel.deleteMany({});//delete * from pokemon
    const { data } = await this.httpService.axiosRef.get<PokeResponse>(this.baseURL);
    const pokemonToInsert: { name: string, nro: number }[] = [];
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const nro = +segments[segments.length - 2];
      pokemonToInsert.push({ name, nro });
    })
    this.pokemonModel.insertMany(pokemonToInsert);
    return 'SEED EXECUTE';
  }
}
