import Image from 'next/image';
import React, { useState } from 'react'
import { Layout } from '~/components/layout'

const ProfilePage = () => {
  const [profileData, setProfileData]: any = useState({
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

  return (
    <Layout>
      <div className="w-full flex flex-col justify-center items-center mt-28 bg-gray-200">
        <div className="w-3/4 text-center flex flex-col justify-center items-center">
          <div className="mb-8 flex flex-col items-center">
            <Image src={profileData.image ?? "/kid-ghost-drawing.jpg"} alt='' height="200" width="200" className="rounded-full" />
            {editMode && <input className="my-6 ml-32" type="file" onChange={onEditChanges} name="image" accept="image/png, image/jpg" />}
          </div>
          <div className="my-2 w-full">
            {editMode ? (
              <input type="text" placeholder="@ Username" className="p-2 w-2/4" minLength={4} maxLength={25} onChange={onEditChanges} name="username" value={profileData.username} />
            ) : <p>{profileData.username}</p>}
          </div>
          <div className="my-2 w-full">
            {editMode ? (
              <input type="text" placeholder="Heading" className="p-2 w-2/4" maxLength={40} onChange={onEditChanges} name="heading" value={profileData.heading} />
            ) : <p>{profileData.heading}</p>}
          </div>
          <div className="my-8 w-full h-48">
            {editMode ? (
              <textarea className="w-3/4 h-full p-2 overflow-scroll resize-none" placeholder="Tell us about yourself!" maxLength={350} onChange={onEditChanges} name="bio" value={profileData.bio} />
            ) : <p>{profileData.bio}</p>}
          </div>
          <div className="flex flex-row justify-evenly mt-16 w-full">
            {editMode &&
              <button className="text-xl text-white bg-blue-500 py-2 px-6 rounded-full" onClick={handleEdit}>Cancel</button>}
            {editMode ? (
              <button className="text-xl text-white bg-blue-500 py-2 px-6 rounded-full" onClick={handleEdit}>Save</button>
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