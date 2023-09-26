import React, { useState } from 'react';

const DragAndDrop = () => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleMouseMove = (event) => {
    event.preventDefault();
    if (dragging) {
      setPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  return (
    <div
      style={{ width: 200, height: 200, backgroundColor: 'lightgray' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {dragging ? (
        <div
          style={{
            width: 100,
            height: 100,
            backgroundColor: 'blue',
            position: 'absolute',
            left: position.x - 50,
            top: position.y - 50,
          }}
        >
          {/* 自定义DOM内容 */}
        </div>
      ) : null}
    </div>
  );
};

export default DragAndDrop;
