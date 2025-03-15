<script>
	import { onMount } from 'svelte';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Button from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Textarea from '$lib/components/ui/textarea';
	import * as Input from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import * as Label from '$lib/components/ui/label';
	import * as Switch from '$lib/components/ui/switch';
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
	import {
		FileText,
		Copy,
		Trash,
		Save,
		Download,
		Upload,
		RefreshCw,
		ChevronRight,
		ChevronDown,
		AlertCircle,
		Check,
		X,
		Search,
		Code,
		Eye,
		Braces,
		List,
		Key
	} from 'lucide-svelte';

	// Firebase setup
	const auth = getAuth();
	const db = getFirestore();
	let user = null;
	let loading = false;
	let activeTab = 'visualizer';

	// JSON state
	let jsonInput = '';
	let jsonError = '';
	let parsedJson = null;
	let jsonKeys = [];
	let jsonHistory = [];
	let expandedNodes = new Set();
	let showDataTypes = true;
	let showArrayCounts = true;
	let searchQuery = '';
	let filteredKeys = [];
	let copiedText = '';
	let processingJson = false;

	// Sample JSON for demonstration
	const sampleJson = {
		user: {
			id: 1,
			name: 'John Doe',
			email: 'john@example.com',
			roles: ['admin', 'editor'],
			settings: {
				theme: 'dark',
				notifications: true,
				language: 'en'
			}
		},
		posts: [
			{
				id: 101,
				title: 'Getting Started with JSON',
				tags: ['json', 'tutorial', 'beginner'],
				comments: [
					{
						id: 1001,
						text: 'Great article!',
						author: 'Jane'
					},
					{
						id: 1002,
						text: 'Very helpful',
						author: 'Bob'
					}
				]
			},
			{
				id: 102,
				title: 'Advanced JSON Techniques',
				tags: ['json', 'advanced'],
				comments: []
			}
		],
		stats: {
			views: 1250,
			likes: 42,
			shares: 17
		}
	};

	// Function to parse JSON input
	function parseJsonInput() {
		processingJson = true;
		jsonError = '';

		try {
			if (!jsonInput.trim()) {
				jsonError = 'Please enter JSON data';
				parsedJson = null;
				jsonKeys = [];
				processingJson = false;
				return;
			}

			parsedJson = JSON.parse(jsonInput);
			extractKeys(parsedJson);

			// Save to history
			if (user) {
				saveToHistory(jsonInput);
			}
		} catch (error) {
			jsonError = `Invalid JSON: ${error.message}`;
			parsedJson = null;
			jsonKeys = [];
		}

		processingJson = false;
	}

	// Function to extract all keys from JSON
	function extractKeys(json, prefix = '') {
		jsonKeys = [];
		extractKeysRecursive(json, prefix);
		filteredKeys = [...jsonKeys];
	}

	// Recursive function to extract keys
	function extractKeysRecursive(obj, path = '', result = []) {
		if (obj === null || obj === undefined) {
			return;
		}

		if (Array.isArray(obj)) {
			// For arrays, we add the array itself as a key with its length
			jsonKeys.push({
				path,
				type: 'array',
				count: obj.length,
				value: `Array(${obj.length})`
			});

			// Process array items if they are objects
			if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
				extractKeysRecursive(obj[0], path ? `${path}[0]` : '[0]');
			}
		} else if (typeof obj === 'object') {
			// For objects, we process each key
			Object.keys(obj).forEach((key) => {
				const newPath = path ? `${path}.${key}` : key;
				const value = obj[key];

				if (typeof value === 'object' && value !== null) {
					// Add the object/array key
					if (Array.isArray(value)) {
						jsonKeys.push({
							path: newPath,
							type: 'array',
							count: value.length,
							value: `Array(${value.length})`
						});
					} else {
						jsonKeys.push({
							path: newPath,
							type: 'object',
							count: Object.keys(value).length,
							value: `Object(${Object.keys(value).length} keys)`
						});
					}

					// Recursively process nested objects/arrays
					extractKeysRecursive(value, newPath);
				} else {
					// Add primitive values
					jsonKeys.push({
						path: newPath,
						type: typeof value,
						value: value === null ? 'null' : String(value)
					});
				}
			});
		}
	}

	// Function to toggle node expansion
	function toggleNode(path) {
		if (expandedNodes.has(path)) {
			expandedNodes.delete(path);
		} else {
			expandedNodes.add(path);
		}
		expandedNodes = expandedNodes; // Trigger reactivity
	}

	// Function to check if a node should be expanded
	function isNodeExpanded(path) {
		return expandedNodes.has(path);
	}

	// Function to get child keys of a path
	function getChildKeys(path) {
		const pathPrefix = path ? `${path}.` : '';
		const directChildren = jsonKeys.filter((key) => {
			if (!path) {
				// Root level keys don't have a dot
				return !key.path.includes('.');
			}

			const keyPath = key.path;
			return (
				keyPath.startsWith(pathPrefix) &&
				keyPath.slice(pathPrefix.length).indexOf('.') === -1 &&
				keyPath !== path
			);
		});

		return directChildren;
	}

	// Function to get root level keys
	function getRootKeys() {
		return jsonKeys.filter((key) => !key.path.includes('.'));
	}

	// Function to filter keys based on search
	function filterKeys() {
		if (!searchQuery.trim()) {
			filteredKeys = [...jsonKeys];
			return;
		}

		const query = searchQuery.toLowerCase();
		filteredKeys = jsonKeys.filter(
			(key) =>
				key.path.toLowerCase().includes(query) || String(key.value).toLowerCase().includes(query)
		);

		// Expand all parent nodes of matched items
		filteredKeys.forEach((key) => {
			const parts = key.path.split('.');
			let currentPath = '';

			parts.forEach((part, index) => {
				if (index === 0) {
					currentPath = part;
				} else {
					currentPath += `.${part}`;
				}

				if (index < parts.length - 1) {
					expandedNodes.add(currentPath);
				}
			});
		});

		expandedNodes = expandedNodes; // Trigger reactivity
	}

	// Function to copy path to clipboard
	function copyPath(path) {
		navigator.clipboard.writeText(path);
		copiedText = path;
		setTimeout(() => {
			copiedText = '';
		}, 2000);
	}

	// Function to copy all keys to clipboard
	function copyAllKeys() {
		const keysText = jsonKeys.map((key) => key.path).join('\n');
		navigator.clipboard.writeText(keysText);
		copiedText = 'all-keys';
		setTimeout(() => {
			copiedText = '';
		}, 2000);
	}

	// Function to download keys as text file
	function downloadKeys() {
		const keysText = jsonKeys.map((key) => key.path).join('\n');
		const blob = new Blob([keysText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'json-keys.txt';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	// Function to load sample JSON
	function loadSampleJson() {
		jsonInput = JSON.stringify(sampleJson, null, 2);
		parseJsonInput();
	}

	// Function to clear the input
	function clearInput() {
		jsonInput = '';
		parsedJson = null;
		jsonKeys = [];
		filteredKeys = [];
		jsonError = '';
	}

	// Function to save to history
	async function saveToHistory(jsonData) {
		if (!user) return;

		try {
			const historyRef = doc(db, 'jsonHistory', user.uid);
			const historyDoc = await getDoc(historyRef);

			const newEntry = {
				timestamp: new Date(),
				json: jsonData.substring(0, 500), // Store a preview to save space
				keyCount: jsonKeys.length
			};

			if (historyDoc.exists()) {
				// Update existing history
				await updateDoc(historyRef, {
					entries: arrayUnion(newEntry)
				});
			} else {
				// Create new history document
				await setDoc(historyRef, {
					entries: [newEntry]
				});
			}
		} catch (error) {
			console.error('Error saving to history:', error);
		}
	}

	// Function to load history
	async function loadHistory() {
		if (!user) return;

		try {
			const historyRef = doc(db, 'jsonHistory', user.uid);
			const historyDoc = await getDoc(historyRef);

			if (historyDoc.exists()) {
				const data = historyDoc.data();
				jsonHistory = data.entries || [];
				// Sort by timestamp descending
				jsonHistory.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
			}
		} catch (error) {
			console.error('Error loading history:', error);
		}
	}

	// Function to format timestamp
	function formatTimestamp(timestamp) {
		if (!timestamp) return '';
		const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
		return date.toLocaleString();
	}

	// Watch for search query changes
	$: if (searchQuery !== undefined) {
		filterKeys();
	}

	onMount(() => {
		onAuthStateChanged(auth, (userData) => {
			if (userData) {
				user = userData;
				loadHistory();
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
					<Card.Title class="text-2xl">JSON Visualizer</Card.Title>
					<Card.Description>Extract and visualize JSON structure with tree mapping</Card.Description
					>
				</div>
				<div class="flex gap-2">
					<Button.Root variant="outline" class="gap-2" on:click={loadSampleJson}>
						<Code size={16} />
						Load Sample
					</Button.Root>
					<Button.Root variant="outline" class="gap-2" on:click={loadSampleJson}>
						<Code size={16} />
						Load Sample
					</Button.Root>
					<Button.Root variant="outline" class="gap-2" on:click={clearInput}>
						<RefreshCw size={16} />
						Clear
					</Button.Root>
				</div>
			</Card.Header>
		</Card.Root>

		<div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4">
			<!-- Main Content -->
			<div class="space-y-4">
				<Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)}>
					<Tabs.List class="w-full">
						<Tabs.Trigger value="visualizer" class="flex-1">
							<div class="flex items-center justify-center gap-2">
								<Braces size={16} />
								JSON Visualizer
							</div>
						</Tabs.Trigger>
						<Tabs.Trigger value="history" class="flex-1">
							<div class="flex items-center justify-center gap-2">
								<List size={16} />
								History
							</div>
						</Tabs.Trigger>
					</Tabs.List>

					<!-- Visualizer Tab -->
					<Tabs.Content value="visualizer" class="space-y-4 pt-4">
						<Card.Root>
							<Card.Header>
								<Card.Title>JSON Input</Card.Title>
								<Card.Description>Paste your JSON data below</Card.Description>
							</Card.Header>
							<Card.Content class="space-y-4">
								<Textarea.Root
									bind:value={jsonInput}
									placeholder="Paste your JSON here..."
									class="min-h-[200px] font-mono"
								/>

								{#if jsonError}
									<div
										class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2"
									>
										<AlertCircle size={18} class="mt-0.5" />
										<p>{jsonError}</p>
									</div>
								{/if}

								<div class="flex justify-center">
									<Button.Root
										class="gap-2 px-6 py-2"
										on:click={parseJsonInput}
										disabled={processingJson}
									>
										{#if processingJson}
											<div
												class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"
											></div>
											Processing...
										{:else}
											<Eye size={18} />
											Visualize JSON
										{/if}
									</Button.Root>
								</div>
							</Card.Content>
						</Card.Root>

						{#if parsedJson && jsonKeys.length > 0}
							<Card.Root>
								<Card.Header class="flex flex-row items-center justify-between">
									<div>
										<Card.Title>JSON Structure</Card.Title>
										<Card.Description>
											{jsonKeys.length} keys found in the JSON structure
										</Card.Description>
									</div>
									<div class="flex gap-2">
										<Button.Root variant="outline" size="sm" class="gap-1" on:click={copyAllKeys}>
											{#if copiedText === 'all-keys'}
												<Check size={14} />
												Copied!
											{:else}
												<Copy size={14} />
												Copy All
											{/if}
										</Button.Root>
										<Button.Root variant="outline" size="sm" class="gap-1" on:click={downloadKeys}>
											<Download size={14} />
											Download
										</Button.Root>
									</div>
								</Card.Header>
								<Card.Content>
									<div class="mb-4">
										<div class="relative">
											<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
											<Input.Root
												type="search"
												placeholder="Search keys..."
												class="pl-8"
												bind:value={searchQuery}
											/>
										</div>
									</div>

									<div class="flex items-center gap-4 mb-4">
										<div class="flex items-center space-x-2">
											<Switch.Root
												id="show-types"
												checked={showDataTypes}
												onCheckedChange={(checked) => (showDataTypes = checked)}
											/>
											<Label.Root for="show-types">Show Data Types</Label.Root>
										</div>
										<div class="flex items-center space-x-2">
											<Switch.Root
												id="show-counts"
												checked={showArrayCounts}
												onCheckedChange={(checked) => (showArrayCounts = checked)}
											/>
											<Label.Root for="show-counts">Show Array/Object Counts</Label.Root>
										</div>
									</div>

									<div class="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-auto">
										<div class="space-y-1">
											{#each getRootKeys() as key}
												<div class="font-mono">
													{#if key.type === 'object' || key.type === 'array'}
														<div class="flex items-center">
															<button
																class="mr-1 focus:outline-none"
																on:click={() => toggleNode(key.path)}
															>
																{#if isNodeExpanded(key.path)}
																	<ChevronDown size={16} />
																{:else}
																	<ChevronRight size={16} />
																{/if}
															</button>
															<span
																class="cursor-pointer hover:text-blue-600"
																on:click={() => toggleNode(key.path)}
															>
																<span class="font-semibold">{key.path}</span>
																{#if showDataTypes}
																	<span class="text-gray-500 text-sm ml-1">{key.type}</span>
																{/if}
																{#if showArrayCounts && key.count !== undefined}
																	<span class="text-gray-500 text-sm ml-1">
																		({key.count}
																		{key.type === 'array' ? 'items' : 'keys'})
																	</span>
																{/if}
															</span>
															<button
																class="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
																on:click={() => copyPath(key.path)}
																title="Copy path"
															>
																{#if copiedText === key.path}
																	<Check size={14} />
																{:else}
																	<Copy size={14} />
																{/if}
															</button>
														</div>
														{#if isNodeExpanded(key.path)}
															<div class="ml-6 border-l-2 border-gray-200 pl-2 mt-1">
																{#each getChildKeys(key.path) as childKey}
																	<div class="mt-1 font-mono">
																		{#if childKey.type === 'object' || childKey.type === 'array'}
																			<div class="flex items-center">
																				<button
																					class="mr-1 focus:outline-none"
																					on:click={() => toggleNode(childKey.path)}
																				>
																					{#if isNodeExpanded(childKey.path)}
																						<ChevronDown size={16} />
																					{:else}
																						<ChevronRight size={16} />
																					{/if}
																				</button>
																				<span
																					class="cursor-pointer hover:text-blue-600"
																					on:click={() => toggleNode(childKey.path)}
																				>
																					<span class="font-semibold">
																						{childKey.path.split('.').pop()}
																					</span>
																					{#if showDataTypes}
																						<span class="text-gray-500 text-sm ml-1">
																							{childKey.type}
																						</span>
																					{/if}
																					{#if showArrayCounts && childKey.count !== undefined}
																						<span class="text-gray-500 text-sm ml-1">
																							({childKey.count}
																							{childKey.type === 'array' ? 'items' : 'keys'})
																						</span>
																					{/if}
																				</span>
																				<button
																					class="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
																					on:click={() => copyPath(childKey.path)}
																					title="Copy path"
																				>
																					{#if copiedText === childKey.path}
																						<Check size={14} />
																					{:else}
																						<Copy size={14} />
																					{/if}
																				</button>
																			</div>
																			{#if isNodeExpanded(childKey.path)}
																				<div class="ml-6 border-l-2 border-gray-200 pl-2 mt-1">
																					{#each getChildKeys(childKey.path) as grandchildKey}
																						<div class="mt-1 font-mono">
																							<!-- Recursive rendering for deeper levels -->
																							<!-- For brevity, we're limiting to 3 levels in this example -->
																							<div class="flex items-center">
																								{#if grandchildKey.type === 'object' || grandchildKey.type === 'array'}
																									<button
																										class="mr-1 focus:outline-none"
																										on:click={() => toggleNode(grandchildKey.path)}
																									>
																										{#if isNodeExpanded(grandchildKey.path)}
																											<ChevronDown size={16} />
																										{:else}
																											<ChevronRight size={16} />
																										{/if}
																									</button>
																								{:else}
																									<div class="w-4 mr-1"></div>
																								{/if}
																								<span>
																									<span class="font-semibold">
																										{grandchildKey.path.split('.').pop()}
																									</span>
																									{#if showDataTypes}
																										<span class="text-gray-500 text-sm ml-1">
																											{grandchildKey.type}
																										</span>
																									{/if}
																									{#if showArrayCounts && grandchildKey.count !== undefined}
																										<span class="text-gray-500 text-sm ml-1">
																											({grandchildKey.count}
																											{grandchildKey.type === 'array'
																												? 'items'
																												: 'keys'})
																										</span>
																									{/if}
																								</span>
																								<button
																									class="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
																									on:click={() => copyPath(grandchildKey.path)}
																									title="Copy path"
																								>
																									{#if copiedText === grandchildKey.path}
																										<Check size={14} />
																									{:else}
																										<Copy size={14} />
																									{/if}
																								</button>
																							</div>
																						</div>
																					{/each}
																				</div>
																			{/if}
																		{:else}
																			<div class="flex items-center">
																				<div class="w-4 mr-1"></div>
																				<span>
																					<span class="font-semibold">
																						{childKey.path.split('.').pop()}
																					</span>
																					{#if showDataTypes}
																						<span class="text-gray-500 text-sm ml-1">
																							{childKey.type}
																						</span>
																					{/if}
																					<span class="text-gray-500 ml-2">
																						{childKey.value}
																					</span>
																				</span>
																				<button
																					class="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
																					on:click={() => copyPath(childKey.path)}
																					title="Copy path"
																				>
																					{#if copiedText === childKey.path}
																						<Check size={14} />
																					{:else}
																						<Copy size={14} />
																					{/if}
																				</button>
																			</div>
																		{/if}
																	</div>
																{/each}
															</div>
														{/if}
													{:else}
														<div class="flex items-center">
															<div class="w-4 mr-1"></div>
															<span>
																<span class="font-semibold">{key.path}</span>
																{#if showDataTypes}
																	<span class="text-gray-500 text-sm ml-1">{key.type}</span>
																{/if}
																<span class="text-gray-500 ml-2">{key.value}</span>
															</span>
															<button
																class="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
																on:click={() => copyPath(key.path)}
																title="Copy path"
															>
																{#if copiedText === key.path}
																	<Check size={14} />
																{:else}
																	<Copy size={14} />
																{/if}
															</button>
														</div>
													{/if}
												</div>
											{/each}
										</div>
									</div>
								</Card.Content>
							</Card.Root>
						{/if}
					</Tabs.Content>

					<!-- History Tab -->
					<Tabs.Content value="history" class="space-y-4 pt-4">
						{#if jsonHistory.length === 0}
							<div class="text-center py-12 bg-gray-50 rounded-lg">
								<FileText size={48} class="mx-auto text-gray-400 mb-4" />
								<h3 class="text-lg font-medium text-gray-700">No History Yet</h3>
								<p class="text-gray-500">Your JSON visualization history will appear here</p>
							</div>
						{:else}
							<Card.Root>
								<Card.Header>
									<Card.Title>Recent JSON Visualizations</Card.Title>
								</Card.Header>
								<Card.Content>
									<div class="space-y-3">
										{#each jsonHistory as item}
											<div
												class="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
												on:click={() => {
													jsonInput = item.json;
													parseJsonInput();
													activeTab = 'visualizer';
												}}
											>
												<div class="flex items-center justify-between mb-1">
													<span class="font-medium text-sm">
														{item.keyCount} keys extracted
													</span>
													<span class="text-xs text-gray-500">
														{formatTimestamp(item.timestamp)}
													</span>
												</div>
												<div
													class="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded overflow-hidden"
												>
													{item.json.length > 100 ? item.json.substring(0, 100) + '...' : item.json}
												</div>
											</div>
										{/each}
									</div>
								</Card.Content>
							</Card.Root>
						{/if}
					</Tabs.Content>
				</Tabs.Root>
			</div>

			<!-- Sidebar -->
			<div class="space-y-4">
				<!-- Stats Card -->
				<Card.Root>
					<Card.Header>
						<Card.Title>JSON Stats</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-2 gap-4 text-center">
							<div class="bg-blue-50 p-3 rounded-lg">
								<div class="text-2xl font-bold text-blue-600">{jsonKeys.length}</div>
								<div class="text-xs text-gray-600">Total Keys</div>
							</div>
							<div class="bg-green-50 p-3 rounded-lg">
								<div class="text-2xl font-bold text-green-600">
									{jsonKeys.filter((k) => k.type === 'object').length}
								</div>
								<div class="text-xs text-gray-600">Objects</div>
							</div>
							<div class="bg-purple-50 p-3 rounded-lg">
								<div class="text-2xl font-bold text-purple-600">
									{jsonKeys.filter((k) => k.type === 'array').length}
								</div>
								<div class="text-xs text-gray-600">Arrays</div>
							</div>
							<div class="bg-amber-50 p-3 rounded-lg">
								<div class="text-2xl font-bold text-amber-600">
									{jsonKeys.filter((k) => k.type !== 'object' && k.type !== 'array').length}
								</div>
								<div class="text-xs text-gray-600">Primitive Values</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Tips Card -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Tips & Information</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							<div class="flex gap-3">
								<div class="bg-blue-100 text-blue-600 p-2 rounded-full h-fit">
									<Key size={16} />
								</div>
								<div>
									<h4 class="font-medium text-sm">Path Navigation</h4>
									<p class="text-sm text-gray-600">
										Click on object and array keys to expand and collapse their contents.
									</p>
								</div>
							</div>
							<div class="flex gap-3">
								<div class="bg-green-100 text-green-600 p-2 rounded-full h-fit">
									<Copy size={16} />
								</div>
								<div>
									<h4 class="font-medium text-sm">Copy Paths</h4>
									<p class="text-sm text-gray-600">
										Click the copy icon to copy the full path to any key for easy access in your
										code.
									</p>
								</div>
							</div>
							<div class="flex gap-3">
								<div class="bg-purple-100 text-purple-600 p-2 rounded-full h-fit">
									<Search size={16} />
								</div>
								<div>
									<h4 class="font-medium text-sm">Search</h4>
									<p class="text-sm text-gray-600">
										Use the search box to quickly find specific keys or values in large JSON
										structures.
									</p>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Quick Actions -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Quick Actions</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-2">
							<Button.Root
								variant="outline"
								class="w-full justify-start gap-2"
								on:click={loadSampleJson}
							>
								<Code size={16} />
								Load Sample JSON
							</Button.Root>
							<Button.Root
								variant="outline"
								class="w-full justify-start gap-2"
								on:click={() => (activeTab = 'history')}
							>
								<FileText size={16} />
								View History
							</Button.Root>
							<Button.Root
								variant="outline"
								class="w-full justify-start gap-2"
								on:click={clearInput}
								disabled={!jsonInput}
							>
								<RefreshCw size={16} />
								Clear Input
							</Button.Root>
							{#if jsonKeys.length > 0}
								<Button.Root
									variant="outline"
									class="w-full justify-start gap-2"
									on:click={downloadKeys}
								>
									<Download size={16} />
									Download All Keys
								</Button.Root>
							{/if}
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar for the JSON tree view */
	:global(.overflow-auto::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
	}

	:global(.overflow-auto::-webkit-scrollbar-track) {
		background: #f1f1f1;
		border-radius: 10px;
	}

	:global(.overflow-auto::-webkit-scrollbar-thumb) {
		background: #d1d5db;
		border-radius: 10px;
	}

	:global(.overflow-auto::-webkit-scrollbar-thumb:hover) {
		background: #9ca3af;
	}
</style>
