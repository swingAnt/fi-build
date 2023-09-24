import React, { Component, useEffect,useRef } from "react";
import classnames from "classnames";
import { message, Modal } from "antd";
import dragInstance from "../dragInstance";
import SplitLine from "./SplitLine";
import { draftEvent } from "@/utils";
// import { getCookie } from "root/utils/utils";
import _ from "lodash";
import Bus from "@/utils/eventBus";
// import AreaInstance from '../AreaInstance'

import  "./index.module.scss";
import { useReactive } from 'ahooks'

const BORDER_WIDTH = 0;
const DOUBLE_BORDER_WIDTH = BORDER_WIDTH * 2;
const SPLIT_LINE_WIDTH = 4;
const confirm = Modal.confirm;

 const PaneBox =(props)=> {
    const paneBox = useRef(null);

    let inPositionPart=false;
    let  isSelf = false;
    const state = useReactive({
        position: "",
        width: 0,
        height: 0,
        unClose: false,
        isfull: false,
        fullWidth: 0,
        fullHeight: 0,
        isDragEnter: false,
    })

    useEffect(()=>{
        const resizeWidthHeight = () => {
            Object.assign(state, {
                fullWidth: document.documentElement.clientWidth,
                fullHeight: document.documentElement.clientHeight,
            });
        };
        Object.assign(state, {
            width: paneBox.current.offsetWidth - DOUBLE_BORDER_WIDTH,
            height: paneBox.current.offsetHeight - DOUBLE_BORDER_WIDTH,
            fullWidth: document.documentElement.clientWidth,
            fullHeight: document.documentElement.clientHeight,
        });
        window.addEventListener("resize", resizeWidthHeight);

        // return () => {
        //     // 移除事件监听器
        //     // window.removeEventListener("resize", resizeWidthHeight);
        //   };
    },[])
 

    useEffect(()=>{
        const {
            width: domWidth,
            height: domHeight,
        } = paneBox.current.getBoundingClientRect();
        const newWidth = domWidth - DOUBLE_BORDER_WIDTH;
        const newHeight = domHeight - DOUBLE_BORDER_WIDTH;
        if (!newWidth || !newHeight) return false;
        Object.assign(state, {
            width: newWidth,
            height: newHeight,
        });

    },[state.height,state.width])


   const getDragImg = () => {
        const { treeLayout } = props;
        const { childList } = treeLayout;
        let dragImg = null;
        if (childList && childList.length) {
            const area = childList[0];
            dragImg = "";
        }
        return dragImg;
    };

   const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

   const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!inPositionPart) {
            state.isDragEnter=false
        }
        props.updateDraggable(true);
    };

    const  handleDragEnter = (e, richEditorIsEdit) => {
        const { isDragEnter } = state;
        e.preventDefault();
        e.stopPropagation();
        if (isDragEnter) return false;
        if (isSelf || richEditorIsEdit) return false;
        state.isDragEnter=true

        props.updateDraggable(false);
    };

    const  positionPartEnter = (p) => {
        inPositionPart = true;
        state.position=p

    };

    const positionPartLeave = (e) => {
        inPositionPart = false;
    };

    const handleDragEnd = () => {
        isSelf = false;
        dragInstance.dragSource = {
            target: null,
            boardId: null,
        };
    };

    const handleDragStart = (e) => {
        const dragImg =  getDragImg();
        if (dragImg) {
            e.dataTransfer.setDragImage(dragImg, 40, 40);
        }
        // e.dataTransfer.setData("containerId", props.treeLayout.id);
        draftEvent(e, "containerId",  props.treeLayout.id);
        dragInstance.dragSource = {
            target: e.target,
            boardId:  props.boardId,
        };

        isSelf = true;

        e.stopPropagation();
    };
    const  handleDrop = (e) => {
        // e.preventDefault();
        // e.stopPropagation();
        const { position } =state;
        const { treeLayout, onCreateArea, onMoveArea } = props;
        const { id: currentConId } = treeLayout;
        // 防止跨面板拖拽
        const { dragSource } = dragInstance;
        if (dragSource.boardId && dragSource.boardId !== props.boardId) {
            console.warn("onDrop: 检测到跨面板拖拽, dragSource:", dragSource);
            return false;
        }
        const isIE = !!window.ActiveXobject || "ActiveXObject" in window; //判断是否IE浏览器
        let data = {};
        //判断是否是IE
        if (isIE) {
            data = JSON.parse(e.dataTransfer.getData("text"));
        } else {
            data = JSON.parse(e.dataTransfer.getData("data"));
        }
        const type = data.type;
        console.log('data',data)
        if ("board_tabspane" === props.boardId && "TabsArea" === type) {
            message.error("不支持多页签多层嵌套");
        }
        if (
            type === "AreaField" ||
            ("board_tabspane" === props.boardId && "TabsArea" === type)
        ) {
            state.position=""
            return false;
        }
        const sourceConId = data.containerId;
        const execDrop = () => {
            // onCreateArea(type, position, currentConId);
            if (sourceConId && sourceConId !== currentConId && position) {
                onMoveArea && onMoveArea(sourceConId, currentConId, position);
            } else if (type) {
                onCreateArea && onCreateArea(type, position, currentConId);
            }
            Object.assign(state,{
                position: "",
                isDragEnter: false,
            })

        };
        if (position === "center" && treeLayout.childList.length > 0) {
            Bus.emit("changeGraphWidgetsTabVisible", false);
            Bus.emit("changeFixedActionMenuVisible", false);
            confirm({
                title: `${"是否要替换当前图表"}?`,
                onOk() {
                    execDrop();
                },
                onCancel: () => {

                    Object.assign(state,{
                        position: "",
                        isDragEnter: false,
                    })
                },
            });
        } else {
            execDrop();
        }
        props.updateDraggable(true);
    };

    const  getPaneBoxes = () => {
        const { treeLayout, isAnalysisEdit } = props;
        let { childList   } = treeLayout||{};
        switch (_.isArray(childList) && childList.length) {
            case 2:
                const firstBox = treeLayout.childList[0];
                const secondBox = treeLayout.childList[1];
                const firstPaneBox = (
                    <PaneBox
                        {...props}
                        parentBox={treeLayout}
                        key={firstBox.id}
                        treeLayout={firstBox}
                        size={getPaneSize(firstBox, secondBox)}
                    />
                );
                const secondPaneBox = (
                    <PaneBox
                        {...props}
                        parentBox={treeLayout}
                        key={secondBox.id}
                        treeLayout={secondBox}
                        size={getPaneSize(secondBox, firstBox)}
                    />
                );
                const splitLine = (
                    <SplitLine
                        key="split-line"
                        {...props}
                        paneBox={paneBox}
                    />
                );
                if (isAnalysisEdit) {
                    // return [firstPaneBox, splitLine, secondPaneBox];
                    return [firstPaneBox, secondPaneBox];

                } else {
                    return [firstPaneBox, secondPaneBox];
                }
            case 1:
                //容器（图、表、筛选器等）
                return [
                    renderArea(treeLayout),
                    // isAnalysisEdit && !active && <div style={{width:'100%', height:'100%', position:'absolute',zIndex:100,backgroundColor:'transparent', top: 0, left: 0}}></div>
                ];
            default:
                return null;
        }
    };
    const renderArea = (treeLayout) => {
        const { isfull } = state;
        const { onCopyArea, onDeleteArea, chooseArea, updateChooseArea,actions } = props;
        const area = treeLayout.childList[0];
        const size = isfull
            ? {
                width: state.fullWidth,
                height: state.fullHeight,
            }
            : {
                width: state.width,
                height: state.height,
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
                    <a onClick={() => onCopyArea(treeLayout)}>复制</a>
                    <a onClick={() => onDeleteArea(treeLayout.id)}>删除</a>
                </div>
                <div  className={'area-instance-show'}
                // onClick={() => actions.changeItem(area)}
                >
                {/* <AreaInstance area={area} isEdit={true}/> */}
                </div>
            </div>
        );
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

    const setFull = (isfull) => {
        const { setTabFull, setHasFull } = props;
        state.isfull=isfull
        setTabFull && setTabFull(isfull);
        setHasFull && setHasFull(isfull);
    };

    const renderPositionParts = (isAreaContainer, isEmptyContainer) => {
        const { isDragEnter, position } = state;
        const isContainer = isAreaContainer || isEmptyContainer;
        // if (!isContainer || !isDragEnter) return null;

        let positions = ["center"];
        debugger
        if (isAreaContainer) {
            positions = positions.concat(["top", "right", "bottom", "left"]);
        }

        return (
            <div className="response-layer">
                {positions.map((p) => {
                    return (
                        <div
                            className={`mouse-${p}-part ${
                                isEmptyContainer ? "empty" : ""
                                }`}
                            onDragEnter={()=>positionPartEnter(p)}
                            onDragLeave={positionPartLeave}
                        />
                    );
                })}
                {position && (
                    <div className={`${position}-part position-part`} />
                )}
            </div>
        );
    };

        const { treeLayout, isAnalysisEdit, draggable } = props;
        const { childList } = treeLayout||{};
        const isAreaContainer = childList&&_.isArray(childList) && childList.length === 1;
        const isEmptyContainer = childList&&_.isArray(childList) && childList.length === 0;
        const area = childList?childList[0]:{};
        const { isfull } = state;
        return (
            <div
                className={classnames('pane-boxs', {
                    full: isfull,
                    edit: isAnalysisEdit,
                    "area-container": isAreaContainer,
                })}
                style={{
                    width: props.size.width,
                    height: props.size.height,
                }}
                draggable={draggable}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnter={(e) =>
                    handleDragEnter(e, area && area.isEdit)
                }
                onDragLeave={handleDragLeave}
                ref={paneBox}
            >
                {getPaneBoxes()}
                {renderPositionParts(isAreaContainer, isEmptyContainer)}
            </div>
        );
    
}
export default PaneBox