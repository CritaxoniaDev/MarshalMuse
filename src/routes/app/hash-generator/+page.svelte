<script>
	import { onMount } from 'svelte';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Button from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Textarea from '$lib/components/ui/textarea';
	import * as Separator from '$lib/components/ui/separator';
	import * as Select from '$lib/components/ui/select';
	import * as Switch from '$lib/components/ui/switch';
	import * as Label from '$lib/components/ui/label';
	import * as Input from '$lib/components/ui/input';
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
		getDocs,
		deleteDoc
	} from 'firebase/firestore';
	import {
		Hash,
		FileText,
		Upload,
		Copy,
		Download,
		RotateCcw,
		Check,
		AlertCircle,
		Info,
		Shield,
		Key,
		Lock,
		Clipboard
	} from 'lucide-svelte';

	// Firebase setup
	const auth = getAuth();
	const db = getFirestore();
	let user = null;
	let loading = true;
	let activeTab = 'text';

	// Text hashing
	let textInput = '';
	let textHashes = {};
	let selectedAlgorithm = 'sha256';
	let textError = '';
	let textCopied = {};
	let caseSensitive = true;
	let trimWhitespace = true;

	// File hashing
	let fileInput = null;
	let fileName = '';
	let fileSize = '';
	let fileHashes = {};
	let fileError = '';
	let fileCopied = {};
	let dragActive = false;
	let hashingProgress = 0;
	let isHashing = false;

	// Hash algorithms
	const algorithms = [
		{ value: 'md5', label: 'MD5', description: 'Fast but not cryptographically secure' },
		{ value: 'sha1', label: 'SHA-1', description: 'Legacy algorithm, avoid for security' },
		{ value: 'sha256', label: 'SHA-256', description: 'Secure and widely used' },
		{ value: 'sha384', label: 'SHA-384', description: 'More secure variant of SHA-2' },
		{ value: 'sha512', label: 'SHA-512', description: 'Most secure SHA-2 variant' }
	];

	// History
	let history = [];
	let savingToFirebase = false;

	// Hash verification
	let verifyMode = false;
	let expectedHash = '';
	let verificationResult = null;

	// Load history from Firebase
	async function loadHistoryFromFirebase(userId) {
		try {
			const historyDocRef = doc(db, 'hashHistory', userId);
			const historyDoc = await getDoc(historyDocRef);

			if (historyDoc.exists()) {
				history = historyDoc.data().items || [];
			} else {
				await setDoc(historyDocRef, { items: [] });
				history = [];
			}

			loading = false;
		} catch (error) {
			console.error('Error loading history from Firebase:', error);
			loading = false;
		}
	}

	// Save history to Firebase
	async function saveHistoryToFirebase() {
		if (!user || savingToFirebase) return;

		try {
			savingToFirebase = true;
			const historyDocRef = doc(db, 'hashHistory', user.uid);

			const historyToSave = history.map((item) => ({
				...item,
				input: item.input.length > 500 ? item.input.substring(0, 500) + '...' : item.input
			}));

			await setDoc(historyDocRef, { items: historyToSave });
		} catch (error) {
			console.error('Error saving history to Firebase:', error);
		} finally {
			savingToFirebase = false;
		}
	}

	// Clear history from Firebase
	async function clearHistoryFromFirebase() {
		if (!user) return;

		try {
			const historyDocRef = doc(db, 'hashHistory', user.uid);
			await setDoc(historyDocRef, { items: [] });
		} catch (error) {
			console.error('Error clearing history from Firebase:', error);
		}
	}

	// Hash functions using Web Crypto API
	async function hashText(text, algorithm) {
		const encoder = new TextEncoder();
		const data = encoder.encode(text);
		const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase().replace(/(\d+)/, '-$1'), data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	}

	// MD5 implementation (since Web Crypto API doesn't support MD5)
	function md5(string) {
		function md5cycle(x, k) {
			var a = x[0], b = x[1], c = x[2], d = x[3];
			a = ff(a, b, c, d, k[0], 7, -680876936);
			d = ff(d, a, b, c, k[1], 12, -389564586);
			c = ff(c, d, a, b, k[2], 17, 606105819);
			b = ff(b, c, d, a, k[3], 22, -1044525330);
			a = ff(a, b, c, d, k[4], 7, -176418897);
			d = ff(d, a, b, c, k[5], 12, 1200080426);
			c = ff(c, d, a, b, k[6], 17, -1473231341);
			b = ff(b, c, d, a, k[7], 22, -45705983);
			a = ff(a, b, c, d, k[8], 7, 1770035416);
			d = ff(d, a, b, c, k[9], 12, -1958414417);
			c = ff(c, d, a, b, k[10], 17, -42063);
			b = ff(b, c, d, a, k[11], 22, -1990404162);
			a = ff(a, b, c, d, k[12], 7, 1804603682);
			d = ff(d, a, b, c, k[13], 12, -40341101);
			c = ff(c, d, a, b, k[14], 17, -1502002290);
			b = ff(b, c, d, a, k[15], 22, 1236535329);
			a = gg(a, b, c, d, k[1], 5, -165796510);
			d = gg(d, a, b, c, k[6], 9, -1069501632);
			c = gg(c, d, a, b, k[11], 14, 643717713);
			b = gg(b, c, d, a, k[0], 20, -373897302);
			a = gg(a, b, c, d, k[5], 5, -701558691);
			d = gg(d, a, b, c, k[10], 9, 38016083);
			c = gg(c, d, a, b, k[15], 14, -660478335);
			b = gg(b, c, d, a, k[4], 20, -405537848);
			a = gg(a, b, c, d, k[9], 5, 568446438);
			d = gg(d, a, b, c, k[14], 9, -1019803690);
			c = gg(c, d, a, b, k[3], 14, -187363961);
			b = gg(b, c, d, a, k[8], 20, 1163531501);
			a = gg(a, b, c, d, k[13], 5, -1444681467);
			d = gg(d, a, b, c, k[2], 9, -51403784);
			c = gg(c, d, a, b, k[7], 14, 1735328473);
			b = gg(b, c, d, a, k[12], 20, -1926607734);
			a = hh(a, b, c, d, k[5], 4, -378558);
			d = hh(d, a, b, c, k[8], 11, -2022574463);
			c = hh(c, d, a, b, k[11], 16, 1839030562);
			b = hh(b, c, d, a, k[14], 23, -35309556);
			a = hh(a, b, c, d, k[1], 4, -1530992060);
			d = hh(d, a, b, c, k[4], 11, 1272893353);
			c = hh(c, d, a, b, k[7], 16, -155497632);
			b = hh(b, c, d, a, k[10], 23, -1094730640);
			a = hh(a, b, c, d, k[13], 4, 681279174);
			d = hh(d, a, b, c, k[0], 11, -358537222);
			c = hh(c, d, a, b, k[3], 16, -722521979);
			b = hh(b, c, d, a, k[6], 23, 76029189);
			a = hh(a, b, c, d, k[9], 4, -640364487);
			d = hh(d, a, b, c, k[12], 11, -421815835);
			c = hh(c, d, a, b, k[15], 16, 530742520);
			b = hh(b, c, d, a, k[2], 23, -995338651);
			a = ii(a, b, c, d, k[0], 6, -198630844);
			d = ii(d, a, b, c, k[7], 10, 1126891415);
			c = ii(c, d, a, b, k[14], 15, -1416354905);
			b = ii(b, c, d, a, k[5], 21, -57434055);
			a = ii(a, b, c, d, k[12], 6, 1700485571);
			d = ii(d, a, b, c, k[3], 10, -1894986606);
			c = ii(c, d, a, b, k[10], 15, -1051523);
			b = ii(b, c, d, a, k[1], 21, -2054922799);
			a = ii(a, b, c, d, k[8], 6, 1873313359);
			d = ii(d, a, b, c, k[15], 10, -30611744);
			c = ii(c, d, a, b, k[6], 15, -1560198380);
			b = ii(b, c, d, a, k[13], 21, 1309151649);
			a = ii(a, b, c, d, k[4], 6, -145523070);
			d = ii(d, a, b, c, k[11], 10, -1120210379);
			c = ii(c, d, a, b, k[2], 15, 718787259);
			b = ii(b, c, d, a, k[9], 21, -343485551);
			x[0] = add32(a, x[0]);
			x[1] = add32(b, x[1]);
			x[2] = add32(c, x[2]);
			x[3] = add32(d, x[3]);
		}

		function cmn(q, a, b, x, s, t) {
			a = add32(add32(a, q), add32(x, t));
			return add32((a << s) | (a >>> (32 - s)), b);
		}

		function ff(a, b, c, d, x, s, t) {
			return cmn((b & c) | ((~b) & d), a, b, x, s, t);
		}

		function gg(a, b, c, d, x, s, t) {
			return cmn((b & d) | (c & (~d)), a, b, x, s, t);
		}

		function hh(a, b, c, d, x, s, t) {
			return cmn(b ^ c ^ d, a, b, x, s, t);
		}

		function ii(a, b, c, d, x, s, t) {
			return cmn(c ^ (b | (~d)), a, b, x, s, t);
		}

		function md51(s) {
			var n = s.length,
				state = [1732584193, -271733879, -1732584194, 271733878], i;
			for (i = 64; i <= s.length; i += 64) {
				md5cycle(state, md5blk(s.substring(i - 64, i)));
			}
			s = s.substring(i - 64);
			var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			for (i = 0; i < s.length; i++)
				tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
			tail[i >> 2] |= 0x80 << ((i % 4) << 3);
			if (i > 55) {
				md5cycle(state, tail);
				for (i = 0; i < 16; i++) tail[i] = 0;
			}
			tail[14] = n * 8;
			md5cycle(state, tail);
			return state;
		}

		function md5blk(s) {
			var md5blks = [], i;
			for (i = 0; i < 64; i += 4) {
				md5blks[i >> 2] = s.charCodeAt(i)
					+ (s.charCodeAt(i + 1) << 8)
					+ (s.charCodeAt(i + 2) << 16)
					+ (s.charCodeAt(i + 3) << 24);
			}
			return md5blks;
		}

		var hex_chr = '0123456789abcdef'.split('');

		function rhex(n) {
			var s = '', j = 0;
			for (; j < 4; j++)
				s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
					+ hex_chr[(n >> (j * 8)) & 0x0F];
			return s;
		}

        		function hex(x) {
			for (var i = 0; i < x.length; i++)
				x[i] = rhex(x[i]);
			return x.join('');
		}

		function add32(a, b) {
			return (a + b) & 0xFFFFFFFF;
		}

		if (string === undefined) return '';
		return hex(md51(string));
	}

	// Process text hashing
	async function processTextHash() {
		textError = '';
		textCopied = {};
		textHashes = {};

		if (!textInput.trim()) {
			textError = 'Please enter text to hash';
			return;
		}

		try {
			let processedInput = textInput;
			
			if (trimWhitespace) {
				processedInput = processedInput.trim();
			}
			
			if (!caseSensitive) {
				processedInput = processedInput.toLowerCase();
			}

			// Generate all hashes
			const hashes = {};
			
			if (selectedAlgorithm === 'all' || selectedAlgorithm === 'md5') {
				hashes.md5 = md5(processedInput);
			}
			
			for (const algo of algorithms) {
				if (algo.value !== 'md5' && (selectedAlgorithm === 'all' || selectedAlgorithm === algo.value)) {
					try {
						hashes[algo.value] = await hashText(processedInput, algo.value);
					} catch (error) {
						console.error(`Error generating ${algo.value} hash:`, error);
					}
				}
			}

			textHashes = hashes;
			addToHistory('text', processedInput, hashes, selectedAlgorithm);

			// Verify hash if in verify mode
			if (verifyMode && expectedHash) {
				verifyHash();
			}

		} catch (error) {
			textError = 'Error generating hash. Please try again.';
			console.error('Text hashing error:', error);
		}
	}

	// Process file hashing
	async function processFileHash() {
		if (!fileInput) {
			fileError = 'Please select a file to hash';
			return;
		}

		fileError = '';
		fileCopied = {};
		fileHashes = {};
		isHashing = true;
		hashingProgress = 0;

		try {
			const reader = new FileReader();
			
			reader.onprogress = (e) => {
				if (e.lengthComputable) {
					hashingProgress = (e.loaded / e.total) * 100;
				}
			};

			reader.onload = async (e) => {
				try {
					const arrayBuffer = e.target.result;
					const hashes = {};

					// Generate hashes for selected algorithm or all
					if (selectedAlgorithm === 'all' || selectedAlgorithm === 'md5') {
						const uint8Array = new Uint8Array(arrayBuffer);
						const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('');
						hashes.md5 = md5(binaryString);
					}

					for (const algo of algorithms) {
						if (algo.value !== 'md5' && (selectedAlgorithm === 'all' || selectedAlgorithm === algo.value)) {
							try {
								const hashBuffer = await crypto.subtle.digest(
									algo.value.toUpperCase().replace(/(\d+)/, '-$1'), 
									arrayBuffer
								);
								const hashArray = Array.from(new Uint8Array(hashBuffer));
								hashes[algo.value] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
							} catch (error) {
								console.error(`Error generating ${algo.value} hash:`, error);
							}
						}
					}

					fileHashes = hashes;
					addToHistory('file', fileName, hashes, selectedAlgorithm);
					
					// Verify hash if in verify mode
					if (verifyMode && expectedHash) {
						verifyHash();
					}

				} catch (error) {
					fileError = 'Error processing file. Please try again.';
					console.error('File hashing error:', error);
				} finally {
					isHashing = false;
					hashingProgress = 0;
				}
			};

			reader.onerror = () => {
				fileError = 'Error reading file';
				isHashing = false;
				hashingProgress = 0;
			};

			reader.readAsArrayBuffer(fileInput);

		} catch (error) {
			fileError = 'Error processing file. Please try again.';
			console.error('File hashing error:', error);
			isHashing = false;
			hashingProgress = 0;
		}
	}

	// Verify hash
	function verifyHash() {
		if (!expectedHash.trim()) {
			verificationResult = null;
			return;
		}

		const expectedHashLower = expectedHash.toLowerCase().trim();
		const currentHashes = activeTab === 'text' ? textHashes : fileHashes;
		
		let isMatch = false;
		let matchedAlgorithm = '';

		for (const [algorithm, hash] of Object.entries(currentHashes)) {
			if (hash.toLowerCase() === expectedHashLower) {
				isMatch = true;
				matchedAlgorithm = algorithm.toUpperCase();
				break;
			}
		}

		verificationResult = {
			isMatch,
			algorithm: matchedAlgorithm,
			expectedHash: expectedHash.trim()
		};
	}

	// Handle file drop
	function handleFileDrop(e) {
		e.preventDefault();
		dragActive = false;

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFileSelect(e.dataTransfer.files[0]);
		}
	}

	// Handle file selection
	function handleFileSelect(file) {
		fileInput = file;
		fileName = file.name;
		fileSize = formatFileSize(file.size);
		fileError = '';
		fileHashes = {};
		fileCopied = {};
	}

	// Handle file input change
	function handleFileInputChange(e) {
		if (e.target.files && e.target.files[0]) {
			handleFileSelect(e.target.files[0]);
		}
	}

	// Format file size
	function formatFileSize(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	// Copy to clipboard
	function copyToClipboard(text, type, algorithm) {
		navigator.clipboard.writeText(text).then(() => {
			if (type === 'text') {
				textCopied = { ...textCopied, [algorithm]: true };
				setTimeout(() => {
					textCopied = { ...textCopied, [algorithm]: false };
				}, 2000);
			} else {
				fileCopied = { ...fileCopied, [algorithm]: true };
				setTimeout(() => {
					fileCopied = { ...fileCopied, [algorithm]: false };
				}, 2000);
			}
		});
	}

	// Download hash results
	function downloadHashes(type) {
		const hashes = type === 'text' ? textHashes : fileHashes;
		const input = type === 'text' ? textInput : fileName;
		
		let content = `Hash Results\n`;
		content += `Generated: ${new Date().toLocaleString()}\n`;
		content += `Input: ${input}\n`;
		content += `Type: ${type}\n\n`;

		for (const [algorithm, hash] of Object.entries(hashes)) {
			content += `${algorithm.toUpperCase()}: ${hash}\n`;
		}

		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `hashes-${Date.now()}.txt`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	// Reset functions
	function resetText() {
		textInput = '';
		textHashes = {};
		textError = '';
		textCopied = {};
		verificationResult = null;
	}

	function resetFile() {
		fileInput = null;
		fileName = '';
		fileSize = '';
		fileHashes = {};
		fileError = '';
		fileCopied = {};
		verificationResult = null;
	}

	// Add to history
	function addToHistory(type, input, hashes, algorithm) {
		const historyItem = {
			id: Date.now(),
			userId: user.uid,
			type,
			input: type === 'text' ? input : input || 'File',
			hashes,
			algorithm,
			timestamp: new Date().toISOString()
		};

		history = [historyItem, ...history.slice(0, 9)];
		saveHistoryToFirebase();
	}

	// Load history item
	function loadHistoryItem(item) {
		if (item.type === 'text') {
			activeTab = 'text';
			textInput = item.input;
			textHashes = item.hashes;
			selectedAlgorithm = item.algorithm;
		} else {
			activeTab = 'file';
			fileName = item.input;
			fileHashes = item.hashes;
			selectedAlgorithm = item.algorithm;
		}
	}

	// Clear history
	function clearHistory() {
		history = [];
		clearHistoryFromFirebase();
	}

	// Format date
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleString();
	}

	// Get user stats
	function getUserStats() {
		if (!history.length) return { total: 0, text: 0, file: 0 };

		const textCount = history.filter((item) => item.type === 'text').length;
		const fileCount = history.filter((item) => item.type === 'file').length;

		return {
			total: history.length,
			text: textCount,
			file: fileCount
		};
	}

	// Get algorithm info
	function getAlgorithmInfo(value) {
		return algorithms.find(algo => algo.value === value) || { label: value.toUpperCase(), description: '' };
	}

	onMount(() => {
		onAuthStateChanged(auth, (userData) => {
			if (userData) {
				user = userData;
				loadHistoryFromFirebase(userData.uid);
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
					<Card.Title class="text-2xl">Hash Generator</Card.Title>
					<Card.Description>Generate MD5, SHA-1, SHA-256, and other hash algorithms</Card.Description>
				</div>
				<div class="flex gap-2">
					<Button.Root
						variant="outline"
						class="gap-2"
						on:click={() => verifyMode = !verifyMode}
					>
						<Shield size={16} />
						{verifyMode ? 'Disable' : 'Enable'} Verification
					</Button.Root>
					<Button.Root
						variant="outline"
						class="gap-2"
						on:click={clearHistory}
						disabled={history.length === 0 || loading}
					>
						<RotateCcw size={16} />
						Clear History
					</Button.Root>
				</div>
			</Card.Header>
		</Card.Root>

		<div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4">
			<!-- Main Content -->
			<div class="space-y-4">
				<Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)}>
					<Tabs.List class="w-full">
						<Tabs.Trigger value="text" class="flex-1">
							<div class="flex items-center justify-center gap-2">
								<FileText size={16} />
								Text
							</div>
						</Tabs.Trigger>
						<Tabs.Trigger value="file" class="flex-1">
							<div class="flex items-center justify-center gap-2">
								<Upload size={16} />
								File
							</div>
						</Tabs.Trigger>
					</Tabs.List>

					<!-- Algorithm Selection -->
					<div class="mt-4">
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-lg">Hash Algorithm</Card.Title>
								<Card.Description>Choose which hash algorithm(s) to generate</Card.Description>
							</Card.Header>
							<Card.Content class="space-y-4">
								<div class="grid grid-cols-2 md:grid-cols-3 gap-2">
									<Button.Root
										variant={selectedAlgorithm === 'all' ? 'default' : 'outline'}
										size="sm"
										class="justify-start"
										on:click={() => selectedAlgorithm = 'all'}
									>
										<Hash size={16} class="mr-2" />
										All Algorithms
									</Button.Root>
									{#each algorithms as algo}
										<Button.Root
											variant={selectedAlgorithm === algo.value ? 'default' : 'outline'}
											size="sm"
											class="justify-start"
											on:click={() => selectedAlgorithm = algo.value}
										>
											{algo.label}
										</Button.Root>
									{/each}
								</div>

								{#if selectedAlgorithm !== 'all'}
									<div class="bg-blue-50 border border-blue-200 rounded-md p-3">
										<div class="flex items-start gap-2">
											<Info size={16} class="text-blue-600 mt-0.5" />
											<div>
												<h4 class="font-medium text-blue-900">{getAlgorithmInfo(selectedAlgorithm).label}</h4>
												<p class="text-sm text-blue-700">{getAlgorithmInfo(selectedAlgorithm).description}</p>
											</div>
										</div>
									</div>
								{/if}
							</Card.Content>
						</Card.Root>
					</div>

					<!-- Hash Verification -->
					{#if verifyMode}
						<Card.Root>
							<Card.Header>
								<Card.Title class="text-lg flex items-center gap-2">
									<Shield size={20} />
									Hash Verification
								</Card.Title>
								<Card.Description>Enter expected hash to verify against generated hashes</Card.Description>
							</Card.Header>
							<Card.Content class="space-y-4">
								<div>
									<Label.Root for="expectedHash" class="text-sm font-medium">Expected Hash</Label.Root>
									<Input.Root
										id="expectedHash"
										bind:value={expectedHash}
										placeholder="Enter expected hash value..."
										class="font-mono"
									/>
								</div>

								{#if verificationResult}
									<div class={`border rounded-md p-3 ${verificationResult.isMatch ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
										<div class="flex items-start gap-2">
											{#if verificationResult.isMatch}
												<Check size={16} class="text-green-600 mt-0.5" />
												<div>
													<h4 class="font-medium text-green-900">Hash Verified ✓</h4>
													<p class="text-sm text-green-700">Matches {verificationResult.algorithm} hash</p>
												</div>
											{:else}
												<AlertCircle size={16} class="text-red-600 mt-0.5" />
												<div>
													<h4 class="font-medium text-red-900">Hash Mismatch ✗</h4>
													<p class="text-sm text-red-700">Expected hash does not match any generated hashes</p>
												</div>
											{/if}
										</div>
									</div>
								{/if}
							</Card.Content>
						</Card.Root>
					{/if}

					<!-- Text Tab -->
					<Tabs.Content value="text" class="space-y-4 pt-4">
						<Card.Root>
							<Card.Header class="flex flex-row items-center justify-between">
								<div>
									<Card.Title>Text Hash Generator</Card.Title>
									<Card.Description>Generate hash values from text input</Card.Description>
								</div>
								<div class="flex items-center gap-2">
									<Button.Root variant="outline" size="sm" class="gap-2" on:click={resetText}>
										<RotateCcw size={16} />
										Reset
									</Button.Root>
								</div>
							</Card.Header>
							<Card.Content class="space-y-4">
								<!-- Text Options -->
								<div class="flex flex-wrap gap-4">
									<div class="flex items-center space-x-2">
										<Switch.Root id="caseSensitive" bind:checked={caseSensitive} />
										<Label.Root for="caseSensitive" class="text-sm">Case Sensitive</Label.Root>
									</div>
									<div class="flex items-center space-x-2">
										<Switch.Root id="trimWhitespace" bind:checked={trimWhitespace} />
										<Label.Root for="trimWhitespace" class="text-sm">Trim Whitespace</Label.Root>
									</div>
								</div>

								<div>
									<div class="flex justify-between mb-2">
										<Label.Root for="textInput" class="text-sm font-medium">Text Input</Label.Root>
										<span class="text-xs text-gray-500">{textInput.length} characters</span>
									</div>
									<Textarea.Root
										id="textInput"
										bind:value={textInput}
										placeholder="Enter text to generate hash..."
										class="min-h-[150px] font-mono"
									/>
								</div>

								{#if textError}
									<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
										<AlertCircle size={18} class="mt-0.5" />
										<p>{textError}</p>
									</div>
								{/if}

								<div class="flex justify-center">
									<Button.Root class="gap-2 px-6 py-2" on:click={processTextHash} disabled={!textInput.trim()}>
										<Hash size={18} />
										Generate Hash{selectedAlgorithm === 'all' ? 'es' : ''}
									</Button.Root>
								</div>

								{#if Object.keys(textHashes).length > 0}
									<div class="space-y-3">
										<div class="flex justify-between items-center">
											<h3 class="text-lg font-semibold">Generated Hashes</h3>
											<Button.Root variant="outline" size="sm" class="gap-2" on:click={() => downloadHashes('text')}>
												<Download size={16} />
												Download All
											</Button.Root>
										</div>

										{#each Object.entries(textHashes) as [algorithm, hash]}
											<div class="border rounded-lg p-4 bg-gray-50">
												<div class="flex justify-between items-center mb-2">
													<div class="flex items-center gap-2">
														<div class="w-3 h-3 rounded-full bg-blue-500"></div>
														<span class="font-medium text-sm">{algorithm.toUpperCase()}</span>
													</div>
													<Button.Root
														variant="outline"
														size="sm"
														class="h-8 px-2"
														on:click={() => copyToClipboard(hash, 'text', algorithm)}
													>
														{#if textCopied[algorithm]}
															<Check size={14} class="mr-1" />
															Copied!
														{:else}
															<Copy size={14} class="mr-1" />
															Copy
														{/if}
													</Button.Root>
												</div>
												<div class="bg-white border rounded p-3 font-mono text-sm break-all">
													{hash}
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</Card.Content>
						</Card.Root>
					</Tabs.Content>

					<!-- File Tab -->
					<Tabs.Content value="file" class="space-y-4 pt-4">
						<Card.Root>
							<Card.Header class="flex flex-row items-center justify-between">
								<div>
									<Card.Title>File Hash Generator</Card.Title>
									<Card.Description>Generate hash values from file uploads</Card.Description>
								</div>
								<div class="flex items-center gap-2">
									<Button.Root variant="outline" size="sm" class="gap-2" on:click={resetFile}>
										<RotateCcw size={16} />
										Reset
									</Button.Root>
								</div>
							</Card.Header>
							<Card.Content class="space-y-4">
								<!-- File Upload Area -->
								<div
									class="border-2 border-dashed rounded-lg p-6 text-center transition-colors"
									class:border-blue-400={dragActive}
									class:bg-blue-50={dragActive}
									on:dragenter={(e) => {
										e.preventDefault();
										dragActive = true;
									}}
									on:dragover={(e) => {
										e.preventDefault();
										dragActive = true;
									}}
									on:dragleave={() => {
										dragActive = false;
									}}
									on:drop={handleFileDrop}
								>
									{#if fileInput}
										<div class="mb-4">
											<div class="flex items-center justify-center gap-2 mb-2">
												<FileText size={24} class="text-blue-500" />
												<div class="text-left">
													<div class="font-medium">{fileName}</div>
													<div class="text-sm text-gray-500">{fileSize}</div>
												</div>
											</div>
											<Button.Root variant="outline" size="sm" class="mt-2" on:click={resetFile}>
												<RotateCcw size={14} class="mr-1" />
												Clear File
											</Button.Root>
										</div>
									{:else}
										<div class="py-8">
											<Upload size={40} class="mx-auto text-gray-400 mb-4" />
											<p class="text-lg font-medium text-gray-700 mb-1">Drop your file here</p>
											<p class="text-sm text-gray-500 mb-4">or click to browse files</p>
											<Button.Root variant="outline" class="relative">
												<input
													type="file"
													class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
													on:change={handleFileInputChange}
												/>
												Select File
											</Button.Root>
										</div>
									{/if}
								</div>

								{#if fileError}
									<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
										<AlertCircle size={18} class="mt-0.5" />
										<p>{fileError}</p>
									</div>
								{/if}

								{#if isHashing}
									<div class="bg-blue-50 border border-blue-200 rounded-md p-4">
										<div class="flex items-center gap-3 mb-2">
											<div class="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
											<span class="font-medium text-blue-900">Generating hashes...</span>
										</div>
										<div class="w-full bg-blue-200 rounded-full h-2">
											<div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: {hashingProgress}%"></div>
										</div>
									</div>
								{/if}

								<div class="flex justify-center">
									<Button.Root 
										class="gap-2 px-6 py-2" 
										on:click={processFileHash} 
										disabled={!fileInput || isHashing}
									>
										<Hash size={18} />
										Generate Hash{selectedAlgorithm === 'all' ? 'es' : ''}
									</Button.Root>
								</div>

								{#if Object.keys(fileHashes).length > 0}
									<div class="space-y-3">
										<div class="flex justify-between items-center">
											<h3 class="text-lg font-semibold">Generated Hashes</h3>
											<Button.Root variant="outline" size="sm" class="gap-2" on:click={() => downloadHashes('file')}>
												<Download size={16} />
												Download All
											</Button.Root>
										</div>

										{#each Object.entries(fileHashes) as [algorithm, hash]}
											<div class="border rounded-lg p-4 bg-gray-50">
												<div class="flex justify-between items-center mb-2">
													<div class="flex items-center gap-2">
														<div class="w-3 h-3 rounded-full bg-green-500"></div>
														<span class="font-medium text-sm">{algorithm.toUpperCase()}</span>
													</div>
													<Button.Root
														variant="outline"
														size="sm"
														class="h-8 px-2"
														on:click={() => copyToClipboard(hash, 'file', algorithm)}
													>
														{#if fileCopied[algorithm]}
															<Check size={14} class="mr-1" />
															Copied!
														{:else}
															<Copy size={14} class="mr-1" />
															Copy
														{/if}
													</Button.Root>
												</div>
												<div class="bg-white border rounded p-3 font-mono text-sm break-all">
													{hash}
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</Card.Content>
						</Card.Root>
					</Tabs.Content>
				</Tabs.Root>
			</div>

			<!-- Sidebar -->
			<div class="space-y-4">
				<!-- User Stats Card -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Your Stats</Card.Title>
					</Card.Header>
					<Card.Content>
						{#if loading}
							<div class="flex justify-center py-4">
								<div class="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
							</div>
						{:else}
							<div class="grid grid-cols-3 gap-4 text-center">
								<div class="bg-blue-50 p-3 rounded-lg">
									<div class="text-2xl font-bold text-blue-600">{getUserStats().total}</div>
									<div class="text-xs text-gray-600">Total Hashes</div>
								</div>
								<div class="bg-green-50 p-3 rounded-lg">
									<div class="text-2xl font-bold text-green-600">{getUserStats().text}</div>
									<div class="text-xs text-gray-600">Text Hashes</div>
								</div>
								<div class="bg-purple-50 p-3 rounded-lg">
									<div class="text-2xl font-bold text-purple-600">{getUserStats().file}</div>
									<div class="text-xs text-gray-600">File Hashes</div>
								</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<!-- History -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Hash History</Card.Title>
						<Card.Description>Your recent hash generations</Card.Description>
					</Card.Header>
					<Card.Content>
						{#if loading}
							<div class="flex justify-center py-8">
								<div class="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
							</div>
						{:else if history.length === 0}
							<div class="text-center py-8 bg-gray-50 rounded-lg">
								<Hash size={32} class="mx-auto text-gray-400 mb-2" />
								<p class="text-gray-600">No hash history yet</p>
							</div>
						{:else}
							<div class="space-y-3 max-h-[500px] overflow-y-auto pr-2">
								{#each history as item}
									<div
										class="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
										on:click={() => loadHistoryItem(item)}
									>
										<div class="flex items-center justify-between mb-1">
											<div class="flex items-center gap-2">
												{#if item.type === 'text'}
													<FileText size={16} class="text-blue-500" />
												{:else}
													<Upload size={16} class="text-green-500" />
												{/if}
												<span class="font-medium text-sm">
													{item.type === 'text' ? 'Text' : 'File'} Hash
												</span>
											</div>
											<span class="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
										</div>
										<div class="text-xs text-gray-600 truncate">
											{item.input.length > 40 ? item.input.substring(0, 40) + '...' : item.input}
										</div>
										<div class="text-xs text-gray-500 mt-1">
											{Object.keys(item.hashes).length} hash{Object.keys(item.hashes).length > 1 ? 'es' : ''} generated
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</Card.Content>
				</Card.Root>

				<!-- Algorithm Info Card -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Hash Algorithms</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							{#each algorithms as algo}
								<div class="flex gap-3">
									<div class={`p-2 rounded-full h-fit ${algo.value === 'md5' ? 'bg-red-100 text-red-600' : algo.value === 'sha1' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
										{#if algo.value === 'md5' || algo.value === 'sha1'}
											<AlertCircle size={16} />
										{:else}
											<Shield size={16} />
										{/if}
									</div>
									<div>
										<h4 class="font-medium text-sm">{algo.label}</h4>
										<p class="text-sm text-gray-600">{algo.description}</p>
									</div>
								</div>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Security Tips Card -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Security Tips</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							<div class="flex gap-3">
								<div class="bg-green-100 text-green-600 p-2 rounded-full h-fit">
									<Shield size={16} />
								</div>
								<div>
									<h4 class="font-medium text-sm">Use SHA-256 or higher</h4>
									<p class="text-sm text-gray-600">
										For security-critical applications, use SHA-256, SHA-384, or SHA-512.
									</p>
								</div>
							</div>
							<div class="flex gap-3">
								<div class="bg-red-100 text-red-600 p-2 rounded-full h-fit">
									<AlertCircle size={16} />
								</div>
								<div>
									<h4 class="font-medium text-sm">Avoid MD5 & SHA-1</h4>
									<p class="text-sm text-gray-600">
										These algorithms have known vulnerabilities and should not be used for security.
									</p>
								</div>
							</div>
							<div class="flex gap-3">
								<div class="bg-blue-100 text-blue-600 p-2 rounded-full h-fit">
									<Key size={16} />
								</div>
								<div>
									<h4 class="font-medium text-sm">File Integrity</h4>
									<p class="text-sm text-gray-600">
										Hash values are perfect for verifying file integrity and detecting changes.
									</p>
								</div>
							</div>
							<div class="flex gap-3">
								<div class="bg-purple-100 text-purple-600 p-2 rounded-full h-fit">
									<Lock size={16} />
								</div>
								<div>
									<h4 class="font-medium text-sm">Password Storage</h4>
									<p class="text-sm text-gray-600">
										Never use plain hashes for passwords. Use bcrypt, scrypt, or Argon2 instead.
									</p>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Sync Status -->
				{#if savingToFirebase}
					<div class="flex items-center justify-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm">
						<div class="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
						<span>Syncing to cloud...</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar for history */
	:global(.max-h-\[500px\]::-webkit-scrollbar) {
		width: 8px;
	}

	:global(.max-h-\[500px\]::-webkit-scrollbar-track) {
		background: #f1f1f1;
		border-radius: 10px;
	}

	:global(.max-h-\[500px\]::-webkit-scrollbar-thumb) {
		background: #d1d5db;
		border-radius: 10px;
	}

	:global(.max-h-\[500px\]::-webkit-scrollbar-thumb:hover) {
		background: #9ca3af;
	}

	/* Progress bar animation */
	:global(.bg-blue-600) {
		transition: width 0.3s ease-in-out;
	}

	/* Hash display styling */
	:global(.break-all) {
		word-break: break-all;
		overflow-wrap: break-word;
	}
</style>
