import { type NextPage } from "next";
import Videoplayer from "~/components/videoplayer";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";

const Home: NextPage = () => {

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event?.preventDefault();
    console.log('being submitted')
  }

  return (
    <div>
      <Header />
      <Videoplayer url="https://mccleansid.wistia.com/medias/ttzeatf88i" />
      <div className="min-h-screen flex flex-row justify-evenly items-center">
        <div className="min-h-screen flex flex-col justify-center items-center font-extralight text-white">
          <p className="text-9xl font-extrabold">Yap.</p>
          <p className="text-3xl p-6">Express your opinion's freely.</p>
          <p className="text-3xl">Diversify your <span className="font-extrabold text-yellow-600">Network</span>.</p>
        </div>
        <div className="min-h-screen flex flex-col justify-center items-center font-extralight text-white">
          <form action="post" onSubmit={handleSubmit}>
            {/* ternary for either login or register fields to be shown */}
            <p className="text-2xl">Get that bready.</p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
