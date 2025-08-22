// types.ts

// Базовые интерфейсы
export interface Info {
	count: number
	pages: number
	next: string | null
	prev: string | null
}

export interface ApiResponse<T> {
	info: Info
	results: T[]
}

// Локации
export interface Location {
	id: number
	name: string
	type: string
	dimension: string
	residents: string[]
	url: string
	created: string
}

// Эпизоды
export interface Episode {
	id: number
	name: string
	air_date: string
	episode: string
	characters: string[]
	url: string
	created: string
}

// Персонажи
export type Gender = 'Female' | 'Male' | 'Genderless' | 'unknown'
export type Status = 'Alive' | 'Dead' | 'unknown'

export interface Character {
	id: number
	name: string
	status: Status
	species: string
	type: string
	gender: Gender
	origin: {
		name: string
		url: string
	}
	location: {
		name: string
		url: string
	}
	image: string
	episode: string[]
	url: string
	created: string
}

// Фильтры для запросов
export interface CharacterFilter {
	name?: string
	status?: Status
	species?: string
	type?: string
	gender?: Gender
	page?: number
}

export interface LocationFilter {
	name?: string
	type?: string
	dimension?: string
	page?: number
}

export interface EpisodeFilter {
	name?: string
	episode?: string
	page?: number
}

// Контекст персонажей
export interface CharacterContextType {
	characters: Character[]
	selectedCharacter: Character | null
	episodes: Episode[]
	loading: boolean
	error: string | null
	hasMore: boolean
	filters: CharacterFilter
	setSelectedCharacter: (character: Character | null) => void
	setEpisodes: (episodes: Episode[]) => void
	setCharacters: (characters: Character[]) => void
	setLoading: (loading: boolean) => void
	setError: (error: string | null) => void
	setHasMore: (hasMore: boolean) => void
	setFilters: (filters: CharacterFilter) => void
	loadMoreCharacters: () => Promise<void>
	searchCharacters: (filters: CharacterFilter) => Promise<void>
	fetchCharacterEpisodes: (character: Character) => Promise<void>
}

// Пропсы компонентов
export interface CharacterCardProps {
	character: Character
	onClick: (character: Character) => void
}

export interface CharacterListProps {
	characters: Character[]
	onCharacterSelect: (character: Character) => void
	loading?: boolean
}

export interface SearchFiltersProps {
	filters: CharacterFilter
	onFiltersChange: (filters: CharacterFilter) => void
	onSearch: () => void
	onReset: () => void
}

// Утилитарные типы
export type ApiEndpoint = 'character' | 'location' | 'episode'

export type ApiResource = Character | Location | Episode

export interface ApiError {
	error: string
}

// Хуки
export interface UseCharactersResult {
	characters: Character[]
	loading: boolean
	error: string | null
	hasMore: boolean
	loadMore: () => Promise<void>
	search: (filters: CharacterFilter) => Promise<void>
	reset: () => void
}

// Параметры запросов
export interface QueryParams {
	[key: string]: string | number | undefined
}

// Респонсы для конкретных эндпоинтов
export interface CharacterResponse extends ApiResponse<Character> {}
export interface LocationResponse extends ApiResponse<Location> {}
export interface EpisodeResponse extends ApiResponse<Episode> {}

// Типы для пагинации
export interface PaginationInfo {
	currentPage: number
	totalPages: number
	totalCount: number
	hasNext: boolean
	hasPrev: boolean
}

// Типы для кэширования
export interface CacheItem<T> {
	data: T
	timestamp: number
	expiresIn: number
}

export interface ApiCache {
	characters: Map<string, CacheItem<Character[]>>
	episodes: Map<string, CacheItem<Episode[]>>
	locations: Map<string, CacheItem<Location[]>>
}
