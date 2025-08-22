import type { ReactElement } from 'react'

interface CharacterCardInfoProps {
	title: string
	info: string
}

export default function CharacterCardInfo({
	title,
	info,
}: CharacterCardInfoProps): ReactElement {
	return (
		<div className='flex flex-row gap-2 text-xs sm:text-2xl'>
			<div className='font-bold'>{title}:</div>
			<div>{info}</div>
		</div>
	)
}
