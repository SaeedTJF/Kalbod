import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function LineChart({ data }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);
        let listdata = []
        let listmonth = []
        
        for (let i in data){
            if (i == 'null'){
                listdata.push("No Model")
                listmonth.push({
                    name: 'No Model',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        //     {
                        //         offset: 0,
                        //         color: 'rgb(128, 255, 165)'
                        //     },
                        //     {
                        //         offset: 1,
                        //         color: 'rgb(1, 191, 236)'
                        //     }
                        // ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data[i]
                })

            }else {
                listdata.push(i)
                listmonth.push({
                    name: i,
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        //     {
                        //         offset: 0,
                        //         color: 'rgb(128, 255, 165)'
                        //     },
                        //     {
                        //         offset: 1,
                        //         color: 'rgb(1, 191, 236)'
                        //     }
                        // ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data[i]
                })
            }
        }
        
        console.log(listmonth)

        

        const option = {
            color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: listdata
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'
                        , 'October'
                        , 'November'
                        , 'December']
                }









            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: listmonth
        };

        chartInstance.setOption(option);

        return () => {
            chartInstance.dispose();
        };
    }, [data]);

    return <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>;
}
