import React, { useState } from 'react';
import { draftEvent } from "@/utils";

const DragComponent = () => {
  const [isDragging, setIsDragging] = useState(false);

  const map=[{
    name:'pie',
    type:'chart',
    title:"饼图",
    width:200,
    height:200,
  },{
    name:'bar',
    type:'chart',
    title:"柱状体",
    width:200,
    height:200,
  },{
    name:'radar',
    type:'chart',
    title:"雷达图",
    width:200,
    height:200,
  },{
    name:'sunburst',
    type:'chart',
    title:"旭日图",
    width:200,
    height:200,
  },{
    name:'line',
    type:'chart',
    title:"折线图",
    width:200,
    height:200,
  },{
    name:'input',
    type:'antd',
    title:"输入框",
    width:100,
    height:30,
  },{
    name:'rangePicker',
    type:'antd',
    title:"时间框",
    width:100,
    height:30,
  },{
    name:'select',
    type:'antd',
    title:"下拉框",
    width:100,
    height:30,
  },{
    name:'create',
    type:'antd',
    title:"新建",
    width:100,
    height:'auto',
  },
  {
    name:'table',
    type:'antd',
    title:"列表",
    width:400,
    height:450,
  },
  {
    name:'drawing',
    type:'drawing',
    title:"画板",
    width:400,
    height:450,
  },
]
  const handleDragStart = (item, e) => {
    setIsDragging(true);
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    //   draftEvent(e, "dragData", {key:'chart',type,lt:Math.floor(dragDom.offsetWidth/2),tp:dragDom.offsetHeight/2});
    draftEvent(e, "dragData", {key:item.type,type:item.name,width:item.width,height:item.height,lt:0,tp:0});

};
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (<>
  {map.map(item=>  <div
      draggable
      onDragStart={(e)=>handleDragStart(item,e)}
      onDragEnd={handleDragEnd}
      style={{ width:'30px',opacity: isDragging ? 1 : 0.5 }}
      onDragOver={(e) => {
        e.preventDefault();
    }}
    >
     {item.title}
    </div>)}
   
    </>
  );
};

export default DragComponent;