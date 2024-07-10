import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CharacterProvider } from './context/CharacterContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<CharacterProvider>
			<App />
		</CharacterProvider>
	</React.StrictMode>
)
