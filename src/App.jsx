import { useContext, useRef } from 'react'
import BackgroundLogo from './assets/logo.png'
import CharacterCard from './components/CharacterCard'
import SearchForm from './components/SearchForm'
import { CharacterContext } from './context/CharacterContext'

function App() {
	const { selectedCharacter } = useContext(CharacterContext)
	const topRef = useRef(null)
	const scrollToTop = () => {
		topRef.current.scrollIntoView({ behavior: 'smooth' })
	}

	return (
		<div
			ref={topRef}
			className='font-Caveat w-full h-full min-h-screen flex flex-row bg-black text-white gap-8 p-4 '
		>
			<div className='flex-1 w-full h-min'>
				{selectedCharacter ? (
					<CharacterCard selectedCharacter={selectedCharacter} />
				) : (
					<SearchForm scrollToTop={scrollToTop} />
				)}
			</div>
			<div className='flex-1 hidden md:block'>
				<img className='w-full' src={BackgroundLogo} />
			</div>
		</div>
	)
}

export default App
