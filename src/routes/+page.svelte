<script>
	import { ArrowRight, MousePointer, Code2, GitBranch, Rocket } from 'lucide-svelte';
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

<main class="bg-white">
	<!-- Hero Section - Simplified Enterprise Design -->
	<div class="py-24 container mx-auto">
		<div class="max-w-6xl mx-auto px-4">
			<div class="text-center mb-16">
				<h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
					<span class="block">MarshalMuse</span>
					<span class="block text-blue-600 mt-2">Development Platform</span>
				</h1>
				<p class="mt-6 max-w-3xl mx-auto text-xl text-gray-500">
					Streamline your development workflow with our comprehensive suite of tools designed for modern enterprise teams.
				</p>
				<div class="mt-10 flex justify-center gap-6">
					<Button
						variant="default"
						size="lg"
						class="gap-2 rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700"
					>
						<MousePointer size={18} />
						Try It Now
					</Button>
					<Button
						variant="outline"
						size="lg"
						class="gap-2 rounded-full px-8 py-3 border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-all duration-300"
					>
						View Documentation
					</Button>
				</div>
			</div>
			
			<!-- Simple visual element -->
			<div class="flex justify-center mb-16">
				<div class="relative w-full max-w-4xl">
					<div class="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl transform rotate-1"></div>
					<div class="relative bg-white border border-gray-200 rounded-lg shadow-lg p-8 overflow-hidden">
						<div class="grid grid-cols-3 gap-4">
							<div class="h-16 bg-gray-100 rounded-md animate-pulse"></div>
							<div class="h-16 col-span-2 bg-gray-100 rounded-md"></div>
							<div class="h-16 col-span-2 bg-gray-100 rounded-md"></div>
							<div class="h-16 bg-gray-100 rounded-md animate-pulse"></div>
							<div class="h-16 bg-gray-100 rounded-md"></div>
							<div class="h-16 col-span-2 bg-gray-100 rounded-md animate-pulse"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Features Section - Simplified -->
	<div class="container mx-auto px-4 py-20 border-t border-gray-100">
		<h2 class="text-3xl font-bold text-center mb-16">Enterprise-Grade Features</h2>
		<div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
			{#each features as feature}
				<Card.Root class="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
					<div
						class="absolute top-0 left-0 w-full h-1"
						class:bg-blue-500={feature.color === 'blue'}
						class:bg-green-500={feature.color === 'green'}
						class:bg-red-500={feature.color === 'red'}
					></div>
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

	<!-- CTA Section - Simplified -->
	<div class="container mx-auto px-4 py-20 border-t border-gray-100">
		<div class="max-w-4xl mx-auto text-center">
			<Card.Root class="border-0 shadow-md bg-gray-50 p-8">
				<Card.Header>
					<Card.Title class="text-3xl font-bold mb-4">
						Ready to Transform Your Development Workflow?
					</Card.Title>
					<Card.Description class="text-lg text-gray-600 mb-8">
						Join thousands of enterprise teams who are shipping better code faster.
					</Card.Description>
				</Card.Header>
				<Card.Content class="flex justify-center">
					<Button
						variant="default"
						size="lg"
						class="gap-2 rounded-full px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
					>
						Start Free Trial <ArrowRight size={20} />
					</Button>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</main>

<style>
	@keyframes pulse {
		0%, 100% {
			opacity: 0.6;
		}
		50% {
			opacity: 0.3;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
