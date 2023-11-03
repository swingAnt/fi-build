import React, { useEffect, useRef } from 'react';
import { Select as AntSelect } from 'antd';


const onChange = (value) => {
  console.log(`selected ${value}`);
};
const onSearch = (value) => {
  console.log('search:', value);
};

// Filter `option.label` match the user type `input`
const filterOption = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
const Select = (props) => (
  <AntSelect
  disabled={props.disabled}
    showSearch
    placeholder="请选择" 
    style={{ width: '100%', height: '100%' }}
    optionFilterProp="children"
    onChange={onChange}
    onSearch={onSearch}
    filterOption={filterOption}
    options={[
      {
        value: '肯德基',
        label: '肯德基',
      },
      {
        value: '麦当劳',
        label: '麦当劳',
      },
      {
        value: '德克士',
        label: '德克士',
      },
    ]}
  />
);
export default Select;