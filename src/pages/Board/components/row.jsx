import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getDragData, draftEvent, getUuid } from "@/utils";

const App = () => {
  const [horizontal, setHorizontal] = useState(true);

  const [lists, setLists] = useState([
    { id: 'list1', items: ['Item 1', 'Item 2', 'Item 3'] },
    { id: 'list2', items: ['Item 4', 'Item 5', 'Item 6'] },
  ]);
  const [list, setList] = useState([{
    id: '11',
    content: [{ id: '1', type: 'Item 1' },
    { id: '2', type: 'Item 2' },
    { id: '3', type: 'Item 3' },]
  },
  {
    id: '22',
    content: [
      { id: '4', type: 'Item 4' },
      { id: '5', type: 'Item 5' },
      { id: '6', type: 'Item 6' },
    ]
  }])
  const handleDrop = (e, id, index) => {
    console.log('handleDrop')
    console.log('e', e)
    console.log('id', id)
    console.log('index', index)

    console.log('list', list)
    console.log('getDragData', getDragData(e))
    list.forEach(l => {
      if (l.id == id) {
        l.content[index].type = getDragData(e).dragData.type
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



  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <a onClick={() => setHorizontal(!horizontal)}>{horizontal ? '横向' : '纵向'}</a>
      <div className="container">
        <Droppable droppableId="lists" direction="horizontal" type="container">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="lists-container"
              style={horizontal ? {} : { display: 'flex' }} 
            >
              {list.map((l, index) => (
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
                              border: '1px solid lightgray',
                              display: 'flex',
                              overflowX: 'auto',
                            } : {
                              flex: 1,
                              padding: '8px',
                              border: '1px solid lightgray',
                            }}
                          >
                            <h2>{l.id}</h2>
                            {l.content.map((item, itemIndex) => (
                              <Draggable key={item.id} draggableId={item.id} index={itemIndex} type="item">
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="item"
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
                            onDrop={(e) => handleDrop(e, l.id, itemIndex)}
                            style={{ width: '100%', height: "100%" }} >{item.type}</div>
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
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
 


      {/* <div className="container">
        <Droppable style={horizontal ? {} : { display: 'flex' }} droppableId="lists" direction="horizontal" type="container">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="lists-container"
            >
              {lists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index} type="container">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="list"
                    >
                      <Droppable droppableId={list.id} type="item" direction={horizontal ? "horizontal" : "vertical"}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="list-items"
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
                            <h2>{list.id}</h2>
                            {list.items.map((item, itemIndex) => (
                              <Draggable key={item} draggableId={item} index={itemIndex} type="item">
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="item"
                                    style={{
                                      padding: '8px',
                                      margin: '4px',
                                      boxSizing: 'border-box',
                                      backgroundColor: snapshot.isDragging ? 'lightblue' : 'lightgray',
                                      width: !horizontal ? '100%' : `${100 / list.items.length}%`,
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {item}
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
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div> */}

    </DragDropContext>
  );
};

export default App;

