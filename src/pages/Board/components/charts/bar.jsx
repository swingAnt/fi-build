import React, { useEffect, useRef } from 'react';

const Bar = (props) => {
  const {echarts,themeType}=props

  const chartRef = useRef(null);
  const resizeObserver = useRef(null);

  useEffect(() => {
       // 销毁旧的ECharts实例
  if (chartRef.current && echarts.getInstanceByDom(chartRef.current)) {
    echarts.dispose(chartRef.current);
  }

    const myChart = echarts.init(chartRef.current, themeType);
    const option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [
            120,
            {
              value: 200,
              itemStyle: {
                color: '#a90000'
              }
            },
            150,
            80,
            70,
            110,
            130
          ],
          type: 'bar'
        }
      ]
    };

    myChart.setOption(option);

    // 开始监听chartRef.current的尺寸变化
    resizeObserver.current = new ResizeObserver(entries => {
      // 检查尺寸是否真的发生了变化
      for (let entry of entries) {
        const {width, height} = entry.contentRect;
        if (myChart.getWidth() !== width || myChart.getHeight() !== height) {
          // 当父容器尺寸变化时，调用echarts的resize方法
          window.requestAnimationFrame(() => {
            if (myChart && myChart.resize) {
              myChart.resize();
            }
          });        }
      }
    });
    
    // 开始监听chartRef.current的尺寸变化
    if (chartRef.current && resizeObserver.current) {
      resizeObserver.current.observe(chartRef.current);
    }
    
    return () => {
      // 在组件卸载时停止监听
      if (chartRef.current && resizeObserver.current) {
        resizeObserver.current.unobserve(chartRef.current);
      }
    };
    
  }, [themeType]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default Bar;
