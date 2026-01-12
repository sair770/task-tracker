import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import TVPage from '@/pages/TV';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tv" element={<TVPage />} />
            </Routes>
        </Router>
    );
}

export default App;
