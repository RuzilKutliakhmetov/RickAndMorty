import type { ReactElement } from 'react'

import { useCharacterContext } from '../context/CharacterContext'

import { CloseButton } from '../constants/images'
import type { Episode } from '../constants/types'
import CharacterCardInfo from './CharacterCardInfo'

export default function CharacterCard(): ReactElement | null {
	const { selectedCharacter, setSelectedCharacter, episodes, setEpisodes } =
		useCharacterContext()

	if (!selectedCharacter) {
		return null
	}

	const handleClose = (): void => {
		setSelectedCharacter(null)
		setEpisodes([])
	}

	const hasGenderInfo = selectedCharacter.gender !== 'unknown'
	const hasTypeInfo = Boolean(selectedCharacter.type)
	const hasOriginInfo = selectedCharacter.origin.name !== 'unknown'

	return (
		<div className='pl-4 sm:pl-8 pr-4 py-4 flex flex-col border border-white rounded-2xl'>
			<div className='flex flex-row justify-between'>
				<div className='text-2xl sm:text-4xl hover:cursor-default'>
					Полная информация
				</div>
				<div onClick={handleClose} className='hover:cursor-pointer'>
					<img className='w-8' src={CloseButton} alt='Close Button' />
				</div>
			</div>

			<div className='p-4 hover:cursor-default'>
				<div className='flex items-center mb-4'>
					<img
						src={selectedCharacter.image}
						alt={selectedCharacter.name}
						className='w-1/3 rounded-full mr-4'
					/>
					<div className='flex flex-col'>
						<h2 className='text-2xl sm:text-4xl font-bold'>
							{selectedCharacter.name}
						</h2>
						<div className='text-xs sm:text-2xl text-gray-600 font-bold'>
							ID: {selectedCharacter.id}
						</div>

						<CharacterCardInfo title='Раса' info={selectedCharacter.species} />
						<CharacterCardInfo title='Жив' info={selectedCharacter.status} />

						{hasGenderInfo && (
							<CharacterCardInfo title='Пол' info={selectedCharacter.gender} />
						)}

						{hasTypeInfo && (
							<CharacterCardInfo title='Тип' info={selectedCharacter.type} />
						)}
					</div>
				</div>

				<CharacterCardInfo
					title='Местоположение'
					info={selectedCharacter.location.name}
				/>

				{hasOriginInfo && (
					<CharacterCardInfo
						title='Происхождение'
						info={selectedCharacter.origin.name}
					/>
				)}

				<table className='min-w-full mt-4 divide-y divide-gray-200'>
					<thead>
						<tr className='text-xs sm:text-xl'>
							<th className='sm:px-4 px-2 sm:py-2 py-1 font-bold text-left leading-2 uppercase tracking-wider'>
								Эпизод
							</th>
							<th className='px-6 py-3 font-bold text-left leading-2 uppercase tracking-wider'>
								Название
							</th>
							<th className='px-6 py-3 font-bold text-left leading-2 uppercase tracking-wider'>
								Дата выхода
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200'>
						{episodes.map((episode: Episode) => (
							<tr className='text-xs sm:text-2xl' key={episode.id}>
								<td className='px-4 py-2 whitespace-nowrap'>
									{episode.episode}
								</td>
								<td className='px-4 py-2 whitespace-nowrap'>{episode.name}</td>
								<td className='px-4 py-2 whitespace-nowrap'>
									{episode.air_date}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
