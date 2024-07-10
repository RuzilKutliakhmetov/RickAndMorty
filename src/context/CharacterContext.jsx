import axios from 'axios'
import { createContext, useEffect, useState } from 'react'

export const CharacterContext = createContext()

export const CharacterProvider = ({ children }) => {
	const [selectedCharacter, setSelectedCharacter] = useState(null)
	const [episodes, setEpisodes] = useState([])

	async function fetchEpisodes(selectedCharacter) {
		try {
			if (selectedCharacter) {
				const episodesData = await Promise.all(
					selectedCharacter.episode.map(episodeUrl => axios.get(episodeUrl))
				)
				setEpisodes([
					...episodes,
					...episodesData.map(response => response.data),
				])
			}
		} catch (error) {
			console.error(error)
		}
	}
	useEffect(() => {
		fetchEpisodes(selectedCharacter)
	}, [selectedCharacter])
	return (
		<CharacterContext.Provider
			value={{ selectedCharacter, setSelectedCharacter, episodes, setEpisodes }}
		>
			{children}
		</CharacterContext.Provider>
	)
}
