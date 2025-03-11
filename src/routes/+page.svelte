<script>
	import { Zap, ArrowRight, Code2, GitBranch, Rocket } from 'lucide-svelte';
	// Import your svelte logo
	// import svelteLogo from '$lib/assets/svelte-logo.svg';

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
                    <span class="absolute -top-3 -left-3 px-4 py-1.5 bg-yellow-400 text-sm font-semibold rounded-full transform rotate-2 shadow-sm">
                        New
                    </span>
                    <h1 class="text-6xl font-extrabold tracking-tighter mb-8 leading-tight">
                        Build Better Software 
                        <span class="text-blue-600 relative">
                            Faster
                            <span class="absolute bottom-0 left-0 w-full h-2 bg-blue-200/50"></span>
                        </span>
                        <Zap class="inline text-yellow-400 ml-2 transform hover:rotate-12 transition-transform" size={36} />
                    </h1>
                    <p class="text-2xl text-gray-600 mb-10 tracking-tight leading-relaxed">
                        Modern tools for modern developers. Streamline your workflow with our suite of powerful
                        development tools.
                    </p>
                    <div class="flex gap-6">
                        <button class="flex items-center cursor-pointer gap-2 px-8 py-4 bg-blue-600 text-white rounded-md border-2 border-blue-600 transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
                            Get Started <ArrowRight size={20} />
                        </button>
                        <button class="px-8 py-4 cursor-pointer border-2 border-gray-800 rounded-md bg-white text-gray-800 transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:border-black hover:text-black">
                            View Docs
                        </button>
                    </div>                                     
                </div>
                <div class="relative">
                    <div class="p-10 bg-white rounded-3xl shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                        <div class="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
                        <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-100 rounded-full opacity-50"></div>
                        <!-- <img src={svelteLogo} alt="Developer Tools" class="w-full h-auto animate-float relative z-10" /> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    

	<!-- Features Section -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each features as feature}
				<div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
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
					<h3 class="text-xl font-semibold mb-3">{feature.title}</h3>
					<p class="text-gray-600">{feature.desc}</p>
				</div>
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
