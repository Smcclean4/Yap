import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { Layout } from '~/components/layout'
import { SidebarNav } from '~/components/sidebar';
import { api } from '~/utils/api';

const HomePage = () => {
  interface UpdateInterface {
    heading: string;
    description: string;
  }

  const homeUpdatesQuery = api.home.getHomeUpdates.useQuery();

  const [homeUpdates, setHomeUpdates]: Array<any> = useState([]);

  const { data: session } = useSession();

  const defaultUpdates: UpdateInterface[] = [
    {
      heading: 'Lorem ipsum news heading',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat risus malesuada est tempor convallis. Cras ac augue sit amet dui rutrum scelerisque. Aenean pretium, nibh et tempor porttitor, ipsum elit gravida sapien, ac laoreet massa ipsum non eros. Quisque venenatis pulvinar dictum. Aenean nisl odio, interdum a tristique eu, faucibus ac nibh. Vivamus interdum venenatis commodo. Sed malesuada quam id ex consectetur mattis. Morbi vel pretium orci. Duis quis dignissim eros, in sagittis eros. Fusce et imperdiet dui. Sed porttitor ultricies finibus. Integer luctus pretium massa, in tincidunt nunc dignissim at. Nulla elementum diam in quam sollicitudin, id efficitur arcu fermentum. Duis viverra volutpat orci, ut laoreet lacus.'
    },
    {
      heading: 'Lorem ipsum news heading',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat risus malesuada est tempor convallis. Cras ac augue sit amet dui rutrum scelerisque. Aenean pretium, nibh et tempor porttitor, ipsum elit gravida sapien, ac laoreet massa ipsum non eros. Quisque venenatis pulvinar dictum. Aenean nisl odio, interdum a tristique eu, faucibus ac nibh. Vivamus interdum venenatis commodo. Sed malesuada quam id ex consectetur mattis. Morbi vel pretium orci. Duis quis dignissim eros, in sagittis eros. Fusce et imperdiet dui. Sed porttitor ultricies finibus. Integer luctus pretium massa, in tincidunt nunc dignissim at. Nulla elementum diam in quam sollicitudin, id efficitur arcu fermentum. Duis viverra volutpat orci, ut laoreet lacus.'
    },
    {
      heading: 'Lorem ipsum news heading',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat risus malesuada est tempor convallis. Cras ac augue sit amet dui rutrum scelerisque. Aenean pretium, nibh et tempor porttitor, ipsum elit gravida sapien, ac laoreet massa ipsum non eros. Quisque venenatis pulvinar dictum. Aenean nisl odio, interdum a tristique eu, faucibus ac nibh. Vivamus interdum venenatis commodo. Sed malesuada quam id ex consectetur mattis. Morbi vel pretium orci. Duis quis dignissim eros, in sagittis eros. Fusce et imperdiet dui. Sed porttitor ultricies finibus. Integer luctus pretium massa, in tincidunt nunc dignissim at. Nulla elementum diam in quam sollicitudin, id efficitur arcu fermentum. Duis viverra volutpat orci, ut laoreet lacus.'
    }
  ]

  useEffect(() => {
    setHomeUpdates([...defaultUpdates])
  }, [])

  return (
    <Layout>
      <SidebarNav user={session?.user.email} />
      <div className="w-full flex flex-col justify-center items-center mt-28 sm:pt-10 bg-gray-200">
        <div className="w-3/4 text-sm sm:text-lg md:text-xl xl:text-2xl xl:leading-10 tracking-wider text-center">
          <p>Welcome to Yap, the chat application where you can message your friends and send out Yaps - opinionated global messages that allow you to share your thoughts and ideas with the world!</p>
          <br></br>
          <p>With Yap, you can stay connected with your friends and family, have private conversations, and also broadcast your views to a wider audience. Whether you want to share your latest project, your favorite song, or just your opinion on the latest news, Yap is the perfect platform to do it.</p>
        </div>
        <div className="bg-gray-900/[0.8] mt-16 mb-2 h-72 w-5/6 lg:w-3/5 text-white flex flex-col justify-center items-center text-2xl overflow-auto rounded-lg">
          <div className="py-5 h-full w-4/5">
            <p className="underline text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 font-bold">Recent News</p>
            {homeUpdates?.map((content: { heading: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, idx: React.Key | null | undefined) => {
              return (
                <div key={idx}>
                  <p className="underline text-md md:text-2xl"><i>{content.heading}</i></p>
                  <p className="py-6 text-sm md:text-xl">{content.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage