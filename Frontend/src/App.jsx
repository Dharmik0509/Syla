import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        {/* We will implement routing later, for now render Home directly */}
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
