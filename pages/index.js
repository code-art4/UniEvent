import { useState, useEffect } from "react"
import Head from "next/head";
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
				<section id="about" class="text-center py-8 mt-16 mb-4">
					<h2 className="text-3xl font-bold mb-4">About</h2>
					<p className="px-4 w-[70%] m-auto text-[17px] leading-8">Welcome to Unilorin Events Management – your gateway to discovering and participating in exciting events happening at the University of Ilorin! Our platform is designed to keep you informed about a diverse range of events, from academic conferences and workshops to cultural celebrations and guest lectures. But that's not all – we're not just here to inform, we're here to engage. Unilorin Events Management allows you to explore detailed event information, browse through engaging sessions, and, most importantly, secure your spot through convenient event registration. With just a few clicks, you can ensure that you're part of the action. Our mission is to enrich your university experience by fostering connections, expanding your horizons, and nurturing your passions. Whether you're a student, faculty member, or staff, our platform is tailored to your interests and needs. Join us in celebrating the vibrant tapestry of events that make our campus come alive. Whether you're looking to expand your knowledge, meet like-minded individuals, or simply have a great time, Unilorin Events Management has something for you. Thank you for being a part of our community. Let's explore, learn, and thrive together!</p>
				</section>
				<HomeSection loading={loading} events={events} />
				<footer class="text-center py-4">
					<p class="text-gray-600">&copy; 2023 Unilorin Events Management. All rights reserved.</p>
				</footer>

			</main >
		</>
	);
}
