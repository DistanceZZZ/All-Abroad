import HeaderBar from "./HeaderBar";
import Footer from "./Footer";

export default function PageNotFound() {
  return (
    <div className="page-container">
      <HeaderBar />
      <main>
        <h1>Page Not Found</h1>
      </main>
      <Footer />
    </div>
  );
}
