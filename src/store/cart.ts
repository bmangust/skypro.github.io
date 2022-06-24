import { makeAutoObservable } from "mobx";
import type { Item } from "./catalog";

interface CartItemProps {
  item: Item;
}
export class CartItem {
  item: Item;
  quantity: number;
  private limits = { min: 1, max: 10 };
  constructor({ item }: CartItemProps) {
    this.item = item;
    this.quantity = 1;
    makeAutoObservable(this);
  }

  private checkLimits = (quantity: number) => {
    if (quantity > this.limits.max) {
      throw new Error("Достигнуто максимальное количество");
    } else if (quantity < this.limits.min) {
      throw new Error("Достигнуто минимальное количество");
    }
  };

  update = (quantity: number) => {
    this.checkLimits(quantity);
    this.quantity = quantity;
  };

  addOne = () => {
    this.checkLimits(this.quantity + 1);
    this.quantity += 1;
  };
}

class Cart {
  _items: { [key: number]: CartItem };
  error?: string;
  constructor() {
    this._items = {};
    makeAutoObservable(this);
  }

  get items() {
    return this._items;
  }

  add = (item: Item) => {
    try {
      this._items[item.id]
        ? this._items[item.id].addOne()
        : (this._items[item.id] = new CartItem({ item }));
    } catch (e: any) {
      console.log(e.message);
      this.error = e.toString();
    }
  };

  updateItem = (item: Item, quantity: number) => {
    if (this._items[item.id]) {
      try {
        this._items[item.id].update(quantity);
        delete this.error;
      } catch (e: any) {
        console.log(e.message);
        this.error = e.toString();
      }
    }
  };

  deleteItem = (item: Item) => {
    if (this._items[item.id]) {
      delete this._items[item.id];
    }
  };

  clearCart = () => {
    this._items = [];
  };
}

export const cart = new Cart();