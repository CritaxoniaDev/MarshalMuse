<script>
    import { initializeApp } from 'firebase/app';
    import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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
    const provider = new GoogleAuthProvider();

    async function signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                goto('/dashboard');
            }
        } catch (error) {
            console.log('Sign-in error:', error);
        }
    }
</script>

<div class="pt-20 flex items-center justify-center">
    <div class="max-w-md w-full p-8 bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] space-y-8">
        <div class="text-center space-y-2">
            <h2 class="text-4xl font-extrabold tracking-tight text-gray-900">Welcome back</h2>
            <p class="text-sm text-gray-600">Sign in to your account to continue</p>
        </div>

        <div class="space-y-6">
            <button
                on:click={signInWithGoogle}
                class="w-full flex cursor-pointer items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] group"
            >
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" class="transform transition-transform group-hover:scale-110">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span class="font-medium">Continue with Google</span>
            </button>

            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
                </div>
            </div>

            <div class="space-y-5">
                <div class="space-y-2">
                    <label for="email" class="text-sm font-medium text-gray-700">Email address</label>
                    <input
                        id="email"
                        type="email"
                        class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    />
                </div>
                <div class="space-y-2">
                    <label for="password" class="text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    />
                </div>                
                <button
                    class="w-full py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transform hover:translate-y-[-2px] transition-all duration-200 hover:shadow-lg"
                >
                    Sign in
                </button>
            </div>
        </div>

        <div class="text-center">
            <a href="/signup" class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline decoration-2 underline-offset-2">
                Don't have an account? Sign up →
            </a>
        </div>
    </div>
</div>

