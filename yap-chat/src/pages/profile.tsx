import Image from 'next/image';
import React, { useState } from 'react'
import { Layout } from '~/components/layout'

const ProfilePage = () => {
  interface ProfileInterface {
    image: undefined;
    username: string;
    heading: string;
    bio: string;
  }

  const [profileData, setProfileData]: any = useState<ProfileInterface>({
    image: undefined,
    username: '',
    heading: '',
    bio: '',
  })

  const [editMode, setEditMode] = useState(false)

  const onEditChanges = ({ target: input }: any) => {
    setProfileData({ ...profileData, [input.name]: input.value })
  }

  const handleEdit = () => {
    setEditMode(!editMode)
  }

  const handleSave = () => {
    setEditMode(!editMode)
  }

  const handleImageUpload = ({ target: input }: any) => {
    const file = input.files[0];
    const imageUrl = URL.createObjectURL(file);
    setProfileData({ ...profileData, [input.name]: imageUrl })
  }

  return (
    <Layout>
      <div className="w-full flex flex-col justify-center items-center mt-28 bg-gray-200 flex-wrap">
        <div className="w-3/4 text-center flex flex-col justify-center items-center">
          <div className="mb-8 flex flex-col items-center">
            <div className="h-48 w-48 border-2 border-white bg-white flex justify-center items-center rounded-full overflow-hidden">
              <Image src={profileData.image ?? "/ezgif.com-webp-to-jpg.jpg"} alt='' height="200" width="200" />
            </div>
            {editMode && <input className="my-6 ml-32" type="file" onChange={handleImageUpload} name="image" accept="image/png, image/jpg, image/gif" />}
          </div>
          <div className="my-2 w-full">
            {editMode ? (
              <div className="w-full">
                <p className="text-xl underline mb-2">Username</p>
                <input type="text" placeholder="Username" className="p-2 w-2/4" minLength={4} maxLength={25} onChange={onEditChanges} name="username" value={profileData.username} />
              </div>
            ) : <p className="text-xl">Username: <b>@{profileData.username === "" ? <p className="text-red-500">Set Your Username</p> : profileData.username}</b></p>}
          </div>
          <div className="my-2 w-full flex flex-col justify-center items-center">
            {editMode ? (
              <div className="w-full">
                <p className="text-xl underline mb-2">Heading</p>
                <input type="text" placeholder="Heading" className="p-2 w-2/4" maxLength={40} onChange={onEditChanges} name="heading" value={profileData.heading} />
              </div>
            ) : (
              <div className="w-1/2">
                <p className="bg-blue-400 w-36 py-2 px-6 text-xl rounded-t-xl text-white text-center border-white">Heading</p>
                <p className="text-xl bg-slate-300/[0.7] p-4 border-2 border-white">{profileData.heading === "" ? <p className="text-red-500">Set Your Heading</p> : profileData.heading}</p>
              </div>
            )}
          </div>
          <div className="my-4 w-full h-48 flex flex-col justify-center items-center">
            {editMode ? (
              <div className="w-full h-full">
                <p className="text-xl underline mb-2">Bio</p>
                <textarea className="w-2/3 h-full p-2 resize-none" placeholder="Tell us about yourself!" maxLength={350} onChange={onEditChanges} name="bio" value={profileData.bio} />
              </div>
            ) : (
              <div className="w-2/3 max-h-48">
                <p className="bg-blue-400 w-36 py-2 px-6 text-xl rounded-t-xl text-white text-center border-white">Bio</p>
                <p className="text-xl bg-slate-300/[0.7] p-4 border-2 border-white text-left">{profileData.bio === "" ? <p className="text-red-500">Set Your Bio</p> : profileData.bio}</p>
              </div>
            )}
          </div>
          <div className="flex flex-row justify-evenly mt-12 w-full">
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