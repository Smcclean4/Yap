import { type NextPage } from "next";
import Videoplayer from "~/components/videoplayer";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { LoginForm } from "~/components/login";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/home")
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
        <div className="min-h-screen flex flex-col justify-center text-center items-center font-extralight text-white">
          {session ? (
            <>
              <button className="m-3 rounded-full bg-blue-500 mx-auto px-6 py-2" onClick={handleLogin}>Go to Home</button>
              <p>Logged in as {session.user.email}</p>
            </>
          ) : <LoginForm />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
