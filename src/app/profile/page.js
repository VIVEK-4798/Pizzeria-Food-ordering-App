"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { React, useEffect, useState } from "react";
import Image from "next/image";
import InfoBox from '../../components/layout/InfoBox';
import SuccessBox from '../../components/layout/SuccessBox';

const ProfilePage = () => {
  const session = useSession();
  const [userName, setUserName] = useState('');
  const [image, setImage] = useState('');
  const [originalUserName, setOriginalUserName] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEdited, setIsEdited] = useState(false); 

  const { status } = session;
  const router = useRouter();

  async function handleProfileInfoUpdate(ev) {
    ev.preventDefault();
    setSaved(false);

    if (isEdited || userName !== originalUserName) {
      setIsSaving(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, image }),
      });
      setIsSaving(false);
      if (response.ok) {
        setSaved(true);
        setOriginalUserName(userName);
        setIsEdited(false);

        setTimeout(() => {
          setSaved(false);
        }, 3000);
      }
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      setUserName(session.data?.user.name);
      setOriginalUserName(session.data?.user.name);
      setImage(session.data.user?.image);
    }
  }, [session, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  async function handleFileChange(ev) {
    const files = ev.target.files;
    if (files?.length === 1) {
      setIsEdited(true); 
      const data = new FormData();
      data.append('files', files[0]);
      setIsUploading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const link = await response.json();
      setImage(link.link);
      setIsUploading(false);
    }
  }

  if (status === "loading") {
    return "Loading...";
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">Profile</h1>
      <div className="max-w-md mx-auto">
        {saved && (
          <SuccessBox>Profile Saved!</SuccessBox>
        )}
        {isSaving && (
          <InfoBox>Saving...</InfoBox>
        )}
        {isUploading && (
          <InfoBox>Uploading...</InfoBox>
        )}
        <div className="flex gap-4 items-center">
          <div>
            <div className="p-2 rounded-lg relative max-w-[80px]">
              {image && (
                <Image className="rounded-lg w-full h-full mb-1 max-h-[80px]"
                  src={image || "/src/images/default-avatar-profile-icon.avif"} 
                  alt="avatar" width={250} height={250} />
              )}
              <label>
                <input type="file" className="hidden" onChange={handleFileChange} />
                <span className="block text-center border border-gray-300
                 rounded-lg p-2 cursor-pointer">Edit</span>
              </label>
            </div>
          </div>
          <form className="grow" onSubmit={handleProfileInfoUpdate}>
            <input type="text" placeholder="first and last name"
              value={userName} onChange={ev => setUserName(ev.target.value)} />
            <input type="email" disabled={true} value={session.data?.user.email} />
            <button type="submit" disabled={!isEdited && userName === originalUserName}>
              Save
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
