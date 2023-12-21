import type { NextApiRequest, NextApiResponse } from 'next';
import {register} from "prom-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Content-Type", register.contentType);
    res.setHeader("Cache-Control", 'no-store');
    res.status(200).send(await register.metrics())
}