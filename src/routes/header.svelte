<script>
	import { onMount } from 'svelte';
	import { Menu, X, Github, Search, Sun, Moon, LogOut } from 'lucide-svelte';
	import { spring } from 'svelte/motion';
	import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
	import { page } from '$app/stores';
	import * as Input from '$lib/components/ui/input';
	import * as Button from '$lib/components/ui/button';

	$: isAuthPage = $page.url.pathname === '/login' || $page.url.pathname === '/signup';
	const auth = getAuth();
	let user = null;
	let isMenuOpen = false;
	let isDark = false;
	let y;
	let headerSpring = spring(
		{ y: 0 },
		{
			stiffness: 3.0,
			damping: 1.5
		}
	);

	onMount(() => {
		let prevScrollY = 0;

		window.addEventListener('scroll', () => {
			const currentScrollY = window.scrollY;
			headerSpring.set({ y: currentScrollY < prevScrollY ? 0 : -100 });
			prevScrollY = currentScrollY;
		});

		onAuthStateChanged(auth, (userData) => {
			user = userData;
		});
	});

	onMount(() => {
		onAuthStateChanged(auth, (userData) => {
			user = userData;
		});
	});

	function toggleTheme() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark');
	}

	async function handleSignOut() {
		try {
			await signOut(auth);
			window.location.href = '/';
		} catch (error) {
			console.error('Error signing out:', error);
		}
	}
</script>

<header
	class="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all duration-300"
	style="transform: translateY({$headerSpring.y}px)"
>
	<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a href={user ? '/dashboard' : '/'} class="flex items-center gap-2 group">
				<div
					class="transform transition-transform group-hover:rotate-[-10deg] group-hover:scale-105"
				>
					<svg
						class="w-6 h-6 text-gray-800 dark:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 6h8m-8 4h12M6 14h8m-8 4h12"
						/>
					</svg>
				</div>
				<span class="font-bold text-xl tracking-tight">MarshalMuse</span>
			</a>

			<!-- Mobile Menu Button -->
			<button
				class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
				on:click={() => (isMenuOpen = !isMenuOpen)}
			>
				{#if isMenuOpen}
					<X size={20} />
				{:else}
					<Menu size={20} />
				{/if}
			</button>

			<!-- Desktop Navigation -->
			<div class="hidden lg:flex items-center justify-end flex-1 ml-10">
				<div class="flex items-center gap-4">
					<!-- Search -->
					{#if user}
						<div class="relative w-64">
							<Search
								class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
								size={16}
							/>
							<Input.Root
								type="search"
								placeholder="Search docs..."
								class="pl-10 rounded-full transition-colors"
							/>
						</div>
					{/if}

					{#if user}
						<div class="flex items-center gap-4">
							<a
								href="/dashboard"
								class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
							>
								<img
									src={user.photoURL}
									alt="Profile"
									class="w-8 h-8 rounded-full border-2 border-gray-200"
								/>
								<span class="font-medium">{user.displayName}</span>
							</a>

							<Button.Root
								variant="outline"
								size="sm"
								class="gap-2 cursor-pointer px-4 py-1.5 text-sm transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] border-2"
								on:click={handleSignOut}
							>
								<LogOut size={16} />
								Sign Out
							</Button.Root>
						</div>
					{:else if !isAuthPage}
						<Button.Root
							variant="default"
							size="sm"
							class="gap-2 cursor-pointer px-4 py-1.5 text-sm transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] border-2 border-blue-600"
							on:click={() => (window.location.href = '/login')}
						>
							Sign In
						</Button.Root>
					{/if}

					<!-- Theme Toggle -->
					<button
						class="p-2 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all duration-300 relative overflow-hidden group"
						on:click={toggleTheme}
					>
						<div
							class="relative z-10 transform transition-transform duration-500"
							class:rotate-180={isDark}
						>
							{#if isDark}
								<Sun
									size={16}
									class="text-yellow-500 transform transition-all duration-500 hover:rotate-90"
								/>
							{:else}
								<Moon
									size={16}
									class="text-blue-600 transform transition-all duration-500 hover:-rotate-12"
								/>
							{/if}
						</div>
						<div
							class="absolute inset-0 transform transition-transform duration-300 scale-0 group-hover:scale-100 group-hover:bg-gradient-to-br"
							class:from-yellow-100={!isDark}
							class:to-yellow-200={!isDark}
							class:from-blue-100={isDark}
							class:to-blue-200={isDark}
						></div>
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if isMenuOpen}
			<div class="lg:hidden py-4 transform transition-all duration-300 ease-in-out">
				<div class="flex flex-col space-y-3">
					<!-- Search for mobile -->
					<div class="px-4 mb-2">
						<div class="relative">
							<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
							<input
								type="search"
								class="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
								placeholder="Search docs..."
							/>
						</div>
					</div>

					<!-- Mobile Action Buttons -->
					<div class="px-4 pt-2 mt-2 border-t border-gray-100 space-y-2">
						<button
							class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg border-2 border-gray-200 transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(229,231,235,1)]"
							on:click={() =>
								(window.location.href = 'https://github.com/CritaxoniaDev/MarshalMuse')}
						>
							<Github size={16} /> Star on GitHub
						</button>

						{#if user}
							<div class="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
								<div class="flex items-center gap-3">
									<img
										src={user.photoURL}
										alt="Profile"
										class="w-8 h-8 rounded-full border-2 border-gray-200"
									/>
									<span class="font-medium text-gray-700">{user.displayName}</span>
								</div>
							</div>
							<button
								class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg border-2 border-gray-200 hover:text-red-600 transition-all duration-200"
								on:click={handleSignOut}
							>
								<LogOut size={16} /> Sign Out
							</button>
						{:else}
							<button
								class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg border-2 border-blue-600 transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]"
								on:click={() => (window.location.href = '/login')}
							>
								Sign In
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</nav>
</header>

<div class="h-16"><!-- Spacer to prevent content jump --></div>
