import Image from 'next/image'
import { formatDate, reduceCharacters, ampmDate } from '../utils/funcs'
import { CiUser } from 'react-icons/ci'
import Router from 'next/router'

const Event = ({ item, id }) => {
    const eventDate = new Date(item?.date); // Replace with your date variable
    const dayOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const dayWeek = dayOfWeek[eventDate.getDay()];
    const monthName = months[eventDate.getMonth()];
    const dayOfMonth = eventDate.getDate();


    return <div
        className='shadow-md rounded-lg w-full md:justify-between relative overflow-hidden bg-white hover:scale-[102%] duration-300'
    >
        <div className='w-full h-[11rem] md:mt-auto mt-3 border border-white/40 '>
            {item?.flier_url ? <Image
                src={item?.flier_url}
                alt='Create an Account'
                className='w-full h-full object-cover'
                width={100}
                height={100}
            /> : null}
        </div>

        <div className='px-2 md:px-5 md:px-8 mb-3'>
            <h2 className='text-lg text-left font-semibold text-[#C07F00] w-full left-0 pt-3 cursor-pointer' onClick={() => Router.push(`/event/${id}`)}>
                {reduceCharacters(item?.title)}
            </h2>
            <p className='text-black/60 text-sm font-medium flex items overflow-hidden'> <span className='flex items-center'>{item?.date ? `${dayWeek}, ${monthName} ${dayOfMonth} ` : null}</span>
                {/* <span> · {ampmDate(item?.time)}</span>    */}
            </p>

            <p className='text-black/60 text-sm font-medium flex items mt-1'> {item?.location}</p>

            {item?.attendees > 0 ? <>
                <CiUser />
                <p className='text-black/60 text-sm font-medium flex items mt-3'> {item?.attendees?.length} attendees</p></> : null}

        </div>
    </div>
}

export default Event