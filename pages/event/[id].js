import React, { useEffect, useState } from "react";
import Head from "next/head";
import { BsFillShareFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { doc, getDoc } from "@firebase/firestore";
import db from "../../utils/firebase";
import ShareEventModal from "../../components/ShareEventModal";
import ErrorPage from "../../components/ErrorPage";

const ListEvent = ({ firebaseEvent }) => {
    const [isRegistrationEnabled, setIsRegistrationEnabled] = useState(firebaseEvent.disableRegistration);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const registerUrl = `http://localhost:3000/register/${router.query.id}`;

    useEffect(() => {
        if (!firebaseEvent.title) {
            router.push("/error");
        }
    }, [firebaseEvent.title, router]);

    const renderRegistrationButton = () => {
        if (!isRegistrationEnabled) {
            return (
                <button
                    className="bg-[#FFD95A] text-white py-2 px-4 rounded-lg mt-6 mx-auto block"
                    onClick={() => router.push(registerUrl)}
                >
                    Register
                </button>
            );
        } else {
            return <p className="text-center text-red">Registration has been disabled</p>;
        }
    };

    const { title, flier_url, attendees, description, date, time, note } = firebaseEvent;

    return (
        <div>
            <Head>
                <title>{`${title} | UniEvent`}</title>
                <meta name="description" content="Unilorin Events system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="relative w-full container mx-auto">
                <div
                    className="h-[30vh] p-3 flex flex-col items-center justify-center bg-[#FFD95A] registergray w-full bg-cover"
                    style={{
                        background: flier_url ? `url(${flier_url})` : "black",
                    }}
                >
                    <h2 className="text-4xl font-extrabold mb-4 text-center text-white">{title}</h2>
                    {attendees && attendees.length > 0 && (
                        <p className="text-xl font-extrabold mb-6 text-white">
                            Total Attendees: <span className="text-white">{attendees.length}</span>
                        </p>
                    )}
                </div>

                <div className="px-4 py-6 text-center">
                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold">Description:</h3>
                        <p>{description}</p>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold">Attendees Number:</h3>
                        <p>{attendees?.length}</p>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold">Time of Event:</h3>
                        <p>
                            {date}, {time}
                        </p>
                    </div>
                    {note && (
                        <div className="mb-6">
                            <h3 className="text-2xl font-semibold">Note:</h3>
                            <p className="">{note}</p>
                        </div>
                    )}
                </div>

                {renderRegistrationButton()}

                {!isRegistrationEnabled && (
                    <BsFillShareFill
                        className="absolute top-6 right-10 cursor-pointer text-2xl text-[#FFD95A]"
                        onClick={openModal}
                    />
                )}

                {showModal && <ShareEventModal event={firebaseEvent} closeModal={closeModal} />}
            </main>
        </div>
    );
};

export async function getServerSideProps(context) {
    const docRef = doc(db, "events", context.query.id);
    const docSnap = await getDoc(docRef);

    let firebaseEvent = {};
    if (docSnap.exists()) {
        firebaseEvent = docSnap.data();
    } else {
        console.log("No such document!");
    }

    return {
        props: { firebaseEvent },
    };
}

export default ListEvent;
