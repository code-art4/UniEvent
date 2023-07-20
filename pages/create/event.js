import React, { useState, useEffect, useCallback, Fragment } from "react";
import Head from "next/head";
import { MdCancel } from "react-icons/md";
import Link from "next/link";
import axios from 'axios';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { addEventToFirebase } from "../../utils/util";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";

const event = () => {
	const [user, setUser] = useState({});
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [price, setPrice] = useState("");
	const [venue, setVenue] = useState("");
	const [description, setDescription] = useState("");
	const [note, setNote] = useState("");
	const [attendeesLength, setAttendeesLength] = useState("");
	const [accountNum, setAccountNum] = useState();
	const [bankName, setBankName] = useState("");
	const [banks, setBanks] = useState([]);
	const [flier, setFlier] = useState(null);
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

	useEffect(() => {
		isUserLoggedIn();
		fetchBankNames()
	}, [isUserLoggedIn]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setButtonClicked(true);
		addEventToFirebase(
			user.uid,
			title,
			price,
			date,
			time,
			venue,
			description,
			note,
			flier,
			accountNum,
			bankName,
			attendeesLength,
			router,
		);
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

	return (
		<div>
			<Head>
				<title>Create New Event | UniEvent</title>
				<meta
					name='description'
					content='Unilorin Events system'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='p-6'>
				<div className='flex items-center justify-between'>
					<h2 className='text-2xl font-bold mb-6'>Create a new event</h2>
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
						onChange={(e) => setTitle(e.target.value)}
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
							required
							onChange={(e) => setAccountNum(e.target.value)}
							placeholder='0000000000'
							maxLength={10}
						/>
						<label htmlFor='bankName'>Bank Name</label>
						<select className='border-[1px] py-2 px-4 rounded-md mb-3'
							required onChange={(e) => setBankName(e.target.value)}>
							{banks.map(each => {
								return <option>{each.name}</option>
							})}
						</select> </Fragment> : null}
					<label htmlFor='expectedAttendees'>Expected Attendees</label>
					<input
						name='attendeesLength'
						type='number'
						className='border-[1px] py-2 px-4 rounded-md mb-3'
						required
						value={attendeesLength}
						onChange={(e) => setAttendeesLength(e.target.value)}
					/>
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
							Create Event
						</button>
					)}
				</form>
			</main>
		</div>
	);
};

export default event;
