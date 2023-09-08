import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Event from './Event';


const HomeSection = ({ events }) => {
	if (events.length < 1) {
		return <div className='w-full bg-black/[8%] md:px-[20px] px-[10px] mt-10 py-10 flex justify-center flex-col items-center'><p className='text-white'>No current events</p></div>
	}

	return (
		<div className='w-full md:bg-black/[8%]'>
		<div className='w-[90%] lg:w-[80%] mx-auto md:px-[20px] px-[10px] py-20 flex justify-center flex-col md:items-center'>
			<h2 className="text-3xl font-bold mb-2 text-[#C07F00]">Upcoming events</h2>
			<h3 className="text-xl md:text-center font-medium mb-4 md:mb-12 text-[#C07F00]/80">Unveiling Unilorin's Upcoming Events: Get Ready for Excitement!</h3>
			<div className='grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-24 w-full py-4 md:px-[50px] px-[10px] mb-12 w-[80%] md:w-full'>
				{events?.slice(0, 12).map((item) => (
					<Event key={item.id} item={item?.data} id={item.id} />
				))}
			</div>			
		</div>
		</div>
	);
};

export default HomeSection;
