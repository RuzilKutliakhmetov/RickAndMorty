import React, { useContext } from 'react'
import CloseButton from '../assets/close-icon.svg'
import { CharacterContext } from '../context/CharacterContext'
import CharacterCardInfo from './CharacterCardInfo'
export default function CharacterCard() {
	const { selectedCharacter, setSelectedCharacter, episodes, setEpisodes } =
		useContext(CharacterContext)

	return (
		<div className='pl-4 sm:pl-8 pr-4 py-4 flex flex-col border border-white rounded-2xl '>
			<div className='flex flex-row justify-between'>
				<div className='text-2xl sm:text-4xl hover:cursor-default'>
					Полная информация
				</div>
				<div
					onClick={() => {
						setSelectedCharacter(null)
						setEpisodes([])
					}}
				>
					<img
						className='w-8 hover:cursor-pointer'
						src={CloseButton}
						alt='CloseButton'
					/>
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
						<h2 className='text-2xl sm:text-4xl font-bold '>
							{selectedCharacter.name}
						</h2>
						<div className='text-xs sm:text-2xl text-gray-600 font-bold'>
							ID: {selectedCharacter.id}
						</div>
						<CharacterCardInfo
							title={'Раса'}
							info={selectedCharacter.species}
						/>

						<CharacterCardInfo title={'Жив'} info={selectedCharacter.status} />
						{selectedCharacter.gender !== 'unknown' ? (
							<CharacterCardInfo
								title={'Пол'}
								info={selectedCharacter.gender}
							/>
						) : (
							<></>
						)}
						{selectedCharacter.type ? (
							<CharacterCardInfo title={'Тип'} info={selectedCharacter.type} />
						) : (
							<></>
						)}
					</div>
				</div>
				<CharacterCardInfo
					title={'Местоположение'}
					info={selectedCharacter.location.name}
				/>

				{selectedCharacter.origin.name !== 'unknown' ? (
					<CharacterCardInfo
						title={'Происхождение'}
						info={selectedCharacter.origin.name}
					/>
				) : (
					<></>
				)}
				<table className='min-w-full mt-4 divide-y divide-gray-200'>
					<thead>
						<tr className='text-xs sm:text-xl'>
							<th className='sm:px-4 px-2 sm:py-2 py-1 font-bold text-left leading-2  uppercase tracking-wider'>
								Эпизод
							</th>
							<th className='px-6 py-3 font-bold text-left leading-2   uppercase tracking-wider'>
								Название
							</th>
							<th className='px-6 py-3 font-bold text-left leading-2   uppercase tracking-wider'>
								Дата выхода
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200'>
						{episodes.map(episode => (
							<tr className='text-xs sm:text-2xl' key={episode.id}>
								<td className='px-4 py-2 whitespace-no-wrap'>
									{episode.episode}
								</td>
								<td className='px-4 py-2 whitespace-no-wrap'>{episode.name}</td>
								<td className='px-4 py-2 whitespace-no-wrap'>
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
