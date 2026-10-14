import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react'
import { Layout } from '~/components/layout'
import { SidebarNav } from '~/components/sidebar';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '~/utils/api';
import { UploadButton } from '~/utils/uploadthing';

const ProfilePage = () => {

  interface ProfileInterface {
    username: string;
    heading: string;
    bio: string;
    image: string;
  }

  const [profileData, setProfileData] = useState<ProfileInterface>({
    username: '',
    heading: '',
    bio: '',
    image: "/ezgif.com-webp-to-jpg.jpg"
  })

  const { data: session } = useSession();
  const ctx = api.useContext()

  const [editMode, setEditMode] = useState(false)

  const { data: profileInfoFromDatabase } = api.profile.getUserProfile.useQuery(
    { id: session?.user?.id ?? '' },
    {
      enabled: Boolean(session?.user?.id),
      retry: 3,
      retryDelay: 1000
    }
  )
  const { mutate: setProfileInfoDatabase } = api.profile.setUserProfile.useMutation({
    onSettled: () => {
      void ctx.profile.getUserProfile.invalidate();
    }
  })

  // Update profileData when database data loads
  useEffect(() => {
    if (profileInfoFromDatabase) {
      setProfileData(prev => ({
        username: profileInfoFromDatabase.name || '',
        heading: profileInfoFromDatabase.heading || '',
        bio: profileInfoFromDatabase.bio || '',
        // Only update image if we don't have a local image (to preserve uploaded images)
        image: prev.image === "/ezgif.com-webp-to-jpg.jpg" ? (profileInfoFromDatabase.image || "/ezgif.com-webp-to-jpg.jpg") : prev.image
      }))
    }
  }, [profileInfoFromDatabase])

  const onEditChanges = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (name === 'username' || name === 'heading' || name === 'bio') {
        setProfileData((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  )

  const handleEdit = useCallback(() => {
    setEditMode(prev => !prev)
  }, [])

  const handleSave = useCallback(() => {
    if (profileData.username === "" || profileData.heading === "" || profileData.bio === "") {
      toast.error('Set all of your Profile Data!')
      return
    }
    console.log('Saving profile with image:', profileData.image)
    const uid = session?.user?.id;
    if (!uid) {
      toast.error('Not signed in.');
      return;
    }
    setProfileInfoDatabase({ id: uid, name: profileData.username, heading: profileData.heading, bio: profileData.bio, image: profileData.image })
    setEditMode(prev => !prev)
    toast.success('Profile saved!')
  }, [profileData, session, setProfileInfoDatabase])

  return (
    <Layout>
      <Toaster />
      <SidebarNav user={session?.user.email} />
      <div className="no-scrollbar flex w-full flex-col flex-wrap items-center justify-center overflow-y-auto overflow-scroll py-10">
        <div className="surface-card animate-rise flex w-11/12 max-w-3xl flex-col flex-wrap items-center p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-4 border-blue-500 bg-white shadow-xl shadow-blue-500/20 ring-4 ring-yap-gold/70">
              <Image
                src={profileData.image || profileInfoFromDatabase?.image || "/ezgif.com-webp-to-jpg.jpg"}
                alt='Profile'
                height="200"
                width="200"
                priority
              />
            </div>
            {editMode && <div className="mt-4">
              <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res: { url: string }[]) => {
                console.log("Files: ", res);
                const url = res[0]?.url;
                if (url) setProfileData((prev) => ({ ...prev, image: url }));
                toast.success('Image upload complete!')
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
            </div>}
          </div>
          <div className="my-4 w-full">
            {editMode ? (
              <div className="w-full">
                <p className="mb-2 text-xl font-semibold">Username</p>
                <input type="text" placeholder="Username" className="field-input mx-auto max-w-md" minLength={4} maxLength={25} onChange={onEditChanges} name="username" value={profileData?.username ?? ""} />
              </div>
            ) : <p className="text-2xl font-extrabold">@{profileInfoFromDatabase?.name || profileData.username || <span className="text-red-500">Set Your Username</span>}</p>}
          </div>
          <div className="flex w-full flex-col items-center justify-center">
            {editMode ? (
              <div className="w-full">
                <p className="mb-2 text-xl font-semibold">Heading</p>
                <input type="text" placeholder="Heading" className="field-input mx-auto max-w-xl" maxLength={40} onChange={onEditChanges} name="heading" value={profileData?.heading ?? ""} />
              </div>
            ) : (
              <div className="w-full max-w-xl">
                <p className="w-36 rounded-t-xl bg-blue-500 px-6 py-2 text-center text-xl text-white">Heading</p>
                <div className="border border-blue-100 bg-slate-100 p-4 text-xl">{profileInfoFromDatabase?.heading || profileData.heading || <p className="text-red-500">Set Your Heading</p>}</div>
              </div>
            )}
          </div>
          <div className="mt-6 flex w-full flex-col items-center justify-center">
            {editMode ? (
              <div className="w-full">
                <p className="mb-2 text-xl font-semibold">Bio</p>
                <textarea className="field-input mx-auto mb-2 h-32 max-w-2xl resize-none" placeholder="Tell us about yourself!" maxLength={350} onChange={onEditChanges} name="bio" value={profileData?.bio ?? ""} />
              </div>
            ) : (
              <div className="my-2 w-full max-w-2xl">
                <p className="w-36 rounded-t-xl bg-blue-500 text-center text-xl text-white">Bio</p>
                <div className="border border-blue-100 bg-slate-100 p-4 text-left text-xl">{profileInfoFromDatabase?.bio || profileData.bio || <p className="text-red-500">Set Your Bio</p>}</div>
              </div>
            )}
          </div>
          <div className="my-6 flex w-full flex-row justify-evenly">
            {editMode &&
              <button className="btn-ghost text-xl" onClick={handleEdit}>Cancel</button>}
            {editMode ? (
              <button className="btn-primary text-xl" onClick={handleSave}>Save</button>
            ) : (
              <button className="btn-primary text-xl" onClick={handleEdit}>Edit</button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage