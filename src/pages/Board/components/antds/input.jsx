import React, { useEffect, useRef } from 'react';
import { Input as AntInput } from 'antd';

const Input = (props) => {
  return <AntInput disabled={props.disabled} placeholder="请输入内容" style={{ width: '100%', height: '100%' }}  />

};

export default Input;
