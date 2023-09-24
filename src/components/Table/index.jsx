import React from 'react';
import { Table } from 'antd';
import styles from './index.module.scss'
import { FileWordTwoTone ,FileExcelTwoTone} from '@ant-design/icons';
import folder from '@/assets/images/folder.png';

const getImg=(type)=>{
  let img;
  switch(type){
      case "1":
          img=<FileWordTwoTone className={styles.icon} />;
          break
          case "2":
              img=<FileExcelTwoTone className={styles.icon} />;
              break
          default:
              img=<img src={folder} alt="logo" className={styles.icon}/>;

  }
  return img
}
const columns= [
  { title: 'Name', dataIndex: 'name', key: 'name',
  render:(r,row) => {
    return <div>{getImg(row.type)}{r}</div>
  } },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
];



const App = (props) => (
  <>
  <div className={styles.driver}></div>
  <Table
    columns={columns}
    rowSelection={{}}
    dataSource={props.list}
    pagination={false}
  /></>
);

export default App;