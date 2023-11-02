
import style from "./free.module.scss"
import { getDragData, draftEvent, getUuid } from "@/utils";
import { useAtom, atom, useAtomValue, useSetAtom, } from 'jotai'
import { useEffect, useState, useRef } from "react";
import classnames from "classnames";
// 鼠标按下时的初始坐标
var initialMouseX;
// 鼠标按下时的初始坐标
var initialMouseY;
// 鼠标按下时的初始元素宽度
var initialElementWidth;
// 鼠标按下时的初始元素高度
var initialElementHeight;
//鼠标按下时的初始初始坐标
var initialLeft
//鼠标按下时的初始初始坐标
var initialTop
var dragging = false
const dataAtom = atom([])
const DropBoard = (props) => {
    const [data, setData] = useAtom(dataAtom);
    const paneBox = useRef(null);
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(200);
    const [left, setLeft] = useState();
    const [top, setTop] = useState();
    const [hovering, setHovering] = useState(false);
    const handleDrop = (e) => {
        console.log('e', e)
        console.log('getDragData', getDragData(e))

        const canvasRect = paneBox.current.getBoundingClientRect();

        const canvasX = e.clientX - canvasRect.left;
        const canvasY = e.clientY - canvasRect.top;

        console.log('canvasX', canvasX)
        console.log('canvasY', canvasY)
        dragging = false

        const dragData = getDragData(e).dragData;
        const { key, type, lt, tp, id } = dragData;
        const headDom = document.querySelector('.header')
        const leftDom = document.querySelector('.tool')
        let newData
        if (id) {
            newData = data.map(item => {
                if (item.id === key) {

                    const selfDom = paneBox.current
                    let top = headDom ? headDom.clientHeight : 0;
                    let left = leftDom ? leftDom.clientWidth : 0;
                    let x = canvasX - left - lt;
                    let y = canvasY - top - tp
                    item = {
                        ...item,
                        x: x > 0 ? x : 0,
                        y: y > 0 ? y : 0,
                        type: type,
                        key: type,
                    }
                }
                return item
            })

        } else {
            newData = data.filter(item => item.id !== key)
            const selfDom = paneBox.current
            let top = headDom ? headDom.clientHeight : 0;
            let left = leftDom ? leftDom.clientWidth : 0;
            let x = canvasX - left - lt;
            let y = canvasY - top - tp
            newData.push({
                id: getUuid(),
                x: x > 0 ? x : 0,
                y: y > 0 ? y : 0,
                type: type,
                key: type,
                width: 100,
                height: 50
            })
        }

        setData(newData)
        console.log('e', e)
        console.log('getDragData', getDragData(e))

    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragEnd = () => {

    };
    const startCreateArea = (key, type, e) => {
        console.log('startCreateArea', e)
        console.log('e.target.classList.contains(style.handle)', e.target.classList.contains(style.handle))
        const dragDom = document.querySelector(`.chart-${key}`)
        console.log('dragDomdragDomdragDom', dragDom)
        draftEvent(e, "dragData", { id: key, key, type, lt: Math.floor(dragDom.offsetWidth / 2), tp: dragDom.offsetHeight / 2 });
        e.stopPropagation();

    };
    /*定义鼠标下落事件*/
    const mouseDown = (type, e) => {
        e.stopPropagation();
        e.preventDefault();

    };
    console.log('data', data)





    const handleMouseDown = (e, area) => {
        // e.stopPropagation()
        // e.preventDefault();
        console.log('handleMouseDown=====11111111',e)

        dragging = true

        // 记录鼠标按下时的初始坐标和元素宽度
        initialMouseX = e.clientX;
        initialElementWidth = area.width;
        initialElementHeight = area.height;
        initialMouseY = e.clientY;
        initialLeft = area.x;
        initialTop = area.y;
    };

    const handleMouseUp = (e) => {
        console.log('handleMouseUp=====11111111')
        dragging = false

    };


// 节流函数
function throttle(callback, delay) {
    let timerId = null;
    return function (...args) {
      const context = this;
      if (!timerId) {
        timerId = setTimeout(function () {
          callback.apply(context, args);
          timerId = null;
        }, delay);
      }
    };
  }
    const handleResize = (e, direction, area) => {
    // 根据拖拽的方向更新元素的位置和尺寸
    console.log('throttle=====0', dragging)

    if (dragging) {
        console.log('dragging=====0', dragging)
        console.log('direction=====0', direction)

        console.log('e', e)
        console.log('area', JSON.parse(JSON.stringify(area)))
        // 计算鼠标移动的距离
        var deltaX = e.clientX - initialMouseX;
        console.log('initialMouseX', initialMouseX)
        console.log('initialMe.clientXouseX', e.clientX)

        console.log('deltaX', deltaX)

        var deltaY = e.clientY - initialMouseY;
        console.log('deltaY', deltaY)

        // 根据调整大小的方向更新宽度和高度
        if (direction === 'top') {
            // 更新顶部调整大小的逻辑
            // 更新元素的顶部位置和高度
            var newTop = initialTop + deltaY;
            var newHeight = initialElementHeight - deltaY;
            area.height = newHeight
            area.y = newTop


        } else if (direction === 'right') {

            // 更新元素的右边框位置和宽度
            var newWidth = initialElementWidth + deltaX;
            console.log('newWidth', newWidth)

            area.width = newWidth
        } else if (direction === 'bottom') {
            // 更新底部调整大小的逻辑
            var newHeight = initialElementHeight + deltaY;
            area.height = newHeight

        } else if (direction === 'left') {
            // 计算鼠标移动的距离
            var deltaX = e.clientX - initialMouseX;
            // 更新元素的左边框位置和宽度
            var newLeft = initialLeft + deltaX;
            var newWidth = initialElementWidth - deltaX;
            area.width = newWidth
            area.x = newLeft
        }
        console.log('area111', area)
        data.forEach(l => {
            if (l.id === area.id) {
                l = area
            }
        })
        setData([...data])
    }

  
}


    const handleMouseEnter = (e) => {
        setHovering(true);
    };

    const handleMouseLeave = (e) => {
        setHovering(false);
    };


    return (
        <div className={style.DropBoard}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={(e) => { }}
            onDragLeave={handleDragLeave}
            ref={paneBox}
        >

            {
                data.map(area => {
                    return <div 
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{ position: 'absolute', width: area.width, height: area.height, left: area.x, top: area.y, background: '#e6f7ff' }}>
                        {/* {hovering && ( */}
                        <>
                            <div
                                draggable={false}

                                className={classnames(style.handle, style.top)}
                                onMouseUp={handleMouseUp}
                                onMouseMove={(e) => handleResize(e, 'top', area)}
                                onMouseDown={(e) => handleMouseDown(e, area)}
                            />
                            <div
                                draggable={false}

                                className={classnames(style.handle, style.right)}
                                onMouseUp={handleMouseUp}
                                onMouseMove={(e) => handleResize(e, 'right', area)}
                                onMouseDown={(e) => handleMouseDown(e, area)}
                            />
                            <div
                                draggable={false}

                                className={classnames(style.handle, style.bottom)}
                                onMouseUp={handleMouseUp}
                                onMouseMove={(e) => handleResize(e, 'bottom', area)}
                                onMouseDown={(e) => handleMouseDown(e, area)}
                            />
                            <div
                                draggable={false}

                                className={classnames(style.handle, style.left)}
                                onMouseUp={handleMouseUp}
                                onMouseMove={(e) => handleResize(e, 'left', area)}
                                onMouseDown={(e) => handleMouseDown(e, area)}
                            />
                        </>
                        {/* )} */}

                        <div
                            draggable={true}
                            onDragStart={(e) => startCreateArea(area.id, area.key, e)}
                            key={area.id}
                            className={classnames(style.draggableElement, `chart-${area.id}`)}
                            style={{ width: area.width, height: area.height, left: area.x, top: area.y, background: '#e6f7ff' }}>

                            <div
                            // onMouseDown={e => mouseDown("resize", e)}
                            >
                                {area.type}

                            </div>
                        </div>
                    </div>
                })
            }
        </div>


    )


}
export default DropBoard