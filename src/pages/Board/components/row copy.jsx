import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getDragData, draftEvent, getUuid } from "@/utils";

const DropBoard = () => {


  const [horizontal, setHorizontal] = useState(true);
  const [list, setList] = useState([{
    id: 11,
    content: [{ id: '1', type: 'Item 1' },
    { id: '2', type: 'Item 2' },
    { id: '3', type: 'Item 3' },]
  },
  {
    id: 22,
    content: [
      { id: '4', type: 'Item 4' },
      { id: '5', type: 'Item 5' },
      { id: '6', type: 'Item 6' },
    ]
  }])
  const onDragEnd = (result) => {
    console.log('result', result)
    if (!result.destination) {
      return; // 拖拽未成功，未有有效目的地
    }
    let target = Array.from(list).filter(l => result.source.droppableId == l.id)[0].content[result.source.index]
    list.forEach(l => {
      if (result.source.droppableId == l.id) {
        const reorderedItems = Array.from(l.content);
        const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
        l.content = reorderedItems
      }
      if (result.destination.droppableId == l.id) {
        l.content.splice(result.destination.index, 0, target);
      }
    })

    setList(list)
  };
  const handleDrop = (e, id, index) => {
    console.log('handleDrop')
    console.log('e', e)
    console.log('id', id)

    console.log('list', list)
    console.log('getDragData', getDragData(e))
    list.forEach(l => {
      if (l.id == id) {
        l.content[index].type = getDragData(e).dragData.type
      }
    })
    setList([...list])
  }
  return (
    <div>
      <a onClick={() => setHorizontal(!horizontal)}>{horizontal ? '横向' : '纵向'}</a>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={horizontal ? {} : { display: 'flex' }}>
          {
            list.map(l => <Droppable droppableId={l.id}
              direction={horizontal ? "horizontal" : "vertical"}
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={horizontal ? {
                    flex: 1,
                    padding: '8px',
                    border: '1px solid lightgray',
                    display: 'flex',
                    overflowX: 'auto',
                  } : {
                    flex: 1,
                    padding: '8px',
                    border: '1px solid lightgray',
                  }}
                >
                  {l.content.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: '8px',
                            margin: '4px',
                            boxSizing: 'border-box',
                            backgroundColor: snapshot.isDragging ? 'lightblue' : 'lightgray',
                            width: !horizontal ? '100%' : `${100 / l.content.length}%`,
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, l.id, index)}
                            style={{ width: '100%', height: "100%" }} >{item.type}</div>
                        </div>
                      )}
                    </Draggable>

                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>)
          }

        </div>
      </DragDropContext>
    </div>
  );
};

export default DropBoard;


