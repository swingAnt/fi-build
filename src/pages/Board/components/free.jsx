
import style from "./free.module.scss"
import { getDragData, draftEvent, getUuid } from "@/utils";
import { useAtom, atom, useAtomValue, useSetAtom, } from 'jotai'
import { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import View from './view'


const dataAtom = atom([])
const DropBoard = (props) => {
  const [data, setData] = useAtom(dataAtom);
  const paneBox = useRef(null);
  const [hovering, setHovering] = useState('');
  const [draging, setDraging] = useState('');

  const startCreateArea = (e,area) => {
    const dragDom = document.querySelector(`.chart-${area.id}`)
    draftEvent(e, "dragData", { id: area.id, key:area.key, type:area.type,width:area.width, height:area.height,lt: Math.floor(dragDom.offsetWidth / 2), tp: dragDom.offsetHeight / 2 });
    e.stopPropagation();
    setDraging(area.id)
  };

  const handleDrop = (e) => {
    setDraging('')
    const canvasRect = paneBox.current.getBoundingClientRect();
    const canvasX = e.clientX - canvasRect.left;
    const canvasY = e.clientY - canvasRect.top;
    const dragData = getDragData(e).dragData;
    const { key, type, lt, tp, id,width,height } = dragData;
    let newData
    if (id) {
      newData = data.map(item => {
        if (item.id === id) {
          let x = canvasX;
          let y = canvasY
          // let x = canvasX - lt;//图案中心换为鼠标左侧的点
          // let y = canvasY - tp
          item = {
            ...item,
            x: x > 0 ? x : 0,
            y: y > 0 ? y : 0,
            type: type,
            key: key,
          }
        }
        return item
      })

    } else {
      newData = data.filter(item => item.id !== key)
      let x = canvasX;
      let y = canvasY
      // let x = canvasX - lt;//图案中心换为鼠标左侧的点
      // let y = canvasY - tp
      newData.push({
        id: getUuid(),
        x: x > 0 ? x : 0,
        y: y > 0 ? y : 0,
        type: type,
        key: key,
        width: width,
        height: height
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

  const stylesRef = useRef({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [styles, setStyles] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [id, setId] = useState('');
  const onDotMousedown = (type, e, area) => {
    console.log('onDotMousedown====', type, area)
    e.stopPropagation()
    e.preventDefault()
    // 获取鼠标按下的坐标
    const downX = e.clientX
    const downY = e.clientY
    setId(area.id)
    stylesRef.current = {
      left: area.x,
      top: area.y,
      width: area.width,
      height: area.height,
    }
    setStyles({
      left: area.x,
      top: area.y,
      width: area.width,
      height: area.height,
    })

    const resizePaneAndUp = (e, up) => {

      if (up) {
        console.log('stylesstylesstylesstyles', stylesRef.current)


        data.forEach(l => {
          if (l.id === area.id) {
            l.x = stylesRef.current.left
            l.y = stylesRef.current.top
            l.width = stylesRef.current.width
            l.height = stylesRef.current.height

          }

        })
        setData(data)
      } else {
        // 移动的x距离
        const disX = e.clientX - downX
        // 移动的y距离
        const disY = e.clientY - downY
        // 是否是上方缩放圆点
        const hasT = type === 'top'
        // 是否是左方缩放圆点
        const hasL = type === 'left'

        let width = area.width + (hasL ? -disX : disX)
        let height = area.height + (hasT ? -disY : disY)

        // 如果是左侧缩放圆点，修改left位置
        let left = area.x + (hasL ? disX : 0)

        // 如果是上方缩放圆点，修改top位置
        let top = area.y + (hasT ? disY : 0)

        if (['top', 'bottom'].includes(type)) {
          // 上下就不改变宽度
          width = area.width

        } else {
          // 左右就不改变高度
          height = area.height

        }

        // 处理逆向缩放
        if (width < 0) {
          width = -width
          left -= width
        }
        if (height < 0) {
          height = -height
          top -= height
        }
        stylesRef.current = {
          left, top, width, height
        }
        setStyles({
          left, top, width, height
        })
        console.log('stylesRef.current=', stylesRef.current)
      }



    }


    const onMousemove = (e) => {
      resizePaneAndUp(e, false)
    }


    const onMouseup = (_e) => {
      setId('')
      resizePaneAndUp(e, true)

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

  const handleMouseEnter = (id) => {
    setHovering(id);
  };

  const handleMouseLeave = (e) => {
    setHovering();
  };
  console.log('data======', data)
  console.log('styles======', styles)
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
            onMouseEnter={() => handleMouseEnter(area.id)}
            onMouseLeave={handleMouseLeave}
            className={style.draggableElement}
            style={id === area.id ? {
              position: 'absolute',
              ...styles,
              background: '#e6f7ff'
            } : {
              position: 'absolute',
              width: area.width, height: area.height, left: area.x, top: area.y,
              background: '#e6f7ff'
            }}
          >
            {hovering === area.id && (
              <>
                <div
                  className={classnames(style.handle, style.top)}
                  onMouseDown={(e) => onDotMousedown('top', e, area)} />
                <div
                  className={classnames(style.handle, style.right)}
                  onMouseDown={(e) => onDotMousedown('right', e, area)}
                />
                <div
                  className={classnames(style.handle, style.bottom)}
                  onMouseDown={(e) => onDotMousedown('bottom', e, area)}

                />
                <div
                  className={classnames(style.handle, style.left)}
                  onMouseDown={(e) => onDotMousedown('left', e, area)}

                />
              </>
            )}

            <div
              draggable={true}
              onDragStart={(e) => startCreateArea( e,area)}
              key={area.id}
              className={classnames(`chart-${area.id}`)}
              style={id === area.id ? {
                ...styles,
                background: '#e6f7ff'
              } : {
                width: area.width, height: area.height, left: area.x, top: area.y,
                background: '#e6f7ff'
              }}
            >
              <View
                type={area.type}
                name={area.key}
                themeType={props.themeType}
                disabled={draging===area.id}
              />



            </div>
          </div>
        })
      }
    </div>


  )


}
export default DropBoard
