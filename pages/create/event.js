import React, { useState, useEffect, useCallback, Fragment } from "react";
import Image from 'next/image'
import Head from "next/head";
import { MdCancel } from "react-icons/md";
import { BsFillCalendarFill, BsFillShareFill } from "react-icons/bs";
import Link from "next/link";
import axios from 'axios';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { addEventToFirebase } from "../../utils/util";
import { ampmDate } from "../../utils/funcs";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import AuthNav from "../../components/AuthNav";

const CreateEvent = () => {
	const [user, setUser] = useState({});
	const [title, setTitle] = useState("");
	const [subtitle, setSubtitle] = useState("")
	const [date, setDate] = useState("");
	const [time, setTime] = useState("");
	const [price, setPrice] = useState(0);
	const [location, setLocation] = useState("");
	const [description, setDescription] = useState("");
	const [note, setNote] = useState("");
	const [attendeesLength, setAttendeesLength] = useState("");
	const [accountNum, setAccountNum] = useState();
	const [bankName, setBankName] = useState("");
	const [banks, setBanks] = useState([]);
	const [flier, setFlier] = useState(null);

	const [openEventPreview, setOpenEventPreview] = useState(false);
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
			subtitle,
			price,
			date,
			time,
			location,
			description,
			note,
			flier,
			accountNum,
			bankName,
			attendeesLength,
			router,
			setButtonClicked
		);
	};

	const handleFileReader = (e) => {
		const reader = new FileReader();
		if (e.target.files[e.target?.files?.length - 1]) {
			reader.readAsDataURL(e.target.files[e.target?.files?.length - 1]);
		}
		reader.onload = (readerEvent) => {
			setFlier(readerEvent.target.result);
		};
	};

	const publicKey = "pk_live_f2091b06253ee2084a8c9dedeb2b724bfa49e68b";
	const baseURL = 'https://api.paystack.co';

	async function fetchBankNames() {
		try {
			const apiKey = publicKey;
			const headers = {
				Authorization: `Bearer ${apiKey}`
			};

			const params = {
				country: 'nigeria',
				perPage: 1000,
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

	const eventDate = new Date(date); // Replace with your date variable
	const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const months = [
		"January", "February", "March", "April", "May", "June", "July",
		"August", "September", "October", "November", "December"
	];

	const dayName = dayOfWeek[eventDate.getDay()];
	const monthName = months[eventDate.getMonth()];
	const dayOfMonth = eventDate.getDate();


	const accountNumber = '0022728151';
	const bankCode = '063';

	const apiUrl = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;

	const headers = {
		Authorization: `Bearer ${publicKey}`,
		'Cache-Control': 'no-cache',
	};

	async function fetchBankDetails() {
		try {
			const response = await axios.get(apiUrl, { headers });
			console.log(response.data);
		} catch (error) {
			console.error('Error:', error.message);
		}
	}


	useEffect(() => {
		if (accountNum && bankName) {
			fetchBankDetails(publicKey, accountNum, bankCode)
		}
	}, [accountNum, bankName])


	return (
		<div>
			<Head>
				<title>Create event | UniEvent</title>
				<meta
					name='description'
					content='Unilorin Events system'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<AuthNav user={user} />
			<main className='p-6 w-[90%] md:w-[70%] lg:w-[50%] mx-auto'>
				<div className='flex items-center justify-between'>
					<h2 className='text-2xl font-bold mb-6'>Event Details</h2>
					{/* <Link href='/dashboard'>
						<MdCancel className='text-4xl text-[#C07F00] cursor-pointer' />
					</Link> */}
				</div>

				<form className='flex flex-col' onSubmit={e => e.preventDefault()}>
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

					<label htmlFor='subtitle'>SubTitle</label>
					<input
						name='subtitle'
						type='text'
						className='border-[1px] py-2 px-4 rounded-md mb-3'
						required
						value={subtitle}
						onChange={(e) => {
							setSubtitle(e?.target?.value)
						}}
					/>
					<div className='w-full flex flex-col lg:flex-row justify-between'>
						<div className='w-full lg:w-1/2 flex flex-col mr-[20px]'>
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
						<div className='w-full lg:w-1/2 flex flex-col'>
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
					<div className='w-full flex flex-col lg:flex-row justify-between'>
						<div className='w-full md:w-1/2 flex flex-col mr-[20px]'>
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

						<div className='w-full md:w-1/2 flex flex-col'>
							<label htmlFor='location'>Location</label>
							<input
								name='location'
								type='text'
								className='border-[1px] py-2 px-4 rounded-md mb-3'
								required
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								placeholder='Plot Address, Lagos, Nigeria'
							/>
						</div>
					</div>

					{price ? <Fragment><div className='w-full flex justify-between'>
						<div className='w-1/2 flex flex-col mr-[20px]'>
							<label htmlFor='accountNum'>Account Number</label>
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
						</div>

						<div className='w-1/2 flex flex-col pl-3'>
							<label htmlFor='bankName'>Bank Name</label>
							<select className='border-[1px] py-2 px-4 rounded-md mb-3'
								required
								onChange={(e) => setBankName(e.target.value)}>
								{banks?.map(each => {
									return <option selected={each.name === bankName}>{each.name}</option>
								})}
							</select>
						</div>
					</div>
					</Fragment> : null}

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

					<div>
						<label htmlFor="flier" className="block font-medium text-gray-700 mb-2">
							Event Flier
						</label>
						<div className="relative">
							<input
								type="file"
								id="flier"
								name="flier"
								className="sr-only"
								accept="image/*"
								required={true}
								onChange={handleFileReader}
							/>
							<label
								htmlFor="flier"
								className="cursor-pointer border-dashed border-2 border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center hover:border-gray-500 focus:border-gray-500 transition duration-300 ease-in-out h-[15rem]"
							>
								{flier ? (
									<img
										src={flier}
										alt="Event Flier"
										className="w-32 h-32 object-cover rounded-lg mb-2"
									/>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-12 h-12 text-gray-400 mb-2"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M3.293 2.293a1 1 0 011.414 0l5 5a1 1 0 001.414 0l5-5a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414l2-2z"
											clipRule="evenodd"
										/>
										<path
											fillRule="evenodd"
											d="M7.293 7.293a1 1 0 011.414 0l2 2a1 1 0 001.414 0l2-2a1 1 0 111.414 1.414L11 12.414a1 1 0 01-1.414 0L4.293 7.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								)}
								<span className="text-gray-600">Upload Event Image</span>
							</label>
						</div>

					</div>

					<div className='flex items-center gap-x-12 my-5'>
						<button className='px-4 py-2 border border-[#C07F00] text-[#C07F00] w-[200px] mt-3 rounded-md hover:border-[transparent] hover:bg-[#C07F00] hover:text-white disabled:border-gray-500 disabled:border disabled:bg-white disabled:text-gray-500' onClick={() => setOpenEventPreview(true)} disabled={!title || !subtitle || !date || !time || !location || !flier}>
							Preview
						</button>
						{buttonClicked ? (
							<Loading title='May take longer time for image uploads' />
						) : (
							<button className='px-4 py-2 bg-[#C07F00] w-[200px] mt-3 text-white rounded-md hover:border hover:border-[#C07F00] hover:bg-white hover:text-[#C07F00] border border-transparent disabled:border-gray-500 disabled:border disabled:bg-white disabled:text-gray-500' onClick={handleSubmit} disabled={!title || !subtitle || !date || !time || !location || !flier}>
								Create Event
							</button>
						)}
					</div>
				</form>
			</main>

			{openEventPreview ? <div className='fixed top-[50%] left-[50%] w-[95%] md:w-[60%] mx-auto bg-white shadow-[#FFD95A] z-[50] px-10 py-7 h-[95vh] md:h-[80vh] overflow-auto' style={{ transform: 'translate(-50%, -50%)' }}>
				<Image src={flier} width={300} height={300} className="h-[30vh] md:h-[45vh] flex flex-row md:flex-col items-center justify-center bg-[#FFD95A] registergray w-full bg-cover mt-7 rounded-xl" />
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
							<p className='text-black/60 font-medium mt-1'>{location}</p>
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
						<BsFillShareFill
							className="cursor-pointer hidden lg:block text-lg text-black/60 mr-2"
						/>
						<button
							className="border border-[#C07F00] text-[#C07F00] py-2 px-4 rounded-lg mt-6 mx-auto block hover:bg-[#C07F00] hover:border-[none] hover:text-white w-full"
						>
							Register
						</button>
					</div>
				</div>

			</div> : null}
			{openEventPreview ? <MdCancel className='fixed top-7 right-6 text-4xl text-[red] cursor-pointer z-[55]' onClick={() => setOpenEventPreview(false)} /> : null}
			{openEventPreview ? <div className='fixed w-full h-screen bg-black/70 z-[45] top-0 left-0' onClick={() => setOpenEventPreview(false)}>
			</div> : null}
		</div>
	);
};

export default CreateEvent;
