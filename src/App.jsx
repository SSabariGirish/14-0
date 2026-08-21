import React, { useState, useMemo, useEffect, useRef } from 'react';
import playersData from './data/players.json';

// ==============================================================================
// 1. EMBEDDED GEOMETRIC VECTOR ICON
// ==============================================================================
function GameIcon({ size = 24, style, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      {...props}
    >
      <rect width="24" height="24" rx="6" fill="#0F172A" />
      <circle cx="12" cy="12" r="9" stroke="#334155" strokeWidth="0.75" strokeDasharray="2 2" />
      <rect x="8.5" y="7.5" width="1.25" height="9" rx="0.5" fill="#9CA3AF" />
      <rect x="11.35" y="6.5" width="1.3" height="10" rx="0.5" fill="#E5E7EB" />
      <rect x="14.25" y="7.5" width="1.25" height="9" rx="0.5" fill="#9CA3AF" />
      <path d="M4.5 16.5C7.5 13.5 11.5 10.5 19.5 7.5" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11.5" cy="11.5" r="1.25" fill="#F97316" />
    </svg>
  );
}

// ==============================================================================
// 2. CONFIGURATION & FRANCHISE BRAND TOKENS
// ==============================================================================
const ERAS = ['2008-2012', '2013-2017', '2018-2022', '2023-2026'];
const TEAMS = ['CSK', 'MI', 'RCB', 'KKR', 'RR', 'PBKS', 'DC', 'SRH', 'GT', 'LSG', 'RPSG', 'DEC', 'GL', 'PWI', 'KTK'];

const SLOTS_CONFIG = {
  Batter: 4,
  Wicketkeeper: 1,
  Bowler: 4,
  'All-Rounder': 2,
  'Impact Player': 1
};

const TEAM_COLORS = {
  CSK:  { bg: '#FEF9C3', border: '#EAB308', text: '#1E3A8A', glow: 'rgba(234, 179, 8, 0.55)', tag: 'CSK' },
  MI:   { bg: '#EFF6FF', border: '#2563EB', text: '#1D4ED8', glow: 'rgba(37, 99, 235, 0.55)', tag: 'MI' },
  RCB:  { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', glow: 'rgba(239, 68, 68, 0.55)', tag: 'RCB' },
  KKR:  { bg: '#FAF5FF', border: '#9333EA', text: '#5B21B6', glow: 'rgba(147, 51, 234, 0.55)', tag: 'KKR' },
  RR:   { bg: '#FDF2F8', border: '#EC4899', text: '#9D174D', glow: 'rgba(236, 72, 153, 0.55)', tag: 'RR' },
  SRH:  { bg: '#FFF7ED', border: '#F97316', text: '#C2410C', glow: 'rgba(249, 115, 22, 0.55)', tag: 'SRH' },
  PBKS: { bg: '#FFF1F2', border: '#E11D48', text: '#9F1239', glow: 'rgba(225, 29, 72, 0.55)', tag: 'PBKS' },
  DC:   { bg: '#F0F9FF', border: '#0284C7', text: '#0369A1', glow: 'rgba(2, 132, 199, 0.55)', tag: 'DC' },
  GT:   { bg: '#F8FAFC', border: '#475569', text: '#0F172A', glow: 'rgba(71, 85, 105, 0.55)', tag: 'GT' },
  LSG:  { bg: '#F0FDFA', border: '#0D9488', text: '#115E59', glow: 'rgba(13, 148, 136, 0.55)', tag: 'LSG' },
  RPSG: { bg: '#FDF4FF', border: '#C026D3', text: '#701A75', glow: 'rgba(192, 38, 211, 0.55)', tag: 'RPSG' },
  DEC:  { bg: '#F1F5F9', border: '#334155', text: '#1E293B', glow: 'rgba(51, 65, 85, 0.55)', tag: 'DEC' },
  GL:   { bg: '#FFFBEB', border: '#D97706', text: '#78350F', glow: 'rgba(217, 119, 6, 0.55)', tag: 'GL' },
  PWI:  { bg: '#FAFAFA', border: '#52525B', text: '#27272A', glow: 'rgba(82, 82, 91, 0.55)', tag: 'PWI' },
  KTK:  { bg: '#FFF7ED', border: '#C2410C', text: '#7C2D12', glow: 'rgba(194, 65, 12, 0.55)', tag: 'KTK' }
};

const FIELD_POSITIONS = [
  { key: 'wk', title: 'WK', label: 'Wicketkeeper', top: '12%', left: '50%', type: 'Wicketkeeper' },
  { key: 'bat1', title: 'BAT 1', label: 'Slip / Opener', top: '22%', left: '26%', type: 'Batter' },
  { key: 'bat2', title: 'BAT 2', label: 'Cover / Opener', top: '22%', left: '74%', type: 'Batter' },
  { key: 'bat3', title: 'BAT 3', label: 'Deep Point', top: '37%', left: '14%', type: 'Batter' },
  { key: 'bat4', title: 'BAT 4', label: 'Deep Square Leg', top: '37%', left: '86%', type: 'Batter' },
  { key: 'ar1', title: 'AR 1', label: 'Mid-Off', top: '52%', left: '26%', type: 'All-Rounder' },
  { key: 'ar2', title: 'AR 2', label: 'Mid-On', top: '52%', left: '74%', type: 'All-Rounder' },
  { key: 'bowl1', title: 'BOWL 1', label: 'Bowler (Delivery)', top: '65%', left: '50%', type: 'Bowler' },
  { key: 'bowl2', title: 'BOWL 2', label: 'Deep Fine Leg', top: '78%', left: '16%', type: 'Bowler' },
  { key: 'bowl3', title: 'BOWL 3', label: 'Deep Long-Off', top: '78%', left: '84%', type: 'Bowler' },
  { key: 'bowl4', title: 'BOWL 4', label: 'Deep Long-On', top: '88%', left: '50%', type: 'Bowler' }
];

// ==============================================================================
// 3. TOURNAMENT TIER & GRADING MATRICES
// ==============================================================================
const getTournamentTier = (wins) => {
  if (wins === 14) return { grade: 'S+', title: 'Undisputed Champions', color: '#10B981' };
  if (wins >= 12)  return { grade: 'S',  title: 'Dynasty Apex Squad', color: '#3B82F6' };
  if (wins >= 10)  return { grade: 'A',  title: 'Elite Playoff Contender', color: '#6366F1' };
  if (wins === 9)  return { grade: 'B',  title: 'Solid Mid-Table Core', color: '#8B5CF6' };
  if (wins === 8)  return { grade: 'C',  title: 'Competitive Challenger', color: '#F59E0B' };
  if (wins === 7)  return { grade: 'D',  title: 'Balanced Average Camp', color: '#D97706' };
  if (wins >= 4)   return { grade: 'E',  title: 'Underperforming Unit', color: '#EF4444' };
  return { grade: 'F',  title: 'Wooden Spoon Rebuild', color: '#991B1B' };
};

export default function App() {
  const [roster, setRoster] = useState([]);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [spinResult, setSpinResult] = useState(null);
  const [seasonResult, setSeasonResult] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);

  // Wheel animation states
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayTeam, setDisplayTeam] = useState('CSK');
  const [displayEra, setDisplayEra] = useState('2023-2026');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortBy, setSortBy] = useState('matches');

  const tickerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, []);

  const currentCounts = useMemo(() => {
    const counts = { Batter: 0, Wicketkeeper: 0, Bowler: 0, 'All-Rounder': 0 };
    roster.forEach(p => {
      if (counts[p.role] !== undefined) counts[p.role] += 1;
    });
    return counts;
  }, [roster]);

  const isRoleAllowed = (role, counts, rosterLength) => {
    const baseSlotsFull = 
      counts.Batter >= SLOTS_CONFIG.Batter &&
      counts.Wicketkeeper >= SLOTS_CONFIG.Wicketkeeper &&
      counts.Bowler >= SLOTS_CONFIG.Bowler &&
      counts['All-Rounder'] >= SLOTS_CONFIG['All-Rounder'];

    if (baseSlotsFull && rosterLength < 12) return true;

    if (role === 'Batter') return counts.Batter < SLOTS_CONFIG.Batter;
    if (role === 'Wicketkeeper') return counts.Wicketkeeper < SLOTS_CONFIG.Wicketkeeper;
    if (role === 'Bowler') return counts.Bowler < SLOTS_CONFIG.Bowler;
    if (role === 'All-Rounder') return counts['All-Rounder'] < SLOTS_CONFIG['All-Rounder'];
    
    return false;
  };

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setHasSpun(true);
    setSpinResult(null);

    let validCombinationFound = false;
    let targetTeam = '';
    let targetEra = '';
    let filteredPool = [];
    let attempts = 0;
    const MAX_ATTEMPTS = 250;

    while (!validCombinationFound && attempts < MAX_ATTEMPTS) {
      attempts++;
      const candidateEra = ERAS[Math.floor(Math.random() * ERAS.length)];
      const candidateTeam = TEAMS[Math.floor(Math.random() * TEAMS.length)];

      filteredPool = playersData.filter(p => 
        p.era === candidateEra && 
        p.team === candidateTeam && 
        isRoleAllowed(p.role, currentCounts, roster.length) &&
        !roster.find(drafted => drafted.playerId === p.playerId)
      );

      if (filteredPool.length > 0) {
        targetTeam = candidateTeam;
        targetEra = candidateEra;
        validCombinationFound = true;
      }
    }

    if (!validCombinationFound) {
      alert("No valid combinations remain. Resetting draft matrix.");
      resetGame();
      setIsSpinning(false);
      return;
    }

    let ticks = 0;
    const totalTicks = 18;
    
    tickerRef.current = setInterval(() => {
      setDisplayTeam(TEAMS[Math.floor(Math.random() * TEAMS.length)]);
      setDisplayEra(ERAS[Math.floor(Math.random() * ERAS.length)]);
      ticks++;

      if (ticks >= totalTicks) {
        clearInterval(tickerRef.current);
        setDisplayTeam(targetTeam);
        setDisplayEra(targetEra);
        setSpinResult({ era: targetEra, team: targetTeam });
        setCurrentOptions(filteredPool);
        setIsSpinning(false);
        setSearchQuery('');
        setRoleFilter('All');
      }
    }, 70);
  };

  const processedOptions = useMemo(() => {
    let list = [...currentOptions];

    if (searchQuery) {
      list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (roleFilter !== 'All') {
      let queryRole = roleFilter;
      if (roleFilter === 'BAT') queryRole = 'Batter';
      if (roleFilter === 'AR') queryRole = 'All-Rounder';
      if (roleFilter === 'BOWL') queryRole = 'Bowler';
      if (roleFilter === 'WK') queryRole = 'Wicketkeeper';
      list = list.filter(p => p.role === queryRole);
    }

    list.sort((a, b) => {
      if (sortBy === 'matches') return (b.matches || 1) - (a.matches || 1);
      if (sortBy === 'batting_avg') return (b.batting_avg || 0) - (a.batting_avg || 0);
      if (sortBy === 'batting_sr') return (b.batting_sr || 0) - (a.batting_sr || 0);
      if (sortBy === 'wickets') return (b.wickets || 0) - (a.wickets || 0);
      if (sortBy === 'bowling_econ') {
        const econA = a.bowling_econ === 0 ? 99 : a.bowling_econ;
        const econB = b.bowling_econ === 0 ? 99 : b.bowling_econ;
        return econA - econB;
      }
      return 0;
    });
    return list;
  }, [currentOptions, searchQuery, roleFilter, sortBy]);

  // ============================================================================
  // 4. HARD-MODE PROBABILISTIC TOURNAMENT SIMULATION ENGINE
  // ============================================================================
  const runTournamentSimulation = (squad) => {
    let topBatters = squad
      .filter(p => p.role === 'Batter' || p.role === 'Wicketkeeper' || p.role === 'All-Rounder')
      .map(p => {
        const matches = Math.max(1, p.matches || 1);
        const volumeWeight = Math.min(1.0, 0.45 + (matches / 50));
        const runRateEfficiency = (p.batting_avg * (p.batting_sr / 100));
        return runRateEfficiency * volumeWeight;
      })
      .sort((a, b) => b - a);

    const top5BattingScore = topBatters.slice(0, 5).reduce((acc, val) => acc + val, 0);
    const battingRating = Math.max(25, Math.min(98, Math.round((top5BattingScore / 225) * 100)));

    let bowlingUnits = squad
      .filter(p => p.role === 'Bowler' || p.role === 'All-Rounder')
      .map(p => {
        const matches = Math.max(1, p.matches || 1);
        const volumeWeight = Math.min(1.0, 0.45 + (matches / 50));
        const wktPoints = (p.wickets || 0) * 32;
        const econPoints = Math.max(-15, (8.4 - (p.bowling_econ || 9.0)) * 14);
        return (wktPoints + econPoints + 20) * volumeWeight;
      })
      .sort((a, b) => b - a);

    const top5BowlingScore = bowlingUnits.slice(0, 5).reduce((acc, val) => acc + val, 0);
    const bowlingRating = Math.max(25, Math.min(98, Math.round((top5BowlingScore / 210) * 100)));

    const unprovenCount = squad.filter(p => (p.matches || 1) < 12).length;
    const balancePenalty = unprovenCount * 4.5;
    const balanceRating = Math.max(20, Math.min(98, Math.round(((battingRating + bowlingRating) / 2) - balancePenalty)));

    const overallSquadPower = (battingRating * 0.42) + (bowlingRating * 0.42) + (balanceRating * 0.16);

    const fixtures = [
      { id: 1, vs: 'PBKS', diff: 76 },
      { id: 2, vs: 'DC',   diff: 78 },
      { id: 3, vs: 'LSG',  diff: 80 },
      { id: 4, vs: 'SRH',  diff: 82 },
      { id: 5, vs: 'GT',   diff: 84 },
      { id: 6, vs: 'RR',   diff: 85 },
      { id: 7, vs: 'RCB',  diff: 87 },
      { id: 8, vs: 'KKR',  diff: 88 },
      { id: 9, vs: 'CSK',  diff: 90 },
      { id: 10, vs: 'MI',  diff: 91 },
      { id: 11, vs: 'GT',  diff: 87 },
      { id: 12, vs: 'RR',  diff: 89 },
      { id: 13, vs: 'KKR', diff: 92 },
      { id: 14, vs: 'CSK', diff: 94 }
    ];

    let wins = 0;
    let matchLogs = [];

    fixtures.forEach((match) => {
      const exponent = (match.diff - overallSquadPower) / 28;
      const winProbability = 1 / (1 + Math.pow(10, exponent));
      const roll = Math.random();
      const isWin = roll < winProbability;

      if (isWin) wins++;

      const marginPower = Math.abs(overallSquadPower - match.diff) + (Math.random() * 6);
      let marginText = '';
      if (isWin) {
        marginText = marginPower > 10 ? `Won by ${Math.round(marginPower * 3.2)} runs` : `Won by ${Math.min(7, Math.max(2, Math.round(marginPower * 0.7)))} wkts`;
      } else {
        marginText = marginPower > 10 ? `Lost by ${Math.round(marginPower * 2.8)} runs` : `Lost by ${Math.min(6, Math.max(1, Math.round(marginPower * 0.6)))} wkts`;
      }

      matchLogs.push({
        id: match.id,
        vs: match.vs,
        result: isWin ? 'W' : 'L',
        margin: marginText
      });
    });

    return {
      wins,
      losses: 14 - wins,
      battingRating,
      bowlingRating,
      balanceRating,
      overallSquadPower: Math.round(overallSquadPower),
      matchLogs
    };
  };

  const handleDraft = (player) => {
    if (isSpinning) return;
    const updatedRoster = [...roster, player];
    setRoster(updatedRoster);
    setCurrentOptions([]);
    setSpinResult(null);
    setHasSpun(false);

    if (updatedRoster.length === 12) {
      const results = runTournamentSimulation(updatedRoster);
      setSeasonResult(results);
    }
  };

  const resetGame = () => {
    if (tickerRef.current) clearInterval(tickerRef.current);
    setRoster([]);
    setCurrentOptions([]);
    setSpinResult(null);
    setSeasonResult(null);
    setHasSpun(false);
    setIsSpinning(false);
    setDisplayTeam('CSK');
    setDisplayEra('2023-2026');
  };

  const { onFieldAssignments, impactPlayer } = useMemo(() => {
    const assignments = FIELD_POSITIONS.map(slot => ({ ...slot, assigned: null }));
    let unassigned = [];

    roster.forEach(player => {
      let placed = false;
      for (let i = 0; i < assignments.length; i++) {
        if (assignments[i].type === player.role && !assignments[i].assigned) {
          assignments[i].assigned = player;
          placed = true;
          break;
        }
      }
      if (!placed) unassigned.push(player);
    });

    return {
      onFieldAssignments: assignments,
      impactPlayer: unassigned[0] || null
    };
  }, [roster]);

  const currentTier = seasonResult ? getTournamentTier(seasonResult.wins) : null;

  return (
    <div style={styles.appCanvas}>
      {/* PROCEDURAL BLUEPRINT, BREATHING PULSE, & SLEEK COMPACT STYLES */}
      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
        
        @keyframes spinPulseAnimation {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 18px rgba(249, 115, 22, 0.45);
          }
          50% {
            transform: scale(1.04);
            box-shadow: 0 6px 26px rgba(249, 115, 22, 0.75);
          }
        }
        .spin-pulse-btn {
          animation: spinPulseAnimation 2.2s infinite ease-in-out;
        }
        .spin-pulse-btn:hover {
          animation-play-state: paused;
          transform: scale(1.06) translateY(-1px) !important;
          background-color: #EA580C !important;
        }
        
        /* 82-0 Style Sleek Compact Embossed Hover State */
        .player-card-interactive {
          transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), 
                      filter 0.18s ease-out;
          cursor: pointer;
          user-select: none;
          outline: none;
        }
        .player-card-interactive:hover {
          transform: translateY(-2px) scale(1.004);
          filter: brightness(1.01);
          box-shadow: 0 8px 18px -4px rgba(15, 23, 42, 0.10), 0 3px 6px -1px rgba(15, 23, 42, 0.05);
        }
        .player-card-interactive:active {
          transform: translateY(0px) scale(0.999);
        }
      `}</style>

      {/* HEADER BAR */}
      <header style={styles.headerBar}>
        <div style={styles.brandTitleGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <GameIcon size={24} style={{ border: '1px solid #E2E8F0', borderRadius: '5px' }} />
            <h1 style={styles.brandLogo}>IPL 14-0 ENGINE</h1>
          </div>
          <span style={styles.roundTrackerPill}>
            {seasonResult ? 'CAMPAIGN CONCLUDED' : `Round ${Math.min(12, roster.length + 1)} / 12`}
          </span>
        </div>

        {!seasonResult ? (
          <div style={styles.spinControlsHub}>
            <div style={styles.marqueeBadgesCluster}>
              <div style={{
                ...styles.thickBezelHUDBox,
                borderColor: TEAM_COLORS[displayTeam]?.border || '#EF4444',
                boxShadow: `0 0 22px ${TEAM_COLORS[displayTeam]?.glow || 'rgba(239, 68, 68, 0.55)'}`
              }}>
                <span style={styles.hudBoxLabel}>TEAM</span>
                <span style={styles.hudBoxValue}>{displayTeam}</span>
              </div>
              
              <div style={{
                ...styles.thickBezelHUDBox,
                borderColor: '#9333EA',
                boxShadow: '0 0 22px rgba(147, 51, 234, 0.55)'
              }}>
                <span style={styles.hudBoxLabel}>ERA</span>
                <span style={styles.hudBoxValue}>{displayEra}</span>
              </div>
            </div>

            <button 
              onClick={handleSpin} 
              disabled={isSpinning}
              className={!isSpinning ? "spin-pulse-btn" : ""}
              style={{
                ...styles.thickSpinButton,
                opacity: isSpinning ? 0.7 : 1,
                cursor: isSpinning ? 'not-allowed' : 'pointer'
              }}
            >
              {isSpinning ? 'SPINNING...' : 'SPIN'}
            </button>
          </div>
        ) : (
          <button onClick={resetGame} className="spin-pulse-btn" style={styles.thickSpinButton}>
            NEW CAMPAIGN
          </button>
        )}
      </header>

      {/* MAIN SPLIT WORKSPACE */}
      <div style={styles.mainLayoutGrid}>
        
        {/* LEFT COLUMN: CANDIDATE FEED OR TOURNAMENT SUMMARY */}
        {!seasonResult ? (
          <div style={styles.leftDraftSheet}>
            <div style={styles.filterActionBar}>
              <div style={styles.roleTabsPillGroup}>
                {['All', 'BAT', 'AR', 'BOWL', 'WK'].map(role => (
                  <button
                    key={role}
                    disabled={isSpinning}
                    onClick={() => setRoleFilter(role)}
                    style={{
                      ...styles.roleTabButton,
                      backgroundColor: roleFilter === role ? '#F97316' : 'transparent',
                      color: roleFilter === role ? '#FFFFFF' : '#475569',
                      fontWeight: roleFilter === role ? '700' : '600'
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search player name..."
                value={searchQuery}
                disabled={isSpinning}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInputControl}
              />

              <select 
                value={sortBy} 
                disabled={isSpinning} 
                onChange={(e) => setSortBy(e.target.value)} 
                style={styles.sortDropdownControl}
              >
                <option value="matches">MATCHES</option>
                <option value="batting_avg">AVG</option>
                <option value="batting_sr">SR</option>
                <option value="wickets">WKT</option>
                <option value="bowling_econ">ECN</option>
              </select>
            </div>

            <div style={styles.availableCounterText}>
              {isSpinning ? "Cycling indexes..." : `${processedOptions.length} players available · Click card to draft`}
            </div>

            <div style={styles.playerStreamViewport}>
              {!hasSpun && !isSpinning ? (
                <div style={styles.emptyPromptState}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#64748B' }}>
                    Press <strong>SPIN</strong> above to generate available franchise candidates.
                  </p>
                </div>
              ) : (
                processedOptions.map(player => {
                  const teamToken = TEAM_COLORS[player.team] || { bg: '#F8FAFC', border: '#E2E8F0', text: '#0F172A' };

                  const hasBatStats = player.role !== 'Bowler' && (player.batting_avg > 0 || player.batting_sr > 0);
                  const hasBowlStats = player.role !== 'Batter' && (player.wickets > 0 || player.bowling_econ > 0);

                  const avgDisplay = hasBatStats ? (player.batting_avg ?? 0).toFixed(1) : '-';
                  const srDisplay = hasBatStats ? Math.round(player.batting_sr ?? 0) : '-';
                  const wktDisplay = hasBowlStats ? (player.wickets ?? 0).toFixed(1) : '-';
                  const ecnDisplay = hasBowlStats ? (player.bowling_econ ?? 0).toFixed(1) : '-';

                  return (
                    <div 
                      key={player.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleDraft(player)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDraft(player); }}
                      className="player-card-interactive"
                      style={{
                        ...styles.playerCardRow,
                        borderLeftColor: teamToken.border,
                        backgroundColor: teamToken.bg
                      }}
                    >
                      <div style={styles.playerMetaIdentity}>
                        <div style={{ ...styles.playerNameHeading, color: teamToken.text }}>{player.name}</div>
                        <div style={styles.playerRoleSubTag}>
                          {player.role.toUpperCase()} · <span style={{ color: '#0F172A', fontWeight: '800' }}>{player.matches || 1}M</span>
                        </div>
                      </div>

                      <div style={styles.metricsClusterRight}>
                        <div style={styles.statColumnCell}>
                          <span style={styles.statNumberPrimary}>{avgDisplay}</span>
                          <span style={styles.statLabelMuted}>AVG</span>
                        </div>

                        <div style={styles.statColumnCell}>
                          <span style={styles.statNumberPrimary}>{srDisplay}</span>
                          <span style={styles.statLabelMuted}>SR</span>
                        </div>

                        <div style={styles.statColumnCell}>
                          <span style={styles.statNumberPrimary}>{wktDisplay}</span>
                          <span style={styles.statLabelMuted}>WKT</span>
                        </div>

                        <div style={styles.statColumnCell}>
                          <span style={styles.statNumberPrimary}>{ecnDisplay}</span>
                          <span style={styles.statLabelMuted}>ECN</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* BALANCED POST-MATCH DASHBOARD WITH NEW CRITERIA TIERS */
          <div style={styles.leftSummaryDashboard}>
            <div style={styles.summaryTopBannerCard}>
              <div style={styles.badgeRowVerdict}>
                <span style={{
                  ...styles.statusPillBadge,
                  backgroundColor: currentTier.color
                }}>
                  {currentTier.grade} - {currentTier.title}
                </span>
                <span style={styles.squadScoreHeader}>Tournament Index: {seasonResult.overallSquadPower}/100</span>
              </div>

              <div style={styles.bigScoreRow}>
                <span style={styles.bigScoreNumbers}>{seasonResult.wins}W - {seasonResult.losses}L</span>
              </div>
            </div>

            <div style={styles.ratingsCardGroup}>
              <div style={styles.ratingBarUnit}>
                <div style={styles.ratingLabelLine}>
                  <span style={styles.metricTitleText}>Batting Execution</span>
                  <strong style={styles.metricPercentText}>{seasonResult.battingRating}/100</strong>
                </div>
                <div style={styles.progressTrack}>
                  <div style={{ ...styles.progressFill, width: `${seasonResult.battingRating}%`, backgroundColor: '#F97316' }} />
                </div>
              </div>

              <div style={styles.ratingBarUnit}>
                <div style={styles.ratingLabelLine}>
                  <span style={styles.metricTitleText}>Bowling Defense</span>
                  <strong style={styles.metricPercentText}>{seasonResult.bowlingRating}/100</strong>
                </div>
                <div style={styles.progressTrack}>
                  <div style={{ ...styles.progressFill, width: `${seasonResult.bowlingRating}%`, backgroundColor: '#2563EB' }} />
                </div>
              </div>

              <div style={styles.ratingBarUnit}>
                <div style={styles.ratingLabelLine}>
                  <span style={styles.metricTitleText}>Squad Balance & Depth</span>
                  <strong style={styles.metricPercentText}>{seasonResult.balanceRating}/100</strong>
                </div>
                <div style={styles.progressTrack}>
                  <div style={{ ...styles.progressFill, width: `${seasonResult.balanceRating}%`, backgroundColor: '#10B981' }} />
                </div>
              </div>
            </div>

            <div style={styles.fixturesSectionHeader}>14-MATCH LEAGUE RESULTS LOG</div>
            <div style={styles.fixturesTimelineGrid}>
              {seasonResult.matchLogs.map(m => (
                <div 
                  key={m.id} 
                  style={{
                    ...styles.matchFixtureCard,
                    borderColor: m.result === 'W' ? '#86EFAC' : '#FCA5A5',
                    backgroundColor: m.result === 'W' ? '#F0FDF4' : '#FEF2F2'
                  }}
                >
                  <div style={styles.matchVsText}>M{m.id} vs {m.vs}</div>
                  <div style={{
                    ...styles.matchResultBadge,
                    color: m.result === 'W' ? '#15803D' : '#B91C1C'
                  }}>
                    {m.result}
                  </div>
                  <div style={styles.matchMarginText}>{m.margin}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIGHT: TACTICAL CRICKET GROUND */}
        <div style={styles.rightFieldContainer}>
          <div style={styles.fieldHeaderCaption}>
            {seasonResult ? 'FINAL 12-MAN TACTICAL LINEUP' : 'LINEUP FORMATION (11 ON-FIELD + 1 IMPACT SUB)'}
          </div>
          
          <div style={styles.cricketStadiumCanvas}>
            <svg style={styles.fieldSvgLayer} viewBox="0 0 100 100" preserveAspectRatio="none">
              <ellipse cx="50" cy="50" rx="46" ry="46" fill="none" stroke="#1E293B" strokeWidth="1.5" />
              <ellipse cx="50" cy="50" rx="30" ry="32" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
              <rect x="45" y="32" width="10" height="36" rx="1.5" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
              <line x1="45" y1="36" x2="55" y2="36" stroke="#475569" strokeWidth="0.75" />
              <line x1="45" y1="64" x2="55" y2="64" stroke="#475569" strokeWidth="0.75" />
            </svg>

            {onFieldAssignments.map(node => {
              const teamTheme = node.assigned ? TEAM_COLORS[node.assigned.team] : null;
              return (
                <div
                  key={node.key}
                  style={{
                    ...styles.fieldPositionNode,
                    top: node.top,
                    left: node.left,
                    backgroundColor: node.assigned ? 'rgba(15, 23, 42, 0.95)' : 'rgba(11, 19, 41, 0.75)',
                    borderColor: node.assigned ? teamTheme.border : '#334155',
                    borderStyle: node.assigned ? 'solid' : 'dashed'
                  }}
                >
                  <span style={{ ...styles.nodeRoleTag, color: node.assigned ? teamTheme.border : '#64748B' }}>
                    {node.title}
                  </span>
                  {node.assigned ? (
                    <span style={styles.nodePlayerName}>
                      {node.assigned.name.split(' ').pop()}
                    </span>
                  ) : (
                    <span style={styles.nodePlaceholderLabel}>EMPTY</span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={styles.impactSubBench}>
            <div style={styles.impactSubLabel}>IMPACT PLAYER (SUB)</div>
            {impactPlayer ? (
              <div style={{
                ...styles.impactPlayerCard,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: TEAM_COLORS[impactPlayer.team]?.border || '#E2E8F0',
                color: '#FFFFFF'
              }}>
                <span style={{ color: TEAM_COLORS[impactPlayer.team]?.border, fontWeight: '800', marginRight: '0.45rem' }}>
                  {impactPlayer.team}
                </span>
                <strong>{impactPlayer.name}</strong> ({impactPlayer.role})
              </div>
            ) : (
              <div style={styles.impactSubEmptyState}>12th Player Wildcard Slot</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ==============================================================================
// 4. STYLES
// ==============================================================================
const styles = {
  appCanvas: {
    backgroundColor: '#ECEFF3',
    backgroundImage: `
      radial-gradient(at 10% 10%, rgba(249, 115, 22, 0.04) 0px, transparent 45%),
      radial-gradient(at 90% 90%, rgba(37, 99, 235, 0.04) 0px, transparent 45%),
      linear-gradient(rgba(15, 23, 42, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px)
    `,
    backgroundSize: '100% 100%, 100% 100%, 24px 24px, 24px 24px',
    color: '#0F172A',
    minHeight: '100vh',
    padding: '1.25rem 2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1280px',
    margin: '0 auto 1.25rem auto',
    backgroundColor: '#FFFFFF',
    padding: '0.85rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
  },
  brandTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem'
  },
  brandLogo: {
    fontSize: '1.15rem',
    fontWeight: '900',
    letterSpacing: '0.04em',
    color: '#0F172A',
    margin: 0
  },
  roundTrackerPill: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F8FAFC',
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    border: '1px solid #E2E8F0'
  },
  spinControlsHub: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem'
  },
  marqueeBadgesCluster: {
    display: 'flex',
    gap: '0.85rem'
  },

  thickBezelHUDBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D1322',
    border: '6px solid',
    borderRadius: '12px',
    padding: '0.35rem 0.75rem',
    width: '150px',
    minWidth: '150px',
    height: '68px',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease-in-out'
  },
  hudBoxLabel: {
    fontSize: '0.65rem',
    fontWeight: '900',
    color: '#FF6B00',
    letterSpacing: '0.08em',
    lineHeight: '1.1',
    marginBottom: '0.15rem'
  },
  hudBoxValue: {
    fontSize: '1.15rem',
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: '0.02em',
    lineHeight: '1.1'
  },
  thickSpinButton: {
    backgroundColor: '#F97316',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    fontWeight: '900',
    border: 'none',
    padding: '0.85rem 2.25rem',
    borderRadius: '12px',
    letterSpacing: '0.06em',
    height: '68px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 18px rgba(249, 115, 22, 0.45)',
    transition: 'all 0.15s'
  },

  mainLayoutGrid: {
    display: 'flex',
    gap: '1.75rem',
    maxWidth: '1280px',
    margin: '0 auto'
  },
  leftDraftSheet: {
    flex: '1 1 54%',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '1.25rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
  },
  filterActionBar: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    flexWrap: 'wrap'
  },
  roleTabsPillGroup: {
    display: 'flex',
    backgroundColor: '#F1F5F9',
    borderRadius: '6px',
    padding: '0.2rem',
    border: '1px solid #E2E8F0'
  },
  roleTabButton: {
    border: 'none',
    padding: '0.35rem 0.65rem',
    fontSize: '0.7rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  searchInputControl: {
    flex: 1,
    minWidth: '130px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '4px',
    padding: '0.4rem 0.75rem',
    fontSize: '0.8rem',
    outline: 'none'
  },
  sortDropdownControl: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #CBD5E1',
    borderRadius: '4px',
    padding: '0.4rem 0.5rem',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  availableCounterText: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#64748B',
    marginBottom: '0.75rem',
    paddingLeft: '0.25rem'
  },
  playerStreamViewport: {
    maxHeight: '560px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    paddingRight: '0.25rem'
  },
  emptyPromptState: {
    padding: '5rem 2rem',
    textAlign: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: '6px',
    border: '1px dashed #CBD5E1'
  },
  playerCardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.45rem 0.85rem',
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
    borderLeftWidth: '5px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
  },
  playerMetaIdentity: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    paddingRight: '1rem',
    overflow: 'hidden'
  },
  playerNameHeading: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'left'
  },
  playerRoleSubTag: {
    fontSize: '0.6rem',
    fontWeight: '700',
    color: '#64748B',
    marginTop: '0.05rem',
    textAlign: 'left'
  },
  metricsClusterRight: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 42px)',
    gap: '0.35rem',
    alignItems: 'center',
    justifyContent: 'end',
    flexShrink: 0
  },
  statColumnCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '42px'
  },
  statNumberPrimary: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center'
  },
  statLabelMuted: {
    fontSize: '0.5rem',
    fontWeight: '800',
    color: '#94A3B8',
    textAlign: 'center'
  },
  rightFieldContainer: {
    flex: '1 1 46%',
    backgroundColor: '#0F172A',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
  },
  fieldHeaderCaption: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: '0.06em',
    marginBottom: '0.75rem',
    textAlign: 'center'
  },
  cricketStadiumCanvas: {
    position: 'relative',
    height: '490px',
    backgroundColor: '#090E1D',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #1E293B'
  },
  fieldSvgLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  fieldPositionNode: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.2rem 0.4rem',
    borderRadius: '5px',
    minWidth: '52px',
    borderWidth: '1.5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
    transition: 'all 0.15s'
  },
  nodeRoleTag: {
    fontSize: '0.5rem',
    fontWeight: '800',
    letterSpacing: '0.04em'
  },
  nodePlayerName: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#FFFFFF'
  },
  nodePlaceholderLabel: {
    fontSize: '0.5rem',
    fontWeight: '700',
    color: '#475569'
  },
  impactSubBench: {
    marginTop: '0.75rem',
    backgroundColor: '#090E1D',
    borderRadius: '6px',
    padding: '0.65rem 0.75rem',
    border: '1px solid #1E293B'
  },
  impactSubLabel: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: '0.05em',
    marginBottom: '0.3rem'
  },
  impactPlayerCard: {
    padding: '0.4rem 0.75rem',
    borderRadius: '4px',
    border: '1px solid',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  impactSubEmptyState: {
    fontSize: '0.75rem',
    color: '#475569',
    fontStyle: 'italic'
  },

  leftSummaryDashboard: {
    flex: '1 1 54%',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    padding: '1.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  summaryTopBannerCard: {
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '1.25rem'
  },
  badgeRowVerdict: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  statusPillBadge: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#FFFFFF',
    padding: '0.35rem 0.85rem',
    borderRadius: '4px',
    letterSpacing: '0.04em'
  },
  squadScoreHeader: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#64748B'
  },
  bigScoreRow: {
    display: 'flex',
    alignItems: 'baseline'
  },
  bigScoreNumbers: {
    fontSize: '3.5rem',
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: '-0.03em',
    lineHeight: '1.1'
  },
  ratingsCardGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: '#F8FAFC',
    padding: '1.25rem',
    borderRadius: '8px',
    border: '1px solid #E2E8F0'
  },
  ratingBarUnit: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  ratingLabelLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  metricTitleText: {
    fontSize: '0.85rem',
    color: '#334155',
    fontWeight: '600'
  },
  metricPercentText: {
    fontSize: '0.85rem',
    color: '#0F172A',
    fontWeight: '800'
  },
  progressTrack: {
    height: '8px',
    backgroundColor: '#E2E8F0',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.5s ease-out'
  },
  fixturesSectionHeader: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginTop: '0.25rem'
  },
  fixturesTimelineGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.5rem'
  },
  matchFixtureCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.45rem 0.2rem',
    borderRadius: '4px',
    border: '1px solid',
    textAlign: 'center'
  },
  matchVsText: {
    fontSize: '0.6rem',
    fontWeight: '700',
    color: '#64748B'
  },
  matchResultBadge: {
    fontSize: '0.95rem',
    fontWeight: '900',
    margin: '0.1rem 0'
  },
  matchMarginText: {
    fontSize: '0.55rem',
    fontWeight: '700',
    color: '#94A3B8'
  }
};