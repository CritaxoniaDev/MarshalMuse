<script>
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Button from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import * as Separator from '$lib/components/ui/separator';
	import createShapeImage from '$lib/assets/images/docs/image1.png';
    import connectShapesImage from '$lib/assets/images/docs/image2.png';
	import {
		Square,
		Circle,
		Diamond,
		ArrowRight,
		Database,
		Cloud,
		File,
		Hexagon,
		Lightbulb,
		MousePointer,
		Move,
		Type,
		Link,
		Save,
		Download,
		Share,
		RotateCcw,
		Plus,
		Minus,
		ChevronRight
	} from 'lucide-svelte';

	// Sample code snippets
	const createShapeCode = `// Add a new shape to the canvas
const newElement = {
  type: 'rectangle',  // rectangle, circle, diamond, etc.
  x: 100,            // x position
  y: 100,            // y position
  width: 100,        // width
  height: 60,        // height
  text: 'Process',   // label
  id: 'element-' + Date.now()
};

elements = [...elements, newElement];`;

	const createConnectionCode = `// Create a connection between two shapes
connections.push({
  start: sourceShape.id,
  end: targetShape.id,
  type: 'straight',
  color: '#2563eb'  // blue
});`;

	// Feature list
	const features = [
		{
			icon: Square,
			title: 'Multiple Shape Types',
			description:
				'Create flowcharts with various shapes including rectangles, circles, diamonds, and more.'
		},
		{
			icon: ArrowRight,
			title: 'Intuitive Connections',
			description:
				'Connect shapes with customizable arrows to represent process flow and relationships.'
		},
		{
			icon: Type,
			title: 'Text Editing',
			description: 'Double-click any shape to add or edit text labels with an intuitive interface.'
		},
		{
			icon: Save,
			title: 'Export Options',
			description: 'Save your flowcharts as PNG images or export them for sharing with others.'
		}
	];

	// Tutorial steps
	const tutorialSteps = [
		{
			title: 'Creating Shapes',
			content:
				'Drag shapes from the left panel onto the canvas. You can choose from basic shapes like rectangles, circles, and diamonds, or advanced shapes like clouds and databases.',
			image: createShapeImage
		},
		{
			title: 'Connecting Shapes',
			content:
				'Click the "Connect Shapes" button, then click on a source shape followed by a target shape. This creates an arrow connecting the two shapes. You can customize the connection color.',
			image: connectShapesImage
		},
		{
			title: 'Adding Text',
			content:
				'Double-click on any shape to add or edit its text label. Press Enter to save or Escape to cancel.',
			image: '/images/docs/flowchart-edit-text.png'
		},
		{
			title: 'Moving Elements',
			content:
				'Click and drag any shape to reposition it on the canvas. Connections will automatically update to follow the shapes.',
			image: '/images/docs/flowchart-move.png'
		},
		{
			title: 'Exporting Your Flowchart',
			content:
				'Click the "Save as PNG" button to download your flowchart as an image file that you can share or include in documents.',
			image: '/images/docs/flowchart-export.png'
		}
	];

	// FAQ items
	const faqItems = [
		{
			question: 'Can I save my flowchart and edit it later?',
			answer:
				"Currently, the flowchart creator supports exporting as PNG images. We're working on adding the ability to save flowcharts to your account for later editing."
		},
		{
			question: 'How do I delete a shape or connection?',
			answer:
				"We're currently implementing a selection and deletion feature. For now, you can use the Undo button to revert recent additions."
		},
		{
			question: 'Can I customize the appearance of shapes?',
			answer:
				'The current version provides standard shapes with default styling. Future updates will include customization options for colors, borders, and more.'
		},
		{
			question: 'Is there a limit to how many shapes I can add?',
			answer:
				"There's no hard limit, but performance may decrease with very complex flowcharts containing hundreds of elements."
		},
		{
			question: 'Can I collaborate with others on a flowchart?',
			answer:
				'Real-time collaboration is planned for a future release. Currently, you can export your flowchart and share the image.'
		}
	];
</script>

<div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
	<div class="max-w-4xl mx-auto">
		<!-- Hero Section -->
		<div class="text-center mb-16">
			<h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
				<span class="block">Flowchart Creator</span>
				<span class="block text-blue-600 mt-1">Documentation</span>
			</h1>
			<p
				class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
			>
				Learn how to create professional flowcharts, diagrams, and process maps with our intuitive
				flowchart creator tool.
			</p>
			<div class="mt-8 flex justify-center">
				<Button.Root
					variant="default"
					size="lg"
					class="gap-2 rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
					on:click={() => (window.location.href = '/app/flowchart-creator')}
				>
					<MousePointer size={18} />
					Try It Now
				</Button.Root>
			</div>
		</div>

		<!-- Features Section -->
		<Card.Root class="mb-12 border-none shadow-lg">
			<Card.Header>
				<Card.Title class="text-2xl font-bold">Key Features</Card.Title>
				<Card.Description>Everything you need to create professional flowcharts</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
					{#each features as feature}
						<div
							class="flex items-start space-x-4 p-4 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
						>
							<div class="flex-shrink-0">
								<div
									class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
								>
									<svelte:component this={feature.icon} size={20} />
								</div>
							</div>
							<div>
								<h3 class="text-lg font-medium text-gray-900">{feature.title}</h3>
								<p class="mt-1 text-sm text-gray-500">{feature.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Getting Started Section -->
		<div class="mb-12">
			<div class="flex items-center space-x-2 mb-6">
				<Lightbulb class="text-yellow-500" size={24} />
				<h2 class="text-2xl font-bold text-gray-900">Getting Started</h2>
			</div>

			<Card.Root>
				<Tabs.Root value="tutorial">
					<Tabs.List class="bg-gray-50 p-1">
						<Tabs.Trigger value="tutorial" class="data-[state=active]:bg-white"
							>Step-by-Step Tutorial</Tabs.Trigger
						>
						<Tabs.Trigger value="video" class="data-[state=active]:bg-white"
							>Video Guide</Tabs.Trigger
						>
						<Tabs.Trigger value="examples" class="data-[state=active]:bg-white"
							>Examples</Tabs.Trigger
						>
					</Tabs.List>

					<Tabs.Content value="tutorial" class="p-6">
						<div class="space-y-8">
							{#each tutorialSteps as step, i}
								<div class="flex flex-col md:flex-row gap-6 items-start">
									<div
										class="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl"
									>
										{i + 1}
									</div>
									<div class="flex-1">
										<h3 class="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
										<p class="text-gray-600 mb-4">{step.content}</p>
										<div class="border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
											<img src={step.image} alt={step.title} class="w-full h-auto" />
										</div>
									</div>
								</div>

								{#if i < tutorialSteps.length - 1}
									<div class="flex justify-center">
										<div class="h-8 border-l-2 border-dashed border-gray-300"></div>
									</div>
								{/if}
							{/each}
						</div>
					</Tabs.Content>

					<Tabs.Content value="video" class="p-6">
						<div
							class="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center"
						>
							<div class="text-center p-8">
								<div
									class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-8 w-8 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<p class="text-gray-600">Video tutorial coming soon!</p>
								<p class="text-sm text-gray-500 mt-2">
									We're currently working on comprehensive video guides.
								</p>
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="examples" class="p-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Card.Root class="overflow-hidden">
								<div class="h-48 bg-gray-100 flex items-center justify-center">
									<span class="text-gray-400 text-sm">Example: Simple Process Flow</span>
								</div>
								<Card.Footer class="bg-white">
									<h4 class="font-medium">Simple Process Flow</h4>
									<p class="text-sm text-gray-500">Basic linear process with decision point</p>
								</Card.Footer>
							</Card.Root>

							<Card.Root class="overflow-hidden">
								<div class="h-48 bg-gray-100 flex items-center justify-center">
									<span class="text-gray-400 text-sm">Example: System Architecture</span>
								</div>
								<Card.Footer class="bg-white">
									<h4 class="font-medium">System Architecture</h4>
									<p class="text-sm text-gray-500">Cloud-based application architecture</p>
								</Card.Footer>
							</Card.Root>

							<Card.Root class="overflow-hidden">
								<div class="h-48 bg-gray-100 flex items-center justify-center">
									<span class="text-gray-400 text-sm">Example: Decision Tree</span>
								</div>
								<Card.Footer class="bg-white">
									<h4 class="font-medium">Decision Tree</h4>
									<p class="text-sm text-gray-500">Complex decision making flowchart</p>
								</Card.Footer>
							</Card.Root>

							<Card.Root class="overflow-hidden">
								<div class="h-48 bg-gray-100 flex items-center justify-center">
									<span class="text-gray-400 text-sm">Example: Data Flow</span>
								</div>
								<Card.Footer class="bg-white">
									<h4 class="font-medium">Data Flow Diagram</h4>
									<p class="text-sm text-gray-500">Visualizing data movement in a system</p>
								</Card.Footer>
							</Card.Root>
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</Card.Root>
		</div>

		<!-- Code Examples Section -->
		<div class="mb-12">
			<div class="flex items-center space-x-2 mb-6">
				<File class="text-blue-500" size={24} />
				<h2 class="text-2xl font-bold text-gray-900">Code Examples</h2>
			</div>

			<Card.Root>
				<Card.Header>
					<Card.Title>For Developers</Card.Title>
					<Card.Description>Programmatically create and manipulate flowcharts</Card.Description>
				</Card.Header>

				<Card.Content>
					<Tabs.Root value="shapes">
						<Tabs.List>
							<Tabs.Trigger value="shapes">Creating Shapes</Tabs.Trigger>
							<Tabs.Trigger value="connections">Creating Connections</Tabs.Trigger>
							<Tabs.Trigger value="export">Exporting</Tabs.Trigger>
						</Tabs.List>

						<Tabs.Content value="shapes" class="pt-4">
							<div class="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto">
								<pre><code>{createShapeCode}</code></pre>
							</div>
							<p class="mt-4 text-sm text-gray-600">
								This code creates a new rectangle shape on the canvas. You can modify the type,
								position, size, and text to create different shapes.
							</p>
						</Tabs.Content>

						<Tabs.Content value="connections" class="pt-4">
							<div class="bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto">
								<pre><code>{createConnectionCode}</code></pre>
							</div>
							<p class="mt-4 text-sm text-gray-600">
								This code creates a connection between two shapes. You can customize the connection
								type and color.
							</p>
						</Tabs.Content>
					</Tabs.Root>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Tips and Best Practices -->
		<div class="mb-12">
			<div class="flex items-center space-x-2 mb-6">
				<Lightbulb class="text-yellow-500" size={24} />
				<h2 class="text-2xl font-bold text-gray-900">Tips & Best Practices</h2>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-2">
							<div
								class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"
							>
								<ChevronRight size={16} />
							</div>
							<Card.Title>Start with the End in Mind</Card.Title>
						</div>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600">
							Before creating your flowchart, identify the start and end points of your process.
							This helps maintain focus and clarity.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-2">
							<div
								class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"
							>
								<ChevronRight size={16} />
							</div>
							<Card.Title>Use Consistent Shapes</Card.Title>
						</div>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600">
							Maintain consistency in your diagram by using the same shape for similar steps or
							processes. This improves readability.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-2">
							<div
								class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"
							>
								<ChevronRight size={16} />
							</div>
							<Card.Title>Keep Text Concise</Card.Title>
						</div>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600">
							Use short, clear phrases in your shapes. Aim for 1-5 words that capture the essence of
							each step.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<div class="flex items-center gap-2">
							<div
								class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"
							>
								<ChevronRight size={16} />
							</div>
							<Card.Title>Organize Spatially</Card.Title>
						</div>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600">
							Arrange your flowchart elements with enough space between them. Group related elements
							together for better organization.
						</p>
					</Card.Content>
				</Card.Root>
			</div>
		</div>

		<!-- FAQ Section -->
		<div class="mb-12">
			<div class="flex items-center space-x-2 mb-6">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-blue-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<h2 class="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
			</div>

			<Card.Root>
				<Card.Content class="pt-6">
					<Accordion.Root>
						{#each faqItems as item, i}
							<Accordion.Item value="item-{i}">
								<Accordion.Trigger class="text-left font-medium py-4">
									{item.question}
								</Accordion.Trigger>
								<Accordion.Content class="pb-4 text-gray-600">
									{item.answer}
								</Accordion.Content>
							</Accordion.Item>
						{/each}
					</Accordion.Root>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Keyboard Shortcuts -->
		<div class="mb-12">
			<div class="flex items-center space-x-2 mb-6">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-gray-700"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
					/>
				</svg>
				<h2 class="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
			</div>

			<Card.Root>
				<Card.Content class="p-0">
					<div class="overflow-hidden">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th
										scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Action
									</th>
									<th
										scope="col"
										class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Shortcut
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								<tr>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> Undo </td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<kbd
											class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
											>Ctrl</kbd
										>
										+
										<kbd
											class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
											>Z</kbd
										>
									</td>
								</tr>
								<tr>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> Save as PNG </td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<kbd
											class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
											>Ctrl</kbd
										>
										+
										<kbd
											class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
											>S</kbd
										>
									</td>
								</tr>
								<tr>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> Edit Text </td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										Double-click on shape
									</td>
								</tr>
								<tr>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										Cancel Text Editing
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<kbd
											class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
											>Esc</kbd
										>
									</td>
								</tr>
								<tr>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										Save Text Edits
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										<kbd
											class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg"
											>Enter</kbd
										>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Call to Action -->
		<div class="mt-16 text-center">
			<Alert.Root class="bg-blue-50 border-blue-200">
				<div class="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
					<div class="text-left">
						<h3 class="text-lg font-semibold text-blue-800">Ready to create your flowchart?</h3>
						<p class="text-blue-700">Start designing professional diagrams in minutes.</p>
					</div>
					<Button.Root
						variant="default"
						size="lg"
						class="whitespace-nowrap gap-2 shadow-md hover:shadow-lg transition-all"
						on:click={() => (window.location.href = '/app/flowchart-creator')}
					>
						<Square size={16} />
						Open Flowchart Creator
					</Button.Root>
				</div>
			</Alert.Root>

			<Separator.Root class="my-8" />

			<p class="text-sm text-gray-500">
				Have questions or need help? Contact our support team at <a
					href="mailto:support@marshalmuse.com"
					class="text-blue-600 hover:underline">support@marshalmuse.com</a
				>
			</p>
		</div>
	</div>
</div>
