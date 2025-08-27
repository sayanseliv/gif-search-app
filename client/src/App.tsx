import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GifCards from './stores/GifCards';

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen w-full">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="container mx-auto">
            <GifCards />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
