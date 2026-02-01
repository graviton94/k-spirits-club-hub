'use client';

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    PolarRadiusAxis
} from 'recharts';

interface TasteRadarProps {
    data: {
        subject: string;
        A: number; // 0-100
        fullMark: 100;
    }[];
    isBackground?: boolean;
}

export default function TasteRadar({ data, isBackground = false }: TasteRadarProps) {
    // 배경용일 경우 색상을 연하게, 메인일 경우 진하게 설정
    const strokeColor = isBackground ? "#4b5563" : "#db2777"; // gray-600 vs pink-600
    const fillColor = isBackground ? "#374151" : "#db2777";   // gray-700 vs pink-600
    const opacity = isBackground ? 0.2 : 0.6;

    return (
        <div className={`w-full h-full ${isBackground ? 'blur-md opacity-30 scale-110' : ''}`}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#404040" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 'bold' }}
                    />
                    {/* 축 범위를 0~100으로 고정 */}
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="My Taste"
                        dataKey="A"
                        stroke={strokeColor}
                        strokeWidth={isBackground ? 1 : 3}
                        fill={fillColor}
                        fillOpacity={opacity}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
