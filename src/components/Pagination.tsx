import type { ReactElement } from 'react'

interface PaginationProps {
	countCharacter: number
	page: number
	totalPage: number
	prevPage: boolean
	nextPage: boolean
	handlePageChange: (direction: 'prev' | 'next') => void
}

const Pagination = ({
	countCharacter,
	page,
	totalPage,
	prevPage,
	nextPage,
	handlePageChange,
}: PaginationProps): ReactElement => {
	const buttonBaseClasses =
		'flex-1 flex justify-center p-2 font-caveat-semibold text-2xl select-none border border-white rounded-lg transition-colors duration-200'

	const activeButtonClasses =
		'hover:cursor-pointer hover:bg-white hover:text-black'

	const disabledButtonClasses =
		'cursor-not-allowed text-gray-600 border-gray-600'

	return (
		<div className='flex flex-col justify-between xl:flex-row items-center gap-4'>
			<div className='font-caveat-semibold text-2xl xl:text-4xl select-none cursor-default text-center xl:text-left'>
				Найдено {countCharacter} {getCharacterWord(countCharacter)}
			</div>

			<div className='flex flex-row gap-3 items-center'>
				<button
					className={`${buttonBaseClasses} ${
						prevPage ? activeButtonClasses : disabledButtonClasses
					}`}
					onClick={() => prevPage && handlePageChange('prev')}
					disabled={!prevPage}
					aria-label='Предыдущая страница'
					type='button'
				>
					Предыдущая
				</button>

				<div className='flex-1 font-caveat-semibold text-2xl text-nowrap text-center cursor-default min-w-[120px]'>
					{page} из {totalPage}
				</div>

				<button
					className={`${buttonBaseClasses} ${
						nextPage ? activeButtonClasses : disabledButtonClasses
					}`}
					onClick={() => nextPage && handlePageChange('next')}
					disabled={!nextPage}
					aria-label='Следующая страница'
					type='button'
				>
					Следующая
				</button>
			</div>
		</div>
	)
}

// Вспомогательная функция для правильного склонения слова "персонаж"
const getCharacterWord = (count: number): string => {
	const lastDigit = count % 10
	const lastTwoDigits = count % 100

	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
		return 'персонажей'
	}

	if (lastDigit === 1) {
		return 'персонаж'
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return 'персонажа'
	}

	return 'персонажей'
}

export default Pagination
