import React, { useState ,useRef} from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getDragData, draftEvent, getUuid } from "@/utils";
import View from './view'
import style from "./row.module.scss"
import classnames from "classnames";

const App = (props) => {
  const [horizontal, setHorizontal] = useState(true);
  const [hovering, setHovering] = useState('');

  const handleMouseEnter = (id) => {
    setHovering(id);
};

const handleMouseLeave = (e) => {
    setHovering();
};
  const [list, setList] = useState(
    [
  //     {
  //   id: '11',
  //   content: [{ id: '1', type: 'Item 1', key: "", width: 100, height: 100 },
  //   { id: '2', type: 'Item 2', key: "", width: 100, height: 100 },
  //   { id: '3', type: 'Item 3', key: "", width: 100, height: 100 },]
  // },
  // {
  //   id: '22',
  //   content: [
  //     { id: '4', type: 'Item 4', key: "", width: 100, height: 100 },
  //     { id: '5', type: 'Item 5', key: "", width: 100, height: 100 },
  //     { id: '6', type: 'Item 6', key: "", width: 100, height: 100 },
  //   ]
  // },
  // {
  //   id: '33',
  //   content: [
  //     { id: '7', type: 'Item 7', key: "", width: 100, height: 100 },
  //     { id: '8', type: 'Item 8', key: "", width: 100, height: 100 },
  //     { id: '9', type: 'Item 9', key: "", width: 100, height: 100 },
  //   ]
  // }
])
  const handleDrop = (e, id, index) => {
    list.forEach(l => {
      if (l.id == id) {
        l.content[index].type = getDragData(e).dragData.type
        l.content[index].key = getDragData(e).dragData.key

      }
    })
    setList([...list])
  }
  function move(index1, index2, arr) {
    //index1 index2 需要更换的下标
    arr.splice(index1, 1, ...arr.splice(index2, 1, arr[index1]))
    return arr
  }
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    if (source.droppableId === "lists" && destination.droppableId === "lists") {
      const updatedList = Array.from(list);
      const l = move(source.index, destination.index, updatedList)
      setList(l);

    } else {
      if (source.droppableId === destination.droppableId) {
        const updatedList = Array.from(list);
        const l = updatedList.find((l) => l.id === source.droppableId);
        const [removed] = l.content.splice(source.index, 1);
        l.content.splice(destination.index, 0, removed);
        setList(updatedList);
      } else {
        const updatedLists = Array.from(list);
        const [removed] = updatedLists.find((l) => l.id === source.droppableId).content.splice(source.index, 1);
        updatedLists.find((l) => l.id === destination.droppableId).content.splice(destination.index, 0, removed);
        setList(updatedLists);
      }
    }

  };

  const stylesRef = useRef({
    length: 100,
  });
  const [styles, setStyles] = useState({
    length: 100,
  });
  const [id, setId] = useState('');
  const onDotMousedown=(type ,e,area)=> {
    console.log('onDotMousedown====',type,area)
    e.stopPropagation()
    e.preventDefault()
    // 获取鼠标按下的坐标
    const downX = e.clientX
    const downY = e.clientY
    setId(area.id)
    stylesRef.current={
      length: area.length,
    }
    setStyles({
      length: area.length,
    })
    const resizePaneAndUp = (e,up) => {

      if(up){
        console.log('stylesstylesstylesstyles',stylesRef.current)
           

    list.forEach(l=>{
        if(l.id===area.id){
          l.length=stylesRef.current.length
        }

      })
      setList(list)
      }else{
              // 移动的x距离
      const disX = e.clientX - downX
      // 移动的y距离
      const disY = e.clientY - downY
      // 是否是上方缩放圆点
      const hasT = type === 'top'
      // 是否是左方缩放圆点
      const hasL = type === 'left'
      
      let width = area.length + (hasL ? -disX : disX)
      let height = area.length + (hasT ? -disY : disY)
      let length=0


        if (['top', 'bottom'].includes(type)) {
          // 上下就不改变宽度
          length=height

        } else {
          // 左右就不改变高度
          length = width

        }

      // 处理逆向缩放
      if (width < 0) {
        length = -width
      }
      if (height < 0) {
        length = -height
      } 
        stylesRef.current={
          length
        }
        setStyles({
          length
        })
        console.log('stylesRef.current=',stylesRef.current)
      }

     

    }
    const onMousemove = (e) => {
      resizePaneAndUp(e,false)
      }
   
    
    const onMouseup = (_e) => {
      setId('')
      resizePaneAndUp(e,true)

      window.removeEventListener('mousemove', onMousemove)
      window.removeEventListener('mouseup', onMouseup)
    }
    
 // 在添加新的事件监听器之前，先移除旧的事件监听器
 window.removeEventListener('mousemove', onMousemove)
 window.removeEventListener('mouseup', onMouseup)

 // 直接在这里添加事件监听器，而不是在mousedown事件处理函数中
 window.addEventListener('mousemove', onMousemove)
 window.addEventListener('mouseup', onMouseup)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <a onClick={() => setHorizontal(!horizontal)}>{horizontal ? '横向' : '纵向'}</a>
      <a onClick={()=>{
        setList([...list,{
          id: getUuid(),
          length: 100, 
          content: [{ id: getUuid(), type: 'Item 1', key: "", },
          { id: getUuid(), type: 'Item 2', key: "", },
          { id: getUuid(), type: 'Item 3', key: "",  },]
        },])
      }}>添加行</a>
      <div className={style.DropBoard}>
        <Droppable droppableId="lists" direction="horizontal" type="container">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={horizontal ? {} : { display: 'flex' }}
            >
              {list.map((l, index) => (
                <div className={style.listsContainer}   
                onMouseEnter={()=>handleMouseEnter(l.id)}
                onMouseLeave={handleMouseLeave}
                >
                {!hovering?'': horizontal?    <>
                            <div
                                className={classnames(style.handle, style.top)}
                                onMouseDown={(e)=>onDotMousedown('top', e,l)}                            />
                      
                            <div
                                className={classnames(style.handle, style.bottom)}
                                onMouseDown={(e)=>onDotMousedown('bottom', e,l)}

                            />

                        </> :
                     <>
               <div
                         className={classnames(style.handle, style.right)}
                         onMouseDown={(e)=>onDotMousedown('right', e,l)}
                     />
                  
                     <div
                         className={classnames(style.handle, style.left)}
                         onMouseDown={(e)=>onDotMousedown('left', e,l)}

                     />
                 </>
}
                <Draggable key={l.id} draggableId={l.id} index={index} type="container">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="list"
                    >
                      <Droppable droppableId={l.id} type="item" direction={horizontal ? "horizontal" : "vertical"}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="list-items"
                            style={horizontal ? {
                              flex: 1,
                              padding: '8px',
                              border: '1px dotted lightgray',
                              display: 'flex',
                              overflowX: 'auto',
                              background: 'white'
                            } : {
                              flex: 1,
                              padding: '8px',
                              border: '1px dotted lightgray',
                              background: 'white'
                            }}
                          >
                            {/* <h2>{l.id}</h2> */}
                            <div style={{position:'absolute',right:'0',top:0}} onClick={()=>{setList(list.filter(o=>o.id!==l.id))}}>删除</div>
                            {l.content.map((item, itemIndex) => (
                              <Draggable key={item.id} draggableId={item.id} index={itemIndex} type="item">
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="item"
                                    style={{
                                      margin: '4px',
                                      boxSizing: 'border-box',
                                      backgroundColor: snapshot.isDragging ? 'lightblue' : '',
                                      border: snapshot.isDragging ? '':'1px solid #e3f2fd',
                                      width: !horizontal ? id===l.id?styles.length:l.length : `${100 / l.content.length}%`,
                                      height: id===l.id?styles.length:l.length,
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <div
                                      onDragOver={(e) => e.preventDefault()}
                                      onDrop={(e) => handleDrop(e, l.id, itemIndex)}
                                      style={{ width: '100%', height: "100%" }} >
                                      {!!item.type ? <View
                                        type={item.type}
                                        name={item.key}
                                        themeType={props.themeType}
                                      /> : "请拖动元素放入内部"}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default App;

