import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import EmptyListImg from '../assets/empty-list.png'
import { CharacterContext } from '../context/CharacterContext'
import CharacterInput from './CharacterInput'
import CharacterList from './CharacterList'
import Pagination from './Pagination'

export default function SearchForm({ scrollToTop }) {
	const { setSelectedCharacter } = useContext(CharacterContext)

	const [searchData, setSearchData] = useState(() => {
		const storedData = localStorage.getItem('searchData')
		if (storedData) {
			return JSON.parse(storedData)
		} else {
			return {
				characterData: {
					name: '',
					status: '',
					species: '',
					episode: 0,
				},
				page: 1,
				totalPage: 1,
				nextPage: null,
				prevPage: null,
				countCharacter: 0,
				searchType: 'character',
			}
		}
	})

	const {
		characterData,
		page,
		totalPage,
		nextPage,
		prevPage,
		countCharacter,
		searchType,
	} = searchData

	const [error, setError] = useState(false)
	const [searchResult, setSearchResult] = useState([])

	// Функция для поиска по персонажам
	function getPostsByCharacterParams(params) {
		axios
			.get('https://rickandmortyapi.com/api/character/', {
				params: params,
			})
			.then(response => {
				setSearchResult(response.data.results)
				setSearchData(prevSearchData => ({
					...prevSearchData,
					countCharacter: response.data.info.count,
					nextPage: response.data.info.next,
					prevPage: response.data.info.prev,
					totalPage: response.data.info.pages,
				}))
				setError(false)
			})
			.catch(error => {
				console.log(error)
				setError(true)
				setSearchData(prevSearchData => ({
					...prevSearchData,
					totalPage: null,
					searchResult: [],
				}))
			})
	}

	// Функция для поиска по эпизоду
	async function getPostsByEpisode(episodeId) {
		try {
			const response = await axios.get(
				`https://rickandmortyapi.com/api/episode/${episodeId}`
			)
			const charactersData = await Promise.all(
				response.data.characters.map(characterUrl => axios.get(characterUrl))
			)

			setSearchResult(charactersData.map(response => response.data))
			setSearchData(prevSearchData => ({
				...prevSearchData,
				countCharacter: charactersData.length,
				nextPage: null,
				prevPage: null,
				totalPage: 1,
			}))
			setError(false)
		} catch (error) {
			console.log(error)
			setError(true)
			setSearchData(prevSearchData => ({
				...prevSearchData,
				nextPage: null,
				prevPage: null,
				totalPage: null,
				searchResult: [],
			}))
		}
	}

	// Сохраняем данные в localStorage
	useEffect(() => {
		localStorage.setItem('searchData', JSON.stringify(searchData))
	}, [searchData])

	// Функция для выполнения поиска
	useEffect(() => {
		setSearchResult([])
		let params = {}
		if (
			searchType === 'character' ||
			characterData.episode == '' ||
			characterData.episode == 0
		) {
			params = Object.assign(
				{},
				...Object.entries(characterData)
					.filter(([key, value]) => value !== '' && value !== 0)
					.map(([key, value]) => ({ [key]: value }))
			)
			params.page = page
			getPostsByCharacterParams(params)
		} else if (searchType === 'episode') {
			if (characterData.episode && characterData.episode !== 0) {
				getPostsByEpisode(characterData.episode)
			}
		}
	}, [characterData, page, searchType])

	// Обработчик изменения параметров поиска
	const handleChange = event => {
		const { name, value } = event.target
		if (name === 'episode')
			setSearchData(prevSearchData => ({
				...prevSearchData,
				characterData: {
					...prevSearchData.characterData,
					[name]: value,
					name: '',
					status: '',
					species: '',
				},
				searchType: 'episode',
			}))
		else {
			setSearchData(prevSearchData => ({
				...prevSearchData,
				characterData: {
					...prevSearchData.characterData,
					[name]: value,
					episode: '',
				},
				searchType: 'character',
			}))
		}
		setSearchData(prevSearchData => ({
			...prevSearchData,
			page: 1,
		}))
		setSelectedCharacter(null)
	}

	// Обработчик изменения типа поиска
	const handleSearchTypeChange = type => {
		setSearchData(prevSearchData => ({
			...prevSearchData,
			searchType: type,
		}))
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
				setSearchData(prevSearchData => ({
					...prevSearchData,
					nextPage: response.data.info.next,
					prevPage: response.data.info.prev,
					totalPage: response.data.info.pages,
				}))
				setSearchData(prevSearchData => ({
					...prevSearchData,
					page:
						direction === 'next'
							? prevSearchData.page + 1
							: direction === 'prev'
							? prevSearchData.page - 1
							: prevSearchData.page,
				}))
			} catch (error) {}
		}
	}

	return (
		<div className='border border-white rounded-2xl py-2 sm:py-4 px-4 sm:px-8  '>
			<div className='text-5xl mt-2 select-none hover:cursor-default'>
				Вселенная Рик и Морти
			</div>
			<CharacterInput characterData={characterData} onChange={handleChange} />
			{error ? (
				<img
					className='w-full focus:cursor-pointer'
					src={EmptyListImg}
					alt=''
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
