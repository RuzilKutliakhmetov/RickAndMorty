import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import EmptyListImg from '../assets/empty-list.png'
import { CharacterContext } from '../context/CharacterContext'
import CharacterInput from './CharacterInput'
import CharacterList from './CharacterList'
import Pagination from './Pagination'

const URL = 'https://rickandmortyapi.com/api/character/'

function SearchForm({ scrollToTop }) {
	const { setSelectedCharacter } = useContext(CharacterContext)
	const [characterData, setCharacterData] = useState(() => {
		// Загружаем данные из localStorage, если они есть
		const storedData = localStorage.getItem('characterData')
		if (storedData) {
			return JSON.parse(storedData)
		} else {
			return {
				name: '',
				status: '',
				species: '',
				episode: 0,
			}
		}
	})
	const [error, setError] = useState(false)
	const [page, setPage] = useState(() => {
		// Загружаем данные из localStorage, если они есть
		const storedPage = localStorage.getItem('page')
		if (storedPage) {
			return parseInt(storedPage, 10) // Преобразуем в число
		} else {
			return 1
		}
	})
	const [totalPage, setTotalPage] = useState(1)
	const [countCharacter, setCountCharacter] = useState(0)
	const [searchResult, setSearchResult] = useState([])
	const [nextPage, setNextPage] = useState('')
	const [prevPage, setPrevPage] = useState('')

	function getPostsByParams(params) {
		axios
			.get(URL, {
				params: params,
			})
			.then(response => {
				if (params.episode && params.episode !== '0') {
					const filteredResults = response.data.results.filter(character => {
						return character.episode.some(episodeUrl => {
							const episodeNumber = episodeUrl.split('/').pop()
							return episodeNumber === params.episode
						})
					})
					setSearchResult(filteredResults)
				} else {
					setSearchResult(response.data.results)
				}
				setCountCharacter(response.data.info.count)
				setNextPage(response.data.info.next)
				setPrevPage(response.data.info.prev)
				setTotalPage(response.data.info.pages)
				setError(false)
			})
			.catch(error => {
				console.log(error)
				setError(true)
				setTotalPage(null)
				setSearchResult([])
			})
	}

	async function fetchEpisodes(selectedEpisode) {
		try {
			if (selectedEpisode) {
				const charactersData = await Promise.all(
					selectedEpisode.characters.map(characterUrl =>
						axios.get(characterUrl)
					)
				)
				setSearchResult(charactersData.map(response => response.data))
				setCountCharacter(charactersData.length)
				setTotalPage(1)
			}
		} catch (error) {
			console.error(error)
		}
	}

	function getPostsByEpisode(episodeId) {
		console.log(`https://rickandmortyapi.com/api/episode/${episodeId}`)
		axios
			.get(`https://rickandmortyapi.com/api/episode/${episodeId}`)
			.then(response => {
				fetchEpisodes(response.data)
			})
			.catch(error => {
				console.log(error)
				setError(true)
				setTotalPage(null)
				setSearchResult([])
			})
	}

	useEffect(() => {
		setSearchResult([])
		const params = Object.assign(
			{},
			...Object.entries(characterData)
				.filter(([key, value]) => value !== '' && value !== 0)
				.map(([key, value]) => ({ [key]: value }))
		)
		params.page = page
		if (
			!('name' in params) &&
			!('status' in params) &&
			!('species' in params) &&
			params.episode &&
			params.episode !== '0'
		)
			getPostsByEpisode(params.episode)
		else getPostsByParams(params)
	}, [characterData, page])

	useEffect(() => {
		localStorage.setItem('characterData', JSON.stringify(characterData))
	}, [characterData])

	useEffect(() => {
		localStorage.setItem('page', page)
	}, [page])

	const handleChange = event => {
		const { name, value } = event.target
		setPage(1)
		setSelectedCharacter(null)
		setCharacterData({
			...characterData,
			[name]: value,
		})
	}

	const handlePageChange = async direction => {
		let newUrl = ''
		switch (direction) {
			case 'next':
				newUrl = nextPage
				break
			case 'prev':
				newUrl = prevPage
				break
		}

		if (newUrl) {
			try {
				const response = await axios.get(newUrl)
				setSearchResult(prevSearchResult => [
					...prevSearchResult,
					...response.data.results,
				])
				setNextPage(response.data.info.next)
				setPrevPage(response.data.info.prev)
				setPage(
					direction === 'next'
						? page + 1
						: direction === 'prev'
						? page - 1
						: page
				)
				setTotalPage(response.data.info.pages)
			} catch (error) {
				console.error(error)
			}
		}
	}

	return (
		<div className='border border-white rounded-2xl px-8 py-4 '>
			<div className='text-5xl mt-2 select-none hover:cursor-default'>
				Вселенная Рик и Морти
			</div>
			<CharacterInput characterData={characterData} onChange={handleChange} />

			{error ? (
				<img
					className='w-full focus:cursor-pointer'
					src={EmptyListImg}
					alt='EmptyListImg'
				></img>
			) : (
				<div className='mt-6 flex flex-col'>
					<Pagination
						countCharacter={countCharacter}
						page={page}
						totalPage={totalPage}
						prevPage={prevPage}
						nextPage={nextPage}
						handlePageChange={handlePageChange}
					/>
					<CharacterList data={searchResult} scrollToTop={scrollToTop} />
					<div className='flex flex-row justify-end'></div>
				</div>
			)}
		</div>
	)
}

export default SearchForm
