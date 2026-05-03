'use client';

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer
} from 'recharts';

interface TasteRadarProps {
    data: {
        subject: string;
        A: number; // 0-100
        fullMark: 100;
    }[];
}

export default function TasteRadar({ data }: TasteRadarProps) {
    return (
        <div className="w-full min-h-[300px] md:min-h-[400px] aspect-square bg-card/40 backdrop-blur-xl rounded-[40px] p-6 border border-border shadow-2xl relative overflow-hidden group">
            {/* Ambient Background Glow - Theme Aware */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-foreground/5 blur-[100px] rounded-full" />

            <ResponsiveContainer width="100%" height={300} minHeight={300} debounce={50}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid 
                        stroke="currentColor" 
                        className="text-muted-foreground/10" 
                        strokeDasharray="4 4" 
                    />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ 
                            fill: 'currentColor', 
                            fontSize: 11, 
                            fontFamily: 'inherit',
                            fontWeight: 900, 
                            letterSpacing: '0.05em' 
                        }} 
                        className="text-foreground/60"
                    />
                    <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={false} 
                        axisLine={false} 
                    />
                    <Radar
                        name="Palate DNA"
                        dataKey="A"
                        stroke="#FFBF00"
                        strokeWidth={3}
                        fill="#FFBF00"
                        fillOpacity={0.25}
                        animationBegin={200}
                        animationDuration={2000}
                        dot={{ 
                            r: 4, 
                            fill: '#FFBF00', 
                            stroke: 'white', 
                            strokeWidth: 2 
                        }}
                        activeDot={{ 
                            r: 6, 
                            fill: '#FFBF00', 
                            stroke: 'white', 
                            strokeWidth: 3,
                            className: "shadow-2xl" 
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
               <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full blur-[1px]" />
            </div>
        </div>
    );
}
