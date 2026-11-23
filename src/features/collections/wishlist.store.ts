import { create } from "zustand";
import { persist } from "zustand/middleware";
interface WishlistState { keys: string[]; toggle: (key:string)=>void; }
export const useWishlistStore=create<WishlistState>()(persist((set)=>({keys:[],toggle:(key)=>set(s=>({keys:s.keys.includes(key)?s.keys.filter(k=>k!==key):[...s.keys,key]}))}),{name:"card-market-wishlist"}));
