import Image from 'next/image'
import { formatDate, reduceCharacters } from '../utils/funcs'
import Router from 'next/router'

const Event = ({ item, id }) => {
    return <div
        className='shadow-md rounded-md w-full md:justify-between relative overflow-hidden'
    >
        <div className='w-full h-[18rem] md:mt-auto mt-3'>
            {item?.flier_url ? <Image
                src={item?.flier_url}
                alt='Create an Account'
                className='w-full h-full object-cover'
                width={300}
                height={300}
            /> : null}
        </div>
        <h2 className='text-xl mb-2 md:text-left lg:text-center font-bold text-[white] translate-y-[-3rem] w-full text-center bg-black/20 left-0 py-2'>
            {reduceCharacters(item?.title)}
        </h2>
        <div class="absolute top-[-1.3rem] left-[-5.3rem] w-0 h-0 
  border-l-[8rem] border-l-transparent
  border-b-[8rem] border-b-[#C07F00]/90
  border-r-[8rem] border-r-transparent" style={{
                transform: 'rotate(-45deg)'
            }}>
            <span className='absolute top-[3.2rem] left-[-2.5rem] text-center text-lg font-semibold text-white'>{formatDate(item?.date)} </span>
        </div>

        <div className='w-full mt-[-3.5rem] pb-3'>
            <div className='w-full md:block flex flex-col items-center bg-white mx-auto rounded-lg px-6 py-2 pt-[1.5rem]'>
                <p className='md:text-left text-center opacity-50 text-black'>
                    {reduceCharacters(item?.description, 250)}
                </p>
                {item.currentAttendees < item.neededAttendees ? <p className='md:text-left text-center mt-3 text-[#ecbf66]/80'>
                    {item?.currentAttendees + '/ ' + item?.neededAttendees} Attendees
                </p> : null}
                <button className='mt-4 mx-auto w-max bg-[#C07F00]/90 text-white px-3 py-2 rounded flex cursor-pointer mb-4' onClick={() => Router.push(`/event/${id}`)}>View Event</button>
            </div>
        </div>

    </div>
}

export default Event