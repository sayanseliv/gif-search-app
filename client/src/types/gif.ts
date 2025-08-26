export interface GifImage {
	url: string;
	width: string;
	height: string;
	size: string;
	mp4?: string;
	mp4_size?: string;
	webp?: string;
	webp_size?: string;
}

export interface GifImages {
	original: GifImage;
	downsized: GifImage;
	downsized_large: GifImage;
	downsized_medium: GifImage;
	downsized_small: GifImage;
	downsized_still: GifImage;
	fixed_height: GifImage;
	fixed_height_downsampled: GifImage;
	fixed_height_small: GifImage;
	fixed_height_small_still: GifImage;
	fixed_height_still: GifImage;
	fixed_width: GifImage;
	fixed_width_downsampled: GifImage;
	fixed_width_small: GifImage;
	fixed_width_small_still: GifImage;
	fixed_width_still: GifImage;
	looping: GifImage;
	original_still: GifImage;
	original_mp4: GifImage;
	preview: GifImage;
	preview_gif: GifImage;
	preview_webp: GifImage;
}

export interface GifUser {
	avatar_url: string;
	banner_image: string;
	banner_url: string;
	profile_url: string;
	username: string;
	display_name: string;
	description: string;
	instagram_url: string;
	website_url: string;
	is_verified: boolean;
}

export interface GifData {
	type: 'gif' | 'stickers';
	id: string;
	url: string;
	slug: string;
	bitly_gif_url: string;
	bitly_url: string;
	embed_url: string;
	username: string;
	source: string;
	title: string;
	rating: string;
	content_url: string;
	source_tld: string;
	source_post_url: string;
	is_sticker: number;
	import_datetime: string;
	trending_datetime: string;
	images: GifImages;
	user: GifUser;
	analytics_response_payload: string;
	analytics: {
		onload: { url: string };
		onclick: { url: string };
		onsent: { url: string };
	};
}

export interface GifResponse {
	data: GifData[];
	pagination: {
		total_count: number;
		count: number;
		offset: number;
	};
	meta: {
		status: number;
		msg: string;
		response_id: string;
	};
}

export interface SearchParams {
	q: string;
	limit?: number;
	offset?: number;
}

export interface SuggestionParams {
	q: string;
	limit?: number;
}

export interface SuggestionResponse {
	data: Array<{
		name: string;
		analytics_response_payload?: string;
	}>;
	meta: {
		status: number;
		msg: string;
		response_id: string;
	};
}
