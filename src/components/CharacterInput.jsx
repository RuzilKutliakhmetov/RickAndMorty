import React from 'react'
import { species, status } from '../constants/parameters'

const CharacterInput = ({ characterData, onChange }) => {
	return (
		<div className='mt-8 flex flex-col'>
			<div className='flex flex-col'>
				<label htmlFor='name' className='mb-2 text-2xl select-none'>
					Имя персонажа
				</label>
				<input
					type='text'
					id='name'
					name='name'
					className='block w-full p-2 text-white font-medium border border-white rounded-lg bg-black text-2xl   focus:ring-black focus:border-white'
					value={characterData.name}
					onChange={onChange}
				/>
			</div>

			<div className='flex flex-row mt-4 justify-evenly items-center gap-8'>
				<div className='flex-1 flex flex-col w-1/2'>
					<label htmlFor='status' className='mb-2 text-2xl select-none'>
						Жив?
					</label>
					<select
						id='status'
						name='status'
						className='block w-full p-1.5 bg-black border border-gray-300 text-white font-medium text-2xl  rounded-lg focus:ring-black focus:border-white '
						value={characterData.status}
						onChange={onChange}
					>
						{status.map(item => (
							<option key={item.value} value={item.value}>
								{item.label}
							</option>
						))}
					</select>
				</div>

				<div className='flex-1 flex flex-col w-1/2'>
					<label htmlFor='species' className='mb-2 text-2xl select-none'>
						Раса
					</label>
					<select
						id='species'
						name='species'
						className='block w-full p-1.5 bg-black border border-gray-300 text-white font-medium text-2xl   rounded-lg focus:ring-black focus:border-white '
						value={characterData.species}
						onChange={onChange}
					>
						{species.map(item => (
							<option key={item.value} value={item.value}>
								{item.label}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className='flex flex-col mt-4'>
				<label htmlFor='episode' className='mb-2 text-2xl select-none'>
					Эпизод
				</label>
				<input
					type='number'
					id='episode'
					name='episode'
					className='block w-full p-2 text-white font-medium border border-white rounded-lg bg-black text-2xl focus:ring-black focus:border-white'
					value={characterData.episode}
					onChange={onChange}
				/>
			</div>
		</div>
	)
}
export default CharacterInput
