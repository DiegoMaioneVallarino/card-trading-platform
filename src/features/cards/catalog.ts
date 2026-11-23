import type { CardCategory } from './card.types';
import { cards } from './card.data';

export type CatalogSet = { id:string; name:string; category:CardCategory; releaseYear?:number; totalCards?:number; description:string };
export type CatalogEntry = { id:string; setId:string; name:string; number:string; rarity:string; image:string; language:string; variant:string; referencePriceMXN:number; source:'demo'; legacyCardId?:string };
export const catalogSets:CatalogSet[] = [
 {id:'pokemon-base-set',name:'Base Set',category:'pokemon',releaseYear:1999,description:'Classic first-generation Pokémon cards.'},
 {id:'pokemon-celebrations',name:'Celebrations',category:'pokemon',releaseYear:2021,description:'Anniversary collection.'},
 {id:'yugioh-lob',name:'Legend of Blue Eyes',category:'yugioh',releaseYear:2002,description:'Early Yu-Gi-Oh! booster collection.'},
 {id:'magic-alpha',name:'Alpha',category:'magic',releaseYear:1993,description:'Original Magic release.'},
];
// Demo reference records: identifiers, numbering and prices are illustrative, not a verified official checklist.
export const catalogEntries:CatalogEntry[] = [
 {id:'pokemon-base-charizard-demo',setId:'pokemon-base-set',name:'Charizard',number:'4/102',rarity:'Holo Rare',image:'/images/charizard.png',language:'English',variant:'Standard',referencePriceMXN:4500,source:'demo',legacyCardId:'1'},
 {id:'pokemon-celebrations-pikachu-demo',setId:'pokemon-celebrations',name:'Pikachu',number:'Demo',rarity:'Ultra Rare',image:'/images/pikachu.png',language:'English',variant:'Standard',referencePriceMXN:890,source:'demo',legacyCardId:'4'},
 {id:'yugioh-lob-blueeyes-demo',setId:'yugioh-lob',name:'Blue-Eyes White Dragon',number:'LOB-001',rarity:'Ultra Rare',image:'/images/blue-eyes.png',language:'English',variant:'Standard',referencePriceMXN:3200,source:'demo',legacyCardId:'2'},
 {id:'magic-alpha-blacklotus-demo',setId:'magic-alpha',name:'Black Lotus',number:'Demo',rarity:'Rare',image:'/images/black-lotus.png',language:'English',variant:'Standard',referencePriceMXN:125000,source:'demo',legacyCardId:'3'},
];
export const catalogSetFor = (entry:CatalogEntry) => catalogSets.find(s=>s.id===entry.setId);
export const catalogById = (id:string) => catalogEntries.find(c=>c.id===id);
export const legacyCardFor = (entry:CatalogEntry) => cards.find(c=>c.id===entry.legacyCardId);
export const categoryName:Record<CardCategory,string> = {pokemon:'Pokémon',yugioh:'Yu-Gi-Oh!',magic:'Magic: The Gathering',sports:'Sports'};
