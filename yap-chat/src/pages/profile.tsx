import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import { Layout } from '~/components/layout'
import { SidebarNav } from '~/components/sidebar';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '~/utils/api';
import { LoadingPage } from '~/shared/loading';

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
  const { data: profileInfoFromDatabase, isLoading: profileLoading } = api.profile.getUserProfile.useQuery({ id: session?.user.id! })
  const { mutate: setProfileInfoDatabase } = api.profile.setUserProfile.useMutation({
    onSettled: () => {
      void ctx.profile.getUserProfile.invalidate();
    }
  })

  const onEditChanges = ({ target: input }: any) => {
    setProfileData({ ...profileData, [input.name]: input.value })
  }

  const handleEdit = () => {
    setEditMode(!editMode)
  }

  const handleSave = () => {
    if (profileData.username === "") {
      toast.error('Set your username!')
      return
    }
    if (profileData.heading === "") {
      toast.error('Set your heading!')
      return
    }
    if (profileData.bio === "") {
      toast.error('Set your bio!')
      return
    }
    setProfileInfoDatabase({ id: session!.user.id, name: profileData.username, heading: profileData.heading, bio: profileData.bio, image: profileData.image })
    setEditMode(!editMode)
    toast.success('Profile saved!')
  }

  const handleImageUpload = ({ target: input }: any) => {
    const file = input.files[0];
    const imageSrc = URL.createObjectURL(file)
    setProfileData({ ...profileData, image: imageSrc })
  }

  return (
    <Layout>
      <Toaster />
      <SidebarNav user={session?.user.email} />
      <div className="w-full flex justify-center items-center mt-28 bg-gray-200 flex-wrap overflow-scroll no-scrollbar overflow-y-auto py-6">
        <div className="w-3/4 text-center flex flex-col flex-wrap justify-center items-center">
          <div className=" flex flex-col items-center">
            <div className="h-48 w-48 border-2 border-white bg-white flex justify-center items-center rounded-full overflow-hidden">
              <Image src={profileInfoFromDatabase?.image ? profileInfoFromDatabase?.image : profileData.image} alt='' height="200" width="200" priority />
            </div>
            {editMode && <input className="my-4 ml-32" type="file" onChange={(e) => handleImageUpload(e)} name="image" accept="image/png, image/jpg, image/gif" />}
          </div>
          <div className="my-2 w-full">
            {editMode ? (
              <div className="w-full">
                <p className="text-xl underline mb-2">Username</p>
                <input type="text" placeholder="Username" className="p-2 w-2/4" minLength={4} maxLength={25} onChange={onEditChanges} name="username" value={profileData?.username ?? ""} />
              </div>
            ) : <p className="text-xl"><b>@{profileData.username === undefined ? <span className="text-red-500">Set Your Username</span> : profileInfoFromDatabase?.name}</b></p>}
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            {editMode ? (
              <div className="w-full">
                <p className="text-xl underline mb-2">Heading</p>
                <input type="text" placeholder="Heading" className="p-2 w-2/4" maxLength={40} onChange={onEditChanges} name="heading" value={profileData?.heading ?? ""} />
              </div>
            ) : (
              <div className="w-1/2">
                <p className="bg-blue-400 w-36 py-2 px-6 text-xl rounded-t-xl text-white text-center border-white">Heading</p>
                <div className="text-xl bg-slate-300/[0.7] p-4 border-2 border-white">{profileData.heading === undefined ? <p className="text-red-500">Set Your Heading</p> : profileInfoFromDatabase?.heading}</div>
              </div>
            )}
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            {editMode ? (
              <div className="w-full">
                <p className="text-xl underline mb-2">Bio</p>
                <textarea className="w-2/3 h-32 mb-2 p-2 resize-none" placeholder="Tell us about yourself!" maxLength={350} onChange={onEditChanges} name="bio" value={profileData?.bio ?? ""} />
              </div>
            ) : (
              <div className="w-2/3 my-6 max-h-48">
                <p className="bg-blue-400 w-36 text-xl rounded-t-xl text-white text-center border-white">Bio</p>
                <div className="text-xl bg-slate-300/[0.7] p-4 border-2 border-white text-left">{profileData.bio === undefined ? <p className="text-red-500">Set Your Bio</p> : profileInfoFromDatabase?.bio}</div>
              </div>
            )}
          </div>
          <div className="flex flex-row justify-evenly w-full my-2">
            {editMode &&
              <button className="text-xl text-white bg-blue-500 py-2 px-6 rounded-full" onClick={handleEdit}>Cancel</button>}
            {editMode ? (
              <button className="text-xl text-white bg-blue-500 py-2 px-6 rounded-full" onClick={handleSave}>Save</button>
            ) : (
              <button className="text-xl text-white bg-blue-500 py-2 px-6 rounded-full" onClick={handleEdit}>Edit</button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ProfilePage