import React, { useEffect, useRef } from 'react';
import { DatePicker } from 'antd';
const { RangePicker: AntRangePicker } = DatePicker;

const RangePicker = (props) => {
  return <AntRangePicker disabled={props.disabled} showTime placeholder="请选择时间" style={{ width: '100%', height: '100%' }}/>

};

export default RangePicker;
