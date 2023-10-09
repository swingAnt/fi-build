// import React, { useEffect, useState } from 'react'
// import styles from './index.module.scss'
// import {createAnimationLoop} from './utils'

// const getSecondsSinceMidnight = ()=> (Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000;


// const ClockFace  = (props) => (
//     <svg viewBox="0 0 200 200" width="95vh">
//       <g transform="translate(100, 100)">
//         {/* static */}
//         <circle class="text-neutral-900" r="99" fill="white" stroke="currentColor" />
//         <Lines numberOfLines={60} class="subsecond" length={2} width={1} />
//         <Lines numberOfLines={12} class="hour" length={5} width={2} />
//         {/* dynamic */}
//         <Hand rotate={props.subsecond} class="subsecond" length={85} width={5} />
//         <Hand rotate={props.hour} class="hour" length={50} width={4} />
//         <Hand rotate={props.minute} class="minute" length={70} width={3} />
//         <Hand rotate={props.second} class="second" length={80} width={2} />
//       </g>
//     </svg>
//   );

// const Clock = () => {
//     const [time, setTime] = useState(getSecondsSinceMidnight());
//     useEffect(()=>{
//         const dispose = createAnimationLoop(() => {
//             setTime(getSecondsSinceMidnight());
//           });        
//           return ()=>{
//             // 做清理工作

//             dispose()
//         }

//     },[])

//     const rotate = (rotate , fixed = 1) => `rotate(${(rotate * 360).toFixed(fixed)})`;

//     const subsecond = () => rotate(time() % 1);
//     const second = () => rotate((time() % 60) / 60);
//     const minute = () => rotate(((time() / 60) % 60) / 60);
//     const hour = () => rotate(((time() / 60 / 60) % 12) / 12);

//     return (
//       <div class="clock">
//         <ClockFace hour={hour()} minute={minute()} second={second()} subsecond={subsecond()} />
//       </div>
//     );
//   };

// const Hand = (props) => {
//     const [local, rest] = splitProps(props, ['rotate', 'length', 'width', 'fixed']);
//     return (
//       <line
//         y1={local.fixed ? local.length - 95 : undefined}
//         y2={-(local.fixed ? 95 : local.length)}
//         stroke="currentColor"
//         stroke-width={local.width}
//         stroke-linecap="round"
//         transform={local.rotate}
//         {...rest}
//       />
//     );
//   };
// export default function (props) {

//   return <Clock />

// }

import React, { useState, useEffect } from 'react';
import styles from './index.module.scss'
import { clsnames } from '@/utils'

function CircularClock() {
    const [secondsAngle, setSecondsAngle] = useState(0);
    const [minutesAngle, setMinutesAngle] = useState(0);
    const [hoursAngle, setHoursAngle] = useState(0);
  
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();
  
      // 计算每个指针的角度
      const secondsDeg = (seconds / 60) * 360;
      const minutesDeg = ((minutes + seconds / 60) / 60) * 360;
      const hoursDeg = ((hours + minutes / 60) / 12) * 360;
  
      // 更新状态
      setSecondsAngle(secondsDeg);
      setMinutesAngle(minutesDeg);
      setHoursAngle(hoursDeg);
  
      // 继续请求下一帧
      requestAnimationFrame(updateClock);
    };
  
    useEffect(() => {
      // 开始请求动画帧
      requestAnimationFrame(updateClock);
    }, []);

    return (
        <div className={styles.circularClock}>
            <div className={styles.clockFace}>
             
            {/* 时钟刻度 */}
        <div className="hour-tick"></div>
        <div className="minute-tick"></div>
        {/* 指针 */}
                    <div className={clsnames(styles.hand, styles.seconds)} style={{ transform: `rotate(${secondsAngle}deg)` }}></div>
                <div className={clsnames(styles.hand, styles.minutes)} style={{ transform: `rotate(${minutesAngle}deg)` }}></div>
                <div className={clsnames(styles.hand, styles.hours)} style={{ transform: `rotate(${hoursAngle}deg)` }}></div>
            </div>
        </div>
    );
}

export default CircularClock;
