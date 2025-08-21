import { ReactElement } from 'react';
import { speciesOptions, statusOptions, genderOptions } from '../constants/parameters';
import { Status, Gender } from '../constants/types'; // Импортируем типы из types.ts

// Типы для параметров
interface SelectOption<T extends string = string> {
  value: T | '';
  label: string;
}

// Пропсы компонента
export interface CharacterInputProps {
  characterData: {
    name: string;
    status: string;
    species: string;
    episode: string;
    gender?: string;
    type?: string;
  };
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

// Типизированные селекты
interface SelectFieldProps<T extends string> {
  id: string;
  name: string;
  label: string;
  value: string;
  options: SelectOption<T>[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const SelectField = <T extends string>({
  id,
  name,
  label,
  value,
  options,
  onChange,
  className = ''
}: SelectFieldProps<T>): ReactElement => (
  <div className='flex-1 flex flex-col'>
    <label htmlFor={id} className='mb-2 text-2xl select-none'>
      {label}
    </label>
    <select
      id={id}
      name={name}
      className={`block w-full p-1.5 bg-black border border-gray-300 text-white font-medium text-2xl rounded-lg focus:ring-black focus:border-white ${className}`}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const CharacterInput = ({ characterData, onChange }: CharacterInputProps): ReactElement => {
  const handleNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      onChange(event);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event);
  };

  return (
    <div className='mt-8 flex flex-col'>
      {/* Имя персонажа */}
      <div className='flex flex-col'>
        <label htmlFor='name' className='mb-2 text-2xl select-none'>
          Имя персонажа
        </label>
        <input
          type='text'
          id='name'
          name='name'
          className='block w-full p-2 text-white font-medium border border-white rounded-lg bg-black text-2xl focus:ring-black focus:border-white'
          value={characterData.name}
          onChange={onChange}
          placeholder='Введите имя персонажа'
        />
      </div>

      {/* Статус и Раса */}
      <div className='flex flex-row mt-4 justify-evenly items-center gap-8'>
        <SelectField<Status>
          id='status'
          name='status'
          label='Жив?'
          value={characterData.status}
          options={statusOptions}
          onChange={handleSelectChange}
        />

        <SelectField
          id='species'
          name='species'
          label='Раса'
          value={characterData.species}
          options={speciesOptions}
          onChange={handleSelectChange}
        />
      </div>

      {/* Пол и Тип */}
      <div className='flex flex-row mt-4 justify-evenly items-center gap-8'>
        <SelectField<Gender>
          id='gender'
          name='gender'
          label='Пол'
          value={characterData.gender || ''}
          options={genderOptions}
          onChange={handleSelectChange}
        />

        <div className='flex-1 flex flex-col'>
          <label htmlFor='type' className='mb-2 text-2xl select-none'>
            Тип
          </label>
          <input
            type='text'
            id='type'
            name='type'
            className='block w-full p-2 text-white font-medium border border-white rounded-lg bg-black text-2xl focus:ring-black focus:border-white'
            value={characterData.type || ''}
            onChange={onChange}
            placeholder='Введите тип персонажа'
          />
        </div>
      </div>

      {/* Эпизод */}
      <div className='flex flex-col mt-4'>
        <label htmlFor='episode' className='mb-2 text-2xl select-none'>
          Эпизод (ID)
        </label>
        <input
          type='number'
          min={1}
          max={51}
          id='episode'
          name='episode'
          className='block w-full p-2 text-white font-medium border border-white rounded-lg bg-black text-2xl focus:ring-black focus:border-white'
          value={characterData.episode}
          onChange={handleNumberInput}
          placeholder='1-51'
        />
      </div>
    </div>
  );
};

export default CharacterInput;