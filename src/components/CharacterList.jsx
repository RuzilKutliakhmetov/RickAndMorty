import React, { useContext } from 'react'
import { CharacterContext } from '../context/CharacterContext'

export default function CharacterList({ data, scrollToTop }) {
	const { selectedCharacter, setSelectedCharacter, setEpisodes } =
		useContext(CharacterContext)
	return (
		<div className=''>
			{data.map((character, index) => (
				<div
					key={index}
					className='flex flex-row gap-2 justify-center items-center p-4 mt-3 text-lg sm:text-2xl border border-white rounded-lg hover:cursor-pointer'
					onClick={() => {
						scrollToTop()
						setSelectedCharacter(character)
						if (character !== selectedCharacter) setEpisodes([])
					}}
				>
					<div className='flex-1 text-center'>{character.name}</div>
					<div className='flex-1 text-center'>{character.species}</div>
					<div className='flex-1 text-center'>{character.status}</div>
					<div className='flex-1 text-center'>{character.location.name}</div>
				</div>
			))}
		</div>
	)
}
