<script>
	import { onMount } from 'svelte';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import {
		Settings,
		Users,
		FileText,
		BarChart,
		Bell,
		Search,
		Kanban,
		GitBranch,
		Workflow,
		Bot,
		Code2,
		Brain,
		Clipboard,
		Database,
		FileCode,
		Hash
	} from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Button from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Carousel from '$lib/components/ui/carousel';

	const auth = getAuth();
	let user = null;
	let activeTab = 'dashboard';

	const devTools = [
		{
			title: 'Kanban Board',
			icon: Kanban,
			description: 'Organize your tasks with drag-and-drop simplicity',
			stats: '12 Active Boards',
			color: 'bg-purple-100 text-purple-600'
		},
		{
			title: 'Flowchart Creator',
			icon: Workflow,
			description: 'Design system architectures and workflows visually',
			stats: '8 Saved Diagrams',
			color: 'bg-blue-100 text-blue-600',
			href: '/app/flowchart-creator'
		},
		{
			title: 'AI Prompt Generator',
			icon: Brain,
			description: 'Generate optimized prompts for AI-assisted development',
			stats: '150+ Prompts Generated',
			color: 'bg-green-100 text-green-600',
			href: '/app/ai-prompt-generator'
		},
		{
			title: 'Base64 Encoder/Decoder',
			icon: FileCode,
			description: 'Convert between base64 and text/images easily',
			stats: '100+ Conversions',
			color: 'bg-amber-100 text-amber-600',
			href: '/app/base64-tool'
		},
		{
			title: 'Hash Generator',
			icon: Hash,
			description: 'Generate MD5, SHA-1, SHA-256, and other hash algorithms',
			stats: '75+ Hashes Generated',
			color: 'bg-red-100 text-red-600',
			href: '/app/hash-generator'
		},
		{
			title: 'Code Snippet Manager',
			icon: Clipboard,
			description: 'Store, organize and share your code snippets at ease',
			stats: '45 Saved Snippets',
			color: 'bg-pink-100 text-pink-600',
			href: '/app/code-snippet-manager'
		},
		{
			title: 'JSON Visualizer',
			icon: FileText,
			description: 'Extract and visualize JSON structure with tree mapping',
			stats: '200+ Mappings',
			color: 'bg-cyan-100 text-cyan-600',
			href: '/app/json-visualizer'
		},
		{
			title: 'Code Generator',
			icon: Code2,
			description: 'Transform designs into production-ready code',
			stats: '1.2k Lines Generated',
			color: 'bg-orange-100 text-orange-600'
		},
		{
			title: 'UML Diagram',
			icon: Workflow,
			description: 'Create professional UML diagrams for your projects',
			stats: '5 Diagram Types',
			color: 'bg-indigo-100 text-indigo-600'
		},
		{
			title: 'ER Diagram',
			icon: Database,
			description: 'Design database schemas with entity-relationship diagrams',
			stats: '10+ Templates',
			color: 'bg-teal-100 text-teal-600'
		}
	];

	onMount(() => {
		onAuthStateChanged(auth, (userData) => {
			if (userData) {
				user = userData;
			} else {
				goto('/');
			}
		});
	});
</script>

<div class="min-h-screen">
	<div class="pt-16 flex">
		<main class="flex-1 p-8">
			<div class="max-w-7xl mx-auto">
				<!-- Welcome Section -->
				<Card.Root class="mb-8">
					<Card.Header>
						<Card.Title class="text-2xl"
							>Welcome back, {user?.displayName || 'Developer'} 👋</Card.Title
						>
						<Card.Description>Your all-in-one development toolkit</Card.Description>
					</Card.Header>
				</Card.Root>

				<!-- Development Tools Carousel -->
				<div class="mb-8">
					<h2 class="text-xl font-semibold mb-6 px-2">Development Tools</h2>

					<Carousel.Root class="w-full">
						<Carousel.Content class="-ml-4">
							{#each devTools as tool, i}
								{@const isComingSoon =
									tool.title === 'Kanban Board' ||
									tool.title === 'Code Generator' ||
									tool.title === 'UML Diagram' ||
									tool.title === 'ER Diagram'}

								<Carousel.Item class="pl-4 md:basis-1/2 lg:basis-1/4">
									<div class="h-full">
										<Card.Root
											class={`h-full transition-all duration-300 ${isComingSoon ? 'relative overflow-hidden' : ''}`}
										>
											{#if isComingSoon}
												<div
													class="absolute -rotate-45 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-1 left-[-40px] top-[20px] w-[170px] text-center text-sm shadow-md z-10"
												>
													COMING SOON
												</div>
												<div
													class="absolute inset-0 bg-gray-100 bg-opacity-40 backdrop-filter backdrop-blur-[1px] z-[1]"
												></div>
											{/if}

											<Card.Header class={`${isComingSoon ? 'opacity-70' : ''} px-5 py-4`}>
												<div class="flex items-center justify-between mb-3">
													<div class={`p-3 rounded-lg ${tool.color}`}>
														<svelte:component this={tool.icon} size={24} />
													</div>
													<Button.Root variant="ghost" size="icon" class="h-8 w-8">
														<Settings size={18} />
													</Button.Root>
												</div>
												<Card.Title class="text-lg font-semibold mb-2">{tool.title}</Card.Title>
												<Card.Description class="text-sm leading-relaxed"
													>{tool.description}</Card.Description
												>
											</Card.Header>

											<Card.Content class="px-5 pb-5">
												<div class="flex items-center justify-between">
													<span class="text-sm font-medium">
														{#if isComingSoon}
															<span class="flex items-center gap-1">
																<span class="relative flex h-2 w-2">
																	<span
																		class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"
																	></span>
																	<span
																		class="relative inline-flex rounded-full h-2 w-2 bg-purple-500"
																	></span>
																</span>
																Launching Soon
															</span>
														{:else}
															{tool.stats}
														{/if}
													</span>

													{#if isComingSoon}
														<Button.Root
															variant="outline"
															size="sm"
															disabled={true}
															class="gap-2 px-5 py-2 text-sm border-2 opacity-70 cursor-not-allowed relative z-[2]"
														>
															<span class="flex items-center gap-1">
																<svg
																	class="w-4 h-4"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		stroke-width="2"
																		d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
																	></path>
																</svg>
																Get Early Access
															</span>
														</Button.Root>
													{:else}
														<Button.Root
															variant="outline"
															size="sm"
															class="gap-2 cursor-pointer px-5 py-2 text-sm transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] border-2"
															on:click={() => goto(tool.href)}
														>
															Open Tool
														</Button.Root>
													{/if}
												</div>
											</Card.Content>
										</Card.Root>
									</div>
								</Carousel.Item>
							{/each}
						</Carousel.Content>

						<div class="flex justify-center mt-4 gap-2">
							<Carousel.Previous
								class="relative left-0 translate-x-0 bg-white border shadow-sm hover:bg-gray-100"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="m15 18-6-6 6-6" />
								</svg>
							</Carousel.Previous>
							<Carousel.Next
								class="relative right-0 translate-x-0 bg-white border shadow-sm hover:bg-gray-100"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="m9 18 6-6-6-6" />
								</svg>
							</Carousel.Next>
						</div>
					</Carousel.Root>
				</div>

				<!-- Recent Activity -->
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between">
						<div>
							<Card.Title>Recent Activity</Card.Title>
							<Card.Description>Your latest development actions</Card.Description>
						</div>
						<Button.Root
							class="gap-2 cursor-pointer px-4 py-1.5 text-sm transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] border-2"
							variant="outline">View All</Button.Root
						>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							{#each Array(3) as _, i}
								<div
									class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
								>
									<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
										<GitBranch size={20} class="text-blue-600" />
									</div>
									<div class="flex-1">
										<p class="font-medium text-gray-800">New branch created</p>
										<p class="text-sm text-gray-500">feature/kanban-integration</p>
									</div>
									<span class="text-sm text-gray-500">2h ago</span>
								</div>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</main>
	</div>
</div>
