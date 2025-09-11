import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  addToSession<T extends { category: string }>(key: string, newItem: T) {
    const existingData: T[] = JSON.parse(sessionStorage.getItem(key) || '[]');
    const categoryOrderMap: { [key: string]: number } = {};
    let order = 0;
    existingData.forEach(item => {
      if (!categoryOrderMap.hasOwnProperty(item.category)) 
        categoryOrderMap[item.category] = order++;
    });
    if (!categoryOrderMap.hasOwnProperty(newItem.category)) 
      categoryOrderMap[newItem.category] = order++;
    existingData.push(newItem);
    existingData.sort((a, b) => {
      return categoryOrderMap[a.category] - categoryOrderMap[b.category];
    });
    sessionStorage.setItem(key, JSON.stringify(existingData));
  }

  updateSession<T>(key: string, updatedItems: T[]) {
    const existingData: T[] = JSON.parse(sessionStorage.getItem(key) || '[]');
    if (existingData.length > 0)
      sessionStorage.setItem(key, JSON.stringify(updatedItems));
    }
  
  deleteFromSession(index: number) {
    const storedItems = sessionStorage.getItem('question');
    if (storedItems) {
      const itemsArray = JSON.parse(storedItems);
      if (index > -1 && index < itemsArray.length) {
        itemsArray.splice(index, 1);
        sessionStorage.setItem('question', JSON.stringify(itemsArray));
      }
    }
  }
}
