import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { doc, getDoc } from "@firebase/firestore";
import db from "../../utils/firebase";
import { registerAttendee } from "../../utils/util";
import { useRouter } from "next/router";
import RegClosed from "../../components/RegClosed";
import ErrorPage from "../../components/ErrorPage";
import Loading from "../../components/Loading";
import { PaystackButton } from 'react-paystack'

const RegisterPage = () => {
    const [success, setSuccess] = useState(false);
    const [event, setEvent] = useState({});
    const [loadingEvent, setLoadingEvent] = useState(true);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cardNo, setCardNo] = useState("");
    const [cardExpiryNum, setCardExpiryNum] = useState("");
    const [cardCVV, setCardCVV] = useState();
    const [cardName, setCardName] = useState("");
    const { query } = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            registerAttendee(name, email, query.id, setSuccess, setLoading);
            setEmail('')
            setName('')
        } catch (e) {
            console.log(e)
        }
        // setEmail("");
        // setName("");
    };    


    const emailAndNameExists = email && name

    useEffect(() => {
        const fetchData = async () => {
    try {
      const docRef = doc(db, "events", query.id);
      const docSnap = await getDoc(docRef);
      let firebaseEvent = {};
      if (docSnap.exists()) {
        firebaseEvent = docSnap.data();
      } else {
        console.log("No such document!");
      }
      setEvent(firebaseEvent);
      setLoadingEvent(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    //   setLoadingEvent(false)
    }    
  };

  // Call fetchData when the component mounts or when emailAndNameExists changes
  fetchData()} ,[query.id, emailAndNameExists])

    const EventButton = () => {        
        const attendees = event.attendees;
        const result = attendees.filter((item) => item.email === email);
        if (result.length === 0) {
            if (isFormValid && event?.accountNum && event?.bankName) {
                return <PaystackButton
                    className='bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md'
                    {...componentProps}
                />
            }else{
                 return <button
                type='submit'
                className='bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md'
                onClick={handleSubmit}
            >
                GET TICKET
            </button>
            }           
        }


        return <button
                type='submit'
                className='bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md'
                onClick={handleSubmit}
            >
                GET TICKET
            </button>
    }


    const isFormValid = email !== "" && name !== "";

    if(loadingEvent){
        return <Loading title='Loading event' />;
    }

    if (loading) {
        return <Loading title='Generating your ticket🤞🏼' />;
    }

    if (!event.title) {
        return <ErrorPage />;
    }

    if (event.disableRegistration) {
        return <RegClosed event={event} />;
    }

    const formatNumber = (number) =>
        number.split("").reduce((seed, next, index) => {
            if (index !== 0 && !(index % 4)) seed += " ";
            return seed + next;
        }, "");

    function addSlashToNumbers(numbers) {
        if (numbers.length !== 4) {
            // Invalid input, return the original string
            return numbers;
        }
        return numbers.slice(0, 2) + " / " + numbers.slice(2);
    }

    const publicKey = "pk_test_d031e856e8b2f0a1b45e46ddaad881dacee9747e";
    const amount = event?.price + '00';
    console.log(amount)

    const componentProps = {
        email,
        amount: Number(amount) + (Number(amount) * (15/100)),
        currency: "NGN",
        channels: ['card', 'bank', 'ussd', 'mobile_money', 'bank_transfer'],
        metadata: {
            accountNumber: event?.accountNumber,
            bankName: event?.bankName
            // accountNumber
        },
        publicKey,
        disabledRegistration: isFormValid ? false : true,
        text: "GET TICKET",        
        onSuccess: () => {
              try {
            registerAttendee(name, email, query.id, setSuccess, setLoading);
 setEmail('');
            setName('');
        } catch (e) {
            console.log(e)
        }
        },
        onClose: () => alert("Wait! Do you want to proceed with not registering?"),
    };

    return (
        <div>
            <Head>
                <title>{`${event.title} | UniEvent`}</title>
                <meta name='description' content='Unilorin Events system' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <main className='w-full flex items-center justify-between min-h-[100vh] relative'>
                <div className='md:w-[60%] w-full flex flex-col items-center justify-center min-h-[100vh] px-[30px] py-[30px] relative'>
                    <h2 className='text-2xl font-medium mb-3'>Get your ticket 🎉</h2>
                    <form className='w-full flex flex-col justify-center'
                        // onSubmit={event?.accountNum && event?.bankName ? e => e.preventDefault() : handleSubmit} 
                        onSubmit={e => e.preventDefault()}
                    >
                        <label htmlFor='name'>Full name</label>
                        <div className='w-full relative'>
                            <input
                                type='text'
                                name='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='border px-10 py-2 mb-3 rounded-md w-full'
                                required
                            />
                            <FaUserAlt className=' absolute left-4 top-3 text-gray-300' />
                        </div>

                        <label htmlFor='email'>Email address</label>
                        <div className='w-full relative'>
                            <input
                                type='email'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='border px-10 py-2 mb-3 rounded-md w-full'
                                required
                            />
                            <HiMail className=' absolute left-4 top-3 text-gray-300 text-xl' />
                        </div>

<EventButton/>
                        {/* {isFormValid && event?.accountNum && event?.bankName ? <PaystackButton
                            className='bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md'
                            {...componentProps}
                        /> : <button
                            type='submit'
                            className='bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md'
                        >
                            GET TICKET
                        </button>} */}

                        {/* <button
                            type='submit'
                            className='bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md'
                        >
                            GET TICKET
                        </button> */}
                    </form>
                    <div className='absolute bottom-5 left-5'>
                        <p className='opacity-50 text-sm'>
                            <Link href='/'>{event.title}</Link> &copy; Copyright{" "}
                            {new Date().getFullYear()}{" "}
                        </p>
                    </div>
                </div>
                <div className='login md:w-[40%] h-[100vh] relative'>
                    <div className='absolute bottom-5 right-5'>
                        <a
                            href='https://github.com/code-art4'
                            target='_blank'
                            className='text-gray-100'
                        >

                        </a>
                    </div>
                </div>
                {success && (
                    <div className='w-full h-[100vh] dim absolute top-0 flex items-center justify-center z-40'>
                        <div className='w-[400px] bg-white h-[300px] flex items-center justify-center flex-col rounded-md shadow-[#FFD95A] shadow-md'>
                            <h2 className='text-2xl font-extrabold mb-4 text-center'>
                                Registered Successfully! 🎉
                            </h2>
                            <p className='text-center mb-6'>
                                Check your email for your ticket and event information.
                            </p>
                            <button
                                className='px-4 py-2 bg-[#FFD95A] rounded-md'
                                onClick={() => setSuccess(false)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RegisterPage;
