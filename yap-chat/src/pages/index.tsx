import { type NextPage } from "next";
import Videoplayer from "~/components/videoplayer";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { useState } from "react";
import { LoginForm } from "~/components/login";
import { RegisterForm } from "~/components/register";

const Home: NextPage = () => {
  const [homeForm, setHomeForm] = useState(true)

  const changeHomeForm = () => {
    setHomeForm(!homeForm)
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
          {/* ternary for either login or register fields to be shown */}
          {homeForm ? <LoginForm /> : <RegisterForm />}
          <button onClick={changeHomeForm}>{homeForm ? <p className="animate-pulse">New user? Click here to register.</p> : <p className="animate-pulse">Returning user? Click here to login.</p>}</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
