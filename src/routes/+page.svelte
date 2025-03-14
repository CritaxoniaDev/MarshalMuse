<script>
	import { Zap, ArrowRight, Code2, GitBranch, Rocket, Terminal, Box, Cpu } from 'lucide-svelte';
	// Import your svelte logo
	import * as Card from "$lib/components/ui/card";
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

<main class="bg-white">
	<!-- Hero Section -->
	<div class="py-20">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
				<div class="relative">
					<span
						class="absolute -top-3 -left-3 px-4 py-1.5 bg-yellow-400 text-sm font-semibold rounded-full transform rotate-2 shadow-sm"
					>
						New
					</span>
					<h1 class="text-6xl font-extrabold tracking-tighter mb-8 leading-tight">
						Build Better Software
						<span class="text-blue-600 relative">
							Faster
							<span class="absolute bottom-0 left-0 w-full h-2 bg-blue-200/50"></span>
						</span>
						<Zap
							class="inline text-yellow-400 ml-2 transform hover:rotate-12 transition-transform"
							size={36}
						/>
					</h1>

					<p
						class="text-2xl mb-10 tracking-tighter flex flex-wrap items-center gap-2"
					>
						<span class="text-purple-600 font-bold ">Modern</span>
						<span class="text-blue-500 font-bold hover:animate-pulse">tools</span>
						<Terminal class="w-6 h-6 text-gray-800" />
						<span class="text-green-500 font-bold ">for</span>
						<span class="text-red-500 font-bold">modern</span>
						<Code2 class="w-6 h-6 text-gray-800" />
						<span class="text-yellow-600 font-bold ">developers.</span>
						<br />
						<span class="text-pink-500 font-bold">Streamline</span>
						<span class="text-indigo-600 font-bold ">your</span>
						<Box class="w-6 h-6 text-gray-800" />
						<span class="text-teal-500 font-bold">workflow</span>
						<span class="text-orange-500 font-bold ">with</span>
						<Cpu class="w-6 h-6 text-gray-800" />
						<span class="text-blue-600 font-bold">our</span>
						<span class="text-violet-600 font-bold ">suite</span>
						<span class="text-emerald-500 font-bold">of</span>
						<span class="text-rose-600 font-bold">powerful</span>
						<span class="text-cyan-600 font-bold">development</span>
						<span class="text-amber-600 font-bold ">tools.</span>
					</p>
					<div class="flex gap-6">
						<button
							class="flex items-center cursor-pointer gap-2 px-8 py-4 bg-blue-600 text-white rounded-md border-2 border-blue-600 transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]"
						>
							Get Started <ArrowRight size={20} />
						</button>
						<button
							class="px-8 py-4 cursor-pointer border-2 border-gray-800 rounded-md bg-white text-gray-800 transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:border-black hover:text-black"
						>
							View Docs
						</button>
					</div>
				</div>
				<div class="relative">
					<div
						class="p-10 bg-white rounded-3xl shadow-xl transform"
					>
						<div
							class="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-50"
						></div>
						<div
							class="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-100 rounded-full opacity-50"
						></div>
						<img src={imagePage} alt="Developer Tools" class="w-full h-auto animate-float relative z-10" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Features Section -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each features as feature}
				<Card.Root class="transition duration-300 hover:-translate-y-1">
					<Card.Header>
						<div
							class="w-12 h-12 rounded-full flex items-center justify-center mb-4"
							class:bg-blue-100={feature.color === 'blue'}
							class:bg-green-100={feature.color === 'green'}
							class:bg-red-100={feature.color === 'red'}
						>
							<svelte:component
								this={feature.icon}
								size={24}
								class={feature.color === 'blue'
									? 'text-blue-600'
									: feature.color === 'green'
									? 'text-green-600'
									: 'text-red-600'}
							/>
						</div>
						<Card.Title class="text-xl font-semibold">
							{feature.title}
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600">{feature.desc}</p>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>

	<!-- CTA Section -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="text-center max-w-3xl mx-auto">
			<h2 class="text-3xl font-bold mb-6">Ready to Transform Your Development?</h2>
			<p class="text-xl text-gray-600 mb-8">
				Join thousands of developers who are shipping better code faster.
			</p>
			<button
				class="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				Start Free Trial <ArrowRight size={20} />
			</button>
		</div>
	</div>
</main>

<style>
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
</style>
