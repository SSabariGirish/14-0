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
  CSK:  { bg: '#1E293B', border: '#EAB308', text: '#FACC15', glow: 'rgba(234, 179, 8, 0.45)', tag: 'CSK' },
  MI:   { bg: '#1E293B', border: '#3B82F6', text: '#60A5FA', glow: 'rgba(59, 130, 246, 0.45)', tag: 'MI' },
  RCB:  { bg: '#1E293B', border: '#EF4444', text: '#F87171', glow: 'rgba(239, 68, 68, 0.45)', tag: 'RCB' },
  KKR:  { bg: '#1E293B', border: '#A855F7', text: '#C084FC', glow: 'rgba(168, 85, 247, 0.45)', tag: 'KKR' },
  RR:   { bg: '#1E293B', border: '#EC4899', text: '#F472B6', glow: 'rgba(236, 72, 153, 0.45)', tag: 'RR' },
  SRH:  { bg: '#1E293B', border: '#F97316', text: '#FB923C', glow: 'rgba(249, 115, 22, 0.45)', tag: 'SRH' },
  PBKS: { bg: '#1E293B', border: '#F43F5E', text: '#FB7185', glow: 'rgba(244, 63, 94, 0.45)', tag: 'PBKS' },
  DC:   { bg: '#1E293B', border: '#0EA5E9', text: '#38BDF8', glow: 'rgba(14, 165, 233, 0.45)', tag: 'DC' },
  GT:   { bg: '#1E293B', border: '#64748B', text: '#94A3B8', glow: 'rgba(100, 116, 139, 0.45)', tag: 'GT' },
  LSG:  { bg: '#1E293B', border: '#14B8A6', text: '#2DD4BF', glow: 'rgba(20, 184, 166, 0.45)', tag: 'LSG' },
  RPSG: { bg: '#1E293B', border: '#D946EF', text: '#E879F9', glow: 'rgba(217, 70, 239, 0.45)', tag: 'RPSG' },
  DEC:  { bg: '#1E293B', border: '#475569', text: '#94A3B8', glow: 'rgba(71, 85, 105, 0.45)', tag: 'DEC' },
  GL:   { bg: '#1E293B', border: '#F59E0B', text: '#FBBF24', glow: 'rgba(245, 158, 11, 0.45)', tag: 'GL' },
  PWI:  { bg: '#1E293B', border: '#71717A', text: '#A1A1AA', glow: 'rgba(113, 113, 122, 0.45)', tag: 'PWI' },
  KTK:  { bg: '#1E293B', border: '#EA580C', text: '#FB923C', glow: 'rgba(234, 88, 12, 0.45)', tag: 'KTK' }
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
  const [displayTeam, setDisplayTeam] = useState('RCB');
  const [displayEra, setDisplayEra] = useState('2023-2026');

  // Single Re-Roll Quotas (1 allowed per campaign)
  const [teamRerollAvailable, setTeamRerollAvailable] = useState(true);
  const [eraRerollAvailable, setEraRerollAvailable] = useState(true);

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

  const findValidPool = (targetTeam, targetEra) => {
    return playersData.filter(p => 
      p.era === targetEra && 
      p.team === targetTeam && 
      isRoleAllowed(p.role, currentCounts, roster.length) &&
      !roster.find(drafted => drafted.playerId === p.playerId)
    );
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

      filteredPool = findValidPool(candidateTeam, candidateEra);

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

  // Re-roll Team only
  const handleRerollTeam = () => {
    if (!teamRerollAvailable || isSpinning || !hasSpun) return;
    setTeamRerollAvailable(false);

    let newTeam = '';
    let filteredPool = [];
    let attempts = 0;

    while (attempts < 100) {
      attempts++;
      const candTeam = TEAMS[Math.floor(Math.random() * TEAMS.length)];
      if (candTeam !== displayTeam) {
        filteredPool = findValidPool(candTeam, displayEra);
        if (filteredPool.length > 0) {
          newTeam = candTeam;
          break;
        }
      }
    }

    if (newTeam) {
      setDisplayTeam(newTeam);
      setCurrentOptions(filteredPool);
      setSpinResult({ era: displayEra, team: newTeam });
    } else {
      alert("No alternative team had valid players for this era. Re-roll refunded.");
      setTeamRerollAvailable(true);
    }
  };

  // Re-roll Era only
  const handleRerollEra = () => {
    if (!eraRerollAvailable || isSpinning || !hasSpun) return;
    setEraRerollAvailable(false);

    let newEra = '';
    let filteredPool = [];
    let attempts = 0;

    while (attempts < 100) {
      attempts++;
      const candEra = ERAS[Math.floor(Math.random() * ERAS.length)];
      if (candEra !== displayEra) {
        filteredPool = findValidPool(displayTeam, candEra);
        if (filteredPool.length > 0) {
          newEra = candEra;
          break;
        }
      }
    }

    if (newEra) {
      setDisplayEra(newEra);
      setCurrentOptions(filteredPool);
      setSpinResult({ era: newEra, team: displayTeam });
    } else {
      alert("No alternative era had valid players for this team. Re-roll refunded.");
      setEraRerollAvailable(true);
    }
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
  // 4. BALANCED TOURNAMENT SIMULATION ENGINE (FIXED 98/100 SKEW)
  // ============================================================================
  const runTournamentSimulation = (squad) => {
    let topBatters = squad
      .filter(p => p.role === 'Batter' || p.role === 'Wicketkeeper' || p.role === 'All-Rounder')
      .map(p => {
        const matches = Math.max(1, p.matches || 1);
        const volumeWeight = Math.min(1.0, 0.5 + (matches / 45));
        const runRateEfficiency = (p.batting_avg * (p.batting_sr / 100));
        return runRateEfficiency * volumeWeight;
      })
      .sort((a, b) => b - a);

    // Top 5 batters carry the primary scoring load
    const top5BattingScore = topBatters.slice(0, 5).reduce((acc, val) => acc + val, 0);
    const battingRating = Math.max(20, Math.min(99, Math.round((top5BattingScore / 240) * 100)));

    let bowlingUnits = squad
      .filter(p => p.role === 'Bowler' || p.role === 'All-Rounder')
      .map(p => {
        const matches = Math.max(1, p.matches || 1);
        const volumeWeight = Math.min(1.0, 0.5 + (matches / 45));
        const wktPoints = (p.wickets || 0) * 35;
        const econPoints = Math.max(-18, (8.0 - (p.bowling_econ || 9.0)) * 16);
        return (wktPoints + econPoints + 22) * volumeWeight;
      })
      .sort((a, b) => b - a);

    const top5BowlingScore = bowlingUnits.slice(0, 5).reduce((acc, val) => acc + val, 0);
    const bowlingRating = Math.max(20, Math.min(99, Math.round((top5BowlingScore / 220) * 100)));

    const unprovenCount = squad.filter(p => (p.matches || 1) < 10).length;
    const balancePenalty = unprovenCount * 5.0;
    const balanceRating = Math.max(15, Math.min(99, Math.round(((battingRating + bowlingRating) / 2) - balancePenalty)));

    // Overall squad power index (Strict scaling so 98/100 squads reliably win 13-1 or 14-0)
    const overallSquadPower = (battingRating * 0.40) + (bowlingRating * 0.40) + (balanceRating * 0.20);

    const fixtures = [
      { id: 1, vs: 'PBKS', diff: 72 },
      { id: 2, vs: 'DC',   diff: 74 },
      { id: 3, vs: 'LSG',  diff: 76 },
      { id: 4, vs: 'SRH',  diff: 78 },
      { id: 5, vs: 'GT',   diff: 80 },
      { id: 6, vs: 'RR',   diff: 82 },
      { id: 7, vs: 'RCB',  diff: 83 },
      { id: 8, vs: 'KKR',  diff: 85 },
      { id: 9, vs: 'CSK',  diff: 87 },
      { id: 10, vs: 'MI',  diff: 88 },
      { id: 11, vs: 'GT',  diff: 84 },
      { id: 12, vs: 'RR',  diff: 86 },
      { id: 13, vs: 'KKR', diff: 89 },
      { id: 14, vs: 'CSK', diff: 91 }
    ];

    let wins = 0;
    let matchLogs = [];

    fixtures.forEach((match) => {
      // Adjusted exponent divisor (35 instead of 28) to give 95+ teams rightful dominance
      const exponent = (match.diff - overallSquadPower) / 35;
      const winProbability = 1 / (1 + Math.pow(10, exponent));
      const roll = Math.random();
      const isWin = roll < winProbability;

      if (isWin) wins++;

      const marginPower = Math.abs(overallSquadPower - match.diff) + (Math.random() * 5);
      let marginText = '';
      if (isWin) {
        marginText = marginPower > 8 ? `Won by ${Math.round(marginPower * 3.5)} runs` : `Won by ${Math.min(7, Math.max(2, Math.round(marginPower * 0.75)))} wkts`;
      } else {
        marginText = marginPower > 8 ? `Lost by ${Math.round(marginPower * 3.0)} runs` : `Lost by ${Math.min(6, Math.max(1, Math.round(marginPower * 0.65)))} wkts`;
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
    setDisplayTeam('RCB');
    setDisplayEra('2023-2026');
    setTeamRerollAvailable(true);
    setEraRerollAvailable(true);
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
      {/* FULL VIEWPORT STYLES */}
      <style>{`
        html, body, #root {
          background-color: #050914 !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100vh !important;
          overflow: hidden !important;
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        
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
          filter: brightness(1.18);
          box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.6), 0 4px 10px -1px rgba(0, 0, 0, 0.3);
        }
        .player-card-interactive:active {
          transform: translateY(0px) scale(0.999);
        }
        .reroll-btn:hover {
          background-color: rgba(249, 115, 22, 0.25) !important;
          border-color: #F97316 !important;
        }
      `}</style>

      {/* HEADER BAR */}
      <header style={styles.headerBar}>
        <div style={styles.brandTitleGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <GameIcon size={24} style={{ border: '1px solid #334155', borderRadius: '5px' }} />
            <h1 style={styles.brandLogo}>IPL 14-0 ENGINE</h1>
          </div>
          <span style={styles.roundTrackerPill}>
            {seasonResult ? 'CAMPAIGN CONCLUDED' : `Round ${Math.min(12, roster.length + 1)} / 12`}
          </span>
        </div>

        {!seasonResult ? (
          <div style={styles.spinControlsHub}>
            <div style={styles.marqueeBadgesCluster}>
              
              {/* TEAM HUD BOX + RE-ROLL BUTTON */}
              <div style={styles.hudWrapperWithReroll}>
                <div style={{
                  ...styles.thickBezelHUDBox,
                  borderColor: TEAM_COLORS[displayTeam]?.border || '#EF4444',
                  boxShadow: `0 0 22px ${TEAM_COLORS[displayTeam]?.glow || 'rgba(239, 68, 68, 0.55)'}`
                }}>
                  <span style={styles.hudBoxLabel}>TEAM</span>
                  <span style={styles.hudBoxValue}>{displayTeam}</span>
                </div>
                {hasSpun && !isSpinning && (
                  <button 
                    onClick={handleRerollTeam}
                    disabled={!teamRerollAvailable}
                    className="reroll-btn"
                    style={{
                      ...styles.rerollActionButton,
                      opacity: teamRerollAvailable ? 1 : 0.35,
                      cursor: teamRerollAvailable ? 'pointer' : 'not-allowed'
                    }}
                    title={teamRerollAvailable ? "Re-roll Team (1 left)" : "Team Re-roll Used"}
                  >
                    🔄 TEAM
                  </button>
                )}
              </div>
              
              {/* ERA HUD BOX + RE-ROLL BUTTON */}
              <div style={styles.hudWrapperWithReroll}>
                <div style={{
                  ...styles.thickBezelHUDBox,
                  borderColor: '#9333EA',
                  boxShadow: '0 0 22px rgba(147, 51, 234, 0.55)'
                }}>
                  <span style={styles.hudBoxLabel}>ERA</span>
                  <span style={styles.hudBoxValue}>{displayEra}</span>
                </div>
                {hasSpun && !isSpinning && (
                  <button 
                    onClick={handleRerollEra}
                    disabled={!eraRerollAvailable}
                    className="reroll-btn"
                    style={{
                      ...styles.rerollActionButton,
                      opacity: eraRerollAvailable ? 1 : 0.35,
                      cursor: eraRerollAvailable ? 'pointer' : 'not-allowed'
                    }}
                    title={eraRerollAvailable ? "Re-roll Era (1 left)" : "Era Re-roll Used"}
                  >
                    🔄 ERA
                  </button>
                )}
              </div>

            </div>

            <button 
              onClick={handleSpin} 
              disabled={isSpinning}
              className={!isSpinning && !hasSpun ? "spin-pulse-btn" : ""}
              style={{
                ...styles.thickSpinButton,
                opacity: isSpinning ? 0.7 : 1,
                cursor: isSpinning ? 'not-allowed' : 'pointer'
              }}
            >
              {isSpinning ? 'SPINNING...' : hasSpun ? 'LOCKED' : 'SPIN'}
            </button>
          </div>
        ) : (
          <button onClick={resetGame} className="spin-pulse-btn" style={styles.thickSpinButton}>
            NEW CAMPAIGN
          </button>
        )}
      </header>

      {/* MAIN VIEWPORT-LOCKED WORKSPACE GRID */}
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
                      color: roleFilter === role ? '#FFFFFF' : '#94A3B8',
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
                  <p style={{ margin: 0, fontWeight: '600', color: '#94A3B8' }}>
                    Press <strong>SPIN</strong> above to generate available franchise candidates.
                  </p>
                </div>
              ) : (
                processedOptions.map(player => {
                  const teamToken = TEAM_COLORS[player.team] || { bg: '#131C31', border: '#334155', text: '#F8FAFC' };

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
                          {player.role.toUpperCase()} · <span style={{ color: '#F8FAFC', fontWeight: '800' }}>{player.matches || 1}M</span>
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
          /* TOURNAMENT SUMMARY DASHBOARD WITH CUSTOM TIERS */
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
                  <div style={{ ...styles.progressFill, width: `${seasonResult.bowlingRating}%`, backgroundColor: '#3B82F6' }} />
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
                    borderColor: m.result === 'W' ? '#065F46' : '#991B1B',
                    backgroundColor: m.result === 'W' ? '#064E3B' : '#7F1D1D'
                  }}
                >
                  <div style={styles.matchVsText}>M{m.id} vs {m.vs}</div>
                  <div style={{
                    ...styles.matchResultBadge,
                    color: m.result === 'W' ? '#34D399' : '#F87171'
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
            <svg style={styles.fieldSvgLayer} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <rect x="0" y="0" width="100" height="100" fill="#12351A" />
              <ellipse cx="50" cy="50" rx="45" ry="43" fill="#163F20" stroke="#FFFFFF" strokeWidth="1.25" strokeOpacity="0.85" />
              <ellipse cx="50" cy="50" rx="28" ry="30" fill="none" stroke="#FFFFFF" strokeWidth="0.75" strokeOpacity="0.4" strokeDasharray="2 2" />
              <rect x="44" y="32" width="12" height="36" rx="2" fill="#8C6239" stroke="#A47548" strokeWidth="0.5" />
              <line x1="44" y1="37" x2="56" y2="37" stroke="#FFFFFF" strokeWidth="0.6" strokeOpacity="0.9" />
              <line x1="44" y1="63" x2="56" y2="63" stroke="#FFFFFF" strokeWidth="0.6" strokeOpacity="0.9" />
              <line x1="46" y1="35" x2="54" y2="35" stroke="#FFFFFF" strokeWidth="0.4" strokeOpacity="0.7" />
              <line x1="46" y1="65" x2="54" y2="65" stroke="#FFFFFF" strokeWidth="0.4" strokeOpacity="0.7" />
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
                    backgroundColor: node.assigned ? 'rgba(18, 53, 26, 0.95)' : 'rgba(10, 35, 17, 0.85)',
                    borderColor: node.assigned ? teamTheme.border : '#475569',
                    borderStyle: node.assigned ? 'solid' : 'dashed'
                  }}
                >
                  <span style={{ ...styles.nodeRoleTag, color: node.assigned ? teamTheme.border : '#94A3B8' }}>
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
                backgroundColor: 'rgba(18, 53, 26, 0.95)',
                borderColor: TEAM_COLORS[impactPlayer.team]?.border || '#334155',
                color: '#FFFFFF'
              }}>
                <span style={{ color: TEAM_COLORS[impactPlayer.team]?.text, fontWeight: '800', marginRight: '0.45rem' }}>
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
    backgroundColor: '#050914',
    color: '#F8FAFC',
    height: '100vh',
    width: '100%',
    margin: 0,
    padding: '0.85rem 1.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexShrink: 0,
    backgroundColor: '#0D1322',
    padding: '0.65rem 1.25rem',
    borderRadius: '10px',
    border: '1px solid #1E293B',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    boxSizing: 'border-box',
    marginBottom: '0.75rem'
  },
  brandTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  brandLogo: {
    fontSize: '1.05rem',
    fontWeight: '900',
    letterSpacing: '0.04em',
    color: '#F8FAFC',
    margin: 0
  },
  roundTrackerPill: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#94A3B8',
    backgroundColor: '#131C31',
    padding: '0.25rem 0.65rem',
    borderRadius: '20px',
    border: '1px solid #1E293B'
  },
  spinControlsHub: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  marqueeBadgesCluster: {
    display: 'flex',
    gap: '0.75rem'
  },

  hudWrapperWithReroll: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem'
  },
  rerollActionButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    color: '#F97316',
    border: '1px solid #334155',
    borderRadius: '4px',
    fontSize: '0.55rem',
    fontWeight: '800',
    padding: '0.15rem 0.4rem',
    letterSpacing: '0.04em',
    transition: 'all 0.15s'
  },

  thickBezelHUDBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#070B17',
    border: '5px solid',
    borderRadius: '10px',
    padding: '0.2rem 0.5rem',
    width: '135px',
    minWidth: '135px',
    height: '56px',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease-in-out'
  },
  hudBoxLabel: {
    fontSize: '0.55rem',
    fontWeight: '900',
    color: '#FF6B00',
    letterSpacing: '0.08em',
    lineHeight: '1.1',
    marginBottom: '0.1rem'
  },
  hudBoxValue: {
    fontSize: '1.05rem',
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: '0.02em',
    lineHeight: '1.1'
  },
  thickSpinButton: {
    backgroundColor: '#F97316',
    color: '#FFFFFF',
    fontSize: '0.85rem',
    fontWeight: '900',
    border: 'none',
    padding: '0.65rem 1.75rem',
    borderRadius: '10px',
    letterSpacing: '0.06em',
    height: '56px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.45)',
    transition: 'all 0.15s'
  },

  mainLayoutGrid: {
    display: 'flex',
    gap: '1.25rem',
    width: '100%',
    flex: 1,
    minHeight: 0,
    boxSizing: 'border-box'
  },
  leftDraftSheet: {
    flex: '1 1 54%',
    backgroundColor: '#0D1322',
    borderRadius: '10px',
    border: '1px solid #1E293B',
    padding: '1rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0
  },
  filterActionBar: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    flexWrap: 'wrap',
    flexShrink: 0
  },
  roleTabsPillGroup: {
    display: 'flex',
    backgroundColor: '#131C31',
    borderRadius: '6px',
    padding: '0.15rem',
    border: '1px solid #1E293B'
  },
  roleTabButton: {
    border: 'none',
    padding: '0.3rem 0.55rem',
    fontSize: '0.65rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  searchInputControl: {
    flex: 1,
    minWidth: '120px',
    backgroundColor: '#131C31',
    border: '1px solid #1E293B',
    borderRadius: '4px',
    color: '#F8FAFC',
    padding: '0.35rem 0.65rem',
    fontSize: '0.75rem',
    outline: 'none'
  },
  sortDropdownControl: {
    backgroundColor: '#131C31',
    border: '1px solid #1E293B',
    borderRadius: '4px',
    color: '#F8FAFC',
    padding: '0.35rem 0.45rem',
    fontSize: '0.75rem',
    cursor: 'pointer'
  },
  availableCounterText: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: '0.5rem',
    paddingLeft: '0.2rem',
    flexShrink: 0
  },
  playerStreamViewport: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    paddingRight: '0.2rem',
    minHeight: 0
  },
  emptyPromptState: {
    padding: '4rem 2rem',
    textAlign: 'center',
    backgroundColor: '#131C31',
    borderRadius: '6px',
    border: '1px dashed #1E293B'
  },
  playerCardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid #1E293B',
    borderLeftWidth: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    boxSizing: 'border-box',
    flexShrink: 0
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
    fontSize: '0.85rem',
    fontWeight: '800',
    textAlign: 'left'
  },
  playerRoleSubTag: {
    fontSize: '0.55rem',
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: '0.03rem',
    textAlign: 'left'
  },
  metricsClusterRight: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 40px)',
    gap: '0.3rem',
    alignItems: 'center',
    justifyContent: 'end',
    flexShrink: 0
  },
  statColumnCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px'
  },
  statNumberPrimary: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center'
  },
  statLabelMuted: {
    fontSize: '0.45rem',
    fontWeight: '800',
    color: '#94A3B8',
    textAlign: 'center'
  },
  rightFieldContainer: {
    flex: '1 1 46%',
    backgroundColor: '#0D1322',
    borderRadius: '10px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    border: '1px solid #1E293B',
    boxSizing: 'border-box',
    minHeight: 0
  },
  fieldHeaderCaption: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: '0.06em',
    marginBottom: '0.5rem',
    textAlign: 'center',
    flexShrink: 0
  },
  cricketStadiumCanvas: {
    position: 'relative',
    flex: 1,
    minHeight: 0,
    backgroundColor: '#12351A',
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
    padding: '0.15rem 0.35rem',
    borderRadius: '5px',
    minWidth: '48px',
    borderWidth: '1.5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
    transition: 'all 0.15s'
  },
  nodeRoleTag: {
    fontSize: '0.45rem',
    fontWeight: '800',
    letterSpacing: '0.04em'
  },
  nodePlayerName: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#FFFFFF'
  },
  nodePlaceholderLabel: {
    fontSize: '0.45rem',
    fontWeight: '700',
    color: '#94A3B8'
  },
  impactSubBench: {
    marginTop: '0.5rem',
    backgroundColor: '#070B17',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    border: '1px solid #1E293B',
    flexShrink: 0
  },
  impactSubLabel: {
    fontSize: '0.6rem',
    fontWeight: '800',
    color: '#F97316',
    letterSpacing: '0.05em',
    marginBottom: '0.2rem'
  },
  impactPlayerCard: {
    padding: '0.35rem 0.65rem',
    borderRadius: '4px',
    border: '1px solid',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  impactSubEmptyState: {
    fontSize: '0.7rem',
    color: '#475569',
    fontStyle: 'italic'
  },

  // TOURNAMENT SUMMARY DASHBOARD
  leftSummaryDashboard: {
    flex: '1 1 54%',
    backgroundColor: '#0D1322',
    borderRadius: '10px',
    border: '1px solid #1E293B',
    padding: '1.25rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    boxSizing: 'border-box',
    minHeight: 0,
    overflowY: 'auto'
  },
  summaryTopBannerCard: {
    borderBottom: '1px solid #1E293B',
    paddingBottom: '0.85rem'
  },
  badgeRowVerdict: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  statusPillBadge: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#FFFFFF',
    padding: '0.3rem 0.75rem',
    borderRadius: '4px',
    letterSpacing: '0.04em'
  },
  squadScoreHeader: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#94A3B8'
  },
  bigScoreRow: {
    display: 'flex',
    alignItems: 'baseline'
  },
  bigScoreNumbers: {
    fontSize: '3rem',
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: '-0.03em',
    lineHeight: '1.1'
  },
  ratingsCardGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: '#131C31',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #1E293B'
  },
  ratingBarUnit: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  ratingLabelLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  metricTitleText: {
    fontSize: '0.8rem',
    color: '#CBD5E1',
    fontWeight: '600'
  },
  metricPercentText: {
    fontSize: '0.8rem',
    color: '#F8FAFC',
    fontWeight: '800'
  },
  progressTrack: {
    height: '6px',
    backgroundColor: '#1E293B',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.5s ease-out'
  },
  fixturesSectionHeader: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginTop: '0.1rem'
  },
  fixturesTimelineGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.4rem'
  },
  matchFixtureCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.35rem 0.15rem',
    borderRadius: '4px',
    border: '1px solid',
    textAlign: 'center'
  },
  matchVsText: {
    fontSize: '0.55rem',
    fontWeight: '700',
    color: '#CBD5E1'
  },
  matchResultBadge: {
    fontSize: '0.85rem',
    fontWeight: '900',
    margin: '0.05rem 0'
  },
  matchMarginText: {
    fontSize: '0.5rem',
    fontWeight: '700',
    color: '#94A3B8'
  }
};