import React from "react";

const Friday = () => {
  class Node {
    constructor(item) {
      this.value = item;
      this.next = null;
    }
  }

  class LinkedList {
    constructor() {
      this.head = null;
    }

    countNodes() {
      if (!this.head) return 0;
      let currentNode = this.head;
      let count = 1;
      while (currentNode.next) {
        currentNode = currentNode.next;
        count += 1;
      }
      return count;
    }

    append(item) {
      const node = new Node(item);
      if (!this.head) {
        this.head = node;
        return;
      }
      let currentNode = this.head;
      while (currentNode.next) {
        currentNode = currentNode.next;
      }
      currentNode.next = node;
    }

    prepend(item) {
      const node = new Node(item);
      node.next = this.head;
      this.head = node;
    }

    get(index) {
      if (index === 0) {
        return this.head.value;
      }
      let currentNode = this.head;
      let count = 0;
      while (currentNode.next) {
        if (count === index) {
          return currentNode.value;
        }
        currentNode = currentNode.next;
        count += 1;
      }
    }

    insertAt(item, index) {
      const node = new Node(item);
      let currentNode = this.head;
      let count = 0;
      while (currentNode.next) {
        if (count === index - 1) {
          node.next = currentNode.next;
          currentNode.next = node;
          return;
        }
        currentNode = currentNode.next;
        count += 1;
      }
    }

    removeAt(index) {
      let currentNode = this.head;
      let previousNode;
      let count = 0;
      while (currentNode.next) {
        if (count === index) {
          previousNode.next = currentNode.next;
          return;
        }
        previousNode = currentNode;
        currentNode = currentNode.next;
        count += 1;
      }
    }
  }

  const list = new LinkedList();
  list.append(1);
  list.append(2);
  list.append(3);
  list.removeAt(1);
  console.log(list); // 3

  return <div>Friday</div>;
};

export default Friday;
