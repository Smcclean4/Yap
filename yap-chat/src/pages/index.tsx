import { type NextPage } from "next";
import Videoplayer from "~/components/videoplayer";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { LoginForm } from "~/components/login";
import { LogoutForm } from "~/components/logout";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session } = useSession();

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
          {/* ternary for either login or register fields to be shown */}
          {session ? (
            <>
              <LogoutForm />
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
