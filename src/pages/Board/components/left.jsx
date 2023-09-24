import React, { useState } from 'react';
import { draftEvent } from "@/utils";

const DragComponent = () => {
  const [isDragging, setIsDragging] = useState(false);


  const handleDragStart = (type, e) => {
    setIsDragging(true);
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    draftEvent(e, "type", type);
    // e.stopPropagation();

};
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={(e)=>handleDragStart('area_chart',e)}
      onDragEnd={handleDragEnd}
      style={{ width:'30px',opacity: isDragging ? 1 : 0.5 }}
      onDragOver={(e) => {
        e.preventDefault();
    }}
    >
      Drag me!
    </div>
  );
};

export default DragComponent;