import { Fragment, useState, useEffect } from "react";
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
        const searchInput = e.target.value;
        setSearch(searchInput)

        setFilteredEvents(
            events?.filter((event) =>
                event?.data?.title?.includes(searchInput)
            )
        );
    };

    const handleShowMore = () => {
        setDisplayCount((prevCount) => prevCount + eventsPerPage);
    };

    if (!events) {
        return <p>Loading....</p>;
    }

    return (
        <main className="min-h-[100vh] home pb-10">
            <div className="w-full h-max bg-[#e1d1b3]/30">
                <Nav />
            </div>
            <div className="w-[50%] mx-auto flex items-center gap-x-3 mt-3 mb-5">
                <input
                    type="search"
                    className="w-full py-2 outline-none px-4"
                    onChange={filterEvent}
                />
                <AiOutlineSearch className="text-white h-6 w-6" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-24 w-full py-4 md:px-[50px] px-[10px] mb-12">
                {search ? filteredEvents?.length > 0 ? filteredEvents.slice(0, displayCount).map((item) => (
                    <Event key={item.id} item={item?.data} id={item?.id} />
                )) : <p className='text-white text-center w-[93vw] h-[60vh] flex items-center justify-center'>There is no event with the search term {search}</p> : events ? events.slice(0, displayCount).map((item) => (
                    <Event key={item.id} item={item?.data} id={item?.id} />
                )) : <p className='text-white text-center w-[93vw] h-[60vh] flex items-center justify-center'>No event exist currently</p>}
            </div>
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
        </main>
    );
};

export default Events;
