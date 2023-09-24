import React, { useState } from 'react'
import styles from './index.module.scss'
// import BoardCavas from '@/components/BoardCavas'

import {DragTool} from './left'


export default function ListView(props) {
 
    return <div className={styles.Container}>
       <div className={styles.left}>
      <DragTool />

    </div> <div className={styles.right}>
      {/* <Left /> */}

    </div>

    </div>
}