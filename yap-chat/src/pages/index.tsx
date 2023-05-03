import { type NextPage } from "next";
import Videoplayer from "~/components/videoplayer";
import { Header } from "~/components/header";

const Home: NextPage = () => {

  return (
    <div>
      <Header />
      <Videoplayer url="https://mccleansid.wistia.com/medias/ttzeatf88i" />
    </div>
  );
};

export default Home;
