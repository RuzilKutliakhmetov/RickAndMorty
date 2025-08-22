import type { ReactElement } from 'react'
import { useRef } from 'react'
import BackgroundLogo from './assets/logo.png'
import CharacterCard from './components/CharacterCard'
import SearchForm from './components/SearchForm'
import { useCharacterContext } from './context/CharacterContext'

function App(): ReactElement {
	const { selectedCharacter } = useCharacterContext()
	const topRef = useRef<HTMLDivElement>(null)

	const scrollToTop = (): void => {
		if (topRef.current) {
			topRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}

	return (
		<div
			ref={topRef}
			className='font-caveat-semibold w-full h-full min-h-screen flex flex-row bg-black text-white gap-8 p-2 sm:p-4'
		>
			<div className='flex-1 h-min'>
				{selectedCharacter ? (
					<CharacterCard />
				) : (
					<SearchForm scrollToTop={scrollToTop} />
				)}
			</div>

			<div className='flex-1 hidden md:block'>
				<img
					className='w-full'
					src={BackgroundLogo}
					alt='Rick and Morty background'
				/>
			</div>
		</div>
	)
}

export default App
