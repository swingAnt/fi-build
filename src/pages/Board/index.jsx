import React, { useState } from 'react'
import styles from './index.module.scss'
// import BoardCavas from '@/components/BoardCavas'

import DragTool from './components/left'
import DropBoard1 from './components/right'
import DropBoard2 from './components/free'
import DropBoard3 from './components/row'
import Clock from '@/components/Clock'


export default function ListView(props) {
  const boardMap = [DropBoard1, DropBoard2, DropBoard3]
  const [mode, setMode] = useState(0)
  const DropBoard = boardMap[mode]
  return <>
  <Clock />
  <div>
  <a
      style={mode == 0 ? { color: 'red' } : {}}
      onClick={() => {
        setMode(0)
      }}>网格布局</a>
    <a
      style={mode == 1 ? { color: 'red' } : {}}

      onClick={() => {
        setMode(1)
      }}>自由布局</a>
    <a
      style={mode == 2 ? { color: 'red' } : {}}
      onClick={() => {
        setMode(2)
      }}>流式布局</a>
  </div>

      
      <div className={styles.Container}>
    
    <div className={styles.left}>
      <DragTool />

    </div>
    <div className={styles.right}>
      <DropBoard />


    </div>

  </div>
      </> 

}