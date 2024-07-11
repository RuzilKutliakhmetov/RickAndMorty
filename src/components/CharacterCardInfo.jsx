import React from 'react'

export default function CharacterCardInfo({ title, info }) {
	return (
		<div className='flex flex-row gap-2 text-xs sm:text-2xl'>
			<div className='font-bold'>{title}:</div>
			<div>{info}</div>
		</div>
	)
}
