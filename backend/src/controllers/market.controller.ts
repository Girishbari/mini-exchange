import { Request, Response } from "express";

interface Balances {
  [key: string]: number;
}

interface User {
  id: string;
  balances: Balances;
}

interface Order {
  userId: string;
  price: number;
  quantity: number;
}

const TICKER = "GOOGLE";

const users: User[] = [
  {
    id: "1",
    balances: {
      GOOGLE: 10,
      USD: 50000,
    },
  },
  {
    id: "2",
    balances: {
      GOOGLE: 10,
      USD: 50000,
    },
  },
];

const bids: Order[] = [];
const asks: Order[] = [];

function flipBalance(
  userId1: string,
  userId2: string,
  quantity: number,
  price: number
) {
  const user1 = users.find((x) => x.id === userId1);
  const user2 = users.find((x) => x.id === userId2);
  if (!user1 || !user2) {
    return;
  }
  user1.balances[TICKER] -= quantity;
  user2.balances[TICKER] += quantity;
  user1.balances["USD"] += quantity * price;
  user2.balances["USD"] -= quantity * price;
}

function computeQuote(side: string, quantity: number, userId: string) {
  let quote = 0;
  let curQuantity = quantity;
  if (side === "bid") {
    for (let i = asks.length - 1; i >= 0; i--) {
      if (asks[i].userId !== userId) {
        console.log(asks[i].quantity, curQuantity);
        if (asks[i].quantity >= curQuantity) {
          quote += curQuantity * asks[i].price;
          curQuantity = 0;
          break;
        } else {
          quote += asks[i].quantity * asks[i].price;
          curQuantity -= asks[i].quantity;
        }
      }
    }
  } else if (side === "ask") {
    for (let i = 0; i < bids.length; i++) {
      if (bids[i].userId !== userId) {
        if (bids[i].quantity >= curQuantity) {
          quote += curQuantity * bids[i].price;
          curQuantity = 0;
          break;
        } else {
          quote += bids[i].quantity * bids[i].price;
          curQuantity -= bids[i].quantity;
        }
      }
    }
  }
  return quote;
}

function fillOrders(
  side: string,
  price: number,
  quantity: number,
  userId: string
): number {
  let remainingQuantity = quantity;
  if (side === "bid") {
    for (let i = asks.length - 1; i >= 0; i--) {
      if (asks[i].price > price) {
        continue;
      }
      if (asks[i].quantity > remainingQuantity) {
        asks[i].quantity -= remainingQuantity;
        flipBalance(asks[i].userId, userId, remainingQuantity, asks[i].price);
        return 0;
      } else {
        remainingQuantity -= asks[i].quantity;
        flipBalance(asks[i].userId, userId, asks[i].quantity, asks[i].price);
        asks.pop();
      }
    }
  } else {
    for (let i = bids.length - 1; i >= 0; i--) {
      if (bids[i].price < price) {
        continue;
      }
      if (bids[i].quantity > remainingQuantity) {
        bids[i].quantity -= remainingQuantity;
        flipBalance(userId, bids[i].userId, remainingQuantity, price);
        return 0;
      } else {
        remainingQuantity -= bids[i].quantity;
        flipBalance(userId, bids[i].userId, bids[i].quantity, price);
        bids.pop();
      }
    }
  }

  return remainingQuantity;
}

export const createOrder = (req: Request, res: Response) => {
  const side: string = req.body.side;
  const price: number = req.body.price;
  const quantity: number = req.body.quantity;
  const userId: string = req.body.userId;

  const remainingQty = fillOrders(side, price, quantity, userId);

  if (remainingQty === 0) {
    res.json({ filledQuantity: quantity });
    return;
  }

  if (side === "bid") {
    bids.push({
      userId,
      price,
      quantity: remainingQty,
    });
    bids.sort((a, b) => (a.price < b.price ? -1 : 1));
  } else {
    asks.push({
      userId,
      price,
      quantity: remainingQty,
    });
    asks.sort((a, b) => (a.price < b.price ? 1 : -1));
  }

  res.json({
    filledQuantity: quantity - remainingQty,
  });
};

export const getUserBalance = (req: Request, res: Response) => {
  const userId = req.params.userId;
  const user = users.find((x) => x.id === userId);
  if (!user) {
    res.json({
      USD: 0,
      [TICKER]: 0,
    });
    return;
  }
  res.json({ balances: user.balances });
};

export const quote = (req: Request, res: Response) => {
  const side: string = req.body.side as string;
  const quantity: number = req.body.quantity as number;
  const userId: string = req.body.userId;
  res.json({
    quote: computeQuote(side, quantity, userId),
  });
};

export const depth = (req: Request, res: Response) => {
  const depthAgg: {
    [price: string]: {
      type: "bid" | "ask";
      quantity: number;
    };
  } = {};

  for (let i = 0; i < bids.length; i++) {
    if (!depthAgg[bids[i].price]) {
      depthAgg[bids[i].price] = {
        quantity: bids[i].quantity,
        type: "bid",
      };
    } else {
      depthAgg[bids[i].price].quantity += bids[i].quantity;
    }
  }

  for (let i = 0; i < asks.length; i++) {
    if (!depthAgg[asks[i].price]) {
      depthAgg[asks[i].price] = {
        quantity: asks[i].quantity,
        type: "ask",
      };
    } else {
      depthAgg[asks[i].price].quantity += asks[i].quantity;
    }
  }

  res.json({
    depth: depthAgg,
  });
};
