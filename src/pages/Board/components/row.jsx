
import style from "./row.module.scss"
import { getDragData,draftEvent ,getUuid} from "@/utils";
import { useAtom, atom ,useAtomValue,useSetAtom,} from 'jotai'
import { useEffect, useState,useRef } from "react";
import { Col, Row, Slider } from 'antd';
const gutters = {};
const vgutters = {};
const colCounts = {};
[8, 16, 24, 32, 40, 48].forEach((value, i) => {
  gutters[i] = value;
});
[8, 16, 24, 32, 40, 48].forEach((value, i) => {
  vgutters[i] = value;
});
[2, 3, 4, 6, 8, 12].forEach((value, i) => {
  colCounts[i] = value;
});
const dataAtom = atom([])
const DropBoard=(props)=> {
    const [gutterKey, setGutterKey] = useState(1);
    const [vgutterKey, setVgutterKey] = useState(1);
    const [colCountKey, setColCountKey] = useState(2);
    const cols = [];
    const colCount = colCounts[colCountKey];
    const paneBox = useRef(null);

    
        return (<>
            <span>Horizontal Gutter (px): </span>
            <div
              style={{
                width: '50%',
              }}
            >
              <Slider
                min={0}
                max={Object.keys(gutters).length - 1}
                value={gutterKey}
                onChange={setGutterKey}
                marks={gutters}
                step={null}
                tooltip={{
                  formatter: (value) => gutters[value],
                }}
              />
            </div>
            <span>Vertical Gutter (px): </span>
            <div
              style={{
                width: '50%',
              }}
            >
              <Slider
                min={0}
                max={Object.keys(vgutters).length - 1}
                value={vgutterKey}
                onChange={setVgutterKey}
                marks={vgutters}
                step={null}
                tooltip={{
                  formatter: (value) => vgutters[value],
                }}
              />
            </div>
            <span>Column Count:</span>
            <div
              style={{
                width: '50%',
                marginBottom: 48,
              }}
            >
              <Slider
                min={0}
                max={Object.keys(colCounts).length - 1}
                value={colCountKey}
                onChange={setColCountKey}
                marks={colCounts}
                step={null}
                tooltip={{
                  formatter: (value) => colCounts[value],
                }}
              />
            </div>
            <RowView gutterKey={gutterKey} vgutterKey={vgutterKey} colCount={colCount}/>
            <RowView gutterKey={gutterKey} vgutterKey={vgutterKey} colCount={colCount}/>


            {/* Todu 代码模版 */}
            {/* Another Row:
            <Row gutter={[gutters[gutterKey], vgutters[vgutterKey]]}>{cols}</Row>
            <pre className="demo-code">{`<Row gutter={[${gutters[gutterKey]}, ${vgutters[vgutterKey]}]}>\n${colCode}\n${colCode}</Row>`}</pre>
            <pre className="demo-code">{`<Row gutter={[${gutters[gutterKey]}, ${vgutters[vgutterKey]}]}>\n${colCode}</Row>`}</pre> */}
            </>
        )
    
    
}
const RowView=(props)=> {
    let {colCount,gutterKey,vgutterKey} =props

    const cols = [];

    let colCode = '';

    for (let i = 0; i < colCount; i++) {
        cols.push(
          <Col key={i.toString()} span={24 / colCount}>
            <div className={style.card}>Column</div>
          </Col>,
        );
        colCode += `  <Col span={${24 / colCount}} />\n`;
      }
        return (<>
            
            <Row gutter={[gutters[gutterKey], vgutters[vgutterKey]]}
            style={{marginBottom:'20px'}}
            >
              {cols}
            </Row>
            {/* Todu 代码模版 */}
            {/* Another Row:
            <Row gutter={[gutters[gutterKey], vgutters[vgutterKey]]}>{cols}</Row>
            <pre className="demo-code">{`<Row gutter={[${gutters[gutterKey]}, ${vgutters[vgutterKey]}]}>\n${colCode}\n${colCode}</Row>`}</pre>
            <pre className="demo-code">{`<Row gutter={[${gutters[gutterKey]}, ${vgutters[vgutterKey]}]}>\n${colCode}</Row>`}</pre> */}
            </>
        )
    
    
}
export default DropBoard
