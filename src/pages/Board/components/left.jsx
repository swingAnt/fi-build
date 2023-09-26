import React, { useState } from 'react';
import { draftEvent } from "@/utils";

const DragComponent = () => {
  const [isDragging, setIsDragging] = useState(false);


  const handleDragStart = (key,type, e) => {
    setIsDragging(true);
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    // draftEvent(e, "type", type);
    // const dragDom=document.querySelector(`.${type}`)
    //   console.log('dragDomdragDomdragDom',dragDom)  
    //   console.log('offsetWidth',dragDom.offsetWidth)
    //   console.log('offsetHeight',dragDom.offsetHeight)
    //   console.log('offsetTop',dragDom.offsetTop)
    //   console.log('offsetLeft',dragDom.offsetLeft)
      //后续替换成图/** 等组合，根据key区分大类
    //   draftEvent(e, "dragData", {key:'chart',type,lt:Math.floor(dragDom.offsetWidth/2),tp:dragDom.offsetHeight/2});
    draftEvent(e, "dragData", {key,type,lt:0,tp:0});

};
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (<>
    <div
      draggable
      onDragStart={(e)=>handleDragStart('chart','area_chart',e)}
      onDragEnd={handleDragEnd}
      style={{ width:'30px',opacity: isDragging ? 1 : 0.5 }}
      onDragOver={(e) => {
        e.preventDefault();
    }}
    >
     图
    </div>
    <div
      draggable
      onDragStart={(e)=>handleDragStart('row','area_chart',e)}
      onDragEnd={handleDragEnd}
      style={{ width:'30px',opacity: isDragging ? 1 : 0.5 }}
      onDragOver={(e) => {
        e.preventDefault();
    }}
    >
     行
    </div>
    </>
  );
};

export default DragComponent;