import React from 'react';
import {
  Routes, Route, Link, NavLink, useParams, useNavigate, useSearchParams, Outlet
} from 'react-router-dom';


const genres = [
  { id: 'action', label: 'Боевик' },
  { id: 'comedy', label: 'Комедия' },
  { id: 'drama', label: 'Драма' }
];

const movies = [
  { id: 'interstellar', name: 'Интерстеллар', genre: 'drama', price: 499, desc: 'Путешествие сквозь червоточину.' },
  { id: 'john-wick', name: 'Джон Уик', genre: 'action', price: 399, desc: 'Месть за собаку.' },
  { id: 'hangover', name: 'Мальчишник в Вегасе', genre: 'comedy', price: 299, desc: 'Что случилось ночью?' }
];

function ProductCard({ movie }) {
  return (
    <Link to={`/catalog/${movie.id}`} className="product-card">
      <strong>{movie.name}</strong>
      <span>{movie.genre}</span>
      <span>{movie.price} ₽</span>
    </Link>
  );
}

function CategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('genre') || '';

  return (
    <div className="filter-row">
      <button onClick={() => setSearchParams({})} className={!active ? 'active' : ''}>Все</button>
      {genres.map(g => (
        <button key={g.id} onClick={() => setSearchParams({ genre: g.id })} className={g.id === active ? 'active' : ''}>
          {g.label}
        </button>
      ))}
    </div>
  );
}

function HomePage() {
  return (
    <div>
      <h1>MovieBox</h1>
      <p>Каталог фильмов с маршрутизацией.</p>
    </div>
  );
}

function CatalogPage() {
  const [searchParams] = useSearchParams();
  const genre = searchParams.get('genre');
  const list = genre ? movies.filter(m => m.genre === genre) : movies;

  return (
    <>
      <CategoryFilter />
      <div className="product-grid">
        {list.map(m => <ProductCard key={m.id} movie={m} />)}
      </div>
    </>
  );
}

function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find(m => m.id === id);

  if (!movie) return <div>Такого фильма нет в каталоге.</div>;

  return (
    <div>
      <h1>{movie.name}</h1>
      <p>{movie.desc}</p>
      <p><strong>{movie.price} ₽</strong></p>
      <button onClick={() => navigate(-1)}>← Назад</button>
    </div>
  );
}

function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q')?.toLowerCase() || '';
  const results = q ? movies.filter(m => m.name.toLowerCase().includes(q)) : [];

  return (
    <>
      {q && <p>Результаты по запросу: "{q}"</p>}
      <div className="product-grid">
        {results.map(m => <ProductCard key={m.id} movie={m} />)}
        {!q && <div>Введите запрос в поиске сверху</div>}
        {q && !results.length && <div>Ничего не найдено</div>}
      </div>
    </>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>404 — Страница не найдена</h1>
      <button onClick={() => navigate('/')}>На главную</button>
    </div>
  );
}

function Layout() {
  const navigate = useNavigate();

  return (
    <>
      <header className="app-header">
        <nav className="main-nav">
          <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Главная</NavLink>
          <NavLink to="/catalog" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Каталог</NavLink>
        </nav>
        <div className="header-search">
          <input placeholder="Найти фильм..." onKeyDown={e => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              navigate('/search?q=' + encodeURIComponent(e.target.value.trim()));
              e.target.value = '';
            }
          }} />
        </div>
      </header>
      <main className="page-area">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/:id" element={<MoviePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}