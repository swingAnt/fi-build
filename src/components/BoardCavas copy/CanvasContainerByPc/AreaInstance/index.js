import React, { Component, Fragment } from "react";
import Thumbnails, { Thumbnail } from '@antv/thumbnails';
import { CaretDownOutlined } from '@ant-design/icons';
import { Switch ,Menu,Dropdown} from 'antd';


import "./index.less";

const chartTypeList = Object.keys(Thumbnails);
export default class AreaInstance extends Component {
    state = {
        showImgBorder: false,
        bgDarkMode: false,
        current: chartTypeList[0],
    
      };
    handleClick = (e) => {
        this.setState({
          current: e.key,
        });
      };
    renderArea = (area) => {
        const { isActive } = this.props;
        const { current } = this.state;
        const liItems = chartTypeList.map((item) => {
            return <Menu.Item key={item}>{item}</Menu.Item>;
          });
          const menu = (
            <Menu onClick={this.handleClick} selectedKeys={[this.state.current]}>
              {liItems}
            </Menu>
          );
      
        let instance;
        if (!area) {
            return null
        }
        console.log('instance-area.type',area.type)
        // const {
        //     component: Component,
        //     manifest: { defaultValue },
        // } = Template[widget.type];
        // const displaySet =
        //     widget && widget.setting && widget.setting.displaySet
        //         ? widget.setting.displaySet
        //         : {};
        // const initProps = Object.assign(defaultValue, displaySet);
        // const newSize = { ...size, width: null };
        //    switch (area.type) {
        //         case "text":
        //                 instance = <>
                             
        //                 </>;
        //                 break;
        //                 default:
        //                         break;
        //                 }


        return    <Fragment>
      <Thumbnail chart={area.type} width={'100%'} height='80%' />
     {/* <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
       <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
         Select Chart Type <CaretDownOutlined />
       </a>
     </Dropdown> */}
     {/* <span> : {current}</span> */}
        </Fragment>
    };
    render() {
        const { area } = this.props;
        return (
            <div className="layout-setting">
                {this.renderArea(area)}
            </div>
        );
    }
}
