import React, { useState } from 'react';
import { BlogPost } from '../types';

interface BlogPageProps {
  posts: BlogPost[];
  onAddPost: (content: string) => Promise<void>;
  currentUserName: string;
  currentUserPhoto: string;
}

const PostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-md border flex space-x-4 animate-fade-in-up">
            <img src={post.authorPhotoUrl} alt={post.authorName} className="h-12 w-12 rounded-full object-cover flex-shrink-0" />
            <div className="flex-grow">
                <div className="flex items-baseline space-x-2">
                    <p className="font-bold text-neutral">{post.authorName}</p>
                    <p className="text-sm text-gray-500">· {new Date(post.timestamp).toLocaleString()}</p>
                </div>
                <p className="mt-2 text-gray-800 whitespace-pre-wrap">{post.content}</p>
            </div>
        </div>
    );
};


const BlogPage: React.FC<BlogPageProps> = ({ posts, onAddPost, currentUserName, currentUserPhoto }) => {
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsPosting(true);
        try {
            await onAddPost(content);
            setContent('');
        } catch (error) {
            console.error("Failed to post:", error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
                    <form onSubmit={handleSubmit} className="flex space-x-4 items-start">
                        <img src={currentUserPhoto} alt={currentUserName} className="h-12 w-12 rounded-full object-cover"/>
                        <div className="flex-grow">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share your thoughts about your company, profile, or job life..."
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                rows={3}
                                disabled={isPosting}
                                aria-label="New post content"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={isPosting || !content.trim()}
                                    className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isPosting ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-neutral">Community Feed</h2>
                    {posts.length > 0 ? (
                        posts.map(post => <PostCard key={post.id} post={post} />)
                    ) : (
                        <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow-md border">
                            <p>No posts yet.</p>
                            <p>Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up {
                  0% {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                .animate-fade-in-up {
                  animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </main>
    );
}

export default BlogPage;
