'use client';
import React, { useState, useEffect } from 'react';
import EditableImage from './EditableImage';

const UserForm = ({ user, onSave }) => {
    console.log("user hehbe",user);
    
    const normalizedUser = { 
        name: user?.name || user?.user?.name || '',
        email: user?.email || user?.userInfo?.email || '',
        image: user?.image || user?.user?.image || '',
        phone: user?.phone || user?.userInfo?.phone || '',
        streetAddress: user?.streetAddress || user?.userInfo?.streetAddress || '',
        zipCode: user?.zipCode || user?.userInfo?.zipCode || '',
        city: user?.city || user?.userInfo?.city || '',
        country: user?.country || user?.userInfo?.country || '',
    };

    // State to store user input fields
    const [originalData, setOriginalData] = useState({});
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState('');
    const [phone, setPhone] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    // ✅ Update form fields when user data is received
    useEffect(() => {
        if (user) {
            console.log("Normalized user data:", normalizedUser);

            setOriginalData(normalizedUser);
            setUserName(normalizedUser.name);
            setEmail(normalizedUser.email);
            setImage(normalizedUser.image);
            setPhone(normalizedUser.phone);
            setStreetAddress(normalizedUser.streetAddress);
            setZipCode(normalizedUser.zipCode);
            setCity(normalizedUser.city);
            setCountry(normalizedUser.country);
        }
    }, [user]);

    // ✅ Check if any field has been modified
    const isEdited =
        originalData &&
        (userName !== originalData.name ||
            image !== originalData.image ||
            phone !== originalData.phone ||
            streetAddress !== originalData.streetAddress ||
            zipCode !== originalData.zipCode ||
            city !== originalData.city ||
            country !== originalData.country);

    return (
        <div className="flex gap-4">
            <div className="p-2 rounded-lg relative max-w-[80px]">
                <EditableImage link={image} setLink={setImage} />
            </div>
            <form
                className="grow"
                onSubmit={(ev) =>
                    onSave(ev, {
                        name: userName, image, phone, city,
                        streetAddress, zipCode, country,
                    })}
            >
                <label> First and last name </label>
                <input
                    type="text"
                    placeholder="First and Last Name"
                    value={userName}
                    onChange={(ev) => setUserName(ev.target.value)}
                />

                <label> Email </label>
                <input type="email" placeholder="email" disabled value={email} />

                <label> Phone No. </label>
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(ev) => setPhone(ev.target.value)}
                />

                <label> Street address </label>
                <input
                    type="text"
                    placeholder="Street Address"
                    value={streetAddress}
                    onChange={(ev) => setStreetAddress(ev.target.value)}
                />

                <div className="flex gap-2">
                    <div>
                        <label> Zip code </label>
                        <input
                            type="text"
                            placeholder="Zip Code"
                            value={zipCode}
                            onChange={(ev) => setZipCode(ev.target.value)}
                        />
                    </div>
                    <div>
                        <label> City </label>
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(ev) => setCity(ev.target.value)}
                        />
                    </div>
                </div>

                <label> Country </label>
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(ev) => setCountry(ev.target.value)}
                />

                <button type="submit" disabled={!isEdited}>Save</button>
            </form>
        </div>
    );
};

export default UserForm;
