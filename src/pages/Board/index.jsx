import React from 'react'
import styles from './index.module.scss'
// import BoardCavas from '@/components/BoardCavas'

import DragTool from './components/left'
// import DropBoard from './components/right'
// import DropBoard from './components/free'
import DropBoard from './components/row'


export default function ListView(props) {
 
    return <div className={styles.Container}>
       <div className={styles.left}>
      <DragTool />

    </div> 
    <div className={styles.right}>
    <DropBoard />


    </div>

    </div>
}