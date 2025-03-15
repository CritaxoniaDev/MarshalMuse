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
	import * as Dialog from '$lib/components/ui/dialog';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import {
		getFirestore,
		collection,
		doc,
		setDoc,
		getDoc,
		updateDoc,
		deleteDoc,
		query,
		where,
		getDocs,
		orderBy,
		limit
	} from 'firebase/firestore';
	import {
		Clipboard,
		Code2,
		Copy,
		Trash,
		Search,
		Plus,
		Save,
		Tag,
		Edit,
		FolderPlus,
		Folder,
		Star,
		StarOff,
		Download,
		Share,
		Filter,
		SortAsc,
		SortDesc,
		Clock,
		AlertCircle,
		Check,
		X
	} from 'lucide-svelte';

	// Firebase setup
	const auth = getAuth();
	const db = getFirestore();
	let user = null;
	let loading = true;
	let activeTab = 'all';
	let searchQuery = '';
	let selectedLanguage = 'all';
	let selectedFolder = 'all';
	let sortBy = 'newest';

	// Snippet state
	let snippets = [];
	let folders = [];
	let tags = [];
	let filteredSnippets = [];
	let savingSnippet = false;
	let editingSnippet = null;
	let deleteSnippetId = null;
	let showDeleteDialog = false;
	let showNewFolderDialog = false;
	let newFolderName = '';
	let copiedSnippetId = null;

	// New snippet form
	let newSnippetOpen = false;
	let snippetTitle = '';
	let snippetDescription = '';
	let snippetCode = '';
	let snippetLanguage = 'javascript';
	let snippetTags = '';
	let snippetFolder = 'default';
	let formError = '';

	// Programming languages
	const languages = [
		{ value: 'javascript', label: 'JavaScript' },
		{ value: 'typescript', label: 'TypeScript' },
		{ value: 'html', label: 'HTML' },
		{ value: 'css', label: 'CSS' },
		{ value: 'python', label: 'Python' },
		{ value: 'java', label: 'Java' },
		{ value: 'csharp', label: 'C#' },
		{ value: 'cpp', label: 'C++' },
		{ value: 'php', label: 'PHP' },
		{ value: 'ruby', label: 'Ruby' },
		{ value: 'go', label: 'Go' },
		{ value: 'rust', label: 'Rust' },
		{ value: 'swift', label: 'Swift' },
		{ value: 'kotlin', label: 'Kotlin' },
		{ value: 'sql', label: 'SQL' },
		{ value: 'bash', label: 'Bash' },
		{ value: 'json', label: 'JSON' },
		{ value: 'markdown', label: 'Markdown' },
		{ value: 'yaml', label: 'YAML' },
		{ value: 'xml', label: 'XML' }
	];

	// Load snippets from Firebase
	// Load snippets from Firebase
	async function loadSnippetsFromFirebase(userId) {
		try {
			// Get user's snippets
			const snippetsRef = collection(db, 'codeSnippets');
			// Remove orderBy to avoid needing the composite index
			const q = query(snippetsRef, where('userId', '==', userId));
			const querySnapshot = await getDocs(q);

			snippets = querySnapshot.docs
				.map((doc) => ({
					id: doc.id,
					...doc.data(),
					createdAt: doc.data().createdAt?.toDate() || new Date()
				}))
				.sort((a, b) => b.createdAt - a.createdAt); // Sort in memory

			// Extract unique folders and tags
			const uniqueFolders = new Set();
			const uniqueTags = new Set();

			snippets.forEach((snippet) => {
				if (snippet.folder) uniqueFolders.add(snippet.folder);
				if (snippet.tags && Array.isArray(snippet.tags)) {
					snippet.tags.forEach((tag) => uniqueTags.add(tag));
				}
			});

			folders = Array.from(uniqueFolders);
			tags = Array.from(uniqueTags);

			// Apply initial filtering
			applyFilters();
			loading = false;
		} catch (error) {
			console.error('Error loading snippets:', error);
			loading = false;
		}
	}

	// Save snippet to Firebase
	async function saveSnippetToFirebase() {
		if (!user) return;
		if (!snippetTitle.trim() || !snippetCode.trim()) {
			formError = 'Title and code are required';
			return;
		}

		try {
			savingSnippet = true;
			formError = '';

			// Process tags
			const processedTags = snippetTags
				.split(',')
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0);

			const snippetData = {
				userId: user.uid,
				title: snippetTitle.trim(),
				description: snippetDescription.trim(),
				code: snippetCode,
				language: snippetLanguage,
				tags: processedTags,
				folder: snippetFolder || 'default',
				isFavorite: false,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			let docRef;
			if (editingSnippet) {
				// Update existing snippet
				docRef = doc(db, 'codeSnippets', editingSnippet.id);
				await updateDoc(docRef, {
					...snippetData,
					createdAt: editingSnippet.createdAt,
					isFavorite: editingSnippet.isFavorite
				});
			} else {
				// Create new snippet
				docRef = doc(collection(db, 'codeSnippets'));
				await setDoc(docRef, snippetData);
			}

			// Reload snippets
			await loadSnippetsFromFirebase(user.uid);

			// Reset form
			resetSnippetForm();
			newSnippetOpen = false;
		} catch (error) {
			console.error('Error saving snippet:', error);
			formError = 'Error saving snippet. Please try again.';
		} finally {
			savingSnippet = false;
		}
	}

	// Delete snippet from Firebase
	async function deleteSnippetFromFirebase(snippetId) {
		if (!user || !snippetId) return;

		try {
			await deleteDoc(doc(db, 'codeSnippets', snippetId));
			snippets = snippets.filter((snippet) => snippet.id !== snippetId);
			applyFilters();
		} catch (error) {
			console.error('Error deleting snippet:', error);
		} finally {
			showDeleteDialog = false;
			deleteSnippetId = null;
		}
	}

	// Toggle favorite status
	async function toggleFavorite(snippet) {
		if (!user) return;

		try {
			const docRef = doc(db, 'codeSnippets', snippet.id);
			await updateDoc(docRef, {
				isFavorite: !snippet.isFavorite
			});

			// Update local state
			snippets = snippets.map((s) =>
				s.id === snippet.id ? { ...s, isFavorite: !s.isFavorite } : s
			);
			applyFilters();
		} catch (error) {
			console.error('Error updating favorite status:', error);
		}
	}

	// Create new folder
	async function createNewFolder() {
		if (!user || !newFolderName.trim()) return;

		try {
			// Add folder to the list
			folders = [...folders, newFolderName.trim()];

			// Close dialog and reset
			showNewFolderDialog = false;
			newFolderName = '';

			// If we're in the new snippet form, select the new folder
			if (newSnippetOpen) {
				snippetFolder = folders[folders.length - 1];
			}
		} catch (error) {
			console.error('Error creating folder:', error);
		}
	}

	// Apply filters to snippets
	function applyFilters() {
		let results = [...snippets];

		// Filter by tab (all, favorites, or specific folder)
		if (activeTab === 'favorites') {
			results = results.filter((snippet) => snippet.isFavorite);
		} else if (activeTab !== 'all') {
			// Tab is a folder name
			results = results.filter((snippet) => snippet.folder === activeTab);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			results = results.filter(
				(snippet) =>
					snippet.title.toLowerCase().includes(query) ||
					snippet.description.toLowerCase().includes(query) ||
					snippet.code.toLowerCase().includes(query) ||
					(snippet.tags && snippet.tags.some((tag) => tag.toLowerCase().includes(query)))
			);
		}

		// Filter by language
		if (selectedLanguage !== 'all') {
			results = results.filter((snippet) => snippet.language === selectedLanguage);
		}

		// Sort results
		if (sortBy === 'newest') {
			results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		} else if (sortBy === 'oldest') {
			results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
		} else if (sortBy === 'az') {
			results.sort((a, b) => a.title.localeCompare(b.title));
		} else if (sortBy === 'za') {
			results.sort((a, b) => b.title.localeCompare(a.title));
		}

		filteredSnippets = results;
	}

	// Copy snippet code to clipboard
	function copyToClipboard(text, snippetId) {
		navigator.clipboard.writeText(text).then(() => {
			copiedSnippetId = snippetId;
			setTimeout(() => {
				copiedSnippetId = null;
			}, 2000);
		});
	}

	// Download snippet as file
	function downloadSnippet(snippet) {
		const fileExtension = getFileExtension(snippet.language);
		const fileName = `${snippet.title.replace(/\s+/g, '_').toLowerCase()}${fileExtension}`;
		const blob = new Blob([snippet.code], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	// Get file extension based on language
	function getFileExtension(language) {
		const extensions = {
			javascript: '.js',
			typescript: '.ts',
			html: '.html',
			css: '.css',
			python: '.py',
			java: '.java',
			csharp: '.cs',
			cpp: '.cpp',
			php: '.php',
			ruby: '.rb',
			go: '.go',
			rust: '.rs',
			swift: '.swift',
			kotlin: '.kt',
			sql: '.sql',
			bash: '.sh',
			json: '.json',
			markdown: '.md',
			yaml: '.yml',
			xml: '.xml'
		};
		return extensions[language] || '.txt';
	}

	// Format date
	function formatDate(date) {
		if (!date) return '';
		const d = new Date(date);
		return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
	}

	// Reset snippet form
	function resetSnippetForm() {
		snippetTitle = '';
		snippetDescription = '';
		snippetCode = '';
		snippetLanguage = 'javascript';
		snippetTags = '';
		snippetFolder = 'default';
		editingSnippet = null;
		formError = '';
	}

	// Edit snippet
	function editSnippet(snippet) {
		editingSnippet = snippet;
		snippetTitle = snippet.title;
		snippetDescription = snippet.description || '';
		snippetCode = snippet.code;
		snippetLanguage = snippet.language;
		snippetTags = snippet.tags ? snippet.tags.join(', ') : '';
		snippetFolder = snippet.folder || 'default';
		newSnippetOpen = true;
	}

	// Get language label
	function getLanguageLabel(value) {
		const language = languages.find((lang) => lang.value === value);
		return language ? language.label : value;
	}

	// Get language color class
	function getLanguageColorClass(language) {
		const colors = {
			javascript: 'bg-yellow-100 text-yellow-800',
			typescript: 'bg-blue-100 text-blue-800',
			html: 'bg-orange-100 text-orange-800',
			css: 'bg-purple-100 text-purple-800',
			python: 'bg-green-100 text-green-800',
			java: 'bg-red-100 text-red-800',
			csharp: 'bg-indigo-100 text-indigo-800',
			cpp: 'bg-pink-100 text-pink-800',
			php: 'bg-violet-100 text-violet-800',
			ruby: 'bg-red-100 text-red-800',
			go: 'bg-cyan-100 text-cyan-800',
			rust: 'bg-amber-100 text-amber-800',
			swift: 'bg-orange-100 text-orange-800',
			kotlin: 'bg-purple-100 text-purple-800',
			sql: 'bg-blue-100 text-blue-800',
			bash: 'bg-gray-100 text-gray-800',
			json: 'bg-yellow-100 text-yellow-800',
			markdown: 'bg-blue-100 text-blue-800',
			yaml: 'bg-teal-100 text-teal-800',
			xml: 'bg-gray-100 text-gray-800'
		};
		return colors[language] || 'bg-gray-100 text-gray-800';
	}

	// Watch for changes and apply filters
	$: {
		if (snippets) {
			applyFilters();
		}
	}

	onMount(() => {
		onAuthStateChanged(auth, (userData) => {
			if (userData) {
				user = userData;
				loadSnippetsFromFirebase(userData.uid);
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
					<Card.Title class="text-2xl">Code Snippet Manager</Card.Title>
					<Card.Description>Store, organize and share your code snippets</Card.Description>
				</div>
				<div class="flex gap-2">
					<Button.Root
						variant="outline"
						class="gap-2"
						on:click={() => (showNewFolderDialog = true)}
					>
						<FolderPlus size={16} />
						New Folder
					</Button.Root>
					<Button.Root
						class="gap-2"
						on:click={() => {
							resetSnippetForm();
							newSnippetOpen = true;
						}}
					>
						<Plus size={16} />
						New Snippet
					</Button.Root>
				</div>
			</Card.Header>
		</Card.Root>

		<div class="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-4">
			<!-- Sidebar -->
			<div class="space-y-4">
				<!-- Search -->
				<div class="relative">
					<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
					<Input.Root
						type="search"
						placeholder="Search snippets..."
						class="pl-8"
						bind:value={searchQuery}
						on:input={applyFilters}
					/>
				</div>

				<!-- Folders -->
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium">Folders</Card.Title>
					</Card.Header>
					<Card.Content class="pt-0">
						<div class="space-y-1">
							<Button.Root
								variant={activeTab === 'all' ? 'default' : 'ghost'}
								class="w-full justify-start"
								on:click={() => (activeTab = 'all')}
							>
								<Folder size={16} class="mr-2" />
								All Snippets
							</Button.Root>
							<Button.Root
								variant={activeTab === 'favorites' ? 'default' : 'ghost'}
								class="w-full justify-start"
								on:click={() => (activeTab = 'favorites')}
							>
								<Star size={16} class="mr-2" />
								Favorites
							</Button.Root>
							{#each folders as folder}
								<Button.Root
									variant={activeTab === folder ? 'default' : 'ghost'}
									class="w-full justify-start"
									on:click={() => (activeTab = folder)}
								>
									<Folder size={16} class="mr-2" />
									{folder}
								</Button.Root>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Filters -->
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium">Filters</Card.Title>
					</Card.Header>
					<Card.Content class="pt-0 space-y-4">
						<div>
							<Label.Root for="language-filter" class="text-xs mb-1.5 block">Language</Label.Root>
							<Select.Root
								value={selectedLanguage}
								onValueChange={(value) => {
									selectedLanguage = value;
									applyFilters();
								}}
							>
								<Select.Trigger id="language-filter" class="w-full">
									<Select.Value placeholder="Select language" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="all">All Languages</Select.Item>
									{#each languages as language}
										<Select.Item value={language.value}>{language.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>

						<div>
							<Label.Root for="sort-filter" class="text-xs mb-1.5 block">Sort By</Label.Root>
							<Select.Root
								value={sortBy}
								onValueChange={(value) => {
									sortBy = value;
									applyFilters();
								}}
							>
								<Select.Trigger id="sort-filter" class="w-full">
									<Select.Value placeholder="Sort by" />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="newest">Newest First</Select.Item>
									<Select.Item value="oldest">Oldest First</Select.Item>
									<Select.Item value="az">A-Z</Select.Item>
									<Select.Item value="za">Z-A</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Stats -->
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-sm font-medium">Stats</Card.Title>
					</Card.Header>
					<Card.Content class="pt-0">
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-sm text-gray-500">Total Snippets</span>
								<span class="font-medium">{snippets.length}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-sm text-gray-500">Favorites</span>
								<span class="font-medium">
									{snippets.filter((s) => s.isFavorite).length}
								</span>
							</div>
							<div class="flex justify-between">
								<span class="text-sm text-gray-500">Folders</span>
								<span class="font-medium">{folders.length}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-sm text-gray-500">Languages</span>
								<span class="font-medium">
									{new Set(snippets.map((s) => s.language)).size}
								</span>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<!-- Main Content -->
			<div>
				{#if loading}
					<div class="flex justify-center items-center h-64">
						<div
							class="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"
						></div>
					</div>
				{:else if filteredSnippets.length === 0}
					<div class="bg-gray-50 rounded-lg p-8 text-center">
						<Clipboard size={48} class="mx-auto text-gray-400 mb-4" />
						<h3 class="text-lg font-medium text-gray-700 mb-1">No snippets found</h3>
						<p class="text-gray-500 mb-4">
							{searchQuery
								? 'Try adjusting your search or filters'
								: 'Create your first code snippet to get started'}
						</p>
						<Button.Root
							on:click={() => {
								resetSnippetForm();
								newSnippetOpen = true;
							}}
						>
							<Plus size={16} class="mr-1" />
							New Snippet
						</Button.Root>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
						{#each filteredSnippets as snippet (snippet.id)}
							<Card.Root class="h-full flex flex-col">
								<Card.Header class="pb-2">
									<div class="flex justify-between items-start">
										<Card.Title class="text-lg">{snippet.title}</Card.Title>
										<div class="flex gap-1">
											<Button.Root
												variant="ghost"
												size="icon"
												class="h-8 w-8"
												on:click={() => toggleFavorite(snippet)}
												title={snippet.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
											>
												{#if snippet.isFavorite}
													<Star size={16} class="text-yellow-500 fill-yellow-500" />
												{:else}
													<Star size={16} />
												{/if}
											</Button.Root>
											<Button.Root
												variant="ghost"
												size="icon"
												class="h-8 w-8"
												on:click={() => editSnippet(snippet)}
												title="Edit snippet"
											>
												<Edit size={16} />
											</Button.Root>
											<Button.Root
												variant="ghost"
												size="icon"
												class="h-8 w-8"
												on:click={() => {
													deleteSnippetId = snippet.id;
													showDeleteDialog = true;
												}}
												title="Delete snippet"
											>
												<Trash size={16} />
											</Button.Root>
										</div>
									</div>
									{#if snippet.description}
										<Card.Description>{snippet.description}</Card.Description>
									{/if}
								</Card.Header>
								<Card.Content class="pb-2 flex-grow">
									<div
										class="bg-gray-50 rounded-md p-3 font-mono text-sm overflow-x-auto max-h-[200px] mb-3"
									>
										<pre class="whitespace-pre-wrap break-all">{snippet.code}</pre>
									</div>
									<div class="flex flex-wrap gap-2 mb-2">
										<span
											class={`text-xs px-2 py-1 rounded-full ${getLanguageColorClass(
												snippet.language
											)}`}
										>
											{getLanguageLabel(snippet.language)}
										</span>
										{#if snippet.folder}
											<span
												class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center"
											>
												<Folder size={12} class="mr-1" />
												{snippet.folder}
											</span>
										{/if}
										{#each snippet.tags || [] as tag}
											<span
												class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 flex items-center"
											>
												<Tag size={12} class="mr-1" />
												{tag}
											</span>
										{/each}
									</div>
								</Card.Content>
								<Card.Footer class="pt-0 mt-auto">
									<div class="flex items-center justify-between w-full">
										<span class="text-xs text-gray-500 flex items-center">
											<Clock size={12} class="mr-1" />
											{formatDate(snippet.createdAt)}
										</span>
										<div class="flex gap-1">
											<Button.Root
												variant="ghost"
												size="sm"
												class="h-8 px-2"
												on:click={() => copyToClipboard(snippet.code, snippet.id)}
											>
												{#if copiedSnippetId === snippet.id}
													<Check size={14} class="mr-1" />
													Copied!
												{:else}
													<Copy size={14} class="mr-1" />
													Copy
												{/if}
											</Button.Root>
											<Button.Root
												variant="ghost"
												size="sm"
												class="h-8 px-2"
												on:click={() => downloadSnippet(snippet)}
											>
												<Download size={14} class="mr-1" />
												Download
											</Button.Root>
										</div>
									</div>
								</Card.Footer>
							</Card.Root>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- New Snippet Dialog -->
<Dialog.Root open={newSnippetOpen} onOpenChange={(open) => (newSnippetOpen = open)}>
	<Dialog.Content class="sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>{editingSnippet ? 'Edit Snippet' : 'New Code Snippet'}</Dialog.Title>
			<Dialog.Description>
				{editingSnippet
					? 'Update your code snippet details below.'
					: 'Add a new code snippet to your collection.'}
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-4">
			{#if formError}
				<div
					class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2"
				>
					<AlertCircle size={18} class="mt-0.5" />
					<p>{formError}</p>
				</div>
			{/if}

			<div class="grid grid-cols-1 gap-4">
				<div>
					<Label.Root for="snippet-title" class="text-sm font-medium mb-1.5 block">
						Title <span class="text-red-500">*</span>
					</Label.Root>
					<Input.Root
						id="snippet-title"
						bind:value={snippetTitle}
						placeholder="Enter a title for your snippet"
						required
					/>
				</div>

				<div>
					<Label.Root for="snippet-description" class="text-sm font-medium mb-1.5 block">
						Description
					</Label.Root>
					<Input.Root
						id="snippet-description"
						bind:value={snippetDescription}
						placeholder="Optional description"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<Label.Root for="snippet-language" class="text-sm font-medium mb-1.5 block">
							Language
						</Label.Root>
						<Select.Root
							value={snippetLanguage}
							onValueChange={(value) => (snippetLanguage = value)}
						>
							<Select.Trigger id="snippet-language" class="w-full">
								<Select.Value placeholder="Select language" />
							</Select.Trigger>
							<Select.Content>
								{#each languages as language}
									<Select.Item value={language.value}>{language.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div>
						<Label.Root for="snippet-folder" class="text-sm font-medium mb-1.5 block">
							Folder
						</Label.Root>
						<Select.Root value={snippetFolder} onValueChange={(value) => (snippetFolder = value)}>
							<Select.Trigger id="snippet-folder" class="w-full">
								<Select.Value placeholder="Select folder" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="default">Default</Select.Item>
								{#each folders as folder}
									{#if folder !== 'default'}
										<Select.Item value={folder}>{folder}</Select.Item>
									{/if}
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
				</div>

				<div>
					<Label.Root for="snippet-tags" class="text-sm font-medium mb-1.5 block">
						Tags (comma separated)
					</Label.Root>
					<Input.Root
						id="snippet-tags"
						bind:value={snippetTags}
						placeholder="e.g. react, hooks, authentication"
					/>
				</div>

				<div>
					<Label.Root for="snippet-code" class="text-sm font-medium mb-1.5 block">
						Code <span class="text-red-500">*</span>
					</Label.Root>
					<Textarea.Root
						id="snippet-code"
						bind:value={snippetCode}
						placeholder="Paste your code here..."
						class="min-h-[200px] font-mono"
						required
					/>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button.Root variant="outline" on:click={() => (newSnippetOpen = false)}>Cancel</Button.Root>
			<Button.Root on:click={saveSnippetToFirebase} disabled={savingSnippet}>
				{#if savingSnippet}
					<div
						class="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"
					></div>
					Saving...
				{:else}
					<Save size={16} class="mr-2" />
					{editingSnippet ? 'Update Snippet' : 'Save Snippet'}
				{/if}
			</Button.Root>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Confirmation Dialog -->
<AlertDialog.Root open={showDeleteDialog} onOpenChange={(open) => (showDeleteDialog = open)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Snippet</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this snippet? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action on:click={() => deleteSnippetFromFirebase(deleteSnippetId)}>
				<Trash size={16} class="mr-2" />
				Delete
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<!-- New Folder Dialog -->
<Dialog.Root open={showNewFolderDialog} onOpenChange={(open) => (showNewFolderDialog = open)}>
	<Dialog.Content class="sm:max-w-[400px]">
		<Dialog.Header>
			<Dialog.Title>Create New Folder</Dialog.Title>
			<Dialog.Description>Create a new folder to organize your code snippets.</Dialog.Description>
		</Dialog.Header>
		<div class="py-4">
			<Label.Root for="folder-name" class="text-sm font-medium mb-1.5 block">
				Folder Name
			</Label.Root>
			<Input.Root
				id="folder-name"
				bind:value={newFolderName}
				placeholder="Enter folder name"
				autofocus
			/>
		</div>
		<Dialog.Footer>
			<Button.Root variant="outline" on:click={() => (showNewFolderDialog = false)}>
				Cancel
			</Button.Root>
			<Button.Root on:click={createNewFolder} disabled={!newFolderName.trim()}>
				<FolderPlus size={16} class="mr-2" />
				Create Folder
			</Button.Root>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style>
	/* Custom scrollbar for code blocks */
	:global(.overflow-x-auto::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
	}

	:global(.overflow-x-auto::-webkit-scrollbar-track) {
		background: #f1f1f1;
		border-radius: 10px;
	}

	:global(.overflow-x-auto::-webkit-scrollbar-thumb) {
		background: #d1d5db;
		border-radius: 10px;
	}

	:global(.overflow-x-auto::-webkit-scrollbar-thumb:hover) {
		background: #9ca3af;
	}

	/* Ensure pre tags wrap properly */
	:global(pre) {
		white-space: pre-wrap;
		word-break: break-word;
	}
</style>
