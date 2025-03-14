<script>
	import { onMount } from 'svelte';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Button from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Select from '$lib/components/ui/select';
	import * as Textarea from '$lib/components/ui/textarea';
	import {
		getFirestore,
		collection,
		doc,
		setDoc,
		getDoc,
		updateDoc,
		arrayUnion,
		query,
		where,
		getDocs
	} from 'firebase/firestore';
	import * as Slider from '$lib/components/ui/slider';
	import {
		Brain,
		Sparkles,
		Save,
		Copy,
		History,
		Star,
		Trash,
		Zap,
		Settings,
		Download,
		Share,
		RefreshCw,
		Loader2
	} from 'lucide-svelte';

	// Add Firebase Firestore
	const db = getFirestore();
	const auth = getAuth();
	let user = null;
	let loading = true;
	let generating = false;
	let promptHistory = [];
	let favorites = [];
	let activeTab = 'generator';

	// Gemini API key and configuration
	const GEMINI_API_KEY = 'AIzaSyCwGXbNPxUihkXKmbv2A3PlHCy_1jLHcCs'; // Replace with your actual key
	// Update the API URL to the correct endpoint
	const GEMINI_API_URL =
		'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

	// Prompt templates
	const promptTemplates = [
		{
			name: 'Code Explanation',
			template:
				'Explain the following code in detail:\n\n```{{language}}\n{{code}}\n```\n\nFocus on: {{focus}}'
		},
		{
			name: 'Code Optimization',
			template: 'Optimize the following code for {{criteria}}:\n\n```{{language}}\n{{code}}\n```'
		},
		{
			name: 'Bug Fix',
			template:
				'Fix the bug in this code:\n\n```{{language}}\n{{code}}\n```\n\nError message: {{error}}'
		},
		{
			name: 'Feature Implementation',
			template:
				'Write code to implement the following feature in {{language}}:\n\nFeature: {{feature}}\n\nRequirements: {{requirements}}'
		},
		{
			name: 'Code Review',
			template: 'Review this code for {{criteria}}:\n\n```{{language}}\n{{code}}\n```'
		},
		{
			name: 'Custom',
			template: ''
		}
	];

	// Form state
	let selectedTemplate = promptTemplates[0];
	let promptInputs = {
		language: 'JavaScript',
		code: '',
		focus: 'efficiency and readability',
		criteria: 'performance',
		error: '',
		feature: '',
		requirements: ''
	};
	let customPrompt = '';
	let generatedPrompt = '';
	let aiResponse = '';
	let temperature = 0.7;
	let maxTokens = 1024;

	async function loadUserData(userId) {
		try {
			// Get user's prompt history
			const historyDocRef = doc(db, 'promptHistory', userId);
			const historyDoc = await getDoc(historyDocRef);

			if (historyDoc.exists()) {
				promptHistory = historyDoc.data().prompts || [];
			} else {
				// Create the document if it doesn't exist
				await setDoc(historyDocRef, { prompts: [] });
			}

			// Get user's favorites
			const favoritesDocRef = doc(db, 'promptFavorites', userId);
			const favoritesDoc = await getDoc(favoritesDocRef);

			if (favoritesDoc.exists()) {
				favorites = favoritesDoc.data().prompts || [];
			} else {
				// Create the document if it doesn't exist
				await setDoc(favoritesDocRef, { prompts: [] });
			}

			loading = false;
		} catch (error) {
			console.error('Error loading user data:', error);
			loading = false;
		}
	}

	// Function to save history to Firebase
	async function saveHistoryToFirebase() {
		if (!user) return;

		try {
			const historyDocRef = doc(db, 'promptHistory', user.uid);
			await setDoc(historyDocRef, { prompts: promptHistory }, { merge: true });
		} catch (error) {
			console.error('Error saving history:', error);
		}
	}

	// Function to save favorites to Firebase
	async function saveFavoritesToFirebase() {
		if (!user) return;

		try {
			const favoritesDocRef = doc(db, 'promptFavorites', user.uid);
			await setDoc(favoritesDocRef, { prompts: favorites }, { merge: true });
		} catch (error) {
			console.error('Error saving favorites:', error);
		}
	}

	function addToHistory(promptData) {
		promptHistory = [promptData, ...promptHistory];
		saveHistoryToFirebase();
	}

	// Add to favorites and save to Firebase
	function addToFavorites(promptData) {
		favorites = [promptData, ...favorites];
		saveFavoritesToFirebase();
	}

	// Remove from history and update Firebase
	function removeFromHistory(id) {
		promptHistory = promptHistory.filter((item) => item.id !== id);
		saveHistoryToFirebase();
	}

	// Remove from favorites and update Firebase
	function removeFromFavorites(id) {
		favorites = favorites.filter((item) => item.id !== id);
		saveFavoritesToFirebase();
	}

	// Clear all history
	async function clearAllHistory() {
		promptHistory = [];
		saveHistoryToFirebase();
	}

	// Clear all favorites
	async function clearAllFavorites() {
		favorites = [];
		saveFavoritesToFirebase();
	}

	// Programming languages
	const languages = [
		'JavaScript',
		'TypeScript',
		'Python',
		'Java',
		'C#',
		'C++',
		'Go',
		'Rust',
		'PHP',
		'Ruby',
		'Swift',
		'Kotlin',
		'Dart',
		'HTML/CSS',
		'SQL'
	];

	function updateTemplate(template) {
		selectedTemplate = template;
		if (template.name === 'Custom') {
			customPrompt = '';
		}
	}

	function buildPrompt() {
		if (selectedTemplate.name === 'Custom') {
			return customPrompt;
		}

		let prompt = selectedTemplate.template;

		// Replace all placeholders with their values
		for (const [key, value] of Object.entries(promptInputs)) {
			prompt = prompt.replace(`{{${key}}}`, value);
		}

		return prompt;
	}

	async function generateAIResponse() {
		const prompt = buildPrompt();
		generatedPrompt = prompt;

		if (!prompt.trim()) {
			alert('Please provide a prompt');
			return;
		}

		generating = true;

		try {
			const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: prompt }]
						}
					],
					generationConfig: {
						temperature: temperature,
						maxOutputTokens: maxTokens,
						topP: 0.95,
						topK: 40
					}
				})
			});

			const data = await response.json();

			if (data.candidates && data.candidates.length > 0) {
				aiResponse = data.candidates[0].content.parts[0].text;

				// Add to history with user ID
				const promptData = {
					id: Date.now(),
					userId: user.uid,
					prompt,
					response: aiResponse,
					template: selectedTemplate.name,
					timestamp: new Date().toISOString()
				};

				addToHistory(promptData);
			} else {
				aiResponse = "Sorry, I couldn't generate a response. Please try again.";
			}
		} catch (error) {
			console.error('Error generating response:', error);
			aiResponse = 'An error occurred while generating the response. Please try again.';
		} finally {
			generating = false;
		}
	}

	function copyToClipboard(text) {
		navigator.clipboard.writeText(text);
	}

	function saveToFavorites() {
		if (!generatedPrompt || !aiResponse) return;

		const favoriteData = {
			id: Date.now(),
			userId: user.uid,
			prompt: generatedPrompt,
			response: aiResponse,
			template: selectedTemplate.name,
			timestamp: new Date().toISOString()
		};

		addToFavorites(favoriteData);
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleString();
	}

	function downloadHistory() {
		const dataStr = JSON.stringify(promptHistory, null, 2);
		const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

		const exportFileDefaultName = 'prompt-history.json';

		const linkElement = document.createElement('a');
		linkElement.setAttribute('href', dataUri);
		linkElement.setAttribute('download', exportFileDefaultName);
		linkElement.click();
	}

	onMount(() => {
		onAuthStateChanged(auth, (userData) => {
			if (userData) {
				user = userData;
				// Load data from Firebase instead of localStorage
				loadUserData(userData.uid);
			} else {
				goto('/');
			}
		});
	});
</script>

<div class="min-h-screen p-4">
	<div class="max-w-[1600px] mx-auto">
		<Card.Root class="mb-4">
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
					<Card.Title class="text-2xl">AI Prompt Generator</Card.Title>
					<Card.Description>Create optimized prompts for AI-assisted development</Card.Description>
				</div>
				<div class="flex gap-2">
					<Button.Root
						variant="outline"
						class="gap-2"
						on:click={downloadHistory}
						disabled={promptHistory.length === 0}
					>
						<Download size={16} />
						Export History
					</Button.Root>
					<Button.Root variant="outline" class="gap-2">
						<Settings size={16} />
						Settings
					</Button.Root>
				</div>
			</Card.Header>
		</Card.Root>

		<div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
			<!-- Main Content -->
			<div class="space-y-4">
				<Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)}>
					<Tabs.List class="w-full">
						<Tabs.Trigger value="generator" class="flex-1">
							<div class="flex items-center justify-center gap-2">
								<Brain size={16} />
								Generator
							</div>
						</Tabs.Trigger>
						<Tabs.Trigger value="history" class="flex-1">
							<div class="flex items-center justify-center gap-2">
								<History size={16} />
								History
							</div>
						</Tabs.Trigger>
						<Tabs.Trigger value="favorites" class="flex-1">
							<div class="flex items-center justify-center gap-2">
								<Star size={16} />
								Favorites
							</div>
						</Tabs.Trigger>
					</Tabs.List>

					<!-- Generator Tab -->
					<Tabs.Content value="generator" class="space-y-4 pt-4">
						<Card.Root>
							<Card.Header>
								<Card.Title>Prompt Template</Card.Title>
								<Card.Description>Select a template or create your own</Card.Description>
							</Card.Header>
							<Card.Content>
								<div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
									{#each promptTemplates as template}
										<div
											class="p-3 border-2 rounded-lg cursor-pointer transition-colors"
											class:border-green-500={selectedTemplate.name === template.name}
											class:bg-green-50={selectedTemplate.name === template.name}
											class:border-gray-200={selectedTemplate.name !== template.name}
											on:click={() => updateTemplate(template)}
										>
											<div class="text-sm font-medium">{template.name}</div>
										</div>
									{/each}
								</div>

								{#if selectedTemplate.name === 'Custom'}
									<div class="mb-4">
										<label class="block text-sm font-medium mb-2">Custom Prompt</label>
										<Textarea.Root
											bind:value={customPrompt}
											placeholder="Write your custom prompt here..."
											class="min-h-[150px]"
										/>
									</div>
								{:else}
									<!-- Dynamic form based on selected template -->
									<div class="space-y-4">
										{#if selectedTemplate.template.includes('{{language}}')}
											<div>
												<label class="block text-sm font-medium mb-2">Programming Language</label>
												<Select.Root
													value={promptInputs.language}
													onValueChange={(value) => (promptInputs.language = value)}
												>
													<Select.Trigger class="w-full bg-white">
														<Select.Value placeholder="Select a language" />
													</Select.Trigger>
													<Select.Content
														class="bg-white"
														position="popper"
														sideOffset={4}
														side="bottom"
														align="start"
														avoidCollisions={true}
													>
														{#each languages as language}
															<Select.Item value={language}>{language}</Select.Item>
														{/each}
													</Select.Content>
												</Select.Root>
											</div>
										{/if}
										{#if selectedTemplate.template.includes('{{code}}')}
											<div>
												<label class="block text-sm font-medium mb-2">Code</label>
												<Textarea.Root
													bind:value={promptInputs.code}
													placeholder="Paste your code here..."
													class="min-h-[150px] font-mono"
												/>
											</div>
										{/if}

										{#if selectedTemplate.template.includes('{{focus}}')}
											<div>
												<label class="block text-sm font-medium mb-2">Focus Areas</label>
												<Textarea.Root
													bind:value={promptInputs.focus}
													placeholder="What should the explanation focus on?"
												/>
											</div>
										{/if}

										{#if selectedTemplate.template.includes('{{criteria}}')}
											<div>
												<label class="block text-sm font-medium mb-2">Criteria</label>
												<Textarea.Root
													bind:value={promptInputs.criteria}
													placeholder="Optimization criteria or review focus"
												/>
											</div>
										{/if}

										{#if selectedTemplate.template.includes('{{error}}')}
											<div>
												<label class="block text-sm font-medium mb-2">Error Message</label>
												<Textarea.Root
													bind:value={promptInputs.error}
													placeholder="Paste the error message here"
												/>
											</div>
										{/if}

										{#if selectedTemplate.template.includes('{{feature}}')}
											<div>
												<label class="block text-sm font-medium mb-2">Feature Description</label>
												<Textarea.Root
													bind:value={promptInputs.feature}
													placeholder="Describe the feature you want to implement"
												/>
											</div>
										{/if}

										{#if selectedTemplate.template.includes('{{requirements}}')}
											<div>
												<label class="block text-sm font-medium mb-2">Requirements</label>
												<Textarea.Root
													bind:value={promptInputs.requirements}
													placeholder="List specific requirements or constraints"
												/>
											</div>
										{/if}
									</div>
								{/if}
							</Card.Content>
						</Card.Root>

						<div class="flex justify-center">
							<Button.Root
								class="gap-2 px-8 py-6 text-lg"
								on:click={generateAIResponse}
								disabled={generating}
							>
								{#if generating}
									<Loader2 size={20} class="animate-spin" />
									Generating...
								{:else}
									<Sparkles size={20} />
									Generate AI Response
								{/if}
							</Button.Root>
						</div>

						{#if generatedPrompt || aiResponse}
							<Card.Root>
								<Card.Header>
									<Card.Title>Generated Prompt</Card.Title>
									<div class="flex justify-end">
										<Button.Root
											variant="ghost"
											size="sm"
											on:click={() => copyToClipboard(generatedPrompt)}
										>
											<Copy size={14} />
										</Button.Root>
									</div>
								</Card.Header>
								<Card.Content>
									<div class="bg-gray-50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
										{generatedPrompt}
									</div>
								</Card.Content>
							</Card.Root>

							<Card.Root>
								<Card.Header class="flex flex-row items-center justify-between">
									<Card.Title>AI Response</Card.Title>
									<div class="flex gap-2">
										<Button.Root
											variant="ghost"
											size="sm"
											on:click={() => copyToClipboard(aiResponse)}
										>
											<Copy size={14} />
										</Button.Root>
										<Button.Root variant="ghost" size="sm" on:click={saveToFavorites}>
											<Star size={14} />
										</Button.Root>
									</div>
								</Card.Header>
								<Card.Content>
									<div class="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
										{aiResponse}
									</div>
								</Card.Content>
							</Card.Root>
						{/if}
					</Tabs.Content>

					<!-- History Tab -->
					<Tabs.Content value="history" class="space-y-4 pt-4">
						{#if promptHistory.length === 0}
							<div class="text-center py-12 bg-gray-50 rounded-lg">
								<History size={48} class="mx-auto text-gray-400 mb-4" />
								<h3 class="text-lg font-medium text-gray-700">No History Yet</h3>
								<p class="text-gray-500">Your prompt history will appear here</p>
							</div>
						{:else}
							<div class="flex justify-between mb-2">
								<h3 class="text-lg font-medium">Recent Prompts</h3>
								<Button.Root
									variant="outline"
									size="sm"
									class="gap-1"
									on:click={() => (promptHistory = [])}
								>
									<Trash size={14} />
									Clear All
								</Button.Root>
							</div>
							{#each promptHistory as item}
								<Card.Root>
									<Card.Header class="flex flex-row items-start justify-between">
										<div>
											<Card.Title>{item.template}</Card.Title>
											<Card.Description>{formatDate(item.timestamp)}</Card.Description>
										</div>
										<div class="flex gap-1">
											<Button.Root
												variant="ghost"
												size="icon"
												on:click={() => removeFromHistory(item.id)}
											>
												<Trash size={14} />
											</Button.Root>
										</div>
									</Card.Header>
									<Card.Content>
										<div class="text-sm font-medium mb-1">Prompt:</div>
										<div class="bg-gray-50 p-2 rounded-md text-sm mb-3 line-clamp-2">
											{item.prompt}
										</div>
										<div class="text-sm font-medium mb-1">Response:</div>
										<div class="bg-gray-50 p-2 rounded-md text-sm line-clamp-3">
											{item.response}
										</div>
									</Card.Content>
									<Card.Footer class="flex justify-end gap-2">
										<Button.Root
											variant="outline"
											size="sm"
											on:click={() => copyToClipboard(item.response)}
										>
											<Copy size={14} class="mr-1" />
											Copy Response
										</Button.Root>
									</Card.Footer>
								</Card.Root>
							{/each}
						{/if}
					</Tabs.Content>

					<!-- Favorites Tab -->
					<Tabs.Content value="favorites" class="space-y-4 pt-4">
						{#if favorites.length === 0}
							<div class="text-center py-12 bg-gray-50 rounded-lg">
								<Star size={48} class="mx-auto text-gray-400 mb-4" />
								<h3 class="text-lg font-medium text-gray-700">No Favorites Yet</h3>
								<p class="text-gray-500">Star your favorite prompts to save them here</p>
							</div>
						{:else}
							<div class="flex justify-between mb-2">
								<h3 class="text-lg font-medium">Favorite Prompts</h3>
								<Button.Root
									variant="outline"
									size="sm"
									class="gap-1"
									on:click={() => (favorites = [])}
								>
									<Trash size={14} />
									Clear All
								</Button.Root>
							</div>
							{#each favorites as item}
								<Card.Root>
									<Card.Header class="flex flex-row items-start justify-between">
										<div>
											<Card.Title>{item.template}</Card.Title>
											<Card.Description>{formatDate(item.timestamp)}</Card.Description>
										</div>
										<div class="flex gap-1">
											<Button.Root
												variant="ghost"
												size="icon"
												on:click={() => removeFromFavorites(item.id)}
											>
												<Trash size={14} />
											</Button.Root>
										</div>
									</Card.Header>
									<Card.Content>
										<div class="text-sm font-medium mb-1">Prompt:</div>
										<div class="bg-gray-50 p-2 rounded-md text-sm mb-3 line-clamp-2">
											{item.prompt}
										</div>
										<div class="text-sm font-medium mb-1">Response:</div>
										<div class="bg-gray-50 p-2 rounded-md text-sm line-clamp-3">
											{item.response}
										</div>
									</Card.Content>
									<Card.Footer class="flex justify-end gap-2">
										<Button.Root
											variant="outline"
											size="sm"
											on:click={() => copyToClipboard(item.response)}
										>
											<Copy size={14} class="mr-1" />
											Copy Response
										</Button.Root>
									</Card.Footer>
								</Card.Root>
							{/each}
						{/if}
					</Tabs.Content>
				</Tabs.Root>
			</div>

			<!-- Sidebar -->
			<div class="space-y-4">
				<Card.Root>
					<Card.Header>
						<Card.Title>Tips & Tricks</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							<div class="flex gap-3">
								<div class="bg-blue-100 text-blue-600 p-2 rounded-full h-fit">
									<Zap size={16} />
								</div>
								<div>
									<h4 class="font-medium text-sm">Be Specific</h4>
									<p class="text-sm text-gray-600">
										The more details you provide, the better the AI response will be.
									</p>
								</div>
							</div>
							<div class="flex gap-3">
								<div class="bg-green-100 text-green-600 p-2 rounded-full h-fit">
									<RefreshCw size={16} />
								</div>
								<div>
									<h4 class="font-medium text-sm">Iterate</h4>
									<p class="text-sm text-gray-600">
										Try different prompts and refine based on results.
									</p>
								</div>
							</div>
							<div class="flex gap-3">
								<div class="bg-purple-100 text-purple-600 p-2 rounded-full h-fit">
									<Settings size={16} />
								</div>
								<div>
									<h4 class="font-medium text-sm">Adjust Temperature</h4>
									<p class="text-sm text-gray-600">
										Lower for precise answers, higher for creative ones.
									</p>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Usage Stats</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							<div class="flex justify-between items-center">
								<span class="text-sm">Prompts Generated</span>
								<span class="font-medium">{promptHistory.length}</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm">Favorite Prompts</span>
								<span class="font-medium">{favorites.length}</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm">Most Used Template</span>
								<span class="font-medium">
									{promptHistory.length > 0
										? Object.entries(
												promptHistory.reduce((acc, item) => {
													acc[item.template] = (acc[item.template] || 0) + 1;
													return acc;
												}, {})
											).sort((a, b) => b[1] - a[1])[0][0]
										: 'None'}
								</span>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Quick Actions</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-2">
							<Button.Root
								variant="outline"
								class="w-full justify-start gap-2"
								on:click={() => (activeTab = 'generator')}
							>
								<Brain size={16} />
								New Prompt
							</Button.Root>
							<Button.Root
								variant="outline"
								class="w-full justify-start gap-2"
								on:click={() => (activeTab = 'history')}
							>
								<History size={16} />
								View History
							</Button.Root>
							<Button.Root
								variant="outline"
								class="w-full justify-start gap-2"
								on:click={() => (activeTab = 'favorites')}
							>
								<Star size={16} />
								View Favorites
							</Button.Root>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
</div>

<style>
	/* Add any custom styles here */
	:global(.line-clamp-2) {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	:global(.line-clamp-3) {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
