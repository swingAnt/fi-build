import style from "./right.module.scss"
import { draftEvent, dropEvent, explainDragAction, treeNodeChange, getUuid, createArea, createEmptyPane } from "@/utils";
import { useAtom, atom, useAtomValue, useSetAtom, } from 'jotai'
import { useEffect, useState, useRef } from "react";
import { message, Modal } from "antd";
import _ from "lodash";
import classnames from "classnames";
import { atomWithImmer } from 'jotai-immer'
import View from './view'
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
const domAtom = atomWithImmer({
    analysisWidth: 0,
    analysisHeight: 0,
    draggable: true,
    positions: {},
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    chooseArea: ""
})
const dragAtom = atom(true)
const DropBoard = (props) => {
    const [tree, setTree] = useAtom(treeAtom);
    const [setting, setSetting] = useAtom(domAtom)
    //更新双方边距
    const resizePane = (firstId, secondId, value, isVertical) => {
        let firstData, secondData, firstIndex, secondIndex, firstArr, secondArr;
        let nextLayouts = JSON.parse(JSON.stringify(tree));

        treeNodeChange(nextLayouts, firstId, (item, index, arr) => {
            firstData = item;
            firstIndex = index;
            firstArr = arr;
        });
        treeNodeChange(nextLayouts, secondId, (items, index, arr) => {
            secondData = items;
            secondIndex = index;
            secondArr = arr;
        });


        if (firstData && secondData) {
            if (isVertical) {
                firstData.width = value;
                secondData.width = 100 - value;
            } else {
                firstData.height = value;
                secondData.height = 100 - value;
            }
        }

        setTree(nextLayouts)

    };
    //内部拖入
    const onMoveArea = (sourceConId, currentConId, position) => {
        console.log("onMoveArea");
        let nextLayouts = JSON.parse(JSON.stringify(tree));

        const { isCover, isAdd, isFirst, isVertical } = explainDragAction(
            position
        );
        if (isCover) {
            let firstData,
                secondData,
                firstIndex,
                secondIndex,
                firstArr,
                secondArr;
            treeNodeChange(nextLayouts, currentConId, (item, index, arr) => {
                firstData = item;
                firstIndex = index;
                firstArr = arr;
            });
            treeNodeChange(nextLayouts, sourceConId, (items, index, arr) => {
                secondData = items;
                secondIndex = index;
                secondArr = arr;
            });
            if (firstData && secondData) {
                const data1 = JSON.parse(JSON.stringify(firstData));
                const data2 = JSON.parse(JSON.stringify(secondData));
                console.log("data1", data1);
                console.log("data2", data2);
                if (firstData.pid === secondData.pid) {
                    console.log("firstData", firstData);
                    console.log("secondData", secondData);
                    let nodes;
                    treeNodeChange(
                        nextLayouts,
                        data1.pid,
                        (items, index, arr) => {
                            nodes = items;
                            nodes.childList = secondData.childList;
                        }
                    );
                } else {
                    //
                    secondArr.splice(secondIndex, 1);
                    let nodes;
                    console.log("secondData", secondData);
                    treeNodeChange(
                        nextLayouts,
                        secondData.pid,
                        (items, index, arr) => {
                            nodes = items;
                            console.log("nodes", nodes);
                            if (nodes) {
                                nodes.childList = secondArr[0].childList;
                                nodes.childList.forEach(
                                    (res) => (res.pid = secondData.pid)
                                );
                            }
                        }
                    );
                    console.log("secondArr", secondArr);
                    firstData.childList = secondData.childList;
                }
            }
        } else if (isAdd) {
            const paneWidth = isVertical ? 100 : 50;
            const paneHeight = isVertical ? 50 : 100;
            console.log("isVertical", isVertical);
            const firstPaneId = getUuid();
            const secondPaneId = getUuid();
            let firstData,
                secondData,
                firstIndex,
                secondIndex,
                firstArr,
                secondArr;
            treeNodeChange(nextLayouts, currentConId, (item, index, arr) => {
                firstData = item;
                firstIndex = index;
                firstArr = arr;
            });
            treeNodeChange(nextLayouts, sourceConId, (items, index, arr) => {
                secondData = items;
                secondIndex = index;
                secondArr = arr;
            });
            if (firstData && secondData) {
                const data1 = JSON.parse(JSON.stringify(firstData));
                const data2 = JSON.parse(JSON.stringify(secondData));

                if (firstData.pid === secondData.pid) {
                    console.log("paneWidth", paneWidth);
                    console.log("paneHeight", paneHeight);

                    firstData.width = paneWidth;
                    firstData.height = paneHeight;
                    secondData.width = paneWidth;
                    secondData.height = paneHeight;
                    let nodes;
                    treeNodeChange(
                        nextLayouts,
                        data1.pid,
                        (items, index, arr) => {
                            nodes = items;
                            nodes.childList = [];
                        }
                    );
                    if (isFirst) {
                        nodes.childList.push(secondData, firstData);
                    } else {
                        nodes.childList.push(firstData, secondData);
                    }
                    console.log("nodes", nodes);
                    // firstData.childList = data2.childList;
                    // secondData.childList = data1.childList;
                } else {
                    //
                    secondArr.splice(secondIndex, 1);
                    let nodes;
                    console.log("secondData", secondData);
                    treeNodeChange(
                        nextLayouts,
                        secondData.pid,
                        (items, index, arr) => {
                            const item = JSON.parse(JSON.stringify(items));
                            nodes = items;
                            console.log("nodes", nodes);
                            if (nodes) {
                                nodes.childList = secondArr[0].childList;
                                nodes.childList.forEach(
                                    (res) => (res.pid = secondData.pid)
                                );
                            }
                        }
                    );
                    firstData.childList = [];
                    firstData.childList[0] = createEmptyPane(
                        secondPaneId,
                        paneWidth,
                        paneHeight,
                        firstData.id,
                        data1.childList[0].type,
                        data1.childList[0].key

                    );
                    if (isFirst) {
                        firstData.childList.unshift(
                            createEmptyPane(
                                firstPaneId,
                                paneWidth,
                                paneHeight,
                                firstData.id,
                                data2.childList[0].type,
                                data2.childList[0].key,

                            )
                        );
                    } else {
                        firstData.childList.push(
                            createEmptyPane(
                                firstPaneId,
                                paneWidth,
                                paneHeight,
                                firstData.id,
                                data2.childList[0].type,
                                data2.childList[0].key

                            )
                        );
                    }
                }
            }
        } else {
            console.warn("检查移动窗格参数");
            return;
        }

        console.log("nextLayouts", nextLayouts);
        setTree(nextLayouts)

    };
    //外部拖入
    const onCreateArea = (type, position, containerId, key) => {
        let nextLayouts = tree;
        const { isCover, isAdd, isFirst, isVertical } = explainDragAction(
            position
        );
        const paneWidth = isVertical ? 100 : 50;
        const paneHeight = isVertical ? 50 : 100;
        if (isCover) {
            const id = getUuid();
            treeNodeChange(tree, containerId, (item, index, arr) => {
                item.childList = [
                    createArea({ type, containerId: id, pid: item.id, key }),

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
                    oldData.type,
                    oldData.key,

                );
                if (isFirst) {
                    item.childList.unshift(
                        createEmptyPane(
                            firstPaneId,
                            paneWidth,
                            paneHeight,
                            containerId,
                            type,
                            key
                        )
                    );
                } else {
                    item.childList.push(
                        createEmptyPane(
                            firstPaneId,
                            paneWidth,
                            paneHeight,
                            containerId,
                            type,
                            key
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
    const updateChooseArea = (id) => {
        console.log('ID', id)

        setSetting((s) => {
            s.chooseArea = id === setting.chooseArea ? "" : id

        })
    }
    console.log("tree[0]", tree[0])

    return (

        <div className={style.DropBoard}>
            <PaneBox tree={tree[0]}
                onCreateArea={onCreateArea}
                resizePane={resizePane}
                updateChooseArea={updateChooseArea}
                onMoveArea={onMoveArea}
                size={{ width: "100%", height: "100%" }}
                themeType={props.themeType}
            />

        </div>
    );
};
const PaneBox = (props) => {
    const { chooseArea } = useAtomValue(domAtom);
    const [isDragEnter, setIsDragEnter] = useState(false)//是否进入区间
    const [isSelf, setIsSelf] = useState(false)//是否该空间本身拖拽
    const [inPositionPart, setInPositionPart] = useState(false)//拖拽-悬浮画布是否离开
    const [position, setPosition] = useState(false)//拖拽-悬浮画布显示区间点
    const [isfull, setIsfull] = useState(false)//全屏显示
    const [draggable, setDraggable] = useAtom(dragAtom);//是否允许拖拽

    const paneBox = useRef(null);
    const { tree, onMoveArea, onCreateArea,themeType } = props

    const childList = tree?.childList
    const isAreaContainer = childList && _.isArray(childList) && childList.length === 1;
    const isEmptyContainer = childList && _.isArray(childList) && childList.length === 0;
    const getDragImg = () => {
        let dragImg = null;
        if (childList && childList.length) {
            const area = childList[0];
            dragImg = "";
        }
        return dragImg;
    };
    const handleDragStart = (e) => {
        // const dragImg =  getDragImg();
        // if (dragImg) {
        // e.dataTransfer.setDragImage(new Image(), 0, 0);    //Todu 设置拖拽图片

        // }
        e.dataTransfer.setDragImage(new Image(), 0, 0);    //Todu 设置拖拽图片

        draftEvent(e, "containerId", props.tree.id);
        //多页签面板
        // dragInstance.dragSource = {
        //     target: e.target,
        //     boardId:  props.boardId,
        // };

        setIsSelf(true)
        e.stopPropagation();
    };


    // useEffect(()=>{
    //     const {
    //         width: domWidth,
    //         height: domHeight,
    //     } = paneBox.current.getBoundingClientRect();
    //     const newWidth = domWidth - DOUBLE_BORDER_WIDTH;
    //     const newHeight = domHeight - DOUBLE_BORDER_WIDTH;
    //     if (!newWidth || !newHeight) return false;
    //     setHeight(newHeight)
    //     setWidth(newWidth)
    // },[height,width])
    const handleDragLeave = (e) => {//离开-状态重置
        e.preventDefault();
        e.stopPropagation();

        if (!inPositionPart) {
            setIsDragEnter(false)
            setPosition(false)
        }
        setDraggable(true)
    };
    const handleDragEnter = (e) => {//进入-状态预设
        e.preventDefault();
        e.stopPropagation();
        if (isDragEnter) return false;
        if (isSelf) return false;
        setIsDragEnter(true)
        setDraggable(false)
    };
    const positionPartEnter = (p) => {
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
                            className={`${style[`mouse-${p}-part`]} ${isEmptyContainer ? style.empty : ""
                                }`}
                            onDragEnter={() => positionPartEnter(p)}
                            onDragLeave={positionPartLeave}
                        />
                    );
                })}
                {position && (
                    <div className={`${style[position + '-part']} ${style.position}`} />
                )}
            </div>
        );
    };
    const handleDrop = (e) => {
        const { id: currentConId } = tree;
        // 防止跨面板拖拽
        // const { dragSource } = dragInstance;
        // if (dragSource.boardId && dragSource.boardId !== props.boardId) {
        //     console.warn("onDrop: 检测到跨面板拖拽, dragSource:", dragSource);
        //     return false;
        // }
        const isIE = !!window.ActiveXobject || "ActiveXObject" in window; //判断是否IE浏览器
        let data = dropEvent(e)
        const type = data.dragData?.type;
        const key = data.dragData?.key;
        debugger
        console.log('data', data)

        const sourceConId = data.containerId;
        const execDrop = () => {
            if (sourceConId && sourceConId !== currentConId && position) {
                onMoveArea && onMoveArea(sourceConId, currentConId, position);
            } else if (type) {
                onCreateArea && onCreateArea(type, position, currentConId, key);
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
    const getPaneBoxes = () => {

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
                const splitLine = (
                    <SplitLine
                        key="split-line"
                        {...props}
                        paneBox={paneBox.current}
                    />
                );
                return [firstPaneBox, splitLine, secondPaneBox];
            // return [firstPaneBox, secondPaneBox];

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
        const { onCopyArea, onDeleteArea, updateChooseArea, actions } = props;
        const area = childList[0];


        return (
            <div onClick={() => {
                updateChooseArea(tree.id);
            }}
                style={chooseArea === tree.id ? {
                    border: '1px solid #f5222d',
                    width: '100%',
                    height: '100%',
                    // background:'#'+Math.floor(Math.random()*16777215).toString(16)
                } :
                    {
                        width: '100%',
                        height: '100%',
                        border: '1px solid rgb(240, 241, 245)',

                        // background:'#'+Math.floor(Math.random()*16777215).toString(16)
                    }}
                id={`area-${tree.id}`}
                key={`area-${tree.id}`}

            >

                {/* <div>
                    <a onClick={() => onCopyArea(tree)}>复制</a>
                    <a onClick={() => onDeleteArea(tree.id)}>删除</a>
                </div> */}
                <div className={style.areaBox}
                // onClick={() => actions.changeItem(area)}
                ><View
                        type={area.type}
                        name={area.key}
                        themeType={themeType}
                    />
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
const moveAtom = atom({
    //鼠标点下的X坐标
    oldClientX: 0,
    //鼠标点下的Y坐标
    oldClientY: 0,
    oldFirstHeight: 0,
    oldFirstWidth: 0,
    oldSecondHeight: 0,
    oldSecondWidth: 0,
    value: 0,
})
const SplitLine = (props) => {
    const setDraggable = useSetAtom(dragAtom);//是否允许拖拽

    const [state, setState] = useAtom(moveAtom);
    const { tree } = props;
    const { childList } = tree;

    const mouseDown = (e) => {
        console.log('mouseDown')

        /*定义鼠标移动事件*/
        document.onmousemove = doMouseMove;

        /*定义鼠标抬起事件*/
        document.onmouseup = doMouseUp;

        let event = e || window.event;



        const { paneBox, tree } = props;

        const firstBox = paneBox.children[0];
        const secondBox = paneBox.children[2];



        setDraggable(false)

        let value
        const isVertical = tree.childList[0].height === 100;
        if (isVertical) {
            value = tree.childList[0].width;
        } else {
            value = tree.childList[0].height;
        }

        setState(Object.assign(state, {
            oldClientX: event.clientX,/*获取鼠标按下的地方距离元素左侧和上侧的距离*/
            oldClientY: event.clientY,
            oldFirstWidth: firstBox.offsetWidth,
            oldFirstHeight: firstBox.offsetHeight,
            oldSecondWidth: secondBox.offsetWidth,
            oldSecondHeight: secondBox.offsetHeight,
            value,
        }))
        e.stopPropagation();
    };

    const doMouseMove = (e) => {
        /*事件兼容*/
        let event = e || window.event;

        const {
            paneBox,
            tree,
            tree: { childList },
        } = props;
        const { oldClientX, oldClientY, oldSecondWidth, oldFirstWidth, oldFirstHeight, oldSecondHeight, } = state
        //移动后对象的xy坐标
        let disX = event.clientX - oldClientX;
        let disY = event.clientY - oldClientY;
        let value;
        const paneWidth = paneBox.offsetWidth;
        const paneHeight = paneBox.offsetHeight;

        const isVertical = childList[0].height === 100;

        if (isVertical) {
            if (disX > 0) {
                disX =
                    oldSecondWidth - disX >= 0
                        ? disX
                        : oldSecondWidth;
            } else {
                disX =
                    oldFirstWidth + disX >= 0 ? disX : - oldFirstWidth;
            }
            value = ((oldFirstWidth + 2 + disX) / paneWidth) * 100;
        } else {
            if (disY > 0) {
                disY =
                    oldSecondHeight - disY >= 0
                        ? disY
                        : oldSecondHeight;
            } else {
                disY =
                    oldFirstHeight + disY >= 0
                        ? disY
                        : -oldFirstHeight;
            }
            value = ((oldFirstHeight + 2 + disY) / paneHeight) * 100;
        }

        props.resizePane(
            childList[0].id,
            childList[1].id,
            value,
            isVertical
        );

        setState(Object.assign(state, {
            value,
            active: true,
        }))
        e.stopPropagation();
    };

    const doMouseUp = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
        console.log('doMouseUp')
        const {
            tree: { childList },
        } = props;
        const isVertical = childList[0].height === 100;

        props.resizePane(
            childList[0].id,
            childList[1].id,
            state.value,
            isVertical
        );

        setDraggable(true)
        e.stopPropagation();
    };



    return (
        <div
            className={classnames(style.splitLine, childList[0].height === 100 ?
                style.isVertical
                : '')}
            onMouseDown={mouseDown}
        />
    );

}

export default DropBoard; 