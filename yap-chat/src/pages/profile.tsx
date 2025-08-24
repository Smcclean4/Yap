import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react'
import { Layout } from '~/components/layout'
import { SidebarNav } from '~/components/sidebar';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '~/utils/api';
import { LoadingPage } from '~/shared/loading';
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
  
  const { data: profileInfoFromDatabase, isLoading: profileLoading } = api.profile.getUserProfile.useQuery(
    { id: session?.user.id! },
    { 
      enabled: !!session?.user.id,
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

  const onEditChanges = useCallback(({ target: input }: any) => {
    setProfileData(prev => ({ ...prev, [input.name]: input.value }))
  }, [])

  const handleEdit = useCallback(() => {
    setEditMode(prev => !prev)
  }, [])

  const handleSave = useCallback(() => {
    if (profileData.username === "" || profileData.heading === "" || profileData.bio === "") {
      toast.error('Set all of your Profile Data!')
      return
    }
    console.log('Saving profile with image:', profileData.image)
    setProfileInfoDatabase({ id: session!.user.id, name: profileData.username, heading: profileData.heading, bio: profileData.bio, image: profileData.image })
    setEditMode(prev => !prev)
    toast.success('Profile saved!')
  }, [profileData, session, setProfileInfoDatabase])

  const handleImageUpload = useCallback(({ target: input }: any) => {
    const file = input.files[0];
    if (file) {
      const imageSrc = URL.createObjectURL(file)
      console.log('Image uploaded:', imageSrc)
      setProfileData(prev => ({ ...prev, image: imageSrc }))
    }
  }, [])

  // Render profile data directly instead of using a nested component
  if (profileLoading) return <LoadingPage />
  
  // Handle case where no session or profile data is available
  if (!session?.user.id) {
    return <div className="w-full flex justify-center items-center mt-28">Please log in to view your profile.</div>
  }

  return (
    <Layout>
      <Toaster />
      <SidebarNav user={session?.user.email} />
      <div className="w-full flex flex-col justify-center items-center mt-28 bg-gray-200 flex-wrap overflow-scroll no-scrollbar overflow-y-auto py-6">
        <div className="w-3/4 text-center flex flex-col flex-wrap justify-center items-center">
          <div className=" flex flex-col items-center">
            <div className="h-48 w-48 border-2 border-white bg-white flex justify-center items-center rounded-full overflow-hidden">
              <Image 
                src={profileData.image || profileInfoFromDatabase?.image || "/ezgif.com-webp-to-jpg.jpg"} 
                alt='Profile' 
                height="200" 
                width="200" 
                priority 
              />
            </div>
            {editMode && <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />}
          </div>
          <div className="my-2 w-full">
            {editMode ? (
              <div className="w-full">
                <p className="text-xl underline mb-2">Username</p>
                <input type="text" placeholder="Username" className="p-2 w-2/4" minLength={4} maxLength={25} onChange={onEditChanges} name="username" value={profileData?.username ?? ""} />
              </div>
            ) : <p className="text-xl"><b>@{profileInfoFromDatabase?.name || profileData.username || <span className="text-red-500">Set Your Username</span>}</b></p>}
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
                <div className="text-xl bg-slate-300/[0.7] p-4 border-2 border-white">{profileInfoFromDatabase?.heading || profileData.heading || <p className="text-red-500">Set Your Heading</p>}</div>
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
                <div className="text-xl bg-slate-300/[0.7] p-4 border-2 border-white text-left">{profileInfoFromDatabase?.bio || profileData.bio || <p className="text-red-500">Set Your Bio</p>}</div>
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