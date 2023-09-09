import { Fragment, useState, useEffect } from "react";
import Head from 'next/head';
import createimage from "../images/createimage.svg";
import event from "../images/event.svg";
import share from "../images/share.svg";
import Image from "next/image";
import { reduceCharacters, formatDate } from "../utils/funcs";
import Nav from "../components/Nav";
import Event from "../components/Event";
import db from "../utils/firebase";
import {
    getDoc,
    addDoc,
    collection,
    doc,
    updateDoc,
    onSnapshot,
    query,
    deleteDoc,
    where,
    arrayUnion,
} from "@firebase/firestore";
import { AiOutlineSearch } from "react-icons/ai";

const Events = () => {
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState();
    const [search, setSearch] = useState();
    const [filteredEvents, setFilteredEvents] = useState();
    const [displayCount, setDisplayCount] = useState(8);
    const [eventParams, setEventParams] = useState({ free: true, paid: false });
    const eventsPerPage = 8;

    const getEvents = () => {
        try {
            const q = query(collection(db, "events"));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const firebaseEvents = [];
                querySnapshot.forEach((doc) => {
                    firebaseEvents.push({ data: doc.data(), id: doc.id });
                });
                setEvents(firebaseEvents);
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getEvents();
    }, []);

    const filterEvent = (e) => {
        const searchInput = e?.target?.value;
        setSearch(searchInput)

        setFilteredEvents(
            events
                ?.filter((event) => {
                    const title = event?.data?.title?.toLowerCase(); // Convert title to lowercase for case-insensitive search
                    const searchTerm = searchInput.toLowerCase(); // Convert searchInput to lowercase

                    return title?.includes(searchTerm);
                }))
    };

    const handleShowMore = () => {
        setDisplayCount((prevCount) => prevCount + eventsPerPage);
    };

    if (!events) {
        return <p>Loading....</p>;
    }


    const Events = () => {
        if (search) {
            const freeEvents = filteredEvents?.filter(item => {
                return (eventParams.free && item?.data?.price <= 0);
            })

            const paidEvents = filteredEvents?.filter(item => {
                return (eventParams.paid && item?.data?.price > 0);
            })

            if (eventParams.free) {
                if (freeEvents?.length <= 0) {
                    return <p className='text-center mt-32'>No events matches the search input</p>
                } else {
                    return <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-24 py-4 md:px-[50px] px-[10px] mb-12 mt-5">
                        {freeEvents?.filter(event =>
                            event?.disableRegistration === true || event?.attendees?.length === event?.expectedAttendees?.length).slice(0, displayCount)
                            .map(item => (

                                <Event key={item.id} item={item?.data} id={item?.id} />

                            ))}
                    </div>
                }
            } else {
                if (paidEvents?.length <= 0) {
                    return <p className='text-center mt-32'>No events matches the search input</p>
                } else {
                    return <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-24 py-4 md:px-[50px] px-[10px] mb-12 mt-5">{paidEvents?.filter(event =>
                        event?.disableRegistration === true || event?.attendees?.length === event?.expectedAttendees?.length)?.slice(0, displayCount)
                        .map(item => (

                            <Event key={item.id} item={item?.data} id={item?.id} />
                        ))}
                    </div>
                }
            }
        } else {
            const freeEvents = events?.filter(item => {
                return (eventParams.free && item?.data?.price <= 0);
            })

            const paidEvents = events?.filter(item => {
                return (eventParams.paid && item?.data?.price > 0);
            })

            if (eventParams.free) {
                if (freeEvents.length <= 0) {
                    return <p className='text-center mt-24'>Free events does not exist right now</p>
                }

                return <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-24 py-4 md:px-[50px] px-[10px] mb-12 mt-5">
                    {freeEvents?.filter(event =>
                    event?.disableRegistration === true || event?.attendees?.length === event?.expectedAttendees?.length)?.slice(0, displayCount)
                    .map(item => (
                        
                            <Event key={item.id} item={item?.data} id={item?.id} />                        
                    ))}
                    </div>
            } else {
                if (eventParams.paid && paidEvents.length <= 0) {
                    return <p className='text-center mt-32'>Paid events does not exist right now</p>
                } else {
                    return <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-24 py-4 md:px-[50px] px-[10px] mb-12 mt-5">
                        {paidEvents?.filter(event =>
                        event?.disableRegistration === true || event?.attendees?.length === event?.expectedAttendees?.length)?.slice(0, displayCount)
                        .map(item => (
                            
                                <Event key={item.id} item={item?.data} id={item?.id} />                            
                        ))}
                    </div>
                }
            }
        }
    }

    return (
        <>
            <Head>
                <title>All Events</title>
            </Head>

            <main className="pb-10">
                <div className="w-full h-max bg-[#e1d1b3]/30 home">
                    <Nav />
                </div>

                <h2 className="text-3xl text-center font-bold mt-20 mb-5 text-[#C07F00]">All Unilorin Events</h2>
                <div className="w-[80%] md:w-[40%] mx-auto flex items-center gap-x-3 mt-3 mb-5 border border-[#C07F00] rounded-full overflow-hidden">
                    <input
                        type="search"
                        className="w-full py-1.5 md:py-2 outline-none px-4 rounded"
                        onChange={filterEvent}
                    />
                    <AiOutlineSearch className="text-[#C07F00] h-6 w-6 mr-4" />
                </div>


                <div className='w-full md:bg-black/[8%]'>
                    <div className="w-[80%] mx-auto mt-7 py-5 pr-6">
                        <div className='flex flex-col'>
                            <div className='md:mt-8 mt-2 flex lg:mt-0 lg:flex-shrink-0'>
                                <div className='ml-auto flex mt-1 bg-[#C07F00]/90 rounded-xl border border-secondary_sky_light w-[max-content] p-[.1rem]'>
                                    <button
                                        className={`${eventParams.free ? 'bg-white text-secondary_ink_light rounded-l-xl h-[2.4rem] w-[8rem] ml-[1px] rounded-r-xl m-auto hover:white' : 'bg-secondary_sky_light text-white h-[2.4rem] w-[8rem] ml-[1px] rounded-xl m-auto hover:bg-white hover:text-[#C07F00]'} `}
                                        onClick={() => setEventParams({ free: true, paid: false })}
                                    >
                                        Free
                                    </button>
                                    <button
                                        className={`${eventParams.paid ? 'bg-white text-secondary_ink_light rounded-l-xl h-[2.4rem] w-[8rem] ml-[1px] rounded-r-xl m-auto hover:white' : 'bg-secondary_sky_light text-white h-[2.4rem] w-[8rem] ml-[1px] rounded-xl m-auto hover:bg-white hover:text-[#C07F00]'} `}
                                        onClick={() => setEventParams({ free: false, paid: true })}
                                    >
                                        Paid
                                    </button>
                                </div>
                            </div>
                        </div>


                        <Events />

                        {filteredEvents && filteredEvents.length > displayCount && (
                            <div className="w-full flex justify-center">
                                <button
                                    className="bg-[#FFD95A] px-6 py-4 rounded-lg mb-4 mt-8 mx-auto"
                                    onClick={handleShowMore}
                                >
                                    See more
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </>
    );
};

export default Events;
