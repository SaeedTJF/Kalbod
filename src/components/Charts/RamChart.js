import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function RamChart({ data, name, value }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);

        const option = {
            series: [
                {
                    type: 'gauge',
                    startAngle: 180,
                    endAngle: 0,
                    center: ['50%', '75%'],
                    radius: '90%',
                    min: 0,
                    max: 1,
                    splitNumber: 8,
                    axisLine: {
                        lineStyle: {
                            width: 2,
                            color: [
                                [0.25, '#2bbc66'],
                                [0.5, '#58D9F9'],
                                [0.75, '#FDDD60'],
                                [1, '#FF6E76']
                            ]
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 10,
                        offsetCenter: [0, '-60%'],
                        itemStyle: {
                            color: 'auto'
                        }
                    },
                    axisTick: {
                        length: 12,
                        lineStyle: {
                            color: 'auto',
                            width: 2
                        }
                    },
                    splitLine: {
                        length: 15,
                        lineStyle: {
                            color: 'auto',
                            width: 2
                        }
                    },
                    axisLabel: {
                        color: '#464646',
                        fontSize: 12,
                        distance: -60,
                        rotate: 'tangential',
                        formatter: function (value) {
                            if (value === 0.875) {
                                return 'Less';
                            } else if (value === 0.625) {
                                return 'Normal';
                            } else if (value === 0.375) {
                                return 'High';
                            } else if (value === 0.125) {
                                return 'Critical';
                            }
                            return '';
                        }
                    },
                    title: {
                        offsetCenter: [0, '-10%'],
                        fontSize: 20
                    },
                    detail: {
                        fontSize: 30,
                        offsetCenter: [0, '-35%'],
                        valueAnimation: true,
                        formatter: function (value) {
                            return Math.round(value * 100) + '';
                        },
                        color: 'inherit'
                    },
                    data: [
                        {
                            value: `${value}`,
                            name: `${name}`
                        }
                    ]
                }
            ]
        };

        chartInstance.setOption(option);

        return () => {
            chartInstance.dispose();
        };
    }, [data, name]);

    return <div ref={chartRef} style={{ width: '30%', height: '250px' }}></div>;
}
