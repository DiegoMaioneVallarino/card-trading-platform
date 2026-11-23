import { cards } from "../cards/card.data";
import type { CardCategory } from "../cards/card.types";
import type { CollectionItem } from "./collection.store";
import type { CardListing } from "../listings/listing.types";

export type ExplorerCard = { key: string; name: string; collection: string; category: CardCategory; image: string; rarity: string; price: number; cardId?: string };
export type ExplorerSet = { id: string; name: string; category: CardCategory; cards: ExplorerCard[]; owned: number; total: number };
export const cardKey = (category: string, collection: string, name: string) => [category, collection, name].map(s => s.trim().toLocaleLowerCase()).join("::");
export const setKey = (category: string, collection: string) => `${category}::${collection.trim().toLocaleLowerCase()}`;
export function buildExplorer(owned: CollectionItem[], listings: CardListing[]): ExplorerSet[] {
 const catalog = new Map<string, ExplorerCard>();
 for (const c of cards) catalog.set(cardKey(c.category,c.collection,c.name), {key:cardKey(c.category,c.collection,c.name),name:c.name,collection:c.collection,category:c.category,image:c.image,rarity:c.rarity,price:c.price,cardId:c.id});
 for (const l of listings) { const key=cardKey(l.category,l.collection,l.name); if(!catalog.has(key)) catalog.set(key,{key,name:l.name,collection:l.collection,category:l.category,image:l.image,rarity:l.rarity,price:l.price,cardId:l.cardId}); }
 for (const o of owned) { const key=cardKey(o.category,o.collection,o.name); if(!catalog.has(key)) catalog.set(key,{key,name:o.name,collection:o.collection,category:o.category,image:o.image,rarity:"Unspecified",price:o.estimatedValue,cardId:o.cardId}); }
 const groups=new Map<string,ExplorerSet>();
 for(const c of catalog.values()) { const id=setKey(c.category,c.collection); if(!groups.has(id)) groups.set(id,{id,name:c.collection,category:c.category,cards:[],owned:0,total:0}); groups.get(id)!.cards.push(c); }
 const ownedKeys=new Set(owned.filter(o=>o.quantity>0).map(o=>cardKey(o.category,o.collection,o.name)));
 for(const group of groups.values()){ group.cards.sort((a,b)=>a.name.localeCompare(b.name));group.total=group.cards.length;group.owned=group.cards.filter(c=>ownedKeys.has(c.key)).length; }
 return [...groups.values()].sort((a,b)=>a.category.localeCompare(b.category)||a.name.localeCompare(b.name));
}
