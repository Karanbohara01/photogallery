export interface Gallery {
    _id: string;
    title: string;
    description?: string;
    contentType: 'embed' | 'hosted';

    // This was missing!
    thumbnail?: string; // <--- Add this line

    embedCode?: string;
    images?: {
        url: string;
        altText: string;
    }[];
    tags: string[];
    views: number;
    createdAt: string;
}