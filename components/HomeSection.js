import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Event from './Event';


const HomeSection = ({ events }) => {
	if (events.length < 1) {
		return <p>No current events</p>
	}

	return (
		<div className='w-full bg-black  md:px-[20px] px-[10px] py-10 flex justify-center flex-col items-center'>
			<h2 className='text-2xl text-[#ecbf66] mb-12'>Popular Events</h2>
			<div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-24 w-full py-4 md:px-[50px] px-[10px] mb-12'>
				{events?.map((item) => (
					<Event key={item.id} item={item.data} id={item.id} />
				))}
			</div>
			<Link href="/events" className='bg-[#FFD95A] px-6 py-4 rounded-lg mb-4 mt-8'>
				View All Events
			</Link>
		</div>
	);
};

export default HomeSection;
