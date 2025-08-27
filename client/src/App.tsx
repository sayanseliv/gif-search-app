import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GifCards from './components/common/GifCards';
import { APP_CONTAINER, CONTAINER, MAIN_CONTENT } from './constants/styles';

function App() {
  return (
    <>
      <div className={APP_CONTAINER}>
        <Header />
        <main className={MAIN_CONTENT}>
          <div className={CONTAINER}>
            <GifCards />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
