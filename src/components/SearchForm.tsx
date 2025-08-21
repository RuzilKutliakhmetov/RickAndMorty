import { useContext, useEffect, useState, ReactElement, useCallback } from 'react';
import axios from 'axios';
import {EmptyList} from '../constants/images';
import { CharacterContext } from '../context/CharacterContext';
import CharacterInput from './CharacterInput';
import CharacterList from './CharacterList';
import Pagination from './Pagination';
import { Character, CharacterFilter, Episode, Status, Gender } from '../constants/types';
import { RickAndMortyAPI } from '../constants/api';

// Создаем отдельный интерфейс для данных формы
interface CharacterFormData {
  name: string;
  status: string;
  species: string;
  episode: string;
  gender?: string;
  type?: string;
}

interface SearchData {
  characterData: CharacterFormData;
  page: number;
  totalPage: number | null;
  nextPage: string | null;
  prevPage: string | null;
  countCharacter: number;
  searchType: 'character' | 'episode';
}

interface SearchFormProps {
  scrollToTop: () => void;
}

// Вспомогательная функция для безопасного преобразования в Gender
const toGender = (value: string): Gender | undefined => {
  if (value === 'Female' || value === 'Male' || value === 'Genderless' || value === 'unknown') {
    return value as Gender;
  }
  return undefined;
};

// Вспомогательная функция для безопасного преобразования в Status
const toStatus = (value: string): Status | undefined => {
  if (value === 'Alive' || value === 'Dead' || value === 'unknown') {
    return value as Status;
  }
  return undefined;
};

export default function SearchForm({ scrollToTop }: SearchFormProps): ReactElement {
  const { setSelectedCharacter } = useContext(CharacterContext);

  const [searchData, setSearchData] = useState<SearchData>(() => {
    const storedData = localStorage.getItem('searchData');
    if (storedData) {
      return JSON.parse(storedData);
    }
    return {
      characterData: {
        name: '',
        status: '',
        species: '',
        episode: '',
        gender: '',
        type: ''
      },
      page: 1,
      totalPage: 1,
      nextPage: null,
      prevPage: null,
      countCharacter: 0,
      searchType: 'character',
    };
  });

  const {
    characterData,
    page,
    totalPage,
    nextPage,
    prevPage,
    countCharacter,
    searchType,
  } = searchData;

  const [error, setError] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Функция для поиска по персонажам
  const getPostsByCharacterParams = useCallback(async (params: CharacterFilter & { page?: number }) => {
    setLoading(true);
    try {
      const response = await RickAndMortyAPI.getCharacters(params);
      setSearchResult(response.results || []);
      setSearchData(prevSearchData => ({
        ...prevSearchData,
        countCharacter: response.info.count,
        nextPage: response.info.next,
        prevPage: response.info.prev,
        totalPage: response.info.pages,
      }));
      setError(false);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setError(true);
      setSearchResult([]);
      setSearchData(prevSearchData => ({
        ...prevSearchData,
        countCharacter: 0,
        nextPage: null,
        prevPage: null,
        totalPage: null,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  // Функция для поиска по эпизоду
  const getPostsByEpisode = useCallback(async (episodeId: string) => {
    if (!episodeId) return;
    
    setLoading(true);
    try {
      const episodeIdNum = parseInt(episodeId);
      if (isNaN(episodeIdNum) || episodeIdNum < 1) {
        throw new Error('Invalid episode ID');
      }

      const episode = await RickAndMortyAPI.getEpisode(episodeIdNum);
      const characterIds = episode.characters.map(url => {
        const matches = url.match(/\/(\d+)$/);
        return matches ? parseInt(matches[1]) : 0;
      }).filter(id => id > 0);

      if (characterIds.length === 0) {
        setSearchResult([]);
        return;
      }

      const characters = await RickAndMortyAPI.getMultipleCharacters(characterIds);
      setSearchResult(characters);
      setSearchData(prevSearchData => ({
        ...prevSearchData,
        countCharacter: characters.length,
        nextPage: null,
        prevPage: null,
        totalPage: 1,
      }));
      setError(false);
    } catch (error) {
      console.error('Error fetching episode:', error);
      setError(true);
      setSearchResult([]);
      setSearchData(prevSearchData => ({
        ...prevSearchData,
        countCharacter: 0,
        nextPage: null,
        prevPage: null,
        totalPage: null,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  // Сохраняем данные в localStorage
  useEffect(() => {
    localStorage.setItem('searchData', JSON.stringify(searchData));
  }, [searchData]);

  // Функция для выполнения поиска
  useEffect(() => {
    setSearchResult([]);
    
    if (searchType === 'episode' && characterData.episode) {
      getPostsByEpisode(characterData.episode);
      return;
    }

    // Поиск по персонажам - преобразуем CharacterFormData в CharacterFilter
    const params: CharacterFilter & { page?: number } = {};
    
    if (characterData.name) params.name = characterData.name;
    if (characterData.status) {
      const statusValue = toStatus(characterData.status);
      if (statusValue) params.status = statusValue;
    }
    if (characterData.species) params.species = characterData.species;
    if (characterData.gender) {
      const genderValue = toGender(characterData.gender);
      if (genderValue) params.gender = genderValue;
    }
    if (characterData.type) params.type = characterData.type;

    if (Object.keys(params).length > 0 || page > 1) {
      params.page = page;
      getPostsByCharacterParams(params);
    } else {
      // Сброс результатов если нет параметров поиска
      setSearchResult([]);
      setSearchData(prev => ({
        ...prev,
        countCharacter: 0,
        nextPage: null,
        prevPage: null,
        totalPage: null,
      }));
    }
  }, [characterData, page, searchType, getPostsByCharacterParams, getPostsByEpisode]);

  // Обработчик изменения параметров поиска
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    
    setSearchData(prevSearchData => {
      const isEpisodeField = name === 'episode';
      const newCharacterData = {
        ...prevSearchData.characterData,
        [name]: value,
      };

      if (isEpisodeField) {
        // При изменении эпизода очищаем остальные поля
        newCharacterData.name = '';
        newCharacterData.status = '';
        newCharacterData.species = '';
        newCharacterData.gender = '';
        newCharacterData.type = '';
      } else {
        // При изменении других полей очищаем эпизод
        newCharacterData.episode = '';
      }

      return {
        ...prevSearchData,
        characterData: newCharacterData,
        searchType: isEpisodeField ? 'episode' : 'character',
        page: 1,
      };
    });

    setSelectedCharacter(null);
  }, [setSelectedCharacter]);

  const handlePageChange = useCallback(async (direction: 'prev' | 'next') => {
    if ((direction === 'next' && !nextPage) || (direction === 'prev' && !prevPage)) {
      return;
    }

    setLoading(true);
    try {
      const url = direction === 'next' ? nextPage : prevPage;
      if (!url) return;

      const response = await axios.get(url);
      setSearchResult(response.data.results || []);
      setSearchData(prevSearchData => ({
        ...prevSearchData,
        nextPage: response.data.info.next,
        prevPage: response.data.info.prev,
        totalPage: response.data.info.pages,
        page: direction === 'next' ? prevSearchData.page + 1 : prevSearchData.page - 1,
      }));
    } catch (error) {
      console.error('Error changing page:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [nextPage, prevPage]);

  // Создаем совместимый объект для CharacterInput
  const characterInputData = {
    name: characterData.name,
    status: characterData.status,
    species: characterData.species,
    episode: characterData.episode,
    gender: characterData.gender,
    type: characterData.type
  };

  return (
    <div className='border border-white rounded-2xl py-2 sm:py-4 px-4 sm:px-8'>
      <div className='text-3xl sm:text-5xl mt-2 select-none cursor-default text-center sm:text-left'>
        Вселенная Рик и Морти
      </div>
      
      <CharacterInput characterData={characterInputData} onChange={handleChange} />
      
      {loading && (
        <div className="text-center py-8 text-xl">Загрузка...</div>
      )}

      {error ? (
        <div className="text-center py-8">
          <img
            className='w-full max-w-md mx-auto cursor-pointer'
            src={EmptyList}
            alt='Ничего не найдено'
          />
          <p className="text-xl mt-4">Ничего не найдено</p>
        </div>
      ) : (
        <div className='mt-6 flex flex-col'>
          {countCharacter > 0 && (
            <Pagination
              countCharacter={countCharacter}
              page={page}
              totalPage={totalPage || 1}
              prevPage={!!prevPage}
              nextPage={!!nextPage}
              handlePageChange={handlePageChange}
            />
          )}
          
          <CharacterList data={searchResult} scrollToTop={scrollToTop} />
        </div>
      )}
    </div>
  );
}