import React, { useEffect, useState } from "react";
import Image from 'next/image'
import Head from "next/head";
import { BsFillCalendarFill, BsFillShareFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { doc, getDoc } from "@firebase/firestore";
import db from "../../utils/firebase";
import { ampmDate } from "../../utils/funcs";
import ShareEventModal from "../../components/ShareEventModal";
import ErrorPage from "../../components/ErrorPage";
import Nav from './../../components/Nav';

const ListEvent = ({ firebaseEvent }) => {
    const [isRegistrationEnabled, setIsRegistrationEnabled] = useState(firebaseEvent.disableRegistration);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const registerUrl = `https://unievnt.netlify.app/register/${router.query.id}`;

    useEffect(() => {
        if (!firebaseEvent.title) {
            router.push("/error");
        }
    }, [firebaseEvent.title, router]);

    const RegistrationButton = () => {
        if (!isRegistrationEnabled) {
            return (
                <button
                    className="border border-[#C07F00] text-[#C07F00] py-2 px-4 rounded-lg mt-6 mx-auto block hover:bg-[#C07F00] hover:border-[none] hover:text-white w-full"
                    onClick={() => router.push(registerUrl)}
                >
                    Register
                </button>
            );
        } else {
            return <p className="text-center text-red">Registration has been disabled</p>;
        }
    };

    const { title, flier_url, attendees, description, date, time, note, subtitle } = firebaseEvent;

    const eventDate = new Date(date); // Replace with your date variable
    const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const dayName = dayOfWeek[eventDate.getDay()];
    const monthName = months[eventDate.getMonth()];
    const dayOfMonth = eventDate.getDate();


    return (
        <div>
            <Head>
                <title>{`${title} | UniEvent`}</title>
                <meta name="description" content="Unilorin Events system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="relative w-full mx-auto">
                <div className="w-full h-max bg-[#e1d1b3]/30 home">
                    <Nav />
                </div>



                <div className='w-[90%] lg:w-[50%] mx-auto'>
                     <Image src={flier_url} width={300} height={300} className="h-[30vh] md:h-[45vh] flex flex-row md:flex-col items-center justify-center bg-[#FFD95A] registergray w-full bg-cover mt-7 rounded-xl" />
                <div className="px-1 md:px-4 py-2 md:py-6 flex flex-col lg:flex-row items-start mx-auto lg:mt-3 gap-x-12">
                    <div className='px-4 flex flex-col gap-y-4 lg:gap-y-7'>
                        <p className='text-lg font-medium text-black/60'>
                            <span>{date ? `${dayName}, ${monthName} ${dayOfMonth} ` : null}</span>
                        </p>
                        <div>
                            <h2 className='text-3xl font-semibold text-[#C07F00] lg:mb-2'>
                                {title}
                            </h2>
                            <p className='text-black/60 font-medium mt-3'>{subtitle}</p>
                        </div>

                        <div>
                            <p className='text-xl text-[#C07F00] font-medium'>Date and time</p>
                            <p className='text-black/60 font-medium mt-1 flex items'> <span className='flex items-center'><BsFillCalendarFill className='w-4 h-4 mr-4' />{date ? `${dayName}, ${monthName} ${dayOfMonth}` : null}</span>
                                <span>  · {ampmDate(time)} WAT</span>   </p>
                        </div>

                        <div>
                            <p className='text-xl text-[#C07F00] font-medium'>Location</p>
                            <p className='text-black/60 font-medium mt-1'> </p>
                        </div>

                        <div>
                            <p className='text-xl text-[#C07F00] font-medium'>About this event</p>
                            <p className='text-black/60 font-medium mt-1'>{description}</p>
                        </div>

                        {note && (
                            <div>
                                <p className='text-xl text-[#C07F00] font-medium'>Note</p>
                                <p className='text-black/60 font-medium mt-1'>{note}</p>
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col items-end w-full lg:w-[35%] rounded-xl px-8 py-4 mt-6'>                        
                             {!isRegistrationEnabled && (
                    <BsFillShareFill
                        className="cursor-pointer hidden lg:block text-lg text-black/60 mr-2"
                        onClick={openModal}
                    />
                )}
                        <RegistrationButton />
                    </div>
                </div>
               

                {showModal && <ShareEventModal event={firebaseEvent} closeModal={closeModal} />}
                    </div>               
            </main>
        </div>
    );
};

export async function getServerSideProps(context) {
    const docRef = doc(db, "events", context.query.id);
    const docSnap = await getDoc(docRef);

    let firebaseEvent = {};
    if (docSnap.exists()) {
        firebaseEvent = docSnap.data();
    } else {
        console.log("No such document!");
    }

    return {
        props: { firebaseEvent },
    };
}

export default ListEvent;
