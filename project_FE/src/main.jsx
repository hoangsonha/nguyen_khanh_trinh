import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import GlobalStyles from './component/GlobalStyles'

createRoot(document.getElementById('root')).render(
    <GlobalStyles>
        <App />
    </GlobalStyles>
);