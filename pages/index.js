import { useState, useEffect } from "react"
import Head from "next/head";
import Image from "next/image";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import HomeSection from "../components/HomeSection";
import Loading from "../components/Loading";
import db from "../utils/firebase";
import { errorMessage } from "../utils/util";
import {
	collection,
	doc,
	query,
	onSnapshot
} from "@firebase/firestore";
import AboutSVG from '../images/about.svg'

export default function Home() {
	const [loading, setLoading] = useState(true)
	const [events, setEvents] = useState()

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
			}, (error) => {
				// Handle snapshot error
				errorMessage("Error fetching data: " + error.message);
				setLoading(false);
			});

			return () => unsubscribe();
		} catch (error) {
			// Handle other errors (e.g., invalid query, database issues)
			errorMessage("Error: " + error.message);
		}
	};


	useEffect(() => {
		getEvents();
	}, [])


	if (!events && loading) {
		return <Loading title="Loading UNIEVENT..." />
	}

	return (
		<>
			<Head>
				<title>UniEvent</title>
				<meta
					name='description'
					content='Unilorin Events system'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='h-[100vh] home'>
				<Nav />
				<Hero />
				<section id="about" class="text-center mt-4 md:mt-16 mb-4 flex flex-col lg:flex-row gap-y-8 items-center justify-between w-[90%] lg:w-[75%] mx-auto py-20">
					<Image src={AboutSVG} width={500} height={500} />
					<div className='w-[80%] md:w-[40%]'>
						<h2 className="text-3xl font-bold mb-4 text-[#C07F00]">About us</h2>
						<p className="px-4 m-auto text-[17px] leading-8">Unilorin Events Management: Your gateway to diverse campus events - from academics to culture. Explore, engage, and thrive together!</p>
					</div>
				</section>
				<HomeSection loading={loading} events={events} />
				<footer class="text-center py-4">
					<p class="text-gray-600">&copy; 2023 Unilorin Events Management. All rights reserved.</p>
				</footer>
			</main >
		</>
	);
}
