'use client';

import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import { TaskData } from '@/store';

const BoundingBoxDrawer = dynamic(() => import('./Canvas'), {
  ssr: false,
});

export default function AnnotationWorkbench({taskData}: {taskData: TaskData}) {
  const [annotations, setAnnotations] = useState([]);

  const handleSubmit = async () => {
    try{
      const res = await fetch('/api/set_object', {
        method: 'POST',
        body: JSON.stringify({
          taskId: taskData.task_id,
          photoPath: taskData.photo_path,
          objective: taskData.objective,
          annotations: annotations,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(res => res.json())
      console.log(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='relative'>
      <BoundingBoxDrawer imageUrl={taskData.photo_path} annotations={annotations} setAnnotations={setAnnotations}/>
      <button className='absolute z-50 bottom-6 right-6 rounded-md border-gray-600 border shadow-lg px-4 py-2 hover:bg-gray-200' onClick={handleSubmit}>Submit annotations</button>
    </div>
  );
}
