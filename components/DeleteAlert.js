import React from "react";
import { MdCancel } from "react-icons/md"
import { deleteEvent } from '../utils/util'

const DeleteAlert = ({ setClose, event }) => {
	console.log(event)
	return (
		<div className='w-full h-[100vh] dim fixed top-0 left-0 flex items-center justify-center p-4 z-40'>
			<div className='md:w-[500px] w-full bg-white h-[300px] flex items-center justify-center flex-col rounded-md shadow-[#FFD95A] shadow-md space-y-4 relative '>
				<h2 className='text-xl font-bold text-center'>
					You want to delete this {event?.data?.title}?
				</h2>
				<p className="text-center">This action cannot be reversed.</p>
				<button className="px-4 py-2 rounded-md shadow-md bg-[red]/90 hover:bg-white hover:text-[red]/90 hover:border hover:border-[red] text-white
				" onClick={() => {
						deleteEvent(event.id)
						setClose(false);
					}}> Yes, Delete</button>
				<MdCancel
					className='text-4xl text-[#C07F00] cursor-pointer hover:text-[#b59a42] top-3 absolute right-4'
					onClick={() => {
						setClose(false);
					}}
				/>
			</div>
		</div>
	);
};

export default DeleteAlert;
