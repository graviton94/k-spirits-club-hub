'use client';

import { motion } from 'framer-motion';
import { FlavorAnalysis, HierarchicalNode } from '@/lib/utils/flavor-engine';
import { useState, useMemo } from 'react';

interface MindMapProps {
  analysis: FlavorAnalysis;
  profileImage?: string | null;
}

/**
 * Hierarchical Mind Map Component
 * Visualizes user's flavor preferences in 3 layers:
 * - User (center)
 * - Products (middle orbit)
 * - Tags (outer orbit)
 * 
 * Refactored to use a single global SVG for connections and separate info sections.
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

  const nodes = analysis.hierarchicalNodes || [];

  // Generate star positions once
  const stars = useMemo(() =>
    Array.from({ length: 50 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    })), []
  );

  // Color mapping for categories
  const getCategoryColor = (category?: string) => {
    if (!category) return 'from-amber-400 to-orange-500';
    if (category.includes('소주')) return 'from-blue-400 to-cyan-500';
    if (category.includes('위스키')) return 'from-amber-500 to-yellow-600';
    if (category.includes('전통주')) return 'from-green-400 to-emerald-500';
    if (category.includes('일반증류주')) return 'from-purple-400 to-fuchsia-500';
    return 'from-gray-400 to-slate-500';
  };

  const getCategoryColorValue = (category?: string) => {
    if (!category) return '#f59e0b'; // amber-500
    if (category.includes('소주')) return '#3b82f6'; // blue-500
    if (category.includes('위스키')) return '#f59e0b'; // amber-500
    if (category.includes('전통주')) return '#22c55e'; // green-500
    if (category.includes('일반증류주')) return '#d946ef'; // fuchsia-500
    return '#6b7280'; // gray-500
  };

  // Helper to find parent node position
  const getParentPosition = (node: HierarchicalNode) => {
    if (node.type === 'product') {
      // Connect to User (0,0)
      return { x: 0, y: 0 };
    }
    if (node.type === 'tag' && node.connections.length > 0) {
      const parentId = node.connections[0];
      const parent = nodes.find(n => n.id === parentId);
      return parent ? parent.position : { x: 0, y: 0 };
    }
    return { x: 0, y: 0 };
  };

  // Render node content (without lines)
  const renderNodeContent = (node: HierarchicalNode, index: number) => {
    const isSelected = selectedNode === node.id;
    const isConnected = selectedNode && nodes.find(n => n.id === selectedNode)?.connections.includes(node.id);
    const shouldHighlight = !selectedNode || isSelected || isConnected;

    if (node.type === 'user') {
      return (
        <motion.div
          key={node.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="absolute z-20"
          style={{
            left: '50%',
            top: '50%',
            x: '-50%',
            y: '-50%' // Center user node exactly
          }}
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px 8px rgba(251, 191, 36, 0.5)',
                '0 0 50px 15px rgba(251, 191, 36, 0.3)',
                '0 0 30px 8px rgba(251, 191, 36, 0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center overflow-hidden"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-3xl">🌟</div>
            )}
          </motion.div>
        </motion.div>
      );
    }

    if (node.type === 'product') {
      return (
        <motion.div
          key={node.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: shouldHighlight ? 1 : 0.3,
            x: node.position.x,
            y: node.position.y,
          }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 12,
            delay: index * 0.05 + 0.2,
          }}
          className="absolute cursor-pointer z-10"
          onClick={() => setSelectedNode(isSelected ? null : node.id)}
          style={{
            left: '50%',
            top: '50%',
            // Framer motion x/y handles translation from center
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ x: '-50%', y: '-50%' }} // Center the div on its coordinate
            animate={{
              boxShadow: isSelected
                ? '0 0 25px 6px rgba(251, 191, 36, 0.6)'
                : '0 0 15px 4px rgba(251, 191, 36, 0.3)',
            }}
            className={`relative px-3 py-2 rounded-lg bg-gradient-to-r ${getCategoryColor(node.category)} text-white font-bold text-xs shadow-lg`}
          >
            <div className="text-center whitespace-nowrap">{node.label}</div>
            <div className="text-[10px] text-center opacity-70">{node.category}</div>
          </motion.div>
        </motion.div>
      );
    }

    if (node.type === 'tag') {
      return (
        <motion.div
          key={node.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: shouldHighlight ? 1 : 0.2,
            x: node.position.x,
            y: node.position.y,
          }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 10,
            delay: index * 0.03 + 0.4,
          }}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ x: '-50%', y: '-50%' }} // Center the div on its coordinate
            className="relative px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] font-medium shadow-sm"
          >
            {node.label}
          </motion.div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Mind Map Visualization Area */}
      <div className="relative w-full min-h-[50vh] bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-900 dark:to-black rounded-t-3xl overflow-hidden border-b border-gray-200 dark:border-gray-800">
        {/* Starfield background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

        {/* Global Connections Layer (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {nodes.map((node, index) => {
            if (node.type === 'user') return null;

            const parentPos = getParentPosition(node);
            const isSelected = selectedNode === node.id;

            // Determine line style
            let strokeColor = 'rgba(251, 191, 36, 0.3)';
            let strokeWidth = isSelected ? 2 : 1;
            let strokeDasharray = node.type === 'tag' ? "2 2" : "4 4";

            if (node.type === 'tag') {
              strokeColor = 'rgba(255, 255, 255, 0.15)';
            } else if (node.type === 'product') {
              // Use category color for product lines if desired, or keep amber
              strokeColor = isSelected ? 'rgba(251, 191, 36, 0.6)' : 'rgba(251, 191, 36, 0.3)';
            }

            return (
              <motion.line
                key={`line-${node.id}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.05 }}
                // Center of container is 50%, 50%.
                // Node positions are relative to center (0,0).
                // So we add '50%' to map (0,0) to center.
                // calc(50% + {x}px) works perfectly.
                x1={`calc(50% + ${parentPos.x}px)`}
                y1={`calc(50% + ${parentPos.y}px)`}
                x2={`calc(50% + ${node.position.x}px)`}
                y2={`calc(50% + ${node.position.y}px)`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
              />
            );
          })}
        </svg>

        {/* Nodes Layer */}
        <div className="relative w-full h-full min-h-[50vh]">
          {nodes.map((node, index) => renderNodeContent(node, index))}
        </div>

        {/* Info text overlay */}
        <div className="absolute top-4 left-0 right-0 text-center px-4 pointer-events-none">
          <p className="text-gray-500 text-xs sm:text-sm">
            💡 제품을 클릭하여 연결된 태그를 확인하세요
          </p>
        </div>
      </div>

      {/* 2. Persona & Stats Section */}
      <div className="bg-white dark:bg-gray-900 rounded-b-3xl p-6 border-x border-b border-gray-200 dark:border-gray-800 shadow-xl space-y-8">

        {/* Persona Section */}
        <div className="text-center">
          <h3 className="text-xs font-bold text-amber-500 tracking-widest uppercase mb-2">My Spirit Persona</h3>
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 dark:from-amber-700 dark:via-orange-600 dark:to-amber-700">
            <div className="px-8 py-4 bg-white dark:bg-gray-900 rounded-xl">
              <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                " {analysis.persona} "
              </p>
            </div>
          </div>
        </div>

        {/* Category Distribution Section */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 text-center uppercase tracking-widest mb-4">
            Collection Analysis
          </h3>
          <div className="flex flex-wrap gap-4 justify-center items-end">
            {analysis.categoryDistribution.map((cat, index) => (
              <div key={cat.category} className="flex flex-col items-center gap-2 group cursor-default">
                {/* Bar visual */}
                <div className="relative w-8 bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden group-hover:scale-110 transition-transform">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(cat.percentage, 10) * 1.5}px` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className="w-full absolute bottom-0 rounded-t-lg opacity-80"
                    style={{ backgroundColor: getCategoryColorValue(cat.category) }}
                  />
                  <div className="h-[150px] w-full invisible"></div> {/* Spacer for max height */}
                </div>

                {/* Label */}
                <div className="text-center">
                  <span className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                    {cat.percentage}%
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    {cat.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
