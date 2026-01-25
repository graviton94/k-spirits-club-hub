'use client';

import { motion } from 'framer-motion';
import { FlavorAnalysis } from '@/lib/utils/flavor-engine';
import { useState, useMemo } from 'react';

interface MindMapProps {
  analysis: FlavorAnalysis;
  profileImage?: string | null;
}

/**
 * Galaxy-style Mind Map Component
 * Visualizes user's flavor preferences as an interactive constellation
 */
export default function MindMap({ analysis, profileImage }: MindMapProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  if (analysis.totalSpirits === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
        <div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🌌
          </motion.div>
          <p className="text-gray-400 text-lg">
            술을 수집하면 취향 지도가 생성됩니다
          </p>
        </div>
      </div>
    );
  }

  // Calculate positions for flavor nodes in orbit around center
  const getOrbitPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const topFlavors = analysis.topKeywords.slice(0, 5);
  
  // Use pre-calculated positions from flavor-engine if available
  // Fallback to even circular distribution if positions weren't calculated
  // Note: relatedSpirits is empty in fallback - only used for visualization, not data processing
  const flavorNodes = analysis.flavorNodes || topFlavors.map((flavor, index) => ({
    id: `node-${index}`,
    keyword: flavor.keyword,
    count: flavor.count,
    relatedSpirits: [], // Empty in fallback mode - positions are still visually distributed
    position: getOrbitPosition(index, topFlavors.length, 140)
  }));

  // Generate star positions once to avoid re-rendering
  const stars = useMemo(() => 
    Array.from({ length: 50 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    })), []
  );

  return (
    <div className="relative w-full min-h-[70vh] bg-gradient-to-b from-black via-gray-900 to-black rounded-3xl overflow-hidden">
      {/* Starfield background effect */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Central container for galaxy visualization */}
      <div className="relative flex items-center justify-center min-h-[70vh] p-8">
        {/* Central Sun (User) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="absolute z-10"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 40px 10px rgba(251, 191, 36, 0.5)',
                '0 0 60px 20px rgba(251, 191, 36, 0.3)',
                '0 0 40px 10px rgba(251, 191, 36, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center overflow-hidden"
          >
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-4xl sm:text-5xl">🌟</div>
            )}
          </motion.div>

          {/* User persona label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <p className="text-amber-300 font-bold text-sm sm:text-base text-center">
              {analysis.persona}
            </p>
          </motion.div>
        </motion.div>

        {/* Flavor nodes in orbit */}
        {flavorNodes.map((node, index) => {
          const position = node.position || getOrbitPosition(index, flavorNodes.length, 140);
          const isSelected = selectedNode === node.keyword;

          // Color palette for different flavor types
          const getFlavorColor = (keyword: string) => {
            if (keyword.includes('부드러운') || keyword.includes('스무스')) return 'from-blue-400 to-cyan-400';
            if (keyword.includes('깔끔한') || keyword.includes('청량')) return 'from-emerald-400 to-teal-400';
            if (keyword.includes('곡물')) return 'from-amber-400 to-yellow-400';
            if (keyword.includes('과일') || keyword.includes('플로랄')) return 'from-pink-400 to-rose-400';
            if (keyword.includes('스파이시') || keyword.includes('강렬')) return 'from-red-400 to-orange-400';
            if (keyword.includes('달콤') || keyword.includes('허니')) return 'from-purple-400 to-fuchsia-400';
            return 'from-gray-400 to-slate-400';
          };

          return (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: selectedNode === null || isSelected ? 1 : 0.3,
                x: position.x,
                y: position.y,
              }}
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 12,
                delay: index * 0.1 + 0.3,
              }}
              className="absolute cursor-pointer"
              onClick={() => setSelectedNode(isSelected ? null : node.keyword)}
              style={{
                left: '50%',
                top: '50%',
              }}
            >
              {/* Connection line to center */}
              <svg
                className="absolute left-1/2 top-1/2 pointer-events-none"
                style={{
                  width: Math.abs(position.x) * 2 + 100,
                  height: Math.abs(position.y) * 2 + 100,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% - ${position.x}px)`}
                  y2={`calc(50% - ${position.y}px)`}
                  stroke="rgba(251, 191, 36, 0.2)"
                  strokeWidth={isSelected ? "2" : "1"}
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                />
              </svg>

              {/* Flavor node */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: isSelected
                    ? '0 0 30px 8px rgba(251, 191, 36, 0.6)'
                    : '0 0 20px 5px rgba(251, 191, 36, 0.3)',
                }}
                className={`relative px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r ${getFlavorColor(
                  node.keyword
                )} text-black font-bold text-xs sm:text-sm shadow-lg`}
              >
                <div className="flex items-center gap-2">
                  <span>{node.keyword}</span>
                  <span className="text-[10px] sm:text-xs opacity-70">×{node.count}</span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Category distribution at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent"
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-gray-400 text-xs sm:text-sm font-semibold mb-3 text-center">
            카테고리 분포
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {analysis.categoryDistribution.map((cat, index) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-gray-800/80 border border-gray-700"
              >
                <span className="text-white text-xs sm:text-sm font-medium">
                  {cat.category}
                </span>
                <span className="ml-2 text-amber-400 text-xs sm:text-sm font-bold">
                  {cat.percentage}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Info text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute top-6 left-0 right-0 text-center px-4"
      >
        <p className="text-gray-500 text-xs sm:text-sm">
          💡 향 태그를 클릭하여 상세 정보를 확인하세요
        </p>
      </motion.div>
    </div>
  );
}
