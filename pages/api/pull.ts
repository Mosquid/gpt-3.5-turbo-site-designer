import { get } from "@/services/redis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ts } = req.body;
  const content = await get(ts.toString());

  res.status(200).json({ content });
}
