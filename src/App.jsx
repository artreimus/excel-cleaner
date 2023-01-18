import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AppOne from './components/Apps/AppOne';
import AppTwo from './components/Apps/AppTwo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="clean">
          <Route path="app-one" element={<AppOne />} />
          <Route path="app-two" element={<AppTwo />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
