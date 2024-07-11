import React from 'react'

function Pagination({
	countCharacter,
	page,
	totalPage,
	prevPage,
	nextPage,
	handlePageChange,
}) {
	return (
		<div className={`flex flex-col justify-between xl:flex-row`}>
			<div className='text-4xl select-none hover:cursor-default'>
				Найдено {countCharacter} персонажей
			</div>
			<div className='flex flex-row gap-3 items-center mt-2 xl:mt-0'>
				<div
					className='flex-1 flex justify-center p-2 text-2xl select-none border border-white  rounded-lg hover:cursor-pointer text-white disabled:text-gray-600'
					onClick={() => handlePageChange('prev')}
					disabled={!prevPage}
				>
					Предыдущая
				</div>
				<div className='flex-1 text-2xl text-nowrap text-center hover:cursor-default'>
					{page} из {totalPage}
				</div>
				<div
					className='flex-1 flex justify-center p-2 text-2xl select-none border border-white rounded-lg hover:cursor-pointer'
					onClick={() => handlePageChange('next')}
					disabled={!nextPage}
				>
					Следующая
				</div>
			</div>
		</div>
	)
}

export default Pagination
