import { ChevronUp } from 'lucide-react';

const Footer = () => {
	const scrollToHeader = () => {
		const header = document.getElementById('main-header');
		if (header) {
			header.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		} else {
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		}
	};

	return (
		<footer id='main-footer' className='bg-gray-800 dark:bg-gray-900 text-gray-100 p-6 mt-8'>
			<div className='container mx-auto flex justify-between items-center'>
				<p className='text-sm'>
					© {new Date().getFullYear()} GIF Search. All rights reserved.
				</p>
				<button
					onClick={scrollToHeader}
					className='p-2 rounded-full bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-200'
					aria-label='Scroll to header'
					title='Scroll to top'>
					<ChevronUp className='w-6 h-6 text-gray-100' />
				</button>
			</div>
		</footer>
	);
};

export default Footer;
