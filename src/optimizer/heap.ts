export class Heap<T extends HeapItem<T>> {
  private items: T[] = [];
  private currentItemCount: number = 0;

  constructor(maxHeapSize: number) {
    this.items = new Array(maxHeapSize);
  }

  add(item: T): void {
    item.heapIndex = this.currentItemCount;
    this.items[this.currentItemCount] = item;
    this.sortUp(item);
    this.currentItemCount++;
  }

  removeFirst(): T {
    if (this.currentItemCount === 0) {
      throw new Error("Cannot remove from an empty heap.");
    }

    const firstItem: T = this.items[0];
    this.currentItemCount--;

    if (this.currentItemCount > 0) {
      this.items[0] = this.items[this.currentItemCount];
      this.items[0].heapIndex = 0;
      this.sortDown(this.items[0]);
    }
    
    return firstItem;
  }

  updateItem(item: T): void {
    this.sortUp(item);
  }

  count(): number {
    return this.currentItemCount;
  }

  contains(item: T): boolean {
    return this.items[item.heapIndex] === item;
  }

  sortDown(item: T): void {
    while (true) {
      const childIndexLeft: number = item.heapIndex * 2 + 1;
      const childIndexRight: number = item.heapIndex * 2 + 2;
      let swapIndex: number = 0;

      if (childIndexLeft < this.currentItemCount) {
        swapIndex = childIndexLeft;

        if (childIndexRight < this.currentItemCount) {
          if (
            this.items[childIndexLeft].compareTo(this.items[childIndexRight]) <
            0
          ) {
            swapIndex = childIndexRight;
          }
        }

        if (item.compareTo(this.items[swapIndex]) < 0) {
          this.swap(item, this.items[swapIndex]);
        } else {
          return;
        }
      } else {
        return;
      }
    }
  }

  sortUp(item: T): void {
    while (item.heapIndex > 0) {
      const parentIndex = Math.floor((item.heapIndex - 1) / 2);
      const parentItem: T = this.items[parentIndex];

      if (item.compareTo(parentItem) > 0) {
        this.swap(item, parentItem);
      } else {
        break;
      }
    }
  }

  swap(itemA: T, itemB: T): void {
    this.items[itemA.heapIndex] = itemB;
    this.items[itemB.heapIndex] = itemA;
    const itemAIndex: number = itemA.heapIndex;
    itemA.heapIndex = itemB.heapIndex;
    itemB.heapIndex = itemAIndex;
  }
}

export type HeapItem<T> = {
  heapIndex: number;
  compareTo: (other: T) => number;
};
