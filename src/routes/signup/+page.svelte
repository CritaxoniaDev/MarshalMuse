<script>
	import { initializeApp } from 'firebase/app';
	import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth';
	import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

	let fullName = '';
	let email = '';
	let password = '';
	let profileImage = '';

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
		} catch (error) {
			console.error('Error during signup:', error);
		}
	}
</script>

<div class="pt-20 flex items-center justify-center">
	<div
		class="max-w-md w-full p-8 bg-white rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] space-y-8"
	>
		<div class="text-center space-y-2">
			<h2 class="text-4xl font-extrabold tracking-tight text-gray-900">Create an account</h2>
			<p class="text-sm text-gray-600">Join our community of developers</p>
		</div>

		<div class="space-y-6">
			<div class="space-y-5">
				<div class="space-y-4">
					<label for="profile" class="text-sm font-medium text-gray-700">Profile Picture</label>
					<div class="flex items-center gap-6">
						<div class="relative group">
							{#if profileImage}
								<img
									src={profileImage}
									alt="Profile Preview"
									class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg transform transition-transform group-hover:scale-105"
								/>
								<div
									class="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
								>
									<span class="text-white text-sm">Change</span>
								</div>
							{:else}
								<div
									class="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center"
								>
									<svg
										class="w-8 h-8 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
							{/if}
						</div>

						<div class="flex-1">
							<label
								for="profile"
								class="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-200 border-dashed rounded-xl hover:border-blue-400 hover:bg-gray-50 cursor-pointer group"
							>
								<div class="flex flex-col items-center justify-center pt-7">
									<svg
										class="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									<p
										class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-blue-500 transition-colors"
									>
										Select a photo
									</p>
								</div>
								<input
									id="profile"
									type="file"
									accept="image/*"
									on:change={handleImageUpload}
									class="hidden"
								/>
							</label>
						</div>
					</div>
				</div>
				<div class="space-y-2">
					<label for="name" class="text-sm font-medium text-gray-700">Full name</label>
					<input
						id="name"
						type="text"
						bind:value={fullName}
						class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
					/>
				</div>
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
					<label for="password" class="text-sm font-medium text-gray-700">Password</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
					/>
				</div>
				<button
					on:click={handleSignUp}
					class="w-full py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transform hover:translate-y-[-2px] transition-all duration-200 hover:shadow-lg"
				>
					Create account
				</button>
			</div>
		</div>

		<div class="text-center">
			<a
				href="/login"
				class="text-sm cursor-pointer font-medium text-blue-600 hover:text-blue-800 hover:underline decoration-2 underline-offset-2"
			>
				Already have an account? Sign in →
			</a>
		</div>
	</div>
</div>
