import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import styles from './Modal.module.css';

type Direction =
	| 'center'
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'topLeft'
	| 'topRight'
	| 'bottomLeft'
	| 'bottomRight';

type ModalProps = {
	show: boolean;
	onClose: () => void;
	children: React.ReactNode;
	direction?: Direction;
};

const getModalVariants = (direction: Direction): Variants => {
	const variants: Record<Direction, Variants> = {
		center: {
			hidden: {
				opacity: 0,
				scale: 0.75,
				x: '-50%',
				y: '-50%',
			},
			visible: {
				opacity: 1,
				scale: 1,
				x: '-50%',
				y: '-50%',
				transition: { duration: 0.3, ease: 'easeOut' },
			},
		},
		top: {
			hidden: {
				opacity: 0,
				x: '-50%',
				y: '-100dvh',
			},
			visible: {
				opacity: 1,
				x: '-50%',
				y: '-50%',
				transition: { duration: 0.4, ease: 'easeOut' },
			},
		},
		bottom: {
			hidden: {
				opacity: 0,
				x: '-50%',
				y: '100dvh',
			},
			visible: {
				opacity: 1,
				x: '-50%',
				y: '-50%',
				transition: { duration: 0.4, ease: 'easeOut' },
			},
		},
		left: {
			hidden: {
				opacity: 0,
				x: '-100vw',
				y: '-50%',
			},
			visible: {
				opacity: 1,
				x: '-50%',
				y: '-50%',
				transition: { duration: 0.4, ease: 'easeOut' },
			},
		},
		right: {
			hidden: {
				opacity: 0,
				x: '100vw',
				y: '-50%',
			},
			visible: {
				opacity: 1,
				x: '-50%',
				y: '-50%',
				transition: { duration: 0.4, ease: 'easeOut' },
			},
		},
		topLeft: {
			hidden: {
				opacity: 0,
				x: '-100vw',
				y: '-100dvh',
				scale: 0.8,
			},
			visible: {
				opacity: 1,
				x: '-50%',
				y: '-50%',
				scale: 1,
				transition: { duration: 0.5, ease: 'easeOut' },
			},
		},
		topRight: {
			hidden: {
				opacity: 0,
				x: '100vw',
				y: '-100vh',
				scale: 0.8,
			},
			visible: {
				opacity: 1,
				x: '-50%',
				y: '-50%',
				scale: 1,
				transition: { duration: 0.5, ease: 'easeOut' },
			},
		},
		bottomLeft: {
			hidden: {
				opacity: 0,
				x: '-100vw',
				y: '100dvh',
				scale: 0.8,
			},
			visible: {
				opacity: 1,
				x: '-50%',
				y: '-50%',
				scale: 1,
				transition: { duration: 0.5, ease: 'easeOut' },
			},
		},
		bottomRight: {
			hidden: {
				opacity: 0,
				x: '100vw',
				y: '100dvh',
				scale: 0.8,
			},
			visible: {
				opacity: 1,
				x: '-50%',
				y: '-50%',
				scale: 1,
				transition: { duration: 0.5, ease: 'easeOut' },
			},
		},
	};

	return variants[direction];
};

const getBackdropVariants = (direction: Direction): Variants => {
	const hasDelay = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].includes(direction);

	return {
		visible: {
			opacity: 1,
			transition: hasDelay ? { delay: 0.1, duration: 0.3 } : { duration: 0.3 },
		},
		hidden: {
			opacity: 0,
			transition: { duration: 0.2 },
		},
	};
};

const Modal: React.FC<ModalProps> = ({ show, onClose, children, direction = 'center' }) => {
	const stop = (e: React.MouseEvent) => {
		e.stopPropagation();
	};
	const modalVariants = getModalVariants(direction);
	const backdropVariants = getBackdropVariants(direction);
	return (
		<AnimatePresence>
			{show && (
				<motion.div
					className={styles.modalBackdrop}
					variants={backdropVariants}
					initial='hidden'
					animate='visible'
					exit='hidden'
					onClick={onClose}>
					<motion.div
						className={styles.modalContent}
						variants={modalVariants}
						initial='hidden'
						animate='visible'
						exit='hidden'
						onClick={stop}>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
