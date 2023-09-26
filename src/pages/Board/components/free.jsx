
import style from "./right.module.scss"
import { getDragData,draftEvent ,getUuid} from "@/utils";
import { useAtom, atom ,useAtomValue,useSetAtom,} from 'jotai'
import { useEffect, useState,useRef } from "react";
const dataAtom = atom([])
const DropBoard=(props)=> {
    const [data, setData] = useAtom(dataAtom); 
    const paneBox = useRef(null);

   const handleDrop = (e) => {
        console.log('e',e)
        console.log('getDragData',getDragData(e))
        
        const canvasRect =paneBox.current.getBoundingClientRect();

        const canvasX = e.clientX - canvasRect.left;
        const canvasY = e.clientY - canvasRect.top;

        console.log('canvasX',canvasX)
        console.log('canvasY',canvasY)

        const dragData=getDragData(e).dragData;
        const {key,type,lt,tp}=dragData;
        const newData=data.filter(item=>item.id!==type)
        const headDom=document.querySelector('.header')
        const leftDom=document.querySelector('.tool')
        const selfDom=paneBox.current
        let  top= headDom ? headDom.clientHeight : 0;
        let left = leftDom ? leftDom.clientWidth : 0;
        console.log('type',type)
        console.log('top',top)
        console.log('left',left)
        console.log('selfDom',selfDom)
        console.log('lt',lt)
        console.log('tp',tp)
        console.log('x',e.clientX-left)
        console.log('y',e.clientY-top)
        let x=canvasX-left-lt;
        let y=canvasY-top-tp
        newData.push({
            id:getUuid(),
            x:x>0?x:0,
            y:y>0?y:0,
            name:type,
            key,
        })
        setData(newData)
        console.log('e',e)
        console.log('getDragData',getDragData(e))
        
    };
    const  handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const     handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const  handleDragEnd = () => {
  
    };
    const  startCreateArea = (key,type, e) => {
        const dragDom=document.querySelector(`.chart-${type}`)
      console.log('dragDomdragDomdragDom',dragDom)
      draftEvent(e, "dragData", {key,type,lt:Math.floor(dragDom.offsetWidth/2),tp:dragDom.offsetHeight/2});
        e.stopPropagation();
  
    };
     /*定义鼠标下落事件*/
     const  mouseDown = (type, e) => {
        e.stopPropagation();
        e.preventDefault();
       
    };
    console.log('data',data)
        return (
            <div className={style.DropBoard}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={(e) =>{}}
            onDragLeave={handleDragLeave}
            ref={paneBox}
        >      

            {
                data.map(area=>{
                  return <div 
                  draggable={true}
                   onDragStart={(e)=>startCreateArea(area.key,area.id,e)}
                    key={area.id}
                    className={`chart-${area.id}`} 
                     style={{position: 'absolute',left:area.x,top:area.y,background:'#e6f7ff'}}>
                       <div
                    onMouseDown={e => mouseDown("resize", e)}
              >
          </div>ssss
          {/* {getView(area.key,area.id)} */}
          {area.type}
</div>
                })
            }
        </div>
    
       
        )
    
    
}
export default DropBoard