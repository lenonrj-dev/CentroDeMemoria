"use client";

import { motion, useReducedMotion } from "framer-motion";
import { memo, useId, useMemo } from "react";

function MiniSpark({
  points = [],
  width = 96,
  height = 28,
  strokeWidth = 1.5,
  filled = true,
  ariaLabel = "mini gráfico",
  loading = false,
  showDot = false,
  strokeClass = "stroke-cyan-400",
  fillClass = "fill-cyan-500/15",
  className = "",
}) {
  const shouldReduce = useReducedMotion();
  const uid = useId();

  const fillTransition = shouldReduce ? { duration: 0 } : { duration: 0.4, ease: "easeOut" };
  const lineTransition = shouldReduce ? { duration: 0 } : { duration: 0.6, ease: "easeOut" };
  const dotTransition = shouldReduce ? { duration: 0 } : { duration: 0.25, ease: "easeOut", delay: 0.35 };

  // Fallback de dados para não renderizar vazio
  const data = points && points.length > 0 ? points : [0.02, 0.03, 0.04, 0.03, 0.05, 0.04, 0.06];

  // Evita divisão por zero quando houver apenas 1 ponto
  const denom = Math.max(data.length - 1, 1);
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const { d, area, lastPoint } = useMemo(() => {
    const cmds = data
      .map((v, i) => {
        const x = (i / denom) * width;
        const y = height - ((v - min) / range) * height;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
    const ap = `${cmds} L ${width},${height} L 0,${height} Z`;

    const lastVal = data[data.length - 1];
    const lx = ((data.length - 1) / denom) * width;
    const ly = height - ((lastVal - min) / range) * height;

    return { d: cmds, area: ap, lastPoint: { x: lx, y: ly } };
  }, [data, denom, height, min, range, width]);

  if (loading) {
    // Skeleton simples com shimmer em SVG (não altera arquitetura)
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="carregando mini gráfico"
        className={`overflow-visible ${className}`}
      >
        <defs>
          <linearGradient id={`shimmer-${uid}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopOpacity="0.1" />
            <stop offset="50%" stopOpacity="0.25" />
            <stop offset="100%" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.rect
          x="0"
          y={height * 0.2}
          width={width}
          height={height * 0.6}
          rx="4"
          aria-hidden="true"
          fill={`url(#shimmer-${uid})`}
          initial={{ x: -width }}
          animate={{ x: width }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear",
          }}
        />
      </svg>
    );
  }

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className={`overflow-visible ${className}`}
      initial={false}
    >
      <title>{ariaLabel}</title>
      <desc>Pequeno gráfico de linha representando tendência em escala relativa.</desc>

      {filled && (
        <motion.path
          d={area}
          className={fillClass}
          // Manter estado inicial fixo evita divergencia de hidratacao entre server e client
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={fillTransition}
        />
      )}

      <motion.path
        d={d}
        strokeWidth={strokeWidth}
        className={strokeClass}
        fill="none"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={lineTransition}
      />

      {showDot && (
        <motion.circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={2.25}
          className={`${strokeClass.replace("stroke-", "fill-")} drop-shadow`}
          stroke="white"
          strokeWidth="1"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={dotTransition}
        />
      )}
    </motion.svg>
  );
}

export default memo(MiniSpark);
