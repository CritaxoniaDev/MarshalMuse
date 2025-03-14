<script>
    import { initializeApp } from 'firebase/app';
    import { 
        getAuth, 
        signInWithEmailAndPassword, 
        GoogleAuthProvider, 
        signInWithPopup 
    } from 'firebase/auth';
    import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
    import { goto } from '$app/navigation';

    const firebaseConfig = {
        apiKey: 'AIzaSyBt9XLOdRcGAx50Bj5Aija7CI1h_RAG9YU',
        authDomain: 'marshalmuse.firebaseapp.com',
        projectId: 'marshalmuse',
        storageBucket: 'marshalmuse.firebasestorage.app',
        messagingSenderId: '834541278534',
        appId: '1:834541278534:web:c75589edf2c6803c680147',
        measurementId: 'G-588YTT2CKP'
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const googleProvider = new GoogleAuthProvider();

    let email = '';
    let password = '';
    let loading = false;
    let error = '';

    // Update user's last login timestamp
    async function updateLastLogin(userId) {
        try {
            const userDocRef = doc(db, 'users', userId);
            await setDoc(userDocRef, {
                lastLogin: serverTimestamp()
            }, { merge: true });
        } catch (err) {
            console.error('Error updating last login:', err);
        }
    }

    async function handleLogin() {
        if (!email || !password) {
            error = 'Please enter both email and password';
            return;
        }
        
        loading = true;
        error = '';
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update last login timestamp
            await updateLastLogin(user.uid);
            
            goto('/dashboard');
        } catch (err) {
            console.error('Error during login:', err);
            error = 'Invalid email or password';
        } finally {
            loading = false;
        }
    }
    
    async function handleGoogleLogin() {
        loading = true;
        error = '';
        
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Update last login timestamp
            await updateLastLogin(user.uid);
            
            goto('/dashboard');
        } catch (err) {
            console.error('Error during Google login:', err);
            error = err.message || 'An error occurred during Google login';
        } finally {
            loading = false;
        }
    }
</script>

<div class="pt-20 flex items-center justify-center">
    <div
        class="max-w-md w-full p-8 bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] space-y-8"
    >
        <div class="text-center space-y-2">
            <h2 class="text-4xl font-extrabold tracking-tight text-gray-900">Welcome back</h2>
            <p class="text-sm text-gray-600">Sign in to your account</p>
        </div>

        {#if error}
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
        {/if}

        <div class="space-y-6">
            <!-- Google Sign In Button -->
            <button
                on:click={handleGoogleLogin}
                disabled={loading}
                class="w-full py-3 px-4 border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
            >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continue with Google
            </button>

            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
            </div>

            <div class="space-y-5">
                <div class="space-y-2">
                    <label for="email" class="text-sm font-medium text-gray-700">Email address</label>
                    <input
                        id="email"
                        type="email"
                        bind:value={email}
                        class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    />
                </div>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <label for="password" class="text-sm font-medium text-gray-700">Password</label>
                        <a href="/forgot-password" class="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <input
                        id="password"
                        type="password"
                        bind:value={password}
                        class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    />
                </div>
                <button
                    on:click={handleLogin}
                    disabled={loading}
                    class="w-full py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transform hover:translate-y-[-2px] transition-all duration-200 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {#if loading}
                        <span class="flex items-center justify-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                        </span>
                    {:else}
                        Sign in
                    {/if}
                </button>
            </div>
        </div>

        <div class="text-center">
            <a
                href="/signup"
                class="text-sm cursor-pointer font-medium text-blue-600 hover:text-blue-800 hover:underline decoration-2 underline-offset-2"
            >
                Don't have an account? Sign up →
            </a>
        </div>
    </div>
</div>

<style>
    /* Optional: Add any custom styles here */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0px 1000px #f9fafb inset;
        transition: background-color 5000s ease-in-out 0s;
    }
</style>
