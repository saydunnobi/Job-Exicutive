/**
 * Firebase API Service
 * This file replaces the mock service with a real implementation using Firebase.
 * It handles authentication, database operations (Firestore), and file storage.
 */
// FIX: Switched from Firebase v9 modular imports to v8 namespaced/compat syntax to fix import errors.
// FIX: Use v8 compat import to make firebase.firestore available.
import firebase from 'firebase/compat/app';
import { db, auth, storage } from './firebaseConfig';

import { Job, Company, JobSeeker, Admin, Review, BlogPost, ReactionType, Reaction, Comment } from '../types';

type UserRole = 'seeker' | 'company' | 'admin';
type User = JobSeeker | Company | Admin;

// --- HELPER FUNCTIONS ---

// Converts a Firestore document snapshot into a usable object, handling the ID and timestamps.
const fromDoc = (doc: any) => {
    const data = doc.data();
    return {
        ...data,
        id: doc.id,
        // Convert Firestore Timestamps to ISO strings for consistency
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp,
    };
};

// A generic function to upload a base64 data URL to Firebase Storage.
const uploadDataUrl = async (path: string, dataUrl: string): Promise<string> => {
    if (!dataUrl.startsWith('data:')) return dataUrl; // It's already a URL, no need to upload
    // FIX: Use v8 storage syntax
    const storageRef = storage.ref(path);
    const snapshot = await storageRef.putString(dataUrl, 'data_url');
    return await snapshot.ref.getDownloadURL();
};

export const api = {
  // --- AUTHENTICATION ---
  authenticateUser: async (email: string, password: string, role: UserRole): Promise<User> => {
    try {
        // FIX: Use v8 auth syntax
        let userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (!user) {
            throw new Error("Authentication failed.");
        }

        // After sign-in, fetch profile to confirm role
        const userProfile = await api.getUserProfile(user.uid);
        if (userProfile && userProfile.role === role) {
            return userProfile.user;
        } else if (userProfile) {
            // Logged in successfully, but role mismatch
            await auth.signOut();
            throw new Error(`You are registered as a ${userProfile.role}, not a ${role}.`);
        } else {
             // User exists in Auth but not in our DB collections.
            await auth.signOut();
            throw new Error('User profile not found.');
        }

    } catch (error: any) {
        // If user not found, create a new account
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            if (role === 'admin') throw new Error('Admin account cannot be created from login.');

            // FIX: Use v8 auth syntax
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
             if (!user) {
                throw new Error("Account creation failed.");
            }
            let newUserProfile: User;

            if (role === 'seeker') {
                const newSeeker: JobSeeker = {
                    id: user.uid,
                    name: email.split('@')[0],
                    email,
                    phone: '',
                    photoUrl: `https://i.pravatar.cc/150?u=${email}`,
                    skills: [],
                    resumeUrl: '',
                    expectedSalary: 0,
                    appliedJobs: [],
                    jobAlertsEnabled: false,
                    jobAlertsPreferences: { keywords: [], jobTypes: [], locationTypes: [], minSalary: 0 }
                };
                // FIX: Use v8 firestore syntax
                await db.collection('seekers').doc(user.uid).set(newSeeker);
                newUserProfile = newSeeker;
            } else { // company
                const newCompany: Company = {
                    id: user.uid,
                    name: email.split('@')[0],
                    email,
                    logo: `https://i.pravatar.cc/150?u=${email}`,
                    description: '',
                    website: '',
                    contactInfo: '',
                    officeAddress: '',
                    reviews: [],
                    jobs: [],
                };
                 // FIX: Use v8 firestore syntax
                await db.collection('companies').doc(user.uid).set(newCompany);
                newUserProfile = newCompany;
            }
            return newUserProfile;
        }
        // For other errors (e.g., wrong password), re-throw
        throw error;
    }
  },

  logout: async () => {
    // FIX: Use v8 auth syntax
    await auth.signOut();
  },
  
  // Fetches a user's profile from 'seekers' or 'companies' collections
  getUserProfile: async (uid: string): Promise<{ user: User; role: UserRole } | null> => {
      // FIX: Use v8 firestore syntax
      const seekerRef = db.collection('seekers').doc(uid);
      const seekerSnap = await seekerRef.get();
      if (seekerSnap.exists) {
          return { user: fromDoc(seekerSnap) as JobSeeker, role: 'seeker' };
      }

      const companyRef = db.collection('companies').doc(uid);
      const companySnap = await companyRef.get();
      if (companySnap.exists) {
          return { user: fromDoc(companySnap) as Company, role: 'company' };
      }
      
      const adminRef = db.collection('admins').doc(uid);
      const adminSnap = await adminRef.get();
      if (adminSnap.exists) {
          return { user: fromDoc(adminSnap) as Admin, role: 'admin' };
      }

      return null;
  },

  // --- DATA FETCHING ---
  getSeekers: async (): Promise<JobSeeker[]> => {
      // FIX: Use v8 firestore syntax
      const snapshot = await db.collection('seekers').get();
      return snapshot.docs.map(fromDoc) as JobSeeker[];
  },
  getCompanies: async (): Promise<Company[]> => {
      // FIX: Use v8 firestore syntax
      const snapshot = await db.collection('companies').get();
      return snapshot.docs.map(fromDoc) as Company[];
  },
  getJobs: async (): Promise<Job[]> => {
      // FIX: Use v8 firestore syntax
      const snapshot = await db.collection('jobs').orderBy('title').get();
      return snapshot.docs.map(fromDoc) as Job[];
  },
  getBlogPosts: async (): Promise<BlogPost[]> => {
      // FIX: Use v8 firestore syntax
      const snapshot = await db.collection('blogPosts').orderBy('timestamp', 'desc').get();
      return snapshot.docs.map(fromDoc) as BlogPost[];
  },

  // --- DATA MUTATION ---
  saveSeeker: async (seekerData: JobSeeker): Promise<JobSeeker> => {
      // FIX: Use v8 firestore syntax
      const seekerRef = db.collection('seekers').doc(seekerData.id);
      const dataToSave = { ...seekerData };

      // Handle file uploads
      dataToSave.photoUrl = await uploadDataUrl(`profile_pictures/${dataToSave.id}`, dataToSave.photoUrl);
      dataToSave.resumeUrl = await uploadDataUrl(`resumes/${dataToSave.id}`, dataToSave.resumeUrl);

      await seekerRef.set(dataToSave, { merge: true });
      const updatedSnap = await seekerRef.get();
      return fromDoc(updatedSnap) as JobSeeker;
  },
  
  saveCompany: async (companyData: Company): Promise<Company> => {
      // FIX: Use v8 firestore syntax
      const companyRef = db.collection('companies').doc(companyData.id);
      const dataToSave = { ...companyData };
      
      // Handle logo upload
      dataToSave.logo = await uploadDataUrl(`logos/${dataToSave.id}`, dataToSave.logo);

      await companyRef.set(dataToSave, { merge: true });
      const updatedSnap = await companyRef.get();
      return fromDoc(updatedSnap) as Company;
  },

  addReview: async(companyId: string, review: Omit<Review, 'id' | 'date'>): Promise<Company> => {
      // FIX: Use v8 firestore syntax
      const companyRef = db.collection('companies').doc(companyId);
      const newReview = { 
          ...review, 
          id: db.collection('dummy').doc().id, // Generate a unique ID
          date: new Date().toISOString() 
      };
      await companyRef.update({ reviews: firebase.firestore.FieldValue.arrayUnion(newReview) });
      const updatedCompanySnap = await companyRef.get();
      return fromDoc(updatedCompanySnap) as Company;
  },

  saveJob: async(jobData: Job | Omit<Job, 'id' | 'applicants' | 'shortlisted' | 'rejected'>): Promise<Job> => {
    // FIX: Use v8 firestore syntax
    if ('id' in jobData && jobData.id) { // Update
        const jobRef = db.collection('jobs').doc(jobData.id);
        await jobRef.update({ ...jobData });
        const updatedSnap = await jobRef.get();
        return fromDoc(updatedSnap) as Job;
    } else { // Create
        const newJobData = {
            ...jobData,
            applicants: [],
            shortlisted: [],
            rejected: []
        };
        const docRef = await db.collection('jobs').add(newJobData);
        const newSnap = await docRef.get();
        return fromDoc(newSnap) as Job;
    }
  },
  
  addBlogPost: async(postData: Omit<BlogPost, 'id' | 'timestamp' | 'reactions' | 'comments'>): Promise<BlogPost> => {
      // FIX: Use v8 firestore syntax
      const newPostData = {
          ...postData,
          timestamp: firebase.firestore.Timestamp.now(),
          reactions: [],
          comments: [],
      };
      const docRef = await db.collection('blogPosts').add(newPostData);
      const newSnap = await docRef.get();
      return fromDoc(newSnap) as BlogPost;
  },
  
  updateBlogPost: async(postId: string, content: string): Promise<BlogPost> => {
    // FIX: Use v8 firestore syntax
    const postRef = db.collection('blogPosts').doc(postId);
    await postRef.update({ content });
    return fromDoc(await postRef.get()) as BlogPost;
  },
  
  addOrUpdateReaction: async(postId: string, userId: string, type: ReactionType): Promise<BlogPost> => {
    // FIX: Use v8 firestore syntax
    const postRef = db.collection('blogPosts').doc(postId);
    const postSnap = await postRef.get();
    const post = fromDoc(postSnap) as BlogPost;

    const existingReaction = post.reactions.find(r => r.userId === userId);
    if (existingReaction) {
        // If it's the same reaction, remove it. Otherwise, update it.
        const reactionToRemove = { ...existingReaction };
        await postRef.update({ reactions: firebase.firestore.FieldValue.arrayRemove(reactionToRemove) });
        if (existingReaction.type !== type) {
            await postRef.update({ reactions: firebase.firestore.FieldValue.arrayUnion({ userId, type }) });
        }
    } else {
        await postRef.update({ reactions: firebase.firestore.FieldValue.arrayUnion({ userId, type }) });
    }
    return fromDoc(await postRef.get()) as BlogPost;
  },

  addComment: async(postId: string, commentData: Omit<Comment, 'id' | 'timestamp'>): Promise<BlogPost> => {
    // FIX: Use v8 firestore syntax
    const postRef = db.collection('blogPosts').doc(postId);
    const newComment = {
      ...commentData,
      id: db.collection('dummy').doc().id,
      timestamp: new Date().toISOString()
    };
    await postRef.update({ comments: firebase.firestore.FieldValue.arrayUnion(newComment) });
    return fromDoc(await postRef.get()) as BlogPost;
  },

  updateComment: async(postId: string, commentId: string, content: string): Promise<BlogPost> => {
    // FIX: Use v8 firestore syntax
    const postRef = db.collection('blogPosts').doc(postId);
    const postSnap = await postRef.get();
    const post = fromDoc(postSnap) as BlogPost;
    const updatedComments = post.comments.map(c => c.id === commentId ? { ...c, content } : c);
    await postRef.update({ comments: updatedComments });
    // Re-fetch the entire post to ensure data consistency
    const updatedSnap = await postRef.get();
    return fromDoc(updatedSnap) as BlogPost;
  },

  deleteComment: async(postId: string, commentId: string): Promise<BlogPost> => {
    // FIX: Use v8 firestore syntax
    const postRef = db.collection('blogPosts').doc(postId);
    const postSnap = await postRef.get();
    const post = fromDoc(postSnap) as BlogPost;
    const commentToDelete = post.comments.find(c => c.id === commentId);
    if (commentToDelete) {
        await postRef.update({ comments: firebase.firestore.FieldValue.arrayRemove(commentToDelete) });
    }
    return fromDoc(await postRef.get()) as BlogPost;
  },

  // --- ADMIN ACTIONS ---
  deleteEntity: async(type: 'job' | 'company' | 'seeker' | 'blogPost', id: string): Promise<boolean> => {
    const collectionName = type === 'blogPost' ? 'blogPosts' : `${type}s`;
    // FIX: Use v8 firestore syntax
    await db.collection(collectionName).doc(id).delete();
    
    // If a company is deleted, delete its jobs as well
    if (type === 'company') {
        const jobsQuery = db.collection('jobs').where('companyId', '==', id);
        const jobsSnapshot = await jobsQuery.get();
        for (const jobDoc of jobsSnapshot.docs) {
            await jobDoc.ref.delete();
        }
    }
    return true;
  }
};