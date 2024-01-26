import { Inter } from "next/font/google";
import AnnotationWorkbench from "./components/AnnotationWorkbench";
import { useEffect, useState } from "react";
import { TaskData, getQueue } from "@/store";
import { Redis } from "@upstash/redis";

const inter = Inter({ subsets: ["latin"] });

const redis = new Redis({
  url: "https://us1-working-coyote-38249.upstash.io",
  token:
    "AZVpACQgNmRlYTk0YjUtOGRjYS00ZDcxLWI5Y2MtZTQwZGE4OGM5NDNkYjNmN2IxZDVkNGE5NGUxZjgxMjQ2OTg1ZDJhN2I1NjU=",
});

export default function Home() {
  const [activeTask, setActiveTask] = useState<TaskData | null>(null);
  const [queue, setQueue] = useState<TaskData[]>([]);

  useEffect(() => {
    let queue: TaskData[] = [];
    const fetchQueue = async () => {
      let cursor = 0;

      do {
        const reply = await redis.scan(cursor);
        cursor = reply[0];
        const keys = reply[1];

        for (let key of keys) {
          const value: TaskData | null = await redis.get(key);
          if (value && !value.annotated) {
            queue.push(value);
          }
        }
      } while (cursor !== 0);
      setQueue(queue);
    };
    fetchQueue();
  });

  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col w-1/4 bg-gray-300 gap-2">
        <h2 className="font-medium text-2xl">Task Queue</h2>
        {queue.map((task, idx) => (
          <div
            key={idx}
            className={`bg-white border-b border-gray-200 flex flex-col gap-1 p-2 hover:bg-gray-100 cursor-pointer ${
              task === activeTask && "bg-indigo-300 hover:bg-indigo-300"
            }`}
            onClick={() => setActiveTask(task)}
          >
            <h4 className="font-medium text-xl">{task.objective}</h4>
            <p>{task.task_id}</p>
          </div>
        ))}
      </div>
      <div className="w-3/4">
        {queue.length > 0 && activeTask && <AnnotationWorkbench taskData={activeTask} />}
      </div>
    </div>
  );
}
