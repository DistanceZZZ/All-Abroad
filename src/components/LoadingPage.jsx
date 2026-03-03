import HeaderBar from "./HeaderBar";
import Footer from "./Footer";

export default function LoadingPage() {
  return (
    <div className="page-container">
      <HeaderBar />
      <main>Loading...</main>
      <Footer />
    </div>
  );
}
