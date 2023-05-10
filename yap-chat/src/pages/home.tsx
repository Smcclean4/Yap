import React, { useEffect, useState } from 'react'
import { Layout } from '~/components/layout'

const HomePage = () => {
  interface UpdateInterface {
    heading: string;
    description: string;
  }

  const [homeUpdates, setHomeUpdates]: Array<any> = useState([]);

  const exampleUpdate: UpdateInterface[] = [
    {
      heading: 'Money',
      description: 'get to it'
    },
    {
      heading: 'Cash',
      description: 'gone do it'
    },
    {
      heading: 'Bag',
      description: 'gotta get it'
    },
    {
      heading: 'money',
      description: 'get to it'
    },
    {
      heading: 'Cash',
      description: 'gone do it'
    },
    {
      heading: 'Bag',
      description: 'gotta get it'
    }
  ]

  useEffect(() => {
    setHomeUpdates([...exampleUpdate])
  }, [])

  return (
    <Layout>
      <div className="w-full flex flex-col justify-center items-center mt-28 bg-gray-200">
        <div className="w-3/4 text-3xl leading-10 tracking-wider text-center">
          <p>Welcome to Yap, the chat application where you can message your friends and send out Yaps - opinionated global messages that allow you to share your thoughts and ideas with the world!</p>
          <br></br>
          <p>With Yap, you can stay connected with your friends and family, have private conversations, and also broadcast your views to a wider audience. Whether you want to share your latest project, your favorite song, or just your opinion on the latest news, Yap is the perfect platform to do it.</p>
        </div>
        <div className="bg-gray-900/[0.8] mt-16 mb-2 h-72 w-3/5 text-white flex flex-col justify-center items-center text-2xl overflow-auto rounded-lg">
          <div className="py-5 h-full w-4/5">
            <p className="underline text-center text-4xl"><b>Recent News</b></p>
            {homeUpdates?.map((content: { heading: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, idx: React.Key | null | undefined) => {
              return (
                <div key={idx}>
                  <p className="underline text-3xl"><i>{content.heading}</i></p>
                  <p className="m-2">{content.description}</p>
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