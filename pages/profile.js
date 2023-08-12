import React, { useState, useCallback, useEffect } from "react";
import { errorMessage, successMessage } from '../utils/util';
import { CgProfile } from 'react-icons/cg'
import db, { storage, auth } from "../utils/firebase";
import {
    getDoc,
    addDoc,
    collection,
    doc,
    updateDoc,
    onSnapshot,
    query,
    deleteDoc,
    where,
    arrayUnion,
} from "@firebase/firestore";
import {
    getDownloadURL,
    ref,
    uploadString,
    deleteObject,
} from "@firebase/storage";
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation'
import Loading from '../components/Loading'

const Profile = () => {
    const router = useRouter()
    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        address: "",
        bankDetails: [],
        profileImage: ''
        // Add more user details as needed
    });

    const [user, setUser] = useState({});
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const isUserLoggedIn = useCallback(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // console.log(user.uid)
                const q = query(collection(db, "users"), where("email", "==", user.email));

                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const firebaseEvents = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        setUserDetails({
                            firstName: data.fname, lastName: data.lname, email: data.email, address: data.address, bankDetails: data.bankDetails || [],
                            password: data.password,
                            profileImage: data.profileImage,
                            id: doc.id
                        })
                        firebaseEvents.push({ data: doc.data(), id: doc.id });
                    });

                    return () => unsubscribe();
                });
            } else {
                console.log('Error')
                // return router.push("/register");
            }
        });
    }, []);

    useEffect(() => {
        isUserLoggedIn();
    }, [isUserLoggedIn]);


    const handleChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleBankDetailsChange = (index, e) => {
        const updatedBankDetails = userDetails.bankDetails.map((bank, i) =>
            i === index ? { ...bank, [e.target.name]: e.target.value } : bank
        );

        setUserDetails({
            ...userDetails,
            bankDetails: updatedBankDetails,
        });
    };

    const handleAddBankDetails = () => {
        if (userDetails.bankDetails?.length >= 3) {
            errorMessage("You can only have a maximum of three accounts.");
            return;
        }


        setUserDetails({
            ...userDetails,
            bankDetails: [
                ...userDetails.bankDetails,
                { bankName: "", accountNumber: "" }, // Add more fields as needed }
            ],
        });
    };

    const handleDeleteBankDetails = (index) => {
        const updatedBankDetails = userDetails.bankDetails.filter((bank, i) => i !== index);
        setUserDetails({
            ...userDetails,
            bankDetails: updatedBankDetails,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setUserDetails({
                ...userDetails,
                profileImage: reader.result,
            });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleEditProfile = async () => {
        const userRef = doc(db, "users", userDetails.id);
        setLoading(true)

        try {
            // Save user details to Firestore under "users" collection with the document ID as the user's email
            await updateDoc(userRef, {
                fname: userDetails.firstName,
                lname: userDetails.lastName
            });

            const imageRef = ref(storage, `users/${userRef.id}/profileImage`);

            await uploadString(imageRef, userDetails.profileImage, "data_url");
            const downloadURL = await getDownloadURL(imageRef);
            updateProfile(auth.currentUser, {
                photoURL: downloadURL
            })
            await updateDoc(userRef, {
                profileImage: downloadURL,
            });

            if (userDetails.password) {
                await updateDoc(userRef, {
                    password: userDetails.password
                }).then(data => {
                    updateProfile(auth.currentUser, {
                        password: userDetails.password
                    }).then(() => {
                        // Profile updated!
                        // ...
                    }).catch((error) => {
                        // An error occurred
                        // ...
                    });
                });
            }

            if (userDetails.address) {
                await updateDoc(userRef, {
                    address: userDetails.address
                });
            }

            if (userDetails.bankDetails?.length > 0) {
                await updateDoc(userRef, {
                    bankDetails: userDetails.bankDetails
                });
            }

            setLoading(false)
            successMessage("Profile successfully edited");
            // router.push("/dashboard");
        } catch (error) {
            console.error("Error saving profile:", error);
            errorMessage("Failed to save profile ❌");
            setLoading(false)
        }
    };

    if (!userDetails.email) {
        return <Loading title='Fetching user information' />
    }

    if(loading){
        return <Loading title='Saving editted user info' />
    }


    return (
        <div className="w-full md:w-[70%] lg:w-[50%] container mx-auto mt-8 p-4">
            <h3 className="text-3xl font-bold text-center text-yellow-700 mb-4">
                Profile
            </h3>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form>
                    {/* Add the image input field */}
                    <div className="mb-4 flex justify-center items-center">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profileImage">
                            {userDetails.profileImage ? (
                                <img src={userDetails.profileImage} alt="Profile" className="w-[13rem] h-[13rem] rounded-full object-cover" />
                            ) : (
                                <CgProfile className='w-[13rem] h-[13rem]' />
                            )}
                        </label>
                        <input
                            className="hidden"
                            type="file"
                            accept="image/*"
                            name="profileImage"
                            id="profileImage"
                            onChange={handleImageChange}
                        />
                    </div>
                    {/* Rest of the user details */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                            First Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            name="firstName"
                            value={userDetails.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                            Last Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            name="lastName"
                            value={userDetails.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="email"
                            name="email"
                            readOnly={true}
                            value={userDetails.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="password"
                            name="password"
                            value={userDetails.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                            Address
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                            name="address"
                            value={userDetails.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Bank Details
                        </label>
                        {userDetails?.bankDetails?.map((bank, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    name="bankName"
                                    placeholder="Bank Name"
                                    value={bank.bankName}
                                    onChange={(e) => handleBankDetailsChange(index, e)}
                                />
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    name="accountNumber"
                                    placeholder="Account Number"
                                    value={bank.accountNumber}
                                    onChange={(e) => handleBankDetailsChange(index, e)}
                                />
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-2 py-1 rounded ml-2 my-3"
                                    onClick={() => handleDeleteBankDetails(index)}
                                >
                                    Delete
                                </button>

                            </div>
                        ))}
                        <button
                            type="button"
                            className="bg-green-500 text-white px-2 py-1 rounded"
                            onClick={handleAddBankDetails}
                        >
                            Add Bank Details
                        </button>
                    </div>

                    <button
                        type="button"
                        className="bg-green-500 text-white px-8 py-3 mt-[3rem] mb-3 rounded mx-auto flex"
                        onClick={handleEditProfile}
                    >
                        Edit Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
