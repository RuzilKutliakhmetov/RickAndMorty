import type { ReactElement } from 'react'
import { memo } from 'react'
import type { Character } from '../constants/types'
import { useCharacterContext } from '../context/CharacterContext'

interface CharacterListProps {
	data: Character[]
	scrollToTop: () => void
}

// Мемоизируем компонент для предотвращения лишних ререндеров
const CharacterList = memo(
	({ data, scrollToTop }: CharacterListProps): ReactElement => {
		const { selectedCharacter, setSelectedCharacter, setEpisodes } =
			useCharacterContext()

		const handleCharacterClick = (character: Character): void => {
			scrollToTop()
			setSelectedCharacter(character)

			// Очищаем эпизоды только если выбран новый персонаж
			if (character.id !== selectedCharacter?.id) {
				setEpisodes([])
			}
		}

		// Если данных нет, показываем сообщение
		if (data.length === 0) {
			return (
				<div className='text-center py-8 text-xl text-gray-500'>
					Персонажи не найдены
				</div>
			)
		}

		return (
			<div className='mt-4 space-y-3'>
				{data.map(character => (
					<div
						key={character.id} // Используем id вместо index для ключа
						className={`flex flex-row gap-2 justify-center items-center p-4 text-lg sm:text-2xl border border-white rounded-lg hover:cursor-pointer transition-colors duration-200 ${
							selectedCharacter?.id === character.id
								? 'bg-white text-black'
								: 'hover:bg-gray-800'
						}`}
						onClick={() => handleCharacterClick(character)}
						role='button'
						tabIndex={0}
						onKeyPress={e => {
							if (e.key === 'Enter' || e.key === ' ') {
								handleCharacterClick(character)
							}
						}}
					>
						<div className='flex-1 text-center truncate' title={character.name}>
							{character.name}
						</div>
						<div
							className='flex-1 text-center truncate'
							title={character.species}
						>
							{character.species}
						</div>
						<div className='flex-1 text-center'>
							<span
								className={`px-2 py-1 rounded-full text-sm ${
									character.status === 'Alive'
										? 'bg-green-500 text-white'
										: character.status === 'Dead'
										? 'bg-red-500 text-white'
										: 'bg-gray-500 text-white'
								}`}
							>
								{character.status}
							</span>
						</div>
						<div
							className='flex-1 text-center truncate'
							title={character.location.name}
						>
							{character.location.name}
						</div>
					</div>
				))}
			</div>
		)
	}
)

// Добавляем displayName для удобства отладки
CharacterList.displayName = 'CharacterList'

export default CharacterList
