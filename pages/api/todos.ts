import type { NextApiRequest, NextApiResponse } from 'next';

interface Task {
  title: string;
}

const tasks: Task[] = [{ title: "Deploy an app" }, { title: "Deploy frontend app" }];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(tasks);
}