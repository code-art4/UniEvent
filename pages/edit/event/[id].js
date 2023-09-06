import React, { useState, useEffect, useCallback, Fragment } from "react";
import axios from 'axios';
import Head from "next/head";
import { MdCancel } from "react-icons/md";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import db, { auth } from "../../../utils/firebase";
import { addEventToFirebase, createSlug, successMessage } from "../../../utils/util";
import { useRouter } from "next/router";
import Loading from "../../../components/Loading";
import {
	doc,
	getDoc,
	updateDoc
} from "firebase/firestore";

const event = () => {
	const [user, setUser] = useState({});
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [price, setPrice] = useState("");
	const [venue, setVenue] = useState("");
	const [description, setDescription] = useState("");
	const [note, setNote] = useState("");
	const [flier, setFlier] = useState(null);
	const [accountNum, setAccountNum] = useState();
	const [bankName, setBankName] = useState("");
	const [banks, setBanks] = useState();
	const [event, setEvent] = useState(false);
	const [buttonClicked, setButtonClicked] = useState(false);
	const router = useRouter();

	const isUserLoggedIn = useCallback(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser({ email: user.email, uid: user.uid });
			} else {
				return router.push("/register");
			}
		});
	}, []);

	const getEvent = async () => {
		const eventRef = doc(db, "events", router.query?.id);
		const eventSnap = await getDoc(eventRef);
		const event = eventSnap.data();
		setEvent(event)
		setUser(event?.user_id)
		setDate(event?.date)
		setDescription(event?.description)
		setNote(event?.note)
		setPrice(event?.price)
		setTime(event?.time)
		setVenue(event?.venue)
		setTitle(event?.title)
		setAccountNum(event?.accountNum)
		setBankName(event?.bankName)
	}

	useEffect(() => {
		isUserLoggedIn();
		fetchBankNames()
	}, [isUserLoggedIn]);

	useEffect(() => {
		router.query?.id ? getEvent() : null
	}, [router])

	console.log(event)

	const handleSubmit = async (e) => {
		e.preventDefault();
		setButtonClicked(true);
		const eventDocRef = doc(db, "events", router.query.id);
		await updateDoc(eventDocRef, {
			title,
			date,
			time,
			price,
			venue,
			description,
			note,
			accountNum,
			bankName,
			flier_url: flier,
			slug: createSlug(title),
			attendees: [],
			disableRegistration: false,
		}).then(() => {
			setTimeout(() => setButtonClicked(false), 1000)
			successMessage("Event successfully edited! 🎉");
			getEvent();
		}).catch(e => {
			console.log(e)
		});
	};

	const handleFileReader = (e) => {
		const reader = new FileReader();
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
		}
		reader.onload = (readerEvent) => {
			setFlier(readerEvent.target.result);
		};
	};

	// const updateEvent = async () => {
	// 	await addDoc(collection(db, "events"), {
	// 		user_id: id,
	// 		title,
	// 		date,
	// 		time,
	// 		venue,
	// 		description,
	// 		note,
	// 		slug: createSlug(title),
	// 		attendees: [],
	// 		disableRegistration: false,
	// 	}).catch(e => {
	// 		console.log(e)
	// 	});

	// }

	const publicKey = "pk_test_d031e856e8b2f0a1b45e46ddaad881dacee9747e";
	const baseURL = 'https://api.paystack.co';

	async function fetchBankNames() {
		try {
			const apiKey = publicKey;
			const headers = {
				Authorization: `Bearer ${apiKey}`
			};

			const params = {
				country: 'nigeria',
				perPage: 100,
			};

			const response = await axios.get(`${baseURL}/bank`, { headers, params });

			// Extract bank names from the API response
			const banks = response.data.data;

			setBanks(banks)

			return banks;
		} catch (error) {
			console.error('Error fetching bank names:', error.message);
			return [];
		}
	}


	if (!event) {
		return <p>Loading...</p>
	}

	return (
		<div>
			<Head>
				<title>Edit {title} | UniEvent</title>
				<meta
					name='description'
					content='Unilorin Events system'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='p-6'>
				<div className='flex items-center justify-between'>
					<h2 className='text-2xl font-bold mb-6'>Edit {event?.title?.charAt(0)?.toUpperCase() + event?.title?.substr(1)?.toLowerCase()}</h2>
					<Link href='/dashboard'>
						<MdCancel className='text-4xl text-[#C07F00] cursor-pointer' />
					</Link>
				</div>

				<form className='flex flex-col' onSubmit={handleSubmit}>
					<label htmlFor='title'>Title</label>
					<input
						name='title'
						type='text'
						className='border-[1px] py-2 px-4 rounded-md mb-3'
						required
						value={title}
						onChange={(e) => {
							setTitle(e?.target?.value)
						}}
					/>
					<div className='w-full flex justify-between'>
						<div className='w-1/2 flex flex-col mr-[20px]'>
							<label htmlFor='date'>Date</label>
							<input
								name='date'
								type='date'
								className='border-[1px] py-2 px-4 rounded-md mb-3'
								required
								value={date}
								onChange={(e) => setDate(e.target.value)}
							/>
						</div>
						<div className='w-1/2 flex flex-col'>
							<label htmlFor='time'>Time</label>
							<input
								name='time'
								type='time'
								className='border-[1px] py-2 px-4 rounded-md mb-3'
								required
								value={time}
								onChange={(e) => setTime(e.target.value)}
							/>
						</div>
					</div>
					<div className='w-full flex justify-between'>
						<div className='w-1/2 flex flex-col mr-[20px]'>
							<label htmlFor='price'>Price</label>
							<input
								name='price'
								type='number'
								min="0" max="10000" step="1"
								className='border-[1px] py-2 px-4 rounded-md mb-3'
								required
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							/>
						</div>
					</div>
					<label htmlFor='venue'>Venue</label>
					<input
						name='venue'
						type='text'
						className='border-[1px] py-2 px-4 rounded-md mb-3'
						required
						value={venue}
						onChange={(e) => setVenue(e.target.value)}
						placeholder='Plot Address, Lagos, Nigeria'
					/>
					{price ? <Fragment><label htmlFor='accountNum'>Account Number</label>
						<input
							name='accountNum'
							type='text'
							className='border-[1px] py-2 px-4 rounded-md mb-3'
							value={accountNum}
							required
							onChange={(e) => setAccountNum(e.target.value)}
							placeholder='0000000000'
							maxLength={10}
						/>
						<label htmlFor='bankName'>Bank Name</label>
						<select className='border-[1px] py-2 px-4 rounded-md mb-3'
							required
							onChange={(e) => setBankName(e.target.value)}>
							{banks?.map(each => {
								return <option selected={each.name === bankName}>{each.name}</option>
							})}
						</select> </Fragment> : null}
					<label htmlFor='description'>
						Event Description <span className='text-gray-500'>(optional)</span>
					</label>
					<textarea
						name='description'
						rows={3}
						className='border-[1px] py-2 px-4 rounded-md mb-3'
						placeholder='Any information or details about the event'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<label htmlFor='note'>
						Note to Attendees <span className='text-gray-500'>(optional)</span>
					</label>
					<textarea
						name='note'
						rows={3}
						value={note}
						onChange={(e) => setNote(e.target.value)}
						className='border-[1px] py-2 px-4 rounded-md mb-3'
						placeholder='Every attendee must take note of this'
					/>
					<label htmlFor='flier'>
						Event Flier <span className='text-gray-500'>(optional)</span>
					</label>
					<input
						name='flier'
						type='file'
						className='border-[1px] py-2 px-4 rounded-md mb-3'
						accept='image/*'
						onChange={handleFileReader}
					/>
					{buttonClicked ? (
						<Loading title='May take longer time for image uploads' />
					) : (
						<button className='px-4 py-2 bg-[#C07F00] w-[200px] mt-3 text-white rounded-md'>
							Edit Event
						</button>
					)}
				</form>
			</main>
		</div >
	);
};

export default event;
