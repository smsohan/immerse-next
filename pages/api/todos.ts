import type { NextApiRequest, NextApiResponse } from 'next';

const todos: Todo[] = [
  { title: "Complete task 1", id: 1 },
  { title: "Grocery shopping", id: 2 },
  { title: "Write a blog article", id: 3 },
  { title: "Attend online meeting", id: 4 },
  { title: "Plan weekend trip", id: 5 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(todos);
}