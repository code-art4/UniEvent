import React, { useState, useEffect } from "react";
import Link from 'next/link';
import createimage from "../images/createimage.svg";
import event from "../images/event.svg";
import share from "../images/share.svg";
import Image from "next/image";
import { reduceCharacters } from '../utils/funcs'
import db from "../utils/firebase";
import Event from './Event';
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


const HomeSection = () => {
	const [events, setEvents] = useState()
	const [loading, setLoading] = useState()
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

				return () => unsubscribe();
			});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		return () => {
			getEvents()
		};
	}, [])


	return (
		<div className='w-full bg-black  md:px-[20px] px-[10px] py-10 flex justify-center flex-col items-center'>
			<h2 className='text-2xl text-[#ecbf66] mb-12'>Popular Events</h2>
			<div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-24 w-full py-4 md:px-[50px] px-[10px] mb-12'>
				{events?.map((item) => (
					<Event key={item.id} item={item.data} id={item.id} />
				))}
			</div>
			<Link href="/events" className='bg-[#FFD95A] px-6 py-4 rounded-lg mb-4 mt-8'>
				See more
			</Link>
			{/* <button className='bg-[#FFD95A] px-6 py-4 rounded-lg mb-4 mt-8'>
				
			</button> */}
		</div>
	);
};

export default HomeSection;
