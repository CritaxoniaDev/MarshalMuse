<script>
	import { Zap, ArrowRight, Code2, GitBranch, Rocket, Terminal, Box, Cpu } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import imagePage from '$lib/assets/image-page.png';

	const features = [
		{
			icon: Code2,
			title: 'Code Analysis',
			desc: 'Smart insights and recommendations for your codebase',
			color: 'blue'
		},
		{
			icon: GitBranch,
			title: 'Version Control',
			desc: 'Seamless integration with your favorite VCS',
			color: 'green'
		},
		{
			icon: Rocket,
			title: 'CI/CD Pipeline',
			desc: 'Automated workflows for continuous delivery',
			color: 'red'
		}
	];
</script>

<svelte:head>
	<!-- Add Rampart One Google Font -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link href="https://fonts.googleapis.com/css2?family=Rampart+One&display=swap" rel="stylesheet" />
</svelte:head>

<main class="bg-white">
	<!-- Hero Section -->
	<div class="py-24 container mx-auto relative">
		<!-- Decorative SVG elements -->
		<svg
			class="absolute top-0 right-0 text-blue-100 w-64 h-64 -z-10 opacity-70"
			viewBox="0 0 200 200"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill="currentColor"
				d="M42.8,-65.2C54.9,-56.3,63.7,-43.2,70.1,-28.8C76.4,-14.4,80.3,1.3,76.7,15.1C73.1,28.9,62,40.8,49.3,50.1C36.6,59.4,22.3,66.1,6.2,69.5C-9.9,72.9,-27.8,73,-42.3,65.5C-56.8,58,-67.9,42.9,-74.1,26.1C-80.3,9.3,-81.5,-9.2,-75.6,-24.8C-69.7,-40.4,-56.7,-53.1,-42.4,-61.3C-28.1,-69.5,-12.6,-73.2,1.9,-76C16.5,-78.8,30.7,-74.1,42.8,-65.2Z"
				transform="translate(100 100)"
			/>
		</svg>

		<svg
			class="absolute bottom-0 left-0 text-yellow-100 w-72 h-72 -z-10 opacity-70"
			viewBox="0 0 200 200"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill="currentColor"
				d="M47.7,-73.2C62.1,-65.3,74.5,-52.1,79.4,-36.9C84.3,-21.6,81.8,-4.3,77.8,11.9C73.8,28.1,68.3,43.2,57.8,54.8C47.3,66.4,31.8,74.5,15.4,77.9C-1,81.4,-18.3,80.2,-33.8,73.5C-49.3,66.8,-63,54.6,-71.5,39.5C-80,24.4,-83.3,6.4,-80.3,-10.2C-77.3,-26.8,-68,-42,-55.6,-51.5C-43.2,-61,-21.6,-64.8,-1.9,-62.2C17.8,-59.6,33.3,-81.1,47.7,-73.2Z"
				transform="translate(100 100)"
			/>
		</svg>

		<!-- Code-like SVG pattern -->
		<svg
			class="absolute left-1/4 top-1/3 w-32 h-32 text-gray-100 -z-10 opacity-60"
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect x="0" y="0" width="100" height="10" fill="currentColor" />
			<rect x="0" y="20" width="80" height="10" fill="currentColor" />
			<rect x="0" y="40" width="60" height="10" fill="currentColor" />
			<rect x="0" y="60" width="90" height="10" fill="currentColor" />
			<rect x="0" y="80" width="40" height="10" fill="currentColor" />
		</svg>

		<div class="max-w-6xl mx-auto px-4 relative">
			<!-- Small decorative dots -->
			<div class="absolute right-10 top-20 flex space-x-2">
				<div class="w-2 h-2 rounded-full bg-blue-400"></div>
				<div class="w-2 h-2 rounded-full bg-green-400"></div>
				<div class="w-2 h-2 rounded-full bg-red-400"></div>
			</div>

			<div class="absolute left-10 bottom-10 flex space-x-2">
				<div class="w-3 h-3 rounded-full bg-yellow-400"></div>
				<div class="w-3 h-3 rounded-full bg-purple-400"></div>
				<div class="w-3 h-3 rounded-full bg-pink-400"></div>
			</div>

			<div class="flex flex-col items-center text-center mb-16 relative">
				<!-- Decorative circuit-like SVG -->
				<svg
					class="absolute -top-10 -right-20 w-40 h-40 text-gray-100 -z-10"
					viewBox="0 0 100 100"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle cx="50" cy="50" r="5" fill="currentColor" />
					<path d="M50,50 L80,50" stroke="currentColor" stroke-width="2" />
					<path d="M50,50 L50,80" stroke="currentColor" stroke-width="2" />
					<path d="M50,50 L20,20" stroke="currentColor" stroke-width="2" />
					<circle cx="80" cy="50" r="3" fill="currentColor" />
					<circle cx="50" cy="80" r="3" fill="currentColor" />
					<circle cx="20" cy="20" r="3" fill="currentColor" />
				</svg>

				<span
					class="px-4 py-1.5 bg-yellow-400 text-sm font-semibold rounded-full transform rotate-2 shadow-sm mb-6 relative"
				>
					New
					<!-- Small decorative sparkles -->
					<svg
						class="absolute -top-2 -right-2 w-4 h-4 text-yellow-600"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" fill="currentColor" />
					</svg>
				</span>

				<h1
					class="text-6xl font-extrabold tracking-tighter mb-8 leading-tight rampart-font max-w-4xl relative"
				>
					Build Better Software
					<span class="text-blue-600 relative">
						Faster
						<span class="absolute bottom-0 left-0 w-full h-3 bg-blue-200/50"></span>
					</span>
					<Zap
						class="inline text-yellow-400 ml-2 transform hover:rotate-12 transition-transform"
						size={36}
					/>

					<!-- Decorative code brackets -->
					<svg
						class="absolute -left-12 top-1/2 transform -translate-y-1/2 w-8 h-16 text-gray-200"
						viewBox="0 0 24 64"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M16,0 C8,16 8,48 16,64" stroke="currentColor" stroke-width="4" fill="none" />
					</svg>
					<svg
						class="absolute -right-12 top-1/2 transform -translate-y-1/2 w-8 h-16 text-gray-200"
						viewBox="0 0 24 64"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M8,0 C16,16 16,48 8,64" stroke="currentColor" stroke-width="4" fill="none" />
					</svg>
				</h1>

				<div class="text-2xl mb-12 max-w-4xl mx-auto relative">
					<!-- Decorative curved line -->
					<svg
						class="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-6 text-gray-200"
						viewBox="0 0 100 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M0,10 C30,0 70,0 100,10" stroke="currentColor" stroke-width="2" fill="none" />
					</svg>

					<div
						class="flex flex-wrap justify-center items-center gap-3 mb-6 p-4 rounded-lg bg-white shadow-sm border border-gray-100 relative"
					>
						<!-- Small decorative gear -->
						<svg
							class="absolute -top-3 -right-3 w-6 h-6 text-gray-300 animate-spin"
							style="animation-duration: 10s;"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill="currentColor"
								d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
							/>
						</svg>

						<span class="text-purple-600 font-bold">Modern</span>
						<span class="text-blue-500 font-bold hover:animate-pulse">tools</span>
						<Terminal class="w-6 h-6 text-gray-800" />
						<span class="text-green-500 font-bold">for</span>
						<span class="text-red-500 font-bold">modern</span>
						<Code2 class="w-6 h-6 text-gray-800" />
						<span class="text-yellow-600 font-bold">developers.</span>
					</div>

					<div
						class="flex flex-wrap justify-center items-center gap-3 p-4 rounded-lg bg-white shadow-sm border border-gray-100 relative"
					>
						<!-- Small decorative lightning bolt -->
						<svg
							class="absolute -bottom-3 -left-3 w-6 h-6 text-blue-300"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path fill="currentColor" d="M11,15H6L13,1V9H18L11,23V15Z" />
						</svg>

						<span class="text-pink-500 font-bold">Streamline</span>
						<span class="text-indigo-600 font-bold">your</span>
						<Box class="w-6 h-6 text-gray-800" />
						<span class="text-teal-500 font-bold">workflow</span>
						<span class="text-orange-500 font-bold">with</span>
						<Cpu class="w-6 h-6 text-gray-800" />
						<span class="text-blue-600 font-bold">our</span>
						<span class="text-violet-600 font-bold">suite</span>
						<span class="text-emerald-500 font-bold">of</span>
						<span class="text-rose-600 font-bold">powerful</span>
						<span class="text-cyan-600 font-bold">development</span>
						<span class="text-amber-600 font-bold">tools.</span>
					</div>

					<!-- Connecting line between text blocks -->
					<svg
						class="absolute left-1/2 transform -translate-x-1/2 h-6 w-4 text-gray-300"
						style="top: 50%; margin-top: -3px;"
						viewBox="0 0 4 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<line
							x1="2"
							y1="0"
							x2="2"
							y2="24"
							stroke="currentColor"
							stroke-width="2"
							stroke-dasharray="4 2"
						/>
					</svg>
				</div>

				<div class="flex flex-wrap justify-center gap-6 relative">
					<!-- Decorative arrow pointing to buttons -->
					<svg
						class="absolute -top-10 left-1/2 transform -translate-x-1/2 w-8 h-8 text-gray-300"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill="currentColor"
							d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"
						/>
					</svg>

					<Button
						variant="default"
						size="lg"
						class="flex items-center gap-2 px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 transition duration-300 hover:shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:translate-y-[-4px] relative"
					>
						Get Started <ArrowRight size={20} />
						<!-- Small decorative dots -->
						<span class="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"></span>
						<span class="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"></span>
						<span class="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full"></span>
						<span class="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full"></span>
					</Button>

					<Button
						variant="outline"
						size="lg"
						class="px-8 py-6 border-2 border-gray-800 bg-white text-gray-800 transition duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:translate-y-[-4px] hover:border-black hover:text-black relative"
					>
						View Docs
						<!-- Small decorative corner -->
						<svg
							class="absolute top-0 right-0 w-4 h-4 text-gray-300"
							viewBox="0 0 16 16"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path fill="currentColor" d="M0,0 L16,0 L16,16 Z"></path>
						</svg>
					</Button>
				</div>
			</div>

			<!-- Decorative grid pattern -->
			<svg
				class="absolute bottom-0 right-0 w-40 h-40 text-gray-100 -z-10"
				viewBox="0 0 100 100"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke="currentColor" stroke-width="0.5" fill="none" d="M0,0 L100,0 L100,100 L0,100 Z"
				></path>
				<path stroke="currentColor" stroke-width="0.5" fill="none" d="M20,0 L20,100"></path>
				<path stroke="currentColor" stroke-width="0.5" fill="none" d="M40,0 L40,100"></path>
				<path stroke="currentColor" stroke-width="0.5" fill="none" d="M60,0 L60,100"></path>
				<path stroke="currentColor" stroke-width="0.5" fill="none" d="M80,0 L80,100"></path>
				<path stroke="currentColor" stroke-width="0.5" fill="none" d="M0,20 L100,20"></path>
				<path stroke="currentColor" stroke-width="0.5" fill="none" d="M0,40 L100,40"></path>
				<path stroke="currentColor" stroke-width="0.5" fill="none" d="M0,60 L100,60"></path>
				<path stroke="currentColor" stroke-width="0.5" fill="none" d="M0,80 L100,80"></path>
			</svg>
		</div>
	</div>

	<!-- Features Section -->
	<div class="container mx-auto px-4 py-24 border-t border-gray-100">
		<h2 class="text-4xl font-bold text-center mb-16 rampart-font">Powerful Features</h2>
		<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
			{#each features as feature, i}
				<Card.Root
					class="transition duration-300 hover:-translate-y-3 hover:shadow-xl border border-gray-200 overflow-hidden"
				>
					<div
						class="absolute top-0 left-0 w-full h-1"
						class:bg-blue-500={feature.color === 'blue'}
						class:bg-green-500={feature.color === 'green'}
						class:bg-red-500={feature.color === 'red'}
					></div>
					<Card.Header>
						<div
							class="w-14 h-14 rounded-full flex items-center justify-center mb-4"
							class:bg-blue-100={feature.color === 'blue'}
							class:bg-green-100={feature.color === 'green'}
							class:bg-red-100={feature.color === 'red'}
						>
							<svelte:component
								this={feature.icon}
								size={28}
								class={feature.color === 'blue'
									? 'text-blue-600'
									: feature.color === 'green'
										? 'text-green-600'
										: 'text-red-600'}
							/>
						</div>
						<Card.Title class="text-2xl font-semibold">
							{feature.title}
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600 text-lg">{feature.desc}</p>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>

	<!-- CTA Section -->
	<div class="container mx-auto px-4 py-24 border-t border-gray-100">
		<div class="max-w-4xl mx-auto text-center">
			<Card.Root class="border-0 shadow-lg p-8">
				<Card.Header>
					<Card.Title class="text-4xl font-bold mb-4 rampart-font">
						Ready to Transform Your Development?
					</Card.Title>
					<Card.Description class="text-xl text-gray-600 mb-8">
						Join thousands of developers who are shipping better code faster.
					</Card.Description>
				</Card.Header>
				<Card.Content class="flex justify-center">
					<Button
						variant="default"
						size="lg"
						class="inline-flex items-center gap-2 px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
					>
						Start Free Trial <ArrowRight size={20} />
					</Button>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</main>

<style>
	.rampart-font {
		font-family: 'Rampart One', cursive;
		letter-spacing: -0.02em;
	}

	@keyframes float {
		0% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	.animate-float {
		animation: float 6s ease-in-out infinite;
	}

	.animate-pulse {
		animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 0.2;
		}
	}
</style>
