// constants/parameters.ts
import type { Gender, Status } from './types'

export interface SelectOption<T extends string = string> {
	value: T | ''
	label: string
}

export const statusOptions: SelectOption<Status>[] = [
	{ value: '', label: 'Выберите статус' },
	{ value: 'Alive', label: 'Жив' },
	{ value: 'Dead', label: 'Мёртв' },
	{ value: 'unknown', label: 'Неизвестно' },
]

export const genderOptions: SelectOption<Gender>[] = [
	{ value: '', label: 'Выберите пол' },
	{ value: 'Female', label: 'Женский' },
	{ value: 'Male', label: 'Мужской' },
	{ value: 'Genderless', label: 'Безполый' },
	{ value: 'unknown', label: 'Неизвестно' },
]

export const speciesOptions: SelectOption[] = [
	{ value: '', label: 'Выберите расу' },
	{ value: 'Human', label: 'Человек' },
	{ value: 'Alien', label: 'Инопланетянин' },
	{ value: 'Humanoid', label: 'Гуманоид' },
	{ value: 'Robot', label: 'Робот' },
	{ value: 'Animal', label: 'Животное' },
	{ value: 'Mythological Creature', label: 'Мифологическое существо' },
	{ value: 'Disease', label: 'Болезнь' },
	{ value: 'unknown', label: 'Неизвестно' },
]
