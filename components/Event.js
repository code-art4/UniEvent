import Image from 'next/image'
import { formatDate, reduceCharacters } from '../utils/funcs'
import Router from 'next/router'

const Event = ({ item, id }) => {
    return <div
        className='bg-[#e1d1b3] shadow-md rounded-md w-full  md:justify-between relative cursor-pointer'
        onClick={() => Router.push(`/event/${id}`)}
    >
        <div className='w-full h-[16rem] md:mt-auto mt-3 px-10'>
{item?.flier_url ?            <Image
                src={item?.flier_url}
                alt='Create an Account'
                className='w-full h-full object-contain'
                width={300}
                height={300}
            /> : null}
        </div>
        <span className='bg-white/70 text-black absolute top-0 left-0 rounded-r-full px-3 py-2'>#{item?.price}</span>
        <span className='bg-white/70 text-black absolute top-0 right-0 rounded-l-full pl-3 py-2 w-20'>{formatDate(item?.date)} </span>
        <div className='w-full absolute bottom-[-5rem] translate-y-[-1.5rem]'>
            <div className='md:w-[95%] w-full md:block flex flex-col items-center bg-white mx-auto rounded-lg px-8 py-4'>
                <h2 className='text-xl mb-2 md:text-left text-center font-bold text-black'>
                    {reduceCharacters(item?.title)}
                </h2>
                <p className='md:text-left text-center opacity-50 text-black'>
                    {reduceCharacters(item?.description)}
                </p>
                {item.currentAttendees < item.neededAttendees ? <p className='md:text-left text-center mt-3 text-[#ecbf66]/80'>
                    {item?.currentAttendees + '/ ' + item?.neededAttendees} Attendees
                </p> : null}
            </div>
        </div>
    </div>
}

export default Event