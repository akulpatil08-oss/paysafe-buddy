import React, { useMemo } from 'react';
import { ShieldAlert, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

interface BikeSpeedometerRiskMeterProps {
  score: number; // 0 to 100
  level: 'safe' | 'caution' | 'danger';
  headline?: string;
  target?: string;
  recommendation?: string;
}

export const BikeSpeedometerRiskMeter: React.FC<BikeSpeedometerRiskMeterProps> = ({
  score,
  level,
  headline,
  target,
  recommendation,
}) => {
  // Clamped score between 0 and 100
  const clampedScore = Math.min(100, Math.max(0, score));

  // Bike meter sweep angle: 140 deg (bottom-left at 0 km/h) to 400 deg (bottom-right at 100 km/h)
  // Total sweep: 260 deg
  const needleAngle = 140 + (clampedScore / 100) * 260;

  // Geometry configuration
  const cx = 130;
  const cy = 130;
  const radius = 94;
  const tickInnerRadius = 80;
  const tickOuterRadius = 90;
  const majorTickInnerRadius = 74;

  // Generate bike meter ticks (every 5 km/h / risk units)
  const ticks = useMemo(() => {
    const list: {
      val: number;
      isMajor: boolean;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      labelX: number;
      labelY: number;
      color: string;
      isRedline: boolean;
    }[] = [];

    for (let v = 0; v <= 100; v += 5) {
      const isMajor = v % 20 === 0;
      const angleDeg = 140 + (v / 100) * 260;
      const rad = (angleDeg * Math.PI) / 180;
      const isRedline = v >= 75;

      const inner = isMajor ? majorTickInnerRadius : tickInnerRadius;
      const outer = tickOuterRadius;

      const x1 = cx + inner * Math.cos(rad);
      const y1 = cy + inner * Math.sin(rad);
      const x2 = cx + outer * Math.cos(rad);
      const y2 = cy + outer * Math.sin(rad);

      // Label positions for major ticks
      const labelRad = ((angleDeg) * Math.PI) / 180;
      const labelDistance = 60;
      const labelX = cx + labelDistance * Math.cos(labelRad);
      const labelY = cy + labelDistance * Math.sin(labelRad);

      let color = '#10B981'; // Green (Safe)
      if (v >= 35 && v < 75) {
        color = '#F59E0B'; // Amber (Caution)
      } else if (v >= 75) {
        color = '#EF4444'; // Red (Redline Danger)
      }

      list.push({
        val: v,
        isMajor,
        x1,
        y1,
        x2,
        y2,
        labelX,
        labelY,
        color,
        isRedline,
      });
    }
    return list;
  }, []);

  // Gear indicator based on bike tachometer RPM
  const gearLabel = useMemo(() => {
    if (clampedScore <= 30) return 'GEAR 1 · SAFE';
    if (clampedScore <= 60) return 'GEAR 3 · CRUISE';
    if (clampedScore <= 80) return 'GEAR 5 · ALERT';
    return 'REDLINE · HAZARD';
  }, [clampedScore]);

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-[#182338] via-[#0d1627] to-[#060c18] border-2 border-slate-700/80 p-4 sm:p-5 text-white shadow-2xl overflow-hidden">
      {/* Carbon fiber texture & glow effect */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${
          level === 'danger'
            ? 'bg-rose-500/25'
            : level === 'caution'
            ? 'bg-amber-500/20'
            : 'bg-emerald-500/20'
        }`}
      />

      {/* Top Motorcycle Gauge Cockpit Header */}
      <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          {/* Neutral [N] Indicator */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] border shadow-xs transition-all ${
              level === 'safe'
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-emerald-500/50 animate-pulse'
                : 'bg-slate-800 text-slate-500 border-slate-700'
            }`}
            title={level === 'safe' ? 'Safe · Neutral Guard' : 'Neutral Indicator'}
          >
            N
          </div>

          {/* ABS / Anti-Scam Shield Indicator */}
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-extrabold"
            title="NPCI Anti-Fraud ABS Guard Active"
          >
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>SHIELD ABS</span>
          </div>
        </div>

        {/* Tell-tale Hazard / Redline Light */}
        <div className="flex items-center gap-2">
          {level === 'danger' ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase animate-pulse shadow-md shadow-rose-600/40">
              <AlertTriangle className="w-3.5 h-3.5 fill-current" />
              <span>REV LIMITER ACTIVE</span>
            </div>
          ) : level === 'caution' ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] tracking-wider uppercase">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>CAUTION ZONE</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[10px] tracking-wider uppercase">
              <span>CRUISING SAFE</span>
            </div>
          )}
        </div>
      </div>

      {/* Speedometer Gauge & Data Cockpit Row */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 pt-3">
        {/* Actual Bike Speedometer Dial (Custom SVG) */}
        <div className="relative w-64 h-60 sm:w-72 sm:h-64 flex items-center justify-center shrink-0">
          {/* Dial Face Metallic Bezel Rings */}
          <svg
            viewBox="0 0 260 250"
            className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] select-none"
          >
            <defs>
              {/* Outer Chrome Bezel Gradient */}
              <linearGradient id="chromeBezel" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="25%" stopColor="#334155" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="75%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>

              {/* Inner Dial Face Dark Radial Gradient */}
              <radialGradient id="dialFace" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="95%" stopColor="#020617" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>

              {/* Needle Hot Glow Filter */}
              <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Outer Bezel (Brushed Aluminum / Chrome Ring) */}
            <circle
              cx={cx}
              cy={cy}
              r="118"
              fill="url(#dialFace)"
              stroke="url(#chromeBezel)"
              strokeWidth="5"
            />
            {/* Inner Recessed Bezel Track */}
            <circle
              cx={cx}
              cy={cy}
              r="110"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.5"
            />

            {/* Perimeter Speed Arc Track (Background) */}
            {/* Arc from 140 to 400 deg: R=90 */}
            <path
              d="M 61.1 187.8 A 90 90 0 1 1 198.9 187.8"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Colored Speed Arc Bands: Safe (0-30), Caution (30-70), Redline (70-100) */}
            {/* 0 to 35: Green (Safe) */}
            <path
              d="M 61.1 187.8 A 90 90 0 0 1 76.6 65.3"
              fill="none"
              stroke="#10B981"
              strokeWidth="4"
              strokeOpacity="0.8"
            />
            {/* 35 to 75: Amber (Caution) */}
            <path
              d="M 76.6 65.3 A 90 90 0 0 1 193.3 84.1"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeOpacity="0.8"
            />
            {/* 75 to 100: REDLINE ZONE (Red danger stripes) */}
            <path
              d="M 193.3 84.1 A 90 90 0 0 1 198.9 187.8"
              fill="none"
              stroke="#EF4444"
              strokeWidth="7"
              strokeDasharray="4 2"
              className={level === 'danger' ? 'animate-pulse' : ''}
            />

            {/* Tick Marks & Speed Values */}
            {ticks.map((t, idx) => (
              <g key={idx}>
                <line
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.color}
                  strokeWidth={t.isMajor ? (t.isRedline ? 3 : 2.5) : 1.2}
                  strokeLinecap="round"
                />
                {t.isMajor && (
                  <text
                    x={t.labelX}
                    y={t.labelY + 3.5}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill={t.color}
                    fontFamily="monospace"
                    className="select-none"
                  >
                    {t.val}
                  </text>
                )}
              </g>
            ))}

            {/* Center Dial Watermark / Brand */}
            <text
              x={cx}
              y={cy - 22}
              textAnchor="middle"
              fontSize="7"
              fontWeight="900"
              letterSpacing="1.5"
              fill="#64748b"
              fontFamily="sans-serif"
            >
              PAYSAFE TACHO
            </text>
            <text
              x={cx}
              y={cy - 12}
              textAnchor="middle"
              fontSize="6"
              fontWeight="700"
              letterSpacing="1"
              fill="#475569"
              fontFamily="monospace"
            >
              x1000 RPM / RISK
            </text>

            {/* Mechanical Speedometer Needle with Counterweight and Pivot Cap */}
            <g
              style={{
                transform: `rotate(${needleAngle}deg)`,
                transformOrigin: `${cx}px ${cy}px`,
                transition: 'transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Needle Counter-weight tail (bottom side) */}
              <polygon
                points={`${cx - 3},${cy} ${cx + 3},${cy} ${cx},${cy + 22}`}
                fill="#334155"
              />

              {/* Main Needle Blade (Bright High-Vis Orange/Red Speedo Needle) */}
              <polygon
                points={`${cx - 3.5},${cy} ${cx + 3.5},${cy} ${cx + 1},${cy - 82} ${cx},${cy - 86} ${cx - 1},${cy - 82}`}
                fill={level === 'danger' ? '#FF2222' : level === 'caution' ? '#FF8800' : '#00E5A3'}
                filter="url(#needleGlow)"
              />
              {/* White reflective center line on needle blade */}
              <line
                x1={cx}
                y1={cy - 10}
                x2={cx}
                y2={cy - 78}
                stroke="#FFFFFF"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>

            {/* Center Hub / Chrome Cap (Locks Needle in Center) */}
            <circle
              cx={cx}
              cy={cy}
              r="14"
              fill="url(#chromeBezel)"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <circle
              cx={cx}
              cy={cy}
              r="8"
              fill="#0f172a"
            />
            <circle
              cx={cx}
              cy={cy}
              r="3.5"
              fill={level === 'danger' ? '#ef4444' : level === 'caution' ? '#f59e0b' : '#10b981'}
              className={level === 'danger' ? 'animate-ping' : ''}
            />

            {/* Lower Semi-Circular Digital Cockpit HUD */}
            <g transform={`translate(${cx - 45}, ${cy + 34})`}>
              <rect
                x="0"
                y="0"
                width="90"
                height="38"
                rx="8"
                fill="#030712"
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Digital Score Number */}
              <text
                x="45"
                y="22"
                textAnchor="middle"
                fontSize="18"
                fontWeight="900"
                fontFamily="monospace"
                fill={level === 'danger' ? '#F87171' : level === 'caution' ? '#FBBF24' : '#34D399'}
                letterSpacing="1"
              >
                {clampedScore}
              </text>
              <text
                x="45"
                y="33"
                textAnchor="middle"
                fontSize="7"
                fontWeight="800"
                fontFamily="sans-serif"
                fill="#94a3b8"
                letterSpacing="1"
              >
                KM/H RISK
              </text>
            </g>
          </svg>

          {/* Odometer Trip readout badge below meter */}
          <div className="absolute -bottom-1 text-center">
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700/80">
              TRIP: {gearLabel}
            </span>
          </div>
        </div>

        {/* Verdict Details & Cockpit Diagnostic Readout */}
        <div className="flex-1 space-y-2.5 text-center md:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span
              className={`text-xs uppercase font-black px-3 py-1 rounded-full border shadow-sm ${
                level === 'danger'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : level === 'caution'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              }`}
            >
              {level.toUpperCase()} TACHO VERDICT
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Tachometer: {clampedScore}/100
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white leading-tight">
            {headline || (level === 'danger' ? 'High Risk Threat Detected' : level === 'caution' ? 'Caution Advised' : 'Safe & Verified Payee')}
          </h3>

          {target && (
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-[11px] text-teal-300 truncate">
              Scanned: {target}
            </div>
          )}

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {recommendation || (level === 'danger' ? 'Do not approve UPI request or scan this QR. High risk of student account compromise.' : 'Verified legitimate college entity.')}
          </p>

          {/* Real Bike Meter Metric Tickers */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center md:text-left">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">RPM Zone</span>
              <span className={`text-xs font-mono font-black ${level === 'danger' ? 'text-rose-400' : level === 'caution' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {clampedScore >= 75 ? '9,000+ (REDLINE)' : clampedScore >= 35 ? '5,000 (MID-REV)' : '1,800 (IDLE)'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center md:text-left">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">NPCI Safety</span>
              <span className="text-xs font-mono font-black text-cyan-300">
                {level === 'danger' ? 'BLOCKED' : level === 'caution' ? 'FLAGGED' : 'CERTIFIED'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
