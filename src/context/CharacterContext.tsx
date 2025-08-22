import axios from 'axios'
import type { ReactNode } from 'react'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import type { Character, Episode } from '../constants/types' // Импортируем типы

// Типизация контекста
interface CharacterContextType {
	selectedCharacter: Character | null
	setSelectedCharacter: (character: Character | null) => void
	episodes: Episode[]
	setEpisodes: (episodes: Episode[]) => void
	fetchEpisodes: (character: Character) => Promise<void>
}

// Создаем контекст с типом
export const CharacterContext = createContext<CharacterContextType | undefined>(
	undefined
)

// Пропсы для провайдера
interface CharacterProviderProps {
	children: ReactNode
}

export const CharacterProvider = ({ children }: CharacterProviderProps) => {
	const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
		null
	)
	const [episodes, setEpisodes] = useState<Episode[]>([])

	// Мемоизированная функция для загрузки эпизодов
	const fetchEpisodes = useCallback(
		async (character: Character): Promise<void> => {
			try {
				if (!character?.episode?.length) {
					setEpisodes([])
					return
				}

				const episodesData = await Promise.all(
					character.episode.map(async (episodeUrl: string) => {
						const response = await axios.get<Episode>(episodeUrl)
						return response.data
					})
				)

				setEpisodes(episodesData)
			} catch (error) {
				console.error('Error fetching episodes:', error)
				setEpisodes([])
			}
		},
		[]
	)

	// Эффект для загрузки эпизодов при изменении выбранного персонажа
	useEffect(() => {
		if (selectedCharacter) {
			fetchEpisodes(selectedCharacter)
		} else {
			setEpisodes([])
		}
	}, [selectedCharacter, fetchEpisodes])

	// Значение контекста
	const contextValue: CharacterContextType = {
		selectedCharacter,
		setSelectedCharacter,
		episodes,
		setEpisodes,
		fetchEpisodes,
	}

	return (
		<CharacterContext.Provider value={contextValue}>
			{children}
		</CharacterContext.Provider>
	)
}

// Хук для удобного использования контекста
export const useCharacterContext = (): CharacterContextType => {
	const context = useContext(CharacterContext)
	if (context === undefined) {
		throw new Error(
			'useCharacterContext must be used within a CharacterProvider'
		)
	}
	return context
}
