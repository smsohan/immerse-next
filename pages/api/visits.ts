import { Visit } from '@/app/models/visit';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const visits = await Visit.incr();
  res.status(200).json({visits: visits});
}