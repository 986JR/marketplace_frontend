import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getPhones, Phone } from '../services/api';
import PhoneCard from '../components/PhoneCard';
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CONDITION_OPTIONS = ['All', 'NEW', 'REFURBISHED', 'USED'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt_desc' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating_desc' },
];

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(12);

  // Filters
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Debounce search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(0);
    }, 400);
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCondition('All');
    setSortBy('createdAt_desc');
    setMinPrice('');
    setMaxPrice('');
    setPage(0);
  };

  const hasActiveFilters = condition !== 'All' || minPrice || maxPrice || sortBy !== 'createdAt_desc' || debouncedSearch;

  const fetchPhones = useCallback(() => {
    setLoading(true);
    const [sortField, sortDir] = sortBy.split('_');
    getPhones(
      page,
      pageSize,
      debouncedSearch || undefined,
      condition !== 'All' ? condition : undefined,
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined,
      sortField,
      sortDir
    ).then(data => {
      setPhones(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page, pageSize, debouncedSearch, condition, minPrice, maxPrice, sortBy]);

  useEffect(() => { fetchPhones(); }, [fetchPhones]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="container" style={{ paddingBottom: '5rem' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
        {isAdmin ? (
          <>
            <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Admin Dashboard
            </p>
            <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '0.75rem', lineHeight: 1.1 }}>
              Hello, <span style={{ color: 'var(--accent)' }}>{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
              Explore and manage your device inventory. Add, edit, or remove phones instantly.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '1rem', lineHeight: 1.1 }}>
              Your Next Phone, <span style={{ color: 'var(--accent)' }}>Found Here</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Browse premium phones with guaranteed quality and the best prices in Dodoma.
            </p>
          </>
        )}

        {/* Search Bar */}
        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
          <div className="glass" style={{
            padding: '0.5rem 1rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search brand, model..."
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: 'white', width: '100%', fontSize: '0.95rem', padding: '0.5rem 0' }}
            />
            {search && (
              <button onClick={() => { setSearch(''); setDebouncedSearch(''); setPage(0); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => setFiltersOpen(o => !o)}
              style={{
                background: filtersOpen || hasActiveFilters ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '10px',
                padding: '0.4rem 0.75rem',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.8rem',
                flexShrink: 0,
                transition: '0.2s'
              }}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {filtersOpen && (
            <div className="glass animate-fade-in" style={{
              position: 'absolute',
              top: 'calc(100% + 0.75rem)',
              left: 0,
              right: 0,
              borderRadius: '16px',
              padding: '1.5rem',
              zIndex: 50,
              background: 'rgba(15,23,42,0.98)',
              border: '1px solid var(--border)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Condition */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Condition</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {CONDITION_OPTIONS.map(c => (
                      <button
                        key={c}
                        onClick={() => { setCondition(c); setPage(0); }}
                        style={{
                          padding: '0.35rem 0.85rem',
                          borderRadius: '8px',
                          border: `1px solid ${condition === c ? 'var(--accent)' : 'var(--border)'}`,
                          background: condition === c ? 'var(--accent)' : 'transparent',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          transition: '0.2s'
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min Price */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Min Price (TZS)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={e => { setMinPrice(e.target.value); setPage(0); }}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Max Price (TZS)</label>
                  <input
                    type="number"
                    placeholder="No limit"
                    value={maxPrice}
                    onChange={e => { setMaxPrice(e.target.value); setPage(0); }}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Sort */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Sort By</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={sortBy}
                      onChange={e => { setSortBy(e.target.value); setPage(0); }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 2rem 0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        fontSize: '0.85rem',
                        appearance: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {SORT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value} style={{ background: '#0f172a' }}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <X size={14} /> Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Listing */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>{isAdmin ? 'Inventory' : 'Available Phones'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {loading ? 'Loading...' : `${totalElements} device${totalElements !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <Loader2 className="animate-spin" size={40} color="var(--accent)" />
          </div>
        ) : phones.length > 0 ? (
          <>
            <div className="phone-grid">
              {phones.map(phone => (
                <PhoneCard
                  key={phone.id}
                  phone={phone}
                  onDelete={deletedId => setPhones(prev => prev.filter(p => p.id !== deletedId))}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={page === 0}
                  onClick={() => handlePageChange(page - 1)}
                  className="pagination-btn"
                >
                  ← Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-btn ${page === i ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => handlePageChange(page + 1)}
                  className="pagination-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="glass" style={{ textAlign: 'center', padding: '5rem 2rem', borderRadius: '20px' }}>
            <h3 style={{ marginBottom: '1rem' }}>No phones found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {hasActiveFilters ? 'Try adjusting your filters.' : 'No phones available yet.'}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
