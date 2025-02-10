/* import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import { Provider } from 'react-redux';
import { store } from './store/index';
import Reserva1 from './pages/Reserva1/Reserva1';
import Reserva2 from './pages/Reserva2/Reserva2';
import Reserva3 from './pages/Reserva3/Reserva3';
import ReservaConfirmacion from './pages/Confirmation/Confirmation';
import Login from './pages/Login/Login';
import Logup from './pages/Logup/Logup';


function App() {
  return (
<Provider store={store}>
  <Router>
    <Layout>
      <Routes>
        <Route path="/register" element={<Logup />} />
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/reserva/:aulaId" element={<Reserva1 />} />
        <Route path="/Reserva2/:aulaId" element={<Reserva2 />} />
        <Route path="/Reserva3/:aulaId" element={<Reserva3 />} />
        <Route path="/ReservaConfirmacion/:aulaId" element={<ReservaConfirmacion />} />
      </Routes>
    </Layout>
  </Router>
</Provider>

)}

export default App;
 */

/* import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/index';
import Reserva1 from './pages/Reserva1/Reserva1';
import Reserva2 from './pages/Reserva2/Reserva2';
import Reserva3 from './pages/Reserva3/Reserva3';
import ReservaConfirmacion from './pages/Confirmation/Confirmation';
import Login from './pages/Login/Login';
import Logup from './pages/Logup/Logup';
import { setUser } from './features/reservation/authSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    if (token && userEmail) {
      dispatch(setUser({ token, user: { email: userEmail } }));
    }
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/register" element={<Logup />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/reserva/:aulaId" element={<Reserva1 />} />
          <Route path="/reserva2/:aulaId" element={<Reserva2 />} />
          <Route path="/reserva3/:aulaId" element={<Reserva3 />} />
          <Route path="/reservaConfirmacion/:aulaId" element={<ReservaConfirmacion />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
 */ import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/index';
import Reserva1 from './pages/Reserva1/Reserva1';
import Reserva2 from './pages/Reserva2/Reserva2';
import Reserva3 from './pages/Reserva3/Reserva3';
import ReservaConfirmacion from './pages/Confirmation/Confirmation';
import Login from './pages/Login/Login';
import Logup from './pages/Logup/Logup';
import { setUser } from './features/reservation/authSlice';
import MisReservas from './pages/MisReservas/MisReservas';
import AdminDashboard from './pages/admin-dashboard/admin-dashboard';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    if (token && userEmail) {
      dispatch(setUser({ token, user: { email: userEmail } }));
    }
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/register" element={<Logup />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/reserva/:aulaId" element={<Reserva1 />} />
          <Route path="/reserva2/:aulaId" element={<Reserva2 />} />
          <Route path="/reserva3/:aulaId" element={<Reserva3 />} />
          <Route path="/reservaConfirmacion/:aulaId" element={<ReservaConfirmacion />} />
          <Route path="/misReservas" element={<MisReservas />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const AppWithProvider = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppWithProvider;
