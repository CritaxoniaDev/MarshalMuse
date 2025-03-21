<script>
	import { initializeApp } from 'firebase/app';
	import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { getFirestore, doc, setDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { ArrowRight, Loader2, Upload, User } from 'lucide-svelte';
	
	// Import shadcn components
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Separator } from '$lib/components/ui/separator';
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';

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

	let fullName = '';
	let email = '';
	let password = '';
	let profileImage = '';
	let loading = false;
	let error = '';

	function handleImageUpload(event) {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onloadend = () => {
			profileImage = reader.result; // This will be the base64 string
		};

		if (file) {
			reader.readAsDataURL(file);
		}
	}

	async function handleSignUp() {
		if (!fullName || !email || !password) {
			error = 'Please fill in all required fields';
			return;
		}
		
		loading = true;
		error = '';
		
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			await setDoc(doc(db, 'users', user.uid), {
				fullName,
				email,
				profileImage,
				createdAt: new Date().toISOString(),
				lastLogin: new Date().toISOString()
			});

			goto('/confirmation');
		} catch (err) {
			console.error('Error during signup:', err);
			error = err.message || 'An error occurred during signup';
		} finally {
			loading = false;
		}
	}
	
	async function handleGoogleSignUp() {
		loading = true;
		error = '';
		
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;
			
			// Create or update user document
			await setDoc(doc(db, 'users', user.uid), {
				fullName: user.displayName || '',
				email: user.email,
				profileImage: user.photoURL || '',
				createdAt: new Date().toISOString(),
				lastLogin: new Date().toISOString()
			}, { merge: true });
			
			goto('/confirmation');
		} catch (err) {
			console.error('Error during Google signup:', err);
			error = err.message || 'An error occurred during Google signup';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
    <title>Sign Up | MarshalMuse</title>
</svelte:head>

<div class="fixed inset-0 flex items-center justify-center bg-white">
    <div class="w-full max-w-md relative">
        <!-- Decorative elements -->
        <div class="absolute -top-6 -right-6 w-12 h-12 bg-green-100 rounded-full opacity-70 z-0"></div>
        <div class="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-100 rounded-full opacity-70 z-0"></div>
        
        <Card.Root class="border-0 shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]">
            <Card.Header class="space-y-1">
                <div class="flex justify-center">
                    <div class="w-12 h-1 bg-blue-600 rounded-full mb-2"></div>
                </div>
                <Card.Title class="text-3xl font-extrabold tracking-tight text-center">
                    Create an account
                </Card.Title>
                <Card.Description class="text-center text-gray-600">
                    Join our community of developers
                </Card.Description>
            </Card.Header>
            
            <Card.Content class="space-y-4 pt-4">
                {#if error}
                    <Alert variant="destructive" class="border-red-200 bg-red-50 text-red-700">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                {/if}
                
                <!-- Profile Image Upload -->
                <div class="flex justify-center">
                    <div class="relative group">
                        <input
                            id="profile"
                            type="file"
                            accept="image/*"
                            on:change={handleImageUpload}
                            class="hidden"
                        />
                        <label for="profile" class="cursor-pointer block">
                            {#if profileImage}
                                <Avatar class="w-20 h-20 border-4 border-white shadow-md group-hover:shadow-lg transition-all duration-200">
                                    <AvatarImage src={profileImage} alt="Profile" />
                                    <AvatarFallback class="bg-blue-100 text-blue-600">
                                        <User size={24} />
                                    </AvatarFallback>
                                </Avatar>
                                <div class="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Upload size={20} class="text-white" />
                                </div>
                            {:else}
                                <Avatar class="w-20 h-20 border-4 border-white shadow-md group-hover:shadow-lg transition-all duration-200">
                                    <AvatarFallback class="bg-blue-100 text-blue-600">
                                        <Upload size={24} />
                                    </AvatarFallback>
                                </Avatar>
                            {/if}
                        </label>
                    </div>
                </div>
                
                <div class="space-y-3">
                    <div class="space-y-1">
                        <Label for="name" class="text-sm font-medium">
                            Full name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            bind:value={fullName}
                            class="h-11 px-4 bg-gray-50 border-gray-200 focus:border-blue-600 focus:ring-blue-200"
                        />
                    </div>
                    
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
                        <Label for="password" class="text-sm font-medium">
                            Password
                        </Label>
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
                        on:click={handleSignUp}
                        disabled={loading}
                    >
                        {#if loading}
                            <Loader2 class="mr-2 h-5 w-5 animate-spin" />
                            Creating account...
                        {:else}
                            Create account
                            <ArrowRight class="ml-2 h-5 w-5" />
                        {/if}
                    </Button>
                </div>
            </Card.Content>
            
            <Card.Footer class="flex justify-center border-t pt-4 pb-2">
                <a
                    href="/login"
                    class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline decoration-2 underline-offset-2 flex items-center"
                >
                    Already have an account? Sign in
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
