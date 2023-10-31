
import style from "./free.module.scss"
import { getDragData, draftEvent, getUuid } from "@/utils";
import { useAtom, atom, useAtomValue, useSetAtom, } from 'jotai'
import { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import { atomWithImmer } from 'jotai-immer'

const dataAtom = atom([])
const DropBoard = (props) => {
    const [data, setData] = useAtom(dataAtom);

    const paneBox = useRef(null);
    const handleDrop = (e) => {
        console.log('e', e)
        console.log('getDragData', getDragData(e))

        const canvasRect = paneBox.current.getBoundingClientRect();

        const canvasX = e.clientX - canvasRect.left;
        const canvasY = e.clientY - canvasRect.top;
        console.log('canvasX', canvasX)
        console.log('canvasY', canvasY)
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
                    return <Area area={area} startCreateArea={startCreateArea}/>
                })
            }
        </div>


    )


}
const domAtom = atomWithImmer({
    initialMouseX: 0,// 鼠标按下时的初始坐标
    initialMouseY: 0,// 鼠标按下时的初始坐标
    initialElementWidth: 0,// 鼠标按下时的初始元素宽度
    initialElementHeight: 0,// 鼠标按下时的初始元素高度
    initialLeft: 0,//鼠标按下时的初始初始坐标
    initialTop: 0,//鼠标按下时的初始初始坐标
    dragging:false,
    hovering:false
})
const Area = (props) => {
    const [setting, setSetting] = useAtom(domAtom);
    console.log('setting',setting)
    const paneBox = useRef(null);
    const {area,startCreateArea}=props
    useEffect(()=>{
            console.log('area',area)

            setSetting((s) => {
                s.initialElementWidth =area.width  
                s.initialElementHeight =area.height        
                s.initialLeft =area.x  
                s.initialTop =area.y 
            })
        

    },[area])
    const handleMouseDown = (e, area) => {
        // e.stopPropagation()
        // e.preventDefault();
        setSetting((s) => {
            s.dragging = true
            s.initialMouseX = e.clientX        // 记录鼠标按下时的初始坐标和元素宽度
            s.initialMouseY = e.clientY 
            // s.initialElementWidth = area.width
            // s.initialElementHeight = area.height
            // s.initialLeft = area.x
            // s.initialTop = area.y

        })
    };

    const handleMouseUp = (e) => {
        console.log('handleMouseUp=====11111111')
        setSetting((s) => {
            s.dragging = false

        })

    };



    const handleResize = (e, direction, area) => {
        const {initialLeft,initialTop,dragging,initialMouseX,initialMouseY,initialElementWidth,initialElementHeight}=setting
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
            if (direction === 'top') {
                // 更新顶部调整大小的逻辑
                // 更新元素的顶部位置和高度
                var newTop = initialTop + deltaY;
                var newHeight = initialElementHeight - deltaY;
                area.height = newHeight
                area.y = newTop
                setSetting((s) => {
                    s.initialElementHeight = e.clientX        // 记录鼠标按下时的初始坐标和元素宽度
                    s.initialTop = newTop
        
                })

            } else if (direction === 'right') {

                // 更新元素的右边框位置和宽度
                var newWidth = initialElementWidth + deltaX;
                setSetting((s) => {
                    s.initialElementWidth =newWidth        
                })
                area.width = newWidth
            } else if (direction === 'bottom') {
                // 更新底部调整大小的逻辑
                var newHeight = initialElementHeight + deltaY;
                area.height = newHeight
                setSetting((s) => {
                    s.initialElementHeight =newHeight        
                })
            } else if (direction === 'left') {
                // 计算鼠标移动的距离
                var deltaX = e.clientX - initialMouseX;
                // 更新元素的左边框位置和宽度
                var newLeft = initialLeft + deltaX;
                var newWidth = initialElementWidth - deltaX;
                area.width = newWidth
                area.x = newLeft
                setSetting((s) => {
                    s.initialLeft =newLeft  
                    s.initialElementWidth =newWidth        
      
                })
            }
            console.log('area111', area)
            // data.forEach(l => {
            //     if (l.id === area.id) {
            //         l = area
            //     }
            // })
            // setData([...data])
      
        }

    };

    const handleMouseEnter = (e) => {
        setSetting(s=>{
            s.hovering=true
        })
    };

    const handleMouseLeave = (e) => {
        setSetting(s=>{
            s.hovering=false
        })
    };


    return ( <div style={{ position: 'absolute', width: setting.initialElementWidth, height: setting.initialElementHeight, left: setting.initialLeft, top: setting.initialTop, background: '#e6f7ff' }}>
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
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            style={{ width: setting.initialElementWidth, height: setting.initialElementHeight, left: setting.initialLeft, top: setting.initialTop,}}>

                            <div
                            // onMouseDown={e => mouseDown("resize", e)}
                            >
                                {area.type}

                            </div>
                        </div>
                    </div>
             

    )


}
export default DropBoard