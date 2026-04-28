import { useEffect, useMemo, useState } from 'react';
import {
  HiOutlineArrowLeft,
  HiOutlineBolt,
  HiOutlineExclamationTriangle,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineTrophy,
} from 'react-icons/hi2';

import { getRankById } from '../data/ranks';
import {
  getGlobalLeaderboard,
  type LeaderboardEntry,
} from '../services/leaderboard';

interface Props {
  currentUserId?: string;
  onBack: () => void;
}

const TEXT = '#0C1628';
const TEXT2 = '#4A5568';
const MUTED = '#8C9CB4';
const BORDER = 'rgba(12,22,40,0.07)';

function getDisplayName(entry: LeaderboardEntry): string {
  return entry.display_name?.trim()
    || entry.username?.trim()
    || 'Student';
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'MI';
}

export default function LeaderboardScreen({ currentUserId, onBack }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    setError(null);

    getGlobalLeaderboard()
      .then(data => {
        if (!ignore) setEntries(data);
      })
      .catch(err => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load leaderboard.');
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const topEntry = entries[0];
  const totalXp = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.xp, 0),
    [entries],
  );

  return (
    <div
      className="app-page"
      style={{
        minHeight: '100vh',
        paddingBottom: '3rem',
        background: 'linear-gradient(180deg, #F3F7FF 0%, #EEF4FF 45%, #F8FBFF 100%)',
      }}
    >
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '2rem 1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '999px',
              border: `1px solid ${BORDER}`,
              background: '#fff',
              color: TEXT2,
              fontSize: '0.88rem',
              fontWeight: 700,
              padding: '0.7rem 1rem',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
            }}
          >
            <HiOutlineArrowLeft aria-hidden="true" />
            <span>Back to map</span>
          </button>

          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 800, color: MUTED, letterSpacing: '0.08em' }}>
              GLOBAL STANDINGS
            </p>
            <h1 style={{ margin: '0.25rem 0 0', fontSize: '1.65rem', fontWeight: 900, color: TEXT }}>
              Leaderboard
            </h1>
          </div>
        </div>

        <section
          style={{
            borderRadius: '1.45rem',
            padding: '1.2rem',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #0D1B36 0%, #14254A 58%, #10203E 100%)',
            color: '#fff',
            boxShadow: '0 22px 54px rgba(15,23,42,0.16)',
            border: '1px solid rgba(100,116,139,0.12)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.85rem',
          }}
        >
          <div>
            <div style={{ color: '#8EA3C4', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
              TOP STUDENT
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900 }}>
              {topEntry ? getDisplayName(topEntry) : 'No entries yet'}
            </div>
            <div style={{ color: '#91A3BE', fontSize: '0.86rem', marginTop: '0.25rem' }}>
              Public profile fields and aggregate progress only
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.6rem' }}>
            <div style={{ borderRadius: '1rem', background: 'rgba(255,255,255,0.08)', padding: '0.85rem' }}>
              <HiOutlineTrophy aria-hidden="true" color="#FBBF24" />
              <div style={{ fontSize: '1.35rem', fontWeight: 900, marginTop: '0.35rem' }}>{entries.length}</div>
              <div style={{ color: '#A5B4CF', fontSize: '0.72rem', fontWeight: 700 }}>players</div>
            </div>
            <div style={{ borderRadius: '1rem', background: 'rgba(255,255,255,0.08)', padding: '0.85rem' }}>
              <HiOutlineBolt aria-hidden="true" color="#FBBF24" />
              <div style={{ fontSize: '1.35rem', fontWeight: 900, marginTop: '0.35rem' }}>{totalXp.toLocaleString('en-US')}</div>
              <div style={{ color: '#A5B4CF', fontSize: '0.72rem', fontWeight: 700 }}>total XP</div>
            </div>
            <div style={{ borderRadius: '1rem', background: 'rgba(255,255,255,0.08)', padding: '0.85rem' }}>
              <HiOutlineSparkles aria-hidden="true" color="#5EEAD4" />
              <div style={{ fontSize: '1.35rem', fontWeight: 900, marginTop: '0.35rem' }}>{topEntry?.badges_count ?? 0}</div>
              <div style={{ color: '#A5B4CF', fontSize: '0.72rem', fontWeight: 700 }}>top badges</div>
            </div>
          </div>
        </section>

        <section
          style={{
            borderRadius: '1.45rem',
            background: '#fff',
            border: `1px solid ${BORDER}`,
            boxShadow: '0 10px 28px rgba(15,23,42,0.05)',
            overflow: 'hidden',
          }}
        >
          {isLoading && (
            <div style={{ padding: '2rem', color: TEXT2, fontWeight: 800, textAlign: 'center' }}>
              Loading leaderboard...
            </div>
          )}

          {!isLoading && error && (
            <div style={{ padding: '2rem', color: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', fontWeight: 800 }}>
              <HiOutlineExclamationTriangle aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && !error && entries.length === 0 && (
            <div style={{ padding: '2rem', color: TEXT2, fontWeight: 800, textAlign: 'center' }}>
              No leaderboard entries yet.
            </div>
          )}

          {!isLoading && !error && entries.map((entry, index) => {
            const name = getDisplayName(entry);
            const rank = getRankById(entry.current_rank_id);
            const isCurrentUser = entry.user_id === currentUserId;

            return (
              <article
                key={entry.user_id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3.25rem minmax(0, 1fr) auto',
                  gap: '0.85rem',
                  alignItems: 'center',
                  padding: '1rem 1.15rem',
                  borderBottom: index === entries.length - 1 ? 'none' : `1px solid ${BORDER}`,
                  background: isCurrentUser ? '#EFF6FF' : '#fff',
                }}
              >
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: index < 3 ? '#FEF3C7' : '#F1F5F9',
                    color: index < 3 ? '#B45309' : TEXT2,
                    fontWeight: 900,
                  }}
                >
                  #{index + 1}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
                  {entry.avatar_url ? (
                    <img
                      src={entry.avatar_url}
                      alt=""
                      style={{
                        width: '2.75rem',
                        height: '2.75rem',
                        borderRadius: '1rem',
                        objectFit: 'cover',
                        flex: '0 0 auto',
                      }}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      style={{
                        width: '2.75rem',
                        height: '2.75rem',
                        borderRadius: '1rem',
                        background: 'linear-gradient(135deg, #14B8A6, #2563EB)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                      }}
                    >
                      {getInitials(name)}
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: TEXT, fontSize: '1rem', fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {name}
                    </div>
                    <div style={{ color: MUTED, fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span>{rank.icon} {rank.name}</span>
                      {isCurrentUser && <span style={{ color: '#2563EB' }}>You</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: TEXT, fontSize: '1.05rem', fontWeight: 900 }}>
                      {entry.xp.toLocaleString('en-US')} XP
                    </div>
                    <div style={{ color: MUTED, fontSize: '0.76rem', fontWeight: 700 }}>
                      {entry.badges_count} badges
                    </div>
                  </div>
                  <div
                    title="Badges"
                    style={{
                      width: '2.35rem',
                      height: '2.35rem',
                      borderRadius: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ECFDF5',
                      color: '#059669',
                    }}
                  >
                    <HiOutlineShieldCheck aria-hidden="true" />
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
