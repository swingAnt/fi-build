import style from "./right.module.scss"
import { draftEvent,dropEvent ,explainDragAction,treeNodeChange,getUuid,createArea,createEmptyPane} from "@/utils";
import { useAtom, atom ,useAtomValue,useSetAtom} from 'jotai'
import { useEffect, useState,useRef } from "react";
import { message, Modal } from "antd";
import _ from "lodash";

const confirm = Modal.confirm;
const BORDER_WIDTH = 0;
const DOUBLE_BORDER_WIDTH = BORDER_WIDTH * 2;
const SPLIT_LINE_WIDTH = 4;
const treeAtom = atom([
  {
      id: "root",
      width: 100,
      height: 100,
      childList: [],
  },
])
const dragAtom = atom(true)
 const DropBoard = () => {
  const [tree, setTree] = useAtom(treeAtom); 

  const onCreateArea = (type, position, containerId) => {
    console.log("onCreateArea");
    let nextLayouts = tree;
    const { isCover, isAdd, isFirst, isVertical } = explainDragAction(
        position
    );
    const paneWidth = isVertical ? 100 : 50;
    const paneHeight = isVertical ? 50 : 100;
    debugger
    if (isCover) {
        const id = getUuid();
        treeNodeChange(tree, containerId, (item, index, arr) => {
            item.childList = [                        
                createArea({type})
            ];
        });
    } else if (isAdd) {
        const firstPaneId = getUuid();
        const secondPaneId = getUuid();
        treeNodeChange(tree, containerId, (item, index, arr) => {
            const oldData = JSON.parse(JSON.stringify(item.childList[0]));
            item.childList[0] = createEmptyPane(
                secondPaneId,
                paneWidth,
                paneHeight,
                containerId,
                oldData.type
            );
            if (isFirst) {
                item.childList.unshift(
                    createEmptyPane(
                        firstPaneId,
                        paneWidth,
                        paneHeight,
                        containerId,
                        type
                    )
                );
            } else {
                item.childList.push(
                    createEmptyPane(
                        firstPaneId,
                        paneWidth,
                        paneHeight,
                        containerId,
                        type
                    )
                );
            }
        });
    } else {
        console.warn("检查创建窗格参数");
        return;
    }
    setTree(nextLayouts)

};

  return (
    <div className={style.DropBoard}>
      <PaneBox tree={tree[0]} onCreateArea={onCreateArea}
      onMoveArea={
        ()=>{console.log('onMoveArea')}
      } 
      size={{ width: "100%", height: "100%" }}
      />
   
</div>
  );
};
const PaneBox = (props) => {
  const [isDragEnter,setIsDragEnter]=useState(false)//是否进入区间
  const [isSelf,setIsSelf]=useState(false)//是否该空间本身拖拽
  const [inPositionPart,setInPositionPart]=useState(false)//拖拽-悬浮画布是否离开
  const [position,setPosition]=useState(false)//拖拽-悬浮画布显示区间点
  const [isfull,setIsfull]=useState(false)//全屏显示
  const [draggable, setDraggable] = useAtom(dragAtom);//是否允许拖拽
  const [fullWidth,setFullWidth]=useState(0)
  const [fullHeight,setFullHeight]=useState(0)
  const [width,setWidth]=useState(0)
  const [height,setHeight]=useState(0)
  const paneBox = useRef(null);
  const {tree,onMoveArea,onCreateArea}=props
  const childList=tree?.childList
  const isAreaContainer = childList&&_.isArray(childList) && childList.length === 1;
  const isEmptyContainer = childList&&_.isArray(childList) && childList.length === 0;
  const handleDragStart = (e) => {
    //Todu 设置拖拽图片
    // const dragImg =  getDragImg();
    // if (dragImg) {
    //     e.dataTransfer.setDragImage(dragImg, 40, 40);
    // }
    draftEvent(e, "containerId",  props.tree.id);
    //多页签面板
    // dragInstance.dragSource = {
    //     target: e.target,
    //     boardId:  props.boardId,
    // };

    isSelf = true;

    e.stopPropagation();
};
useEffect(()=>{
    const resizeWidthHeight = () => {
      setFullWidth(document.documentElement.clientWidth)
      setFullHeight(document.documentElement.clientHeight)
    };
    setWidth(paneBox.current.offsetWidth - DOUBLE_BORDER_WIDTH)
    setHeight(paneBox.current.offsetHeight - DOUBLE_BORDER_WIDTH)
    setFullWidth(document.documentElement.clientWidth)
    setFullHeight(document.documentElement.clientHeight)

    // window.addEventListener("resize", resizeWidthHeight);

},[])


const handleDragLeave = (e) => {//离开-状态重置
  e.preventDefault();
  e.stopPropagation();

  if (!inPositionPart) {
    setIsDragEnter(false)
  }
  setDraggable(true)
};
const  handleDragEnter = (e) => {//进入-状态预设
  e.preventDefault();
  e.stopPropagation();
  if (isDragEnter) return false;
  if (isSelf) return false;
  setIsDragEnter(true)
  setDraggable(false)
};
const  positionPartEnter = (p) => {
  setPosition(p)
  setInPositionPart(true)
};

const positionPartLeave = (e) => {
  setInPositionPart(false)
};
const handleDragEnd = () => {
  setIsSelf(false)
  // 状态重置，后续引入多面板
  // dragInstance.dragSource = {
  //     target: null,
  //     boardId: null,
  // };
};
const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
};
const renderPositions = () => {
  const isShowDrag = isAreaContainer || isEmptyContainer;//不超过盒子上限
  if (!isShowDrag || !isDragEnter) return null;
  let positions = ["center"];
  if (isAreaContainer) {
      positions = positions.concat(["top", "right", "bottom", "left"]);
  }

  return (
      <div className={style.layer}>
          {positions.map((p) => {
              return (
                  <div
                      className={`${style[`mouse-${p}-part`]} ${
                          isEmptyContainer ? style.empty : ""
                          }`}
                      onDragEnter={()=>positionPartEnter(p)}
                      onDragLeave={positionPartLeave}
                  />
              );
          })}
          {position && (
              <div className={`${style[position+'-part']} ${style.position}`} />
          )}
      </div>
  );
};
const  handleDrop = (e) => {
  const { id: currentConId } = tree;
  // 防止跨面板拖拽
  // const { dragSource } = dragInstance;
  // if (dragSource.boardId && dragSource.boardId !== props.boardId) {
  //     console.warn("onDrop: 检测到跨面板拖拽, dragSource:", dragSource);
  //     return false;
  // }
  const isIE = !!window.ActiveXobject || "ActiveXObject" in window; //判断是否IE浏览器
  let data = dropEvent(e)
  const type = data.type;
  console.log('data',data)

  const sourceConId = data.containerId;
  const execDrop = () => {
      if (sourceConId && sourceConId !== currentConId && position) {
          onMoveArea && onMoveArea(sourceConId, currentConId, position);
      } else if (type) {
          onCreateArea && onCreateArea(type, position, currentConId);
      }
      setPosition("")
      setIsDragEnter(false)

  };
  if (position === "center" && childList.length > 0) {
      confirm({
          title: `${"是否要替换当前图表"}?`,
          onOk() {
              execDrop();
          },
          onCancel: () => {
            setPosition("")
            setIsDragEnter(false)
          },
      });
  } else {
      execDrop();
  }
  setDraggable(true)
}
const  getPaneBoxes = () => {

  switch (_.isArray(childList) && childList.length) {
      case 2:
          const firstBox = childList[0];
          const secondBox = childList[1];
          const firstPaneBox = (
              <PaneBox
                  {...props}
                  parentBox={tree}
                  key={firstBox.id}
                  tree={firstBox}
                  size={getPaneSize(firstBox, secondBox)}
              />
          );
          const secondPaneBox = (
              <PaneBox
                  {...props}
                  parentBox={tree}
                  key={secondBox.id}
                  tree={secondBox}
                  size={getPaneSize(secondBox, firstBox)}
              />
          );
          // const splitLine = (
          //     <SplitLine
          //         key="split-line"
          //         {...props}
          //         paneBox={paneBox}
          //     />
          // );
              // return [firstPaneBox, splitLine, secondPaneBox];
              return [firstPaneBox, secondPaneBox];

      case 1:
          //容器（图、表、筛选器等）
          return [
              renderArea(),
          ];
      default:
          return null;
  }
};
const getPaneSize = (pane, brotherPane) => {
  const direction = pane.width === 100 ? "VERTICAL" : "HORIZONTAL";
  // const { isAnalysisEdit } = props;
  const isAnalysisEdit = true;
  const FOLD_BUTTON_WIDTH = 15;
  if (pane.isFold) {
      if (direction === "VERTICAL") {
          return {
              width: "100%",
              height: FOLD_BUTTON_WIDTH,
          };
      } else {
          return {
              width: FOLD_BUTTON_WIDTH,
              height: "100%",
          };
      }
  } else if (brotherPane.isFold) {
      if (direction === "VERTICAL") {
          return {
              width: "100%",
              height: `calc(100% - ${SPLIT_LINE_WIDTH}px - ${FOLD_BUTTON_WIDTH}px)`,
          };
      } else {
          return {
              width: `calc(100% - ${SPLIT_LINE_WIDTH}px - ${FOLD_BUTTON_WIDTH}px)`,
              height: "100%",
          };
      }
  } else {
      if (direction === "VERTICAL") {
          return {
              width: "100%",
              height: isAnalysisEdit
                  ? `calc(${pane.height}% - ${SPLIT_LINE_WIDTH / 2}px)`
                  : `${pane.height}%`,
          };
      } else {
          return {
              width: isAnalysisEdit
                  ? `calc(${pane.width}% - ${SPLIT_LINE_WIDTH / 2}px)`
                  : `${pane.width}%`,
              height: "100%",
          };
      }
  }
};
const renderArea = () => {
  const { onCopyArea, onDeleteArea, chooseArea, updateChooseArea,actions } = props;
  const area = childList[0];
  const size = isfull
      ? {
          width: fullWidth,
          height: fullHeight,
      }
      : {
          width: width,
          height: height,
      };
  return (
      <div onClick={() => {
          updateChooseArea(area.id);
      }}
          style={chooseArea === area.id ? {
              border: '1px solid #f5222d',
              width: '100%',
              height: '100%',
              // background:'#'+Math.floor(Math.random()*16777215).toString(16)
          } :
              {
                  width: '100%',
                  height: '100%',
                  // background:'#'+Math.floor(Math.random()*16777215).toString(16)
              }}
              id={`area-${area.id}`}
              key={`area-${area.id}`}

      >
          {area.name}
          {area.type}
          <div>
              <a onClick={() => onCopyArea(tree)}>复制</a>
              <a onClick={() => onDeleteArea(tree.id)}>删除</a>
          </div>
          <div  className={'area-instance-show'}
          // onClick={() => actions.changeItem(area)}
          >
          
          </div>
      </div>
  );
};
  return (
    <div 
    className={style.PaneBox}
    draggable={draggable}
    ref={paneBox}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    onDragOver={handleDragOver}
    onDrop={handleDrop}
    style={{
      width: props.size.width,
      height: props.size.height,
  }}
    onDragEnter={(e) =>
        handleDragEnter(e)
    }
    onDragLeave={handleDragLeave}
    >
      
      {getPaneBoxes()}

   {renderPositions()}
</div>
  );
};
export default DropBoard; 