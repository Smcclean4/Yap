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
    void router.push("/home");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      <Header />
      <Videoplayer
        url="https://mccleansid.wistia.com/medias/ttzeatf88i"
        className="pointer-events-none absolute inset-0 z-0 m-auto h-screen w-full"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gray-900/20" />
      <div className="relative z-10 flex min-h-screen flex-row flex-wrap items-center justify-evenly md:justify-around">
        <div className="flex flex-col items-center justify-center text-7xl font-extralight text-white md:text-xl">
          <p className="text-9xl font-extrabold drop-shadow-[0_8px_24px_rgba(59,130,246,0.45)]">Yap.</p>
          <p className="p-6 text-3xl">Express your opinions freely.</p>
          <p className="text-3xl">Diversify your <span className="font-extrabold text-yellow-600">Network</span>.</p>
        </div>
        <div className="flex flex-col items-center justify-center text-center text-2xl font-extralight text-white md:text-xl">
          {session ? (
            <>
              <button className="btn-primary mx-auto m-3 animate-glow" onClick={handleLogin}>Go to Home</button>
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
