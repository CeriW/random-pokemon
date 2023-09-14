import React, { useState, useEffect } from 'react';
import './App.css';
import getRandomPokemon from './getRandomPokemon';
import getHeldItem from './getHeldItem';
import samplePokemon from './sample-pokemon.json';

export type Pokemon = {
  name: string;
  id: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  types: PokemonTypeList;
  stats: PokemonBaseStats;
  held_items: PokemonHeldItem[];
  [key: string]: any;
};

type PokemonBaseStats = { base_stat: number; stat: { name: string } }[];
type PokemonTypeList = { type: { name: string } }[];
export type PokemonHeldItem = { item: { name: string; url: string } };

const HeldItemList = () => {
  return <div></div>;
};

const TypeList: React.FC<{ list: PokemonTypeList }> = ({ list }) => {
  const myList = list.map((item, index) => {
    return (
      <li key={index} className={item.type.name}>
        {item.type.name}
      </li>
    );
  });

  return <div>{myList}</div>;
};

const BaseStatList: React.FC<{ list: PokemonBaseStats }> = ({ list }) => {
  const myList = list.map((item, index) => {
    return (
      <div key={index}>
        <span>{item.stat.name}:</span>
        <span>{item.base_stat}</span>
      </div>
    );
  });

  return <div>{myList}</div>;
};
export default function App() {
  // const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemon, setPokemon] = useState<Pokemon | null>(samplePokemon);
  const [heldItems, setHeldItems] = useState<{ name: string; sprite: string }[]>([]);
  const fetchNewRandomPokemon = async () => {
    try {
      const newPokemon = await getRandomPokemon();
      console.log(newPokemon);
      setPokemon(newPokemon);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateHeldItems = async () => {};

  useEffect(() => {
    if (pokemon) {
      const newHeldItemsPromises = pokemon.held_items.map(async (item) => {
        const itemInfo = await getHeldItem(item.item.url);
        return itemInfo;
      });

      Promise.all(newHeldItemsPromises)
        .then((resolvedHeldItems) => {
          console.log(resolvedHeldItems);
          setHeldItems(resolvedHeldItems);
        })
        .catch((error) => {
          console.error('Error fetching held items:', error);
        });
    }
  }, [pokemon]);

  return (
    <div>
      <button onClick={fetchNewRandomPokemon}>Click me</button>
      {pokemon ? (
        <div>
          <TypeList list={pokemon.types} />
          <BaseStatList list={pokemon.stats} />
          <div className="pokemon-name">{pokemon.name}</div>
          <div className="pokemon-id">#{pokemon.id}</div>
          <div className="pokemon-sprites">
            <img src={pokemon.sprites.other['official-artwork']['front_default']} alt="" />
            <img src={pokemon.sprites.other['official-artwork']['front_shiny']} alt="" />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
