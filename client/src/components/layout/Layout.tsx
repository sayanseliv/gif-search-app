import Header from './Header';
import Footer from './Footer';

const Layout = () => {
	return (
		<>
			<Header />
			<main className='min-h-screen w-full px-4 py-8 bg-gray-100'>
				<div className='max-w-7xl mx-auto w-full'></div>
			</main>
			<Footer />
		</>
	);
};

export default Layout;
