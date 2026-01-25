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

  // Render node based on type
  const renderNode = (node: HierarchicalNode, index: number) => {
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
          className="absolute z-10"
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
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center overflow-hidden"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-3xl">🌟</div>
            )}
          </motion.div>

          {/* User persona label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <p className="text-amber-300 font-bold text-xs text-center">
              {analysis.persona}
            </p>
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
          className="absolute cursor-pointer"
          onClick={() => setSelectedNode(isSelected ? null : node.id)}
          style={{
            left: '50%',
            top: '50%',
          }}
        >
          {/* Connection line to user */}
          <svg
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              width: Math.abs(node.position.x) * 2 + 100,
              height: Math.abs(node.position.y) * 2 + 100,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.line
              x1="50%"
              y1="50%"
              x2={`calc(50% - ${node.position.x}px)`}
              y2={`calc(50% - ${node.position.y}px)`}
              stroke="rgba(251, 191, 36, 0.3)"
              strokeWidth={isSelected ? "2" : "1"}
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
            />
          </svg>

          {/* Product node */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
          {/* Connection line to product */}
          {node.connections[0] && (() => {
            const parentNode = nodes.find(n => n.id === node.connections[0]);
            if (!parentNode) return null;

            const dx = node.position.x - parentNode.position.x;
            const dy = node.position.y - parentNode.position.y;

            return (
              <svg
                className="absolute left-1/2 top-1/2 pointer-events-none"
                style={{
                  width: Math.abs(dx) + 50,
                  height: Math.abs(dy) + 50,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% - ${dx}px)`}
                  y2={`calc(50% - ${dy}px)`}
                  stroke="rgba(251, 191, 36, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.03 + 0.5 }}
                />
              </svg>
            );
          })()}

          {/* Tag node */}
          <motion.div
            whileHover={{ scale: 1.05 }}
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
    <div className="relative w-full min-h-[70vh] bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-900 dark:to-black rounded-3xl overflow-hidden">
      {/* Starfield background */}
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

      {/* Central container */}
      <div className="relative flex items-center justify-center min-h-[70vh] p-8">
        {nodes.map((node, index) => renderNode(node, index))}
      </div>

      {/* Category distribution at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent"
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
          💡 제품을 클릭하여 연결된 태그를 확인하세요
        </p>
      </motion.div>
    </div>
  );
}
