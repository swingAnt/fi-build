import React from "react";
import { draftEvent } from "@/utils/index";
import CanvasContainerByPc from "./CanvasContainerByPc";
import styles from './index.module.scss'

const Init = () => {

  const startCreateArea = (type, e) => {
    draftEvent(e, "type", type);
    e.stopPropagation();
  };


  return (
    <div className={styles.init}>

      <div className={styles.left}  >
        <div
          draggable={true}
          onDragStart={(e) => startCreateArea("area_chart", e)}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          折线图
        </div>
        <div
          draggable={true}
          onDragStart={(e) => startCreateArea("donut_chart", e)}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          环图
        </div>
        <div
          draggable={true}
          onDragStart={(e) => startCreateArea("bar_chart", e)}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          柱状图
        </div>
        <div
          draggable={true}
          onDragStart={(e) => startCreateArea("heatmap", e)}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          分组图
        </div>
        <div
          draggable={true}
          onDragStart={(e) => startCreateArea("scatter_plot", e)}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          散点图
        </div>
        <div
          draggable={true}
          onDragStart={(e) => startCreateArea("radar_chart", e)}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          雷达图
        </div>
        <div
          draggable={true}
          onDragStart={(e) => startCreateArea("pie_chart", e)}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          饼图
        </div>
      </div>
      <div className={styles.right}  >
        <CanvasContainerByPc />
      </div>
    </div>
  );
};

export default Init;
