import { TaskData, addToQueue, getQueue, getStore } from "@/store";
import type { NextApiRequest, NextApiResponse } from "next";
import { Redis } from "@upstash/redis";

// req.body
// image
// objective

const redis = new Redis({
  url: "https://us1-working-coyote-38249.upstash.io",
  token: "AZVpACQgNmRlYTk0YjUtOGRjYS00ZDcxLWI5Y2MtZTQwZGE4OGM5NDNkYjNmN2IxZDVkNGE5NGUxZjgxMjQ2OTg1ZDJhN2I1NjU=",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // check if the image requested has been labelled
  // if yes -> return the annotations in store

  if (!req.body) {
    return res.status(400).send("No data in request body");
  }

  const { image, objective } = req.body;

  const foundStore: TaskData | null = await redis.get(image);
  if (foundStore) {
    if (foundStore.objective === objective && foundStore.annotated) {
      res.status(200).json({ annotations: foundStore.annotations });
    } else {
      res.status(200).json({ message: `image ${image} not annotated yet` });
    }
  } else {
    try {
      await redis.set(
        image,
        JSON.stringify({
          task_id: image,
          photo_path: `/images/${image}`,
          objective: objective,
          annotated: false,
        })
      );
      res.status(200).json({ message: "image added to queue" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
}
