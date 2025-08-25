import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
	return (
		<>
			<div className='flex flex-col min-h-screen w-full'>
				<Header />
				<main className='flex-1 px-4 py-8'>
					<div className='max-w-7xl mx-auto'>{/* Здесь будет твой контент */}</div>
				</main>
				<Footer />
			</div>
		</>
	);
}

export default App;
