<script>
	import {
		Book,
		FileText,
		Code,
		GitBranch,
		Rocket,
		Terminal,
		Search,
		ArrowRight
	} from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';

	// Documentation categories
	const docCategories = [
		{
			title: 'Getting Started',
			description: 'Learn the basics of MarshalMuse and set up your environment',
			icon: Book,
			href: '/docs/getting-started',
			color: 'blue'
		},
		{
			title: 'Flowchart Creator',
			description: 'Create professional flowcharts and diagrams with our intuitive tool',
			icon: GitBranch,
			href: '/docs/flowchart-creator',
			color: 'green'
		},
		{
			title: 'API Reference',
			description: 'Comprehensive API documentation for developers',
			icon: Code,
			href: '/docs/api',
			color: 'purple'
		},
		{
			title: 'Examples',
			description: 'Real-world examples and use cases',
			icon: FileText,
			href: '/docs/examples',
			color: 'amber'
		}
	];

	// Recent updates
	const recentUpdates = [
		{
			title: 'Flowchart Creator v2.1',
			date: 'June 15, 2023',
			description: 'Added new node types and improved connection handling'
		},
		{
			title: 'API Documentation Update',
			date: 'May 28, 2023',
			description: 'Comprehensive update to the REST API documentation'
		},
		{
			title: 'Getting Started Guide',
			date: 'May 10, 2023',
			description: 'New beginner-friendly onboarding documentation'
		}
	];

	// Helper function to get icon color class
	function getIconColorClass(color) {
		switch (color) {
			case 'blue':
				return 'text-blue-600';
			case 'green':
				return 'text-green-600';
			case 'purple':
				return 'text-purple-600';
			case 'amber':
				return 'text-amber-600';
			default:
				return 'text-gray-600';
		}
	}

	// Helper function to get background color class
	function getBgColorClass(color) {
		switch (color) {
			case 'blue':
				return 'bg-blue-100';
			case 'green':
				return 'bg-green-100';
			case 'purple':
				return 'bg-purple-100';
			case 'amber':
				return 'bg-amber-100';
			default:
				return 'bg-gray-100';
		}
	}
</script>

<svelte:head>
	<title>Documentation | MarshalMuse</title>
	<meta
		name="description"
		content="Comprehensive documentation for MarshalMuse - the modern development platform"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-12 max-w-7xl">
	<!-- Documentation Header -->
	<div class="text-center mb-16">
		<h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
			<span class="block">MarshalMuse</span>
			<span class="block text-blue-600 mt-1">Documentation</span>
		</h1>
		<p
			class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
		>
			Comprehensive guides, references, and examples to help you get the most out of MarshalMuse.
		</p>

		<!-- Search Bar -->
		<div class="mt-8 max-w-2xl mx-auto">
			<div class="relative">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search class="h-5 w-5 text-gray-400" />
				</div>
				<input
					type="text"
					class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
					placeholder="Search documentation..."
				/>
			</div>
		</div>
	</div>

	<!-- Documentation Categories -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
		{#each docCategories as category}
			<a href={category.href} class="group block">
				<Card.Root
					class="h-full border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
				>
					<Card.Header>
						<div class="flex items-start">
							<div
								class="mr-4 p-3 rounded-lg transition-colors duration-300 {getBgColorClass(
									category.color
								)}"
							>
								<svelte:component
									this={category.icon}
									size={24}
									class={getIconColorClass(category.color)}
								/>
							</div>
							<div>
								<Card.Title
									class="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-300"
								>
									{category.title}
								</Card.Title>
								<Card.Description class="text-gray-600 mt-1">
									{category.description}
								</Card.Description>
							</div>
						</div>
					</Card.Header>
					<Card.Footer class="border-t border-gray-100 bg-gray-50 flex justify-end">
						<span class="text-sm text-blue-600 flex items-center">
							View documentation <ArrowRight size={16} class="ml-1" />
						</span>
					</Card.Footer>
				</Card.Root>
			</a>
		{/each}
	</div>

	<!-- Quick Links and Updates -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
		<!-- Quick Links -->
		<div class="lg:col-span-2">
			<h2 class="text-2xl font-bold mb-6">Quick Links</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Card.Root class="border border-gray-200">
					<Card.Header>
						<Card.Title class="flex items-center">
							<Terminal size={18} class="mr-2 text-blue-600" />
							Installation Guide
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600 text-sm">
							Learn how to install and set up MarshalMuse on your system.
						</p>
					</Card.Content>
					<Card.Footer class="flex justify-end">
						<Button variant="link" class="text-blue-600 p-0">Read Guide</Button>
					</Card.Footer>
				</Card.Root>

				<Card.Root class="border border-gray-200">
					<Card.Header>
						<Card.Title class="flex items-center">
							<GitBranch size={18} class="mr-2 text-green-600" />
							Flowchart Tutorial
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600 text-sm">
							Create your first flowchart with our step-by-step tutorial.
						</p>
					</Card.Content>
					<Card.Footer class="flex justify-end">
						<Button variant="link" class="text-blue-600 p-0">Start Tutorial</Button>
					</Card.Footer>
				</Card.Root>

				<Card.Root class="border border-gray-200">
					<Card.Header>
						<Card.Title class="flex items-center">
							<Code size={18} class="mr-2 text-purple-600" />
							API Examples
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600 text-sm">Practical examples of using the MarshalMuse API.</p>
					</Card.Content>
					<Card.Footer class="flex justify-end">
						<Button variant="link" class="text-blue-600 p-0">View Examples</Button>
					</Card.Footer>
				</Card.Root>

				<Card.Root class="border border-gray-200">
					<Card.Header>
						<Card.Title class="flex items-center">
							<Rocket size={18} class="mr-2 text-red-600" />
							Deployment Guide
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600 text-sm">
							Learn how to deploy your MarshalMuse projects to production.
						</p>
					</Card.Content>
					<Card.Footer class="flex justify-end">
						<Button variant="link" class="text-blue-600 p-0">Read Guide</Button>
					</Card.Footer>
				</Card.Root>
			</div>
		</div>

		<!-- Recent Updates -->
		<div>
			<h2 class="text-2xl font-bold mb-6">Recent Updates</h2>
			<Card.Root class="border border-gray-200">
				<Card.Header>
					<Card.Title>Documentation Updates</Card.Title>
					<Card.Description>Latest changes to our documentation</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						{#each recentUpdates as update}
							<div class="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
								<h3 class="font-medium text-gray-900">{update.title}</h3>
								<p class="text-sm text-gray-500 mb-1">{update.date}</p>
								<p class="text-sm text-gray-600">{update.description}</p>
							</div>
						{/each}
					</div>
				</Card.Content>
				<Card.Footer>
					<Button variant="link" class="text-blue-600 p-0">View all updates</Button>
				</Card.Footer>
			</Card.Root>
		</div>
	</div>

	<!-- Documentation Resources -->
	<div class="mb-16">
		<h2 class="text-2xl font-bold mb-6">Documentation Resources</h2>
		<Tabs.Root value="guides" class="w-full">
			<Tabs.List class="w-full border-b border-gray-200">
				<Tabs.Trigger value="guides" class="text-sm sm:text-base">Guides</Tabs.Trigger>
				<Tabs.Trigger value="api" class="text-sm sm:text-base">API Reference</Tabs.Trigger>
				<Tabs.Trigger value="examples" class="text-sm sm:text-base">Examples</Tabs.Trigger>
				<Tabs.Trigger value="faq" class="text-sm sm:text-base">FAQ</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="guides" class="p-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<a
						href="/docs/guides/installation"
						class="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
					>
						<h3 class="font-medium text-gray-900 mb-1">Installation Guide</h3>
						<p class="text-sm text-gray-600">Step-by-step installation instructions</p>
					</a>
					<a
						href="/docs/guides/getting-started"
						class="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
					>
						<h3 class="font-medium text-gray-900 mb-1">Getting Started</h3>
						<p class="text-sm text-gray-600">Your first steps with MarshalMuse</p>
					</a>
					<a
						href="/docs/guides/flowcharts"
						class="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
					>
						<h3 class="font-medium text-gray-900 mb-1">Creating Flowcharts</h3>
						<p class="text-sm text-gray-600">Learn to create effective flowcharts</p>
					</a>
				</div>
			</Tabs.Content>
			<Tabs.Content value="api" class="p-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<a
						href="/docs/api/overview"
						class="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
					>
						<h3 class="font-medium text-gray-900 mb-1">API Overview</h3>
						<p class="text-sm text-gray-600">Introduction to the MarshalMuse API</p>
					</a>
					<a
						href="/docs/api/authentication"
						class="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
					>
						<h3 class="font-medium text-gray-900 mb-1">Authentication</h3>
						<p class="text-sm text-gray-600">Secure your API requests</p>
					</a>
					<a
						href="/docs/api/endpoints"
						class="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
					>
						<h3 class="font-medium text-gray-900 mb-1">API Endpoints</h3>
						<p class="text-sm text-gray-600">Complete list of available endpoints</p>
					</a>
				</div>
			</Tabs.Content>
			<Tabs.Content value="examples" class="p-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<a
						href="/docs/examples/basic-flowchart"
						class="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
					>
						<h3 class="font-medium text-gray-900 mb-1">Basic Flowchart</h3>
						<p class="text-sm text-gray-600">Create a simple process flowchart</p>
					</a>
					<a
						href="/docs/examples/api-integration"
						class="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
					>
						<h3 class="font-medium text-gray-900 mb-1">API Integration</h3>
						<p class="text-sm text-gray-600">Integrate MarshalMuse with your app</p>
					</a>
					<a
						href="/docs/examples/advanced-diagrams"
						class="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
					>
						<h3 class="font-medium text-gray-900 mb-1">Advanced Diagrams</h3>
						<p class="text-sm text-gray-600">Create complex diagrams with advanced features</p>
					</a>
				</div>
			</Tabs.Content>
			<Tabs.Content value="faq" class="p-4">
				<div class="space-y-4">
					<div class="border-b border-gray-200 pb-4">
						<h3 class="font-medium text-gray-900 mb-1">How do I install MarshalMuse?</h3>
						<p class="text-sm text-gray-600">
							You can install MarshalMuse using npm or yarn. See our <a
								href="/docs/guides/installation"
								class="text-blue-600 hover:underline">installation guide</a
							> for detailed instructions.
						</p>
					</div>
					<div class="border-b border-gray-200 pb-4">
						<h3 class="font-medium text-gray-900 mb-1">Is MarshalMuse free to use?</h3>
						<p class="text-sm text-gray-600">
							MarshalMuse offers both free and premium plans. The free plan includes basic features,
							while premium plans offer advanced capabilities and priority support.
						</p>
					</div>
					<div class="border-b border-gray-200 pb-4">
						<h3 class="font-medium text-gray-900 mb-1">Can I export my flowcharts?</h3>
						<p class="text-sm text-gray-600">
							Yes, you can export flowcharts in various formats including PNG, SVG, PDF, and JSON
							for further editing.
						</p>
					</div>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>

	<!-- Community and Support -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
		<Card.Root class="border-2 border-gray-200">
			<Card.Header>
				<Card.Title class="text-xl">Join Our Community</Card.Title>
				<Card.Description>Connect with other MarshalMuse users and developers</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<a
						href="https://github.com/CritaxoniaDev/MarshalMuse"
						class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<div class="mr-3 p-2 bg-gray-100 rounded-full">
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-medium text-gray-900">GitHub</h3>
							<p class="text-sm text-gray-600">Star our repository and contribute to the project</p>
						</div>
					</a>
					<a
						href="#"
						class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<div class="mr-3 p-2 bg-gray-100 rounded-full">
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-medium text-gray-900">Twitter</h3>
							<p class="text-sm text-gray-600">Follow us for updates and announcements</p>
						</div>
					</a>
					<a
						href="#"
						class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
					>
						<div class="mr-3 p-2 bg-gray-100 rounded-full">
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v19.056c0 1.368-1.104 2.472-2.46 2.472h-15.08c-1.356 0-2.46-1.104-2.46-2.472v-19.056c0-1.368 1.104-2.472 2.46-2.472h15.08zm-7.54 9.6c-2.608 0-4.64 2.032-4.64 4.64 0 2.608 2.032 4.64 4.64 4.64 2.608 0 4.64-2.032 4.64-4.64 0-2.608-2.032-4.64-4.64-4.64zm0 7.68c-1.664 0-3.04-1.376-3.04-3.04s1.376-3.04 3.04-3.04 3.04 1.376 3.04 3.04c0 1.664-1.376 3.04-3.04 3.04zm5.92-7.68h-1.28v-1.28c0-.544-.448-.96-.96-.96h-1.28c-.544 0-.96.416-.96.96v1.28h-1.28c-.544 0-.96.416-.96.96v1.28c0 .544.416.96.96.96h1.28v1.28c0 .544.416.96.96.96h1.28c.544 0 .96-.416.96-.96v-1.28h1.28c.544 0 .96-.416.96-.96v-1.28c0-.544-.416-.96-.96-.96zm-1.92-5.76c1.024 0 1.92.896 1.92 1.92s-.896 1.92-1.92 1.92-1.92-.896-1.92-1.92.896-1.92 1.92-1.92z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-medium text-gray-900">Discord</h3>
							<p class="text-sm text-gray-600">Join our community chat for real-time support</p>
						</div>
					</a>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="border-2 border-gray-200">
			<Card.Header>
				<Card.Title class="text-xl">Need Help?</Card.Title>
				<Card.Description>Get support from our team and community</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<div class="p-4 bg-blue-50 border border-blue-100 rounded-lg">
						<h3 class="font-medium text-blue-800 mb-2">Documentation</h3>
						<p class="text-sm text-blue-700 mb-3">
							Browse our comprehensive documentation for answers to common questions.
						</p>
						<Button
							variant="outline"
							class="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
						>
							Browse Docs
						</Button>
					</div>

					<div class="p-4 bg-green-50 border border-green-100 rounded-lg">
						<h3 class="font-medium text-green-800 mb-2">Community Forum</h3>
						<p class="text-sm text-green-700 mb-3">
							Ask questions and share your knowledge with the community.
						</p>
						<Button
							variant="outline"
							class="bg-white border-green-200 text-green-700 hover:bg-green-50"
						>
							Visit Forum
						</Button>
					</div>

					<div class="p-4 bg-purple-50 border border-purple-100 rounded-lg">
						<h3 class="font-medium text-purple-800 mb-2">Contact Support</h3>
						<p class="text-sm text-purple-700 mb-3">
							Get direct help from our support team for complex issues.
						</p>
						<Button
							variant="outline"
							class="bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
						>
							Contact Us
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
