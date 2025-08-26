import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import SearchSection from '../common/SearchSection';
const Header = () => {
	const [theme, setTheme] = useState(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) return savedTheme;

		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	});

	const [userThemeSet, setUserThemeSet] = useState(() => {
		return !!localStorage.getItem('theme');
	});

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		document.documentElement.classList.toggle('dark', theme === 'dark');

		if (theme === 'dark') {
			document.documentElement.style.setProperty('--background', '#1f2937');
			document.documentElement.style.setProperty('--foreground', '#f9fafb');
		} else {
			document.documentElement.style.setProperty('--background', '#f3f4f6');
			document.documentElement.style.setProperty('--foreground', '#111827');
		}

		localStorage.setItem('theme', theme);
	}, [theme]);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleChange = (e: MediaQueryListEvent) => {
			if (!userThemeSet) {
				const newTheme = e.matches ? 'dark' : 'light';
				setTheme(newTheme);
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [userThemeSet]);

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		setUserThemeSet(true);
	};

	return (
		<header className='bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 border-b-1 border-blue-400 transition-colors duration-300'>
			<div className='container mx-auto flex justify-between items-center flex-wrap sm:flex-nowrap gap-2'>
				<h1 className='shrink-0 text-2xl font-bold'>GIF Search</h1>
				<SearchSection />
				<button
					onClick={toggleTheme}
					className='p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors duration-200'
					aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
					{theme === 'light' ? (
						<Moon className='w-6 h-6 text-gray-900' />
					) : (
						<Sun className='w-6 h-6 text-yellow-400' />
					)}
				</button>
			</div>
		</header>
	);
};
export default Header;
