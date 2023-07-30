import { useState, useEffect } from "react"
import Head from "next/head";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import HomeSection from "../components/HomeSection";
import Loading from "../components/Loading";
import db from "../utils/firebase";
import {
	collection,
	doc,
	query,
	onSnapshot
} from "@firebase/firestore";

export default function Home() {
	const [loading, setLoading] = useState(true)
	const [events, setEvents] = useState()
	const [error, setError] = useState()

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
			setError(error);
		}
	};

	useEffect(() => {
		getEvents();		
	}, [])

	// console.log(error)


	if (!events && loading) {
		return <Loading title="Loading UNIEVENT..."/>
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
				<HomeSection loading={loading} events={events} />
			</main>
		</>
	);
}
