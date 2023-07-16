import React from "react";
import Link from "next/link";
import Head from "next/head";

const RegClosed = ({ event }) => {
	return (
		<div>
			<Head>
				<title>{`${event.title} | UniEvents`}</title>
				<meta
					name='description'
					content='Unilorin Events system'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='w-full h-[100vh] flex flex-col items-center justify-center bg-orange-50'>
				<h2 className='text-2xl font-bold mb-6'>Registration closed! 😪</h2>
				<p>
					<Link href='/' className="text-orange-500">{event.title}</Link>{" "}
				</p>
				<p className='opacity-50 text-md text-center'>
					&copy; Copyright {new Date().getFullYear()}{" "}
				</p>
			</main>
		</div>
	);
};

export default RegClosed;
