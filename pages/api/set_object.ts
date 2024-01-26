import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

// req.body
// image
// objective

const redis = new Redis({
  url: "https://us1-working-coyote-38249.upstash.io",
  token: "AZVpACQgNmRlYTk0YjUtOGRjYS00ZDcxLWI5Y2MtZTQwZGE4OGM5NDNkYjNmN2IxZDVkNGE5NGUxZjgxMjQ2OTg1ZDJhN2I1NjU=",
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {taskId, photoPath, objective, annotations} = req.body;
  try {
    redis.set(
      req.body.taskId,
      JSON.stringify({
        task_id: taskId,
        photo_path: photoPath,
        objective: objective,
        annotations: annotations,
        annotated: true,
      })
    );
    res
      .status(200)
      .json({
        message: `Image ${req.body.taskId}'s annotation added to store`,
      });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
