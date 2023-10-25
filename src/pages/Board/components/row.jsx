import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const App = () => {
  const [lists, setLists] = useState([
    { id: 'list1', items: ['Item 1', 'Item 2', 'Item 3'] },
    { id: 'list2', items: ['Item 4', 'Item 5', 'Item 6'] },
  ]);

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
     if(source.droppableId ==="lists"&& destination.droppableId==="lists"){
      const updatedList = Array.from(lists);
     const list= move(source.index,destination.index,updatedList)
     setLists(list);

    }else{
      if (source.droppableId === destination.droppableId) {
        const updatedList = Array.from(lists);
        const list = updatedList.find((list) => list.id === source.droppableId);
        const [removed] = list.items.splice(source.index, 1);
        list.items.splice(destination.index, 0, removed);
        setLists(updatedList);
      } else {
        const updatedLists = Array.from(lists);
        const [removed] = updatedLists.find((list) => list.id === source.droppableId).items.splice(source.index, 1);
        updatedLists.find((list) => list.id === destination.droppableId).items.splice(destination.index, 0, removed);
        setLists(updatedLists);
      }
    }
   
  };

  const handleContainerDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const updatedLists = Array.from(lists);
    const [removed] = updatedLists.splice(source.index, 1);
    updatedLists.splice(destination.index, 0, removed);
    setLists(updatedLists);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
    <div className="container">
        <Droppable droppableId="lists" direction="horizontal" type="container">
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
                      <Droppable droppableId={list.id} type="item">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="list-items"
                          >
                            <h2>{list.id}</h2>
                            {list.items.map((item, itemIndex) => (
                              <Draggable key={item} draggableId={item} index={itemIndex} type="item">
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="item"
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
      </div>

    </DragDropContext>
  );
};

export default App;

