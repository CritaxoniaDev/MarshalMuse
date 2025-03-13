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
		Brain
	} from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Button from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';

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
			color: 'bg-blue-100 text-blue-600'
		},
		{
			title: 'AI Prompt Generator',
			icon: Brain,
			description: 'Generate optimized prompts for AI-assisted development',
			stats: '150+ Prompts Generated',
			color: 'bg-green-100 text-green-600'
		},
		{
			title: 'Code Generator',
			icon: Code2,
			description: 'Transform designs into production-ready code',
			stats: '1.2k Lines Generated',
			color: 'bg-orange-100 text-orange-600'
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

				<!-- Development Tools Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{#each devTools as tool}
						<Card.Root class="transition-all duration-300">
							<Card.Header>
								<div class="flex items-center justify-between mb-2">
									<div class={`p-3 rounded-lg ${tool.color}`}>
										<svelte:component this={tool.icon} size={24} />
									</div>
									<Button.Root variant="ghost" size="icon">
										<Settings size={18} />
									</Button.Root>
								</div>
								<Card.Title>{tool.title}</Card.Title>
								<Card.Description>{tool.description}</Card.Description>
							</Card.Header>
							<Card.Content>
								<div class="flex items-center justify-between">
									<span class="text-sm font-medium">{tool.stats}</span>
									<Button.Root
										variant="outline"
										size="sm"
										class="gap-2 cursor-pointer px-4 py-1.5 text-sm transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] border-2"
									>
										Open Tool
									</Button.Root>
								</div>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>

				<!-- Recent Activity -->
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between">
						<div>
							<Card.Title>Recent Activity</Card.Title>
							<Card.Description>Your latest development actions</Card.Description>
						</div>
						<Button.Root class="gap-2 cursor-pointer px-4 py-1.5 text-sm transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] border-2" variant="outline">View All</Button.Root>
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
