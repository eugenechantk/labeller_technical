// store/serverDataStore.js
export type TaskData = {
  task_id: string;
  photo_path: string;
  objective: string;
  annotations?: any;
  annotated: boolean;
}

let store: TaskData[]= []; // Initial data

export const getStore = () => store;

export const addToStore = (newData:any) => {
  store = [...store, newData];
};

let queue: TaskData[]= []; // Initial data

export const getQueue = () => queue;

export const addToQueue = (newData:any) => {
  queue = [...queue, newData];
};


