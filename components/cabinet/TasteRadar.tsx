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
        <div className="w-full h-full bg-card/40 backdrop-blur-xl rounded-[40px] p-6 border border-border shadow-2xl relative overflow-hidden group">
            {/* Ambient Background Glow - Theme Aware */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 blur-[100px] rounded-full group-hover:bg-amber-500/20 transition-all duration-700" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-foreground/5 blur-[100px] rounded-full" />

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid 
                        stroke="currentColor" 
                        className="text-muted-foreground/20" 
                        strokeDasharray="3 3" 
                    />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ 
                            fill: 'currentColor', 
                            fontSize: 10, 
                            fontWeight: 800, 
                            letterSpacing: '0.05em' 
                        }} 
                        className="text-foreground/70"
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Palate DNA"
                        dataKey="A"
                        stroke="#FFBF00"
                        strokeWidth={2}
                        fill="#FFBF00"
                        fillOpacity={0.15}
                        animationBegin={0}
                        animationDuration={1500}
                        dot={{ r: 3, fill: '#FFBF00', stroke: 'currentColor', strokeWidth: 1 }}
                        className="text-background"
                        activeDot={{ r: 5, fill: '#FFBF00', stroke: 'currentColor', strokeWidth: 2 }}
                    />
                </RadarChart>
            </ResponsiveContainer>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
               <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full blur-[1px]" />
            </div>
        </div>
    );
}
