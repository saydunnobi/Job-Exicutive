import React, { useState } from 'react';
import { BlogPost } from '../types';
import Modal from './Modal';
import { PencilIcon, TrashIcon } from './icons';

interface BlogPageProps {
  posts: BlogPost[];
  onAddPost: (content: string) => Promise<void>;
  onUpdatePost: (postId: number, content: string) => Promise<void>;
  onDeletePost: (postId: number) => Promise<void>;
  currentUserRole: 'seeker' | 'company' | 'admin';
  currentUserName: string;
  currentUserPhoto: string;
}

interface PostCardProps {
    post: BlogPost;
    currentUserRole: 'seeker' | 'company' | 'admin';
    onEdit: () => void;
    onDelete: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUserRole, onEdit, onDelete }) => {
    return (
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-interactive hover:shadow-interactive-lg hover:-translate-y-1 transition-transform-shadow duration-300 flex space-x-4 animate-fade-in-up">
            <img src={post.authorPhotoUrl} alt={post.authorName} className="h-12 w-12 rounded-full object-cover flex-shrink-0" />
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-baseline space-x-2">
                            <p className="font-bold text-neutral">{post.authorName}</p>
                            <p className="text-sm text-gray-500">· {new Date(post.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                     {currentUserRole === 'admin' && (
                        <div className="flex items-center space-x-1 flex-shrink-0">
                            <button onClick={onEdit} className="text-gray-500 hover:text-primary p-1 rounded-full hover:bg-gray-100" aria-label="Edit Post">
                                <PencilIcon className="h-5 w-5"/>
                            </button>
                            <button onClick={onDelete} className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100" aria-label="Delete Post">
                                <TrashIcon className="h-5 w-5"/>
                            </button>
                        </div>
                    )}
                </div>
                <p className="mt-2 text-gray-800 whitespace-pre-wrap">{post.content}</p>
            </div>
        </div>
    );
};


const BlogPage: React.FC<BlogPageProps> = ({ posts, onAddPost, onUpdatePost, onDeletePost, currentUserRole, currentUserName, currentUserPhoto }) => {
    const [content, setContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [editedContent, setEditedContent] = useState('');
    const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
    
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

    const handleUpdate = async () => {
        if (!editingPost || !editedContent.trim()) return;
        await onUpdatePost(editingPost.id, editedContent);
        setEditingPost(null);
        setEditedContent('');
    };

    const handleDelete = async () => {
        if (!deletingPost) return;
        await onDeletePost(deletingPost.id);
        setDeletingPost(null);
    };


    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-interactive mb-8">
                    <form onSubmit={handleSubmit} className="flex space-x-4 items-start">
                        <img src={currentUserPhoto} alt={currentUserName} className="h-12 w-12 rounded-full object-cover"/>
                        <div className="flex-grow">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share your thoughts about your company, profile, or job life..."
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition bg-white/50"
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
                        posts.map(post => <PostCard 
                            key={post.id} 
                            post={post} 
                            currentUserRole={currentUserRole}
                            onEdit={() => {
                                setEditingPost(post);
                                setEditedContent(post.content);
                            }}
                            onDelete={() => setDeletingPost(post)}
                        />)
                    ) : (
                        <div className="text-center text-gray-500 py-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-interactive">
                            <p>No posts yet.</p>
                            <p>Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Edit Post Modal */}
            <Modal isOpen={!!editingPost} onClose={() => setEditingPost(null)} title="Edit Post">
                <div className="space-y-4">
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        rows={6}
                        aria-label="Edit post content"
                    />
                    <div className="flex justify-end space-x-4">
                        <button onClick={() => setEditingPost(null)} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-md">Cancel</button>
                        <button onClick={handleUpdate} className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-md">Save Changes</button>
                    </div>
                </div>
            </Modal>
            
            {/* Delete Post Modal */}
            <Modal isOpen={!!deletingPost} onClose={() => setDeletingPost(null)} title="Confirm Deletion">
                 <div className="text-center">
                    <p className="text-lg">Are you sure you want to delete this post?</p>
                    <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
                    <div className="mt-6 flex justify-center space-x-4">
                        <button onClick={() => setDeletingPost(null)} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded-md">Cancel</button>
                        <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md">Delete</button>
                    </div>
                </div>
            </Modal>

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