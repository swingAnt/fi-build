import React, { useEffect, useRef } from 'react';

const Sunburst = (props) => {
  const chartRef = useRef(null);
  const resizeObserver = useRef(null);
  const {echarts,themeType}=props

  useEffect(() => {
       // 销毁旧的ECharts实例
  if (chartRef.current && echarts.getInstanceByDom(chartRef.current)) {
    echarts.dispose(chartRef.current);
  }

    const myChart = echarts.init(chartRef.current, themeType);
    const option = {
      silent: true,
      series: [
        {
          radius: ['15%', '80%'],
          type: 'sunburst',
          sort: undefined,
          emphasis: {
            focus: 'ancestor'
          },
          data: [
            {
              value: 8,
              children: [
                {
                  value: 4,
                  children: [
                    {
                      value: 2
                    },
                    {
                      value: 1
                    },
                    {
                      value: 1
                    },
                    {
                      value: 0.5
                    }
                  ]
                },
                {
                  value: 2
                }
              ]
            },
            {
              value: 4,
              children: [
                {
                  children: [
                    {
                      value: 2
                    }
                  ]
                }
              ]
            },
            {
              value: 4,
              children: [
                {
                  children: [
                    {
                      value: 2
                    }
                  ]
                }
              ]
            },
            {
              value: 3,
              children: [
                {
                  children: [
                    {
                      value: 1
                    }
                  ]
                }
              ]
            }
          ],
          label: {
            color: '#000',
            textBorderColor: '#fff',
            textBorderWidth: 2,
            formatter: function (param) {
              var depth = param.treePathInfo.length;
              if (depth === 2) {
                return 'radial';
              } else if (depth === 3) {
                return 'tangential';
              } else if (depth === 4) {
                return '0';
              }
              return '';
            }
          },
          levels: [
            {},
            {
              itemStyle: {
                color: '#CD4949'
              },
              label: {
                rotate: 'radial'
              }
            },
            {
              itemStyle: {
                color: '#F47251'
              },
              label: {
                rotate: 'tangential'
              }
            },
            {
              itemStyle: {
                color: '#FFC75F'
              },
              label: {
                rotate: 0
              }
            }
          ]
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

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default Sunburst;
