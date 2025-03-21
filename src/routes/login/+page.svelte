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
    import { ArrowRight, Loader2 } from 'lucide-svelte';
    
    // Import shadcn components
    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Alert, AlertDescription } from '$lib/components/ui/alert';
    import { Separator } from '$lib/components/ui/separator';

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

<svelte:head>
    <title>Sign In | MarshalMuse</title>
</svelte:head>

<div class="fixed inset-0 flex items-center justify-center bg-white">
    <div class="w-full max-w-md relative">
        <!-- Decorative elements -->
        <div class="absolute -top-6 -right-6 w-12 h-12 bg-blue-100 rounded-full opacity-70 z-0"></div>
        <div class="absolute -bottom-6 -left-6 w-12 h-12 bg-yellow-100 rounded-full opacity-70 z-0"></div>
        
        <Card.Root class="border-0 shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]">
            <Card.Header class="space-y-1">
                <div class="flex justify-center">
                    <div class="w-12 h-1 bg-blue-600 rounded-full mb-2"></div>
                </div>
                <Card.Title class="text-3xl font-extrabold tracking-tight text-center">
                    Welcome back
                </Card.Title>
                <Card.Description class="text-center text-gray-600">
                    Sign in to your account to continue
                </Card.Description>
            </Card.Header>
            
            <Card.Content class="space-y-4 pt-4">
                {#if error}
                    <Alert variant="destructive" class="border-red-200 bg-red-50 text-red-700">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                {/if}
                
                <!-- Google Sign In Button -->
                <Button 
                    variant="outline" 
                    class="w-full py-5 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                    on:click={handleGoogleLogin}
                    disabled={loading}
                >
                    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                </Button>
                
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <Separator class="w-full" />
                    </div>
                    <div class="relative flex justify-center text-xs uppercase">
                        <span class="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <div class="space-y-1">
                        <Label for="email" class="text-sm font-medium">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            bind:value={email}
                            class="h-11 px-4 bg-gray-50 border-gray-200 focus:border-blue-600 focus:ring-blue-200"
                        />
                    </div>
                    
                    <div class="space-y-1">
                        <div class="flex items-center justify-between">
                            <Label for="password" class="text-sm font-medium">
                                Password
                            </Label>
                            <a 
                                href="/forgot-password" 
                                class="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            bind:value={password}
                            class="h-11 px-4 bg-gray-50 border-gray-200 focus:border-blue-600 focus:ring-blue-200"
                        />
                    </div>
                    
                    <Button
                        variant="default"
                        size="lg"
                        class="w-full text-white h-11 mt-2 bg-blue-600 hover:bg-blue-700 transform hover:translate-y-[-2px] transition-all duration-200 hover:shadow-lg"
                        on:click={handleLogin}
                        disabled={loading}
                    >
                        {#if loading}
                            <Loader2 class="mr-2 h-5 w-5 animate-spin" />
                            Signing in...
                        {:else}
                            Sign in
                            <ArrowRight class="ml-2 h-5 w-5" />
                        {/if}
                    </Button>
                </div>
            </Card.Content>
            
            <Card.Footer class="flex justify-center border-t pt-4 pb-2">
                <a
                    href="/signup"
                    class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline decoration-2 underline-offset-2 flex items-center"
                >
                    Don't have an account? Sign up
                    <ArrowRight class="ml-1 h-4 w-4" />
                </a>
            </Card.Footer>
        </Card.Root>
        
        <!-- Decorative dots -->
        <div class="absolute top-1/4 -left-4 flex space-x-1">
            <div class="w-1 h-1 rounded-full bg-blue-400"></div>
            <div class="w-1 h-1 rounded-full bg-green-400"></div>
            <div class="w-1 h-1 rounded-full bg-red-400"></div>
        </div>
        
        <div class="absolute bottom-1/4 -right-4 flex space-x-1">
            <div class="w-1 h-1 rounded-full bg-yellow-400"></div>
            <div class="w-1 h-1 rounded-full bg-purple-400"></div>
            <div class="w-1 h-1 rounded-full bg-pink-400"></div>
        </div>
    </div>
</div>

<style>
    /* Optional: Add any custom styles here */
    :global(input:-webkit-autofill),
    :global(input:-webkit-autofill:hover),
    :global(input:-webkit-autofill:focus) {
        -webkit-box-shadow: 0 0 0px 1000px #f9fafb inset;
        transition: background-color 5000s ease-in-out 0s;
    }
</style>
