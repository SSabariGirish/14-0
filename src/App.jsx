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


const FONT_DISPLAY = "'Chakra Petch', 'Segoe UI', sans-serif";
const FONT_BODY = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

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

// Soft-compresses a raw 0-100+ rating so that scores above 85 get
// progressively harder to reach — a 99 should mean "genuinely elite top-5",
// not just "drafted a handful of recognizable names". Below 85 the raw
// score passes through untouched.
const compressRating = (raw) => {
  const compressed = raw <= 85 ? raw : 85 + (raw - 85) * 0.4;
  return Math.max(20, Math.min(99, Math.round(compressed)));
};

// Small canvas-drawing helper (manual, so it works even on browsers
// without native ctx.roundRect support).
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const STORAGE_KEY = 'ipl140_engine_save_v1';

const loadSavedCampaign = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

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
  const initialSave = useRef(loadSavedCampaign()).current;
  const [resumedBanner, setResumedBanner] = useState(
    !!(initialSave && (initialSave.roster?.length > 0 || initialSave.seasonResult))
  );

  const [roster, setRoster] = useState(initialSave?.roster || []);
  const [currentOptions, setCurrentOptions] = useState(initialSave?.currentOptions || []);
  const [spinResult, setSpinResult] = useState(initialSave?.spinResult || null);
  const [seasonResult, setSeasonResult] = useState(initialSave?.seasonResult || null);
  const [hasSpun, setHasSpun] = useState(initialSave?.hasSpun || false);

  const [isSpinning, setIsSpinning] = useState(false);
  const [displayTeam, setDisplayTeam] = useState(initialSave?.displayTeam || 'RCB');
  const [displayEra, setDisplayEra] = useState(initialSave?.displayEra || '2023-2026');

  const [teamRerollAvailable, setTeamRerollAvailable] = useState(
    initialSave?.teamRerollAvailable ?? true
  );
  const [eraRerollAvailable, setEraRerollAvailable] = useState(
    initialSave?.eraRerollAvailable ?? true
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortBy, setSortBy] = useState('matches');
  const [shareStatus, setShareStatus] = useState('idle'); // idle | working | done
  const [fallbackNotice, setFallbackNotice] = useState(false);
  const [justLocked, setJustLocked] = useState(false);

  const tickerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (tickerRef.current) clearTimeout(tickerRef.current);
    };
  }, []);

  // Persist the in-progress (or concluded) campaign so a refresh doesn't
  // wipe out a 12-round draft. Best-effort: if localStorage is unavailable
  // (private browsing, quota exceeded) the game still works normally.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        roster,
        currentOptions,
        spinResult,
        seasonResult,
        hasSpun,
        displayTeam,
        displayEra,
        teamRerollAvailable,
        eraRerollAvailable
      }));
    } catch {
      // ignore — persistence is a nice-to-have, not a hard requirement
    }
  }, [roster, currentOptions, spinResult, seasonResult, hasSpun,
      displayTeam, displayEra, teamRerollAvailable, eraRerollAvailable]);

  const currentCounts = useMemo(() => {
    const counts = { Batter: 0, Wicketkeeper: 0, Bowler: 0, 'All-Rounder': 0 };
    roster.forEach(p => {
      if (counts[p.role] !== undefined) counts[p.role] += 1;
    });
    return counts;
  }, [roster]);

  const overseasCount = useMemo(() => {
    return roster.filter(p => p.is_overseas).length;
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

  // Every team+era combination, in random order. Used instead of capped
  // random sampling so a search either truly exhausts every option or
  // finds one — no more "sometimes" misses from bad luck within N tries.
  const shuffledCombos = () => {
    const combos = [];
    TEAMS.forEach((team) => ERAS.forEach((era) => combos.push({ team, era })));
    for (let i = combos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combos[i], combos[j]] = [combos[j], combos[i]];
    }
    return combos;
  };

  // Exhaustively searches every allowed combo for one with an eligible
  // undrafted player. If nothing satisfies the strict role requirement
  // anywhere in the dataset (e.g. every All-Rounder has already been
  // drafted), falls back to any undrafted player from that combo rather
  // than leaving the caller with nothing — this is what stops a thin role
  // from ever hard-locking or wiping the campaign.
  const findExhaustiveCombo = (comboFilter) => {
    const combos = shuffledCombos().filter(comboFilter);

    for (const combo of combos) {
      const pool = findValidPool(combo.team, combo.era);
      if (pool.length > 0) return { ...combo, pool, relaxed: false };
    }
    for (const combo of combos) {
      const pool = playersData.filter((p) =>
        p.era === combo.era &&
        p.team === combo.team &&
        !roster.find((drafted) => drafted.playerId === p.playerId)
      );
      if (pool.length > 0) return { ...combo, pool, relaxed: true };
    }
    return null;
  };

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    setHasSpun(true);
    setSpinResult(null);
    setFallbackNotice(false);

    const found = findExhaustiveCombo(() => true);

    if (!found) {
      alert("No undrafted players remain anywhere in the dataset — your campaign is effectively complete as-is.");
      setIsSpinning(false);
      setHasSpun(false);
      return;
    }

    const { team: targetTeam, era: targetEra, pool: filteredPool, relaxed } = found;

    // A real slot-machine reel decelerates before it lands rather than
    // ticking at a flat rate — this is the one signature "big" motion
    // moment in the game, so it's worth the extra care.
    const totalTicks = 16;
    let tick = 0;

    const runTick = () => {
      if (tick >= totalTicks) {
        setDisplayTeam(targetTeam);
        setDisplayEra(targetEra);
        setSpinResult({ era: targetEra, team: targetTeam });
        setCurrentOptions(filteredPool);
        setFallbackNotice(relaxed);
        setIsSpinning(false);
        setSearchQuery('');
        setRoleFilter('All');
        setJustLocked(true);
        setTimeout(() => setJustLocked(false), 550);
        return;
      }
      const progress = tick / totalTicks;
      // In the final stretch, bias the reel toward the real target so the
      // last few frames already look like they're converging — the lock
      // then reads as "it settled here" rather than a 1-frame swap.
      const convergeChance = Math.max(0, (progress - 0.55) / 0.45);
      const showsTarget = Math.random() < convergeChance;
      setDisplayTeam(showsTarget ? targetTeam : TEAMS[Math.floor(Math.random() * TEAMS.length)]);
      setDisplayEra(showsTarget ? targetEra : ERAS[Math.floor(Math.random() * ERAS.length)]);
      tick++;
      // eases from a fast 45ms shuffle up to a slow ~190ms settle
      const nextProgress = tick / totalTicks;
      const delay = 45 + Math.pow(nextProgress, 2.2) * 145;
      tickerRef.current = setTimeout(runTick, delay);
    };

    runTick();
  };

  const handleRerollTeam = () => {
    if (!teamRerollAvailable || isSpinning || !hasSpun) return;
    setTeamRerollAvailable(false);

    const found = findExhaustiveCombo((c) => c.era === displayEra && c.team !== displayTeam);

    if (found) {
      setDisplayTeam(found.team);
      setCurrentOptions(found.pool);
      setSpinResult({ era: displayEra, team: found.team });
      setFallbackNotice(found.relaxed);
    } else {
      alert("No alternative team has undrafted players for this era. Re-roll refunded.");
      setTeamRerollAvailable(true);
    }
  };

  const handleRerollEra = () => {
    if (!eraRerollAvailable || isSpinning || !hasSpun) return;
    setEraRerollAvailable(false);

    const found = findExhaustiveCombo((c) => c.team === displayTeam && c.era !== displayEra);

    if (found) {
      setDisplayEra(found.era);
      setCurrentOptions(found.pool);
      setSpinResult({ era: found.era, team: displayTeam });
      setFallbackNotice(found.relaxed);
    } else {
      alert("No alternative era has undrafted players for this team. Re-roll refunded.");
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

    const top5BattingScore = topBatters.slice(0, 5).reduce((acc, val) => acc + val, 0);
    const battingRating = compressRating((top5BattingScore / 300) * 100);

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
    const bowlingRating = compressRating((top5BowlingScore / 270) * 100);

    // A player with under 10 IPL matches is only a real "liability" if their
    // per-match output was also weak. A star having a short, brilliant
    // cameo (a 3-match overseas import who smashed every game) shouldn't
    // cost the squad the same as a bowler who played once and got taken
    // apart. Penalty is capped so a couple of unproven picks can't tank an
    // otherwise strong draft.
    const liabilityPenalty = squad.reduce((sum, p) => {
      const matches = p.matches || 1;
      if (matches >= 10) return sum;
      const battingQuality = p.batting_avg > 0
        ? (p.batting_avg * (p.batting_sr / 100)) / 55
        : 0;
      const bowlingQuality = p.wickets > 0
        ? (((p.wickets * 35) + (8.0 - (p.bowling_econ || 9.0)) * 16)) / 55
        : 0;
      const quality = Math.max(battingQuality, bowlingQuality);
      const perPlayerPenalty = quality >= 1 ? 1.0 : 2.5;
      return sum + perPlayerPenalty;
    }, 0);
    const balancePenalty = Math.min(25, liabilityPenalty);
    const balanceRating = Math.max(15, Math.min(99, Math.round(((battingRating + bowlingRating) / 2) - balancePenalty)));

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
    setFallbackNotice(false);

    if (updatedRoster.length === 12) {
      const results = runTournamentSimulation(updatedRoster);
      setSeasonResult(results);
    }
  };

  const resetGame = () => {
    if (tickerRef.current) clearTimeout(tickerRef.current);
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setResumedBanner(false);
    setShareStatus('idle');
    setFallbackNotice(false);
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

  // Renders the final result as a shareable PNG (portrait, social-friendly)
  // and either opens the native share sheet (mobile) or downloads the file.
  const handleShareResult = async () => {
    if (!seasonResult || !currentTier) return;
    setShareStatus('working');

    const W = 1080, H = 1350;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#050914');
    bgGrad.addColorStop(1, '#0B1220');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(255,255,255,0.035)';
    for (let x = 0; x < W; x += 36) {
      for (let y = 0; y < H; y += 36) ctx.fillRect(x, y, 1.4, 1.4);
    }

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '900 42px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText('IPL 14-0 ENGINE', 60, 96);

    ctx.fillStyle = currentTier.color;
    roundRect(ctx, 60, 128, 460, 56, 10);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 25px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText(`${currentTier.grade} · ${currentTier.title}`, 80, 165);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '900 100px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText(`${seasonResult.wins}W – ${seasonResult.losses}L`, 60, 305);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 24px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText(`Tournament Index: ${seasonResult.overallSquadPower}/100`, 60, 344);

    const bars = [
      { label: 'Batting Execution', value: seasonResult.battingRating, color: '#F97316' },
      { label: 'Bowling Defense', value: seasonResult.bowlingRating, color: '#3B82F6' },
      { label: 'Squad Balance & Depth', value: seasonResult.balanceRating, color: '#10B981' }
    ];
    let barY = 400;
    bars.forEach((b) => {
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '600 22px -apple-system, "Segoe UI", sans-serif';
      ctx.fillText(b.label, 60, barY);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = '800 22px -apple-system, "Segoe UI", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${b.value}/100`, W - 60, barY);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#1E293B';
      roundRect(ctx, 60, barY + 14, W - 120, 14, 7);
      ctx.fill();
      ctx.fillStyle = b.color;
      roundRect(ctx, 60, barY + 14, (W - 120) * (b.value / 100), 14, 7);
      ctx.fill();
      barY += 72;
    });

    ctx.fillStyle = '#94A3B8';
    ctx.font = '800 20px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText('FINAL 12-MAN SQUAD', 60, barY + 26);

    const gridTop = barY + 56;
    const colW = (W - 120) / 2;
    onFieldAssignments.forEach((slot, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 60 + col * colW;
      const y = gridTop + row * 66;
      const teamTheme = slot.assigned ? TEAM_COLORS[slot.assigned.team] : null;

      ctx.fillStyle = '#0D1322';
      roundRect(ctx, x, y, colW - 16, 54, 8);
      ctx.fill();
      ctx.strokeStyle = teamTheme ? teamTheme.border : '#334155';
      ctx.lineWidth = 2;
      roundRect(ctx, x, y, colW - 16, 54, 8);
      ctx.stroke();

      ctx.fillStyle = teamTheme ? teamTheme.text : '#94A3B8';
      ctx.font = '800 13px -apple-system, "Segoe UI", sans-serif';
      ctx.fillText(slot.title, x + 16, y + 22);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '700 20px -apple-system, "Segoe UI", sans-serif';
      ctx.fillText(slot.assigned ? slot.assigned.name : 'EMPTY', x + 16, y + 43);
    });

    const impactY = gridTop + 6 * 66 + 22;
    if (impactPlayer) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 18px -apple-system, "Segoe UI", sans-serif';
      ctx.fillText(`IMPACT SUB: ${impactPlayer.name} (${impactPlayer.team})`, 60, impactY);
    }

    ctx.fillStyle = '#475569';
    ctx.font = '600 17px -apple-system, "Segoe UI", sans-serif';
    ctx.fillText('Built with the IPL 14-0 Engine', 60, H - 40);

    canvas.toBlob(async (blob) => {
      if (!blob) { setShareStatus('idle'); return; }
      const file = new File([blob], 'ipl-14-0-result.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'My IPL 14-0 Engine result' });
          setShareStatus('done');
          setTimeout(() => setShareStatus('idle'), 1800);
          return;
        } catch {
          // user cancelled the native share sheet — fall through to download
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ipl-14-0-result.png';
      a.click();
      URL.revokeObjectURL(url);
      setShareStatus('done');
      setTimeout(() => setShareStatus('idle'), 1800);
    }, 'image/png');
  };

  return (
    <div style={styles.appCanvas}>
      {/* FULL VIEWPORT STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');

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

        .hud-badge-lock {
          animation: hudLockFlash 0.5s ease-out;
        }
        @keyframes hudLockFlash {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.9); }
          35%  { box-shadow: 0 0 26px 6px rgba(255,255,255,0.55); }
          100% { box-shadow: 0 0 22px var(--hud-glow, rgba(239,68,68,0.55)); }
        }

        .stadium-floodlight {
          position: fixed;
          top: -25vh;
          left: 50%;
          width: 90vw;
          height: 55vh;
          transform: translateX(-50%);
          background: radial-gradient(ellipse at center, rgba(249, 115, 22, 0.10) 0%, rgba(249, 115, 22, 0) 62%);
          pointer-events: none;
          z-index: -1;
        }
        .stadium-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: -1;
          opacity: 0.05;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        @keyframes barFillIn {
          from { width: 0%; }
        }
        .rating-bar-fill {
          animation: barFillIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes tierPunchIn {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .tier-badge-reveal {
          animation: tierPunchIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes fixtureFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="stadium-floodlight" />
      <div className="stadium-grain" />

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

          {/* DYNAMIC OVERSEAS TRACKER PILL (SHADED GREEN -> RED WARNING) */}
          {!seasonResult && (
            <span style={{
              ...styles.overseasTrackerPill,
              ...(overseasCount >= 4 ? {
                color: '#FCA5A5',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              } : {})
            }}>
              ✈️ Overseas: {overseasCount} / 4
            </span>
          )}
        </div>

        {!seasonResult ? (
          <div style={styles.spinControlsHub}>
            <div style={styles.marqueeBadgesCluster}>
              
              <div style={styles.hudWrapperWithReroll}>
                <div
                  className={justLocked && !isSpinning ? "hud-badge-lock" : ""}
                  style={{
                    ...styles.thickBezelHUDBox,
                    borderColor: TEAM_COLORS[displayTeam]?.border || '#EF4444',
                    boxShadow: `0 0 22px ${TEAM_COLORS[displayTeam]?.glow || 'rgba(239, 68, 68, 0.55)'}`,
                    '--hud-glow': TEAM_COLORS[displayTeam]?.glow || 'rgba(239, 68, 68, 0.55)'
                  }}
                >
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
              
              <div style={styles.hudWrapperWithReroll}>
                <div
                  className={justLocked && !isSpinning ? "hud-badge-lock" : ""}
                  style={{
                    ...styles.thickBezelHUDBox,
                    borderColor: '#9333EA',
                    boxShadow: '0 0 22px rgba(147, 51, 234, 0.55)',
                    '--hud-glow': 'rgba(147, 51, 234, 0.55)'
                  }}
                >
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
              disabled={isSpinning || hasSpun}
              className={!isSpinning && !hasSpun ? "spin-pulse-btn" : ""}
              style={{
                ...styles.thickSpinButton,
                opacity: isSpinning ? 0.7 : hasSpun ? 0.55 : 1,
                cursor: (isSpinning || hasSpun) ? 'not-allowed' : 'pointer'
              }}
            >
              {isSpinning ? 'SPINNING...' : hasSpun ? 'LOCKED' : 'SPIN'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={handleShareResult}
              disabled={shareStatus === 'working'}
              style={{
                ...styles.thickSpinButton,
                backgroundColor: '#0F1830',
                color: '#F8FAFC',
                border: '1px solid #334155',
                boxShadow: 'none',
                opacity: shareStatus === 'working' ? 0.7 : 1,
                cursor: shareStatus === 'working' ? 'not-allowed' : 'pointer'
              }}
            >
              {shareStatus === 'working' ? 'RENDERING…' : shareStatus === 'done' ? 'SHARED ✓' : '📤 SHARE RESULT'}
            </button>
            <button onClick={resetGame} className="spin-pulse-btn" style={styles.thickSpinButton}>
              NEW CAMPAIGN
            </button>
          </div>
        )}
      </header>

      {resumedBanner && (
        <div style={styles.resumedBannerPill} onClick={() => setResumedBanner(false)}>
          ↺ Resumed your in-progress campaign — click to dismiss
        </div>
      )}

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

            {fallbackNotice && !isSpinning && (
              <div style={styles.fallbackNoticeBanner}>
                ⚠️ No dedicated match for the role you still need was left anywhere in the dataset —
                showing every undrafted player from this franchise/era instead so you can keep going.
              </div>
            )}

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

                  // OVERSEAS QUOTA LOGIC
                  const isOverseasLimitReached = player.is_overseas && overseasCount >= 4;

                  return (
                    <div 
                      key={player.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        if (!isOverseasLimitReached) handleDraft(player);
                      }}
                      onKeyDown={(e) => { 
                        if ((e.key === 'Enter' || e.key === ' ') && !isOverseasLimitReached) handleDraft(player); 
                      }}
                      className={!isOverseasLimitReached ? "player-card-interactive" : ""}
                      style={{
                        ...styles.playerCardRow,
                        borderLeftColor: teamToken.border,
                        backgroundColor: teamToken.bg,
                        opacity: isOverseasLimitReached ? 0.35 : 1,
                        cursor: isOverseasLimitReached ? 'not-allowed' : 'pointer'
                      }}
                      title={isOverseasLimitReached ? "Max 4 Overseas Players Reached" : ""}
                    >
                      <div style={styles.playerMetaIdentity}>
                        <div style={{ ...styles.playerNameHeading, color: teamToken.text }}>
                          {player.name} {player.is_overseas && "✈️"}
                        </div>
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
          <div style={{ ...styles.leftSummaryDashboard, borderTopColor: currentTier.color }}>
            <div style={styles.summaryTopBannerCard}>
              <div style={styles.badgeRowVerdict}>
                <span className="tier-badge-reveal" style={{
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
                  <div
                    className="rating-bar-fill"
                    style={{ ...styles.progressFill, width: `${seasonResult.battingRating}%`, backgroundColor: '#F97316', animationDelay: '0.05s' }}
                  />
                </div>
              </div>

              <div style={styles.ratingBarUnit}>
                <div style={styles.ratingLabelLine}>
                  <span style={styles.metricTitleText}>Bowling Defense</span>
                  <strong style={styles.metricPercentText}>{seasonResult.bowlingRating}/100</strong>
                </div>
                <div style={styles.progressTrack}>
                  <div
                    className="rating-bar-fill"
                    style={{ ...styles.progressFill, width: `${seasonResult.bowlingRating}%`, backgroundColor: '#3B82F6', animationDelay: '0.2s' }}
                  />
                </div>
              </div>

              <div style={styles.ratingBarUnit}>
                <div style={styles.ratingLabelLine}>
                  <span style={styles.metricTitleText}>Squad Balance & Depth</span>
                  <strong style={styles.metricPercentText}>{seasonResult.balanceRating}/100</strong>
                </div>
                <div style={styles.progressTrack}>
                  <div
                    className="rating-bar-fill"
                    style={{ ...styles.progressFill, width: `${seasonResult.balanceRating}%`, backgroundColor: '#10B981', animationDelay: '0.35s' }}
                  />
                </div>
              </div>
            </div>

            <div style={styles.fixturesSectionHeader}>14-Match League Results Log</div>
            <div style={styles.fixturesTimelineGrid}>
              {seasonResult.matchLogs.map((m, i) => (
                <div 
                  key={m.id} 
                  style={{
                    ...styles.matchFixtureCard,
                    borderColor: m.result === 'W' ? '#065F46' : '#991B1B',
                    backgroundColor: m.result === 'W' ? '#064E3B' : '#7F1D1D',
                    animation: `fixtureFadeIn 0.3s ease-out both`,
                    animationDelay: `${0.4 + i * 0.035}s`
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
    fontFamily: FONT_BODY,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 0
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
    fontWeight: '700',
    letterSpacing: '0.04em',
    color: '#F8FAFC',
    margin: 0,
    fontFamily: FONT_DISPLAY
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
  overseasTrackerPill: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#6EE7B7',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: '0.25rem 0.65rem',
    borderRadius: '20px',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    letterSpacing: '0.02em',
    transition: 'all 0.3s ease'
  },
  resumedBannerPill: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#94A3B8',
    backgroundColor: '#0D1322',
    border: '1px solid #1E293B',
    borderRadius: '8px',
    padding: '0.4rem 0.85rem',
    marginBottom: '0.75rem',
    cursor: 'pointer',
    flexShrink: 0,
    width: 'fit-content'
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
    padding: '0.25rem 1.1rem',
    width: 'auto',
    minWidth: '190px',
    height: '56px',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease-in-out'
  },
  hudBoxLabel: {
    fontSize: '0.55rem',
    fontWeight: '700',
    color: '#FF6B00',
    letterSpacing: '0.08em',
    lineHeight: '1.1',
    marginBottom: '0.15rem',
    whiteSpace: 'nowrap',
    fontFamily: FONT_DISPLAY
  },
  hudBoxValue: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: '0.01em',
    lineHeight: '1.1',
    whiteSpace: 'nowrap',
    fontFamily: FONT_DISPLAY
  },
  thickSpinButton: {
    backgroundColor: '#F97316',
    color: '#FFFFFF',
    fontSize: '0.85rem',
    fontWeight: '700',
    border: 'none',
    padding: '0.65rem 1.75rem',
    borderRadius: '10px',
    letterSpacing: '0.06em',
    height: '56px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.45)',
    transition: 'all 0.15s',
    fontFamily: FONT_DISPLAY
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
    borderTop: '2px solid #F97316',
    borderLeft: '1px solid #1E293B',
    borderRight: '1px solid #1E293B',
    borderBottom: '1px solid #1E293B',
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
  fallbackNoticeBanner: {
    fontSize: '0.72rem',
    fontWeight: '600',
    color: '#FCD34D',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.35)',
    borderRadius: '8px',
    padding: '0.5rem 0.75rem',
    marginBottom: '0.6rem',
    flexShrink: 0,
    lineHeight: 1.4
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
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
    fontFamily: FONT_DISPLAY
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
    borderTop: '2px solid #10B981',
    borderLeft: '1px solid #1E293B',
    borderRight: '1px solid #1E293B',
    borderBottom: '1px solid #1E293B',
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
    fontWeight: '700',
    letterSpacing: '0.04em',
    fontFamily: FONT_DISPLAY
  },
  nodePlayerName: {
    fontSize: '0.68rem',
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: FONT_DISPLAY
  },
  nodePlaceholderLabel: {
    fontSize: '0.45rem',
    fontWeight: '700',
    color: '#475569'
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

  leftSummaryDashboard: {
    flex: '1 1 54%',
    backgroundColor: '#0D1322',
    borderRadius: '10px',
    borderTop: '2px solid #1E293B',
    borderLeft: '1px solid #1E293B',
    borderRight: '1px solid #1E293B',
    borderBottom: '1px solid #1E293B',
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
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#FFFFFF',
    padding: '0.3rem 0.75rem',
    borderRadius: '4px',
    letterSpacing: '0.04em',
    fontFamily: FONT_DISPLAY
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
    fontSize: '3.2rem',
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: '-0.01em',
    lineHeight: '1.1',
    fontFamily: FONT_DISPLAY
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
    fontSize: '0.9rem',
    fontWeight: '700',
    margin: '0.05rem 0',
    fontFamily: FONT_DISPLAY
  },
  matchMarginText: {
    fontSize: '0.5rem',
    fontWeight: '700',
    color: '#94A3B8'
  }
};