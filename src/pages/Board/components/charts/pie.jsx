import React, { useEffect, useRef } from 'react';
const Pie = (props) => {
    const {echarts,themeType}=props
  const chartRef = useRef(null);
  const resizeObserver = useRef(null);
  useEffect(() => {
    // 销毁旧的ECharts实例
  if (chartRef.current && echarts.getInstanceByDom(chartRef.current)) {
    echarts.dispose(chartRef.current);
  }

    const myChart = echarts.init(chartRef.current,themeType);
    const option = {
    //   title: {
    //     text: 'Referer of a Website',
    //     subtext: 'Fake Data',
    //     left: 'center'
    //   },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myChart.setOption(option);
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
              });
          }
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

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}/>;
};

export default Pie;
