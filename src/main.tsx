import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { CharacterProvider } from './context/CharacterContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<CharacterProvider>
			<App />
		</CharacterProvider>
	</StrictMode>
)
