<script>
	import { onMount } from 'svelte';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Button from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import {
		Square,
		Circle,
		Diamond,
		ArrowRight,
		Database,
		Cloud,
		File,
		Hexagon,
		ChevronDown,
		Plus,
		Minus,
		RotateCcw,
		Save,
		Download,
		Share
	} from 'lucide-svelte';

	const auth = getAuth();
	let user = null;
	let canvas;
	let ctx;
	let selectedShape = null;
	let selectedElement = null;
	let isDrawingConnection = false;
	let startPoint = null;
	let scale = 1;

	const shapes = [
		{
			category: 'Basic',
			items: [
				{ type: 'rectangle', icon: Square, label: 'Process' },
				{ type: 'circle', icon: Circle, label: 'Start/End' },
				{ type: 'diamond', icon: Diamond, label: 'Decision' },
				{ type: 'database', icon: Database, label: 'Database' }
			]
		},
		{
			category: 'Advanced',
			items: [
				{ type: 'cloud', icon: Cloud, label: 'Cloud' },
				{ type: 'document', icon: File, label: 'Document' },
				{ type: 'hexagon', icon: Hexagon, label: 'Preparation' }
			]
		}
	];

	let elements = [];
	let connections = [];
	let history = [];
	let isConnectionMode = false;
	let sourceShape = null;
	let tempConnection = null;
	let editingElement = null;
	let tempText = '';

	// Add this to your shapes array
	const connectionTool = {
		type: 'connection',
		icon: ArrowRight,
		label: 'Connect Shapes'
	};

	// Add this function to handle double click
	function handleDoubleClick(e) {
		const rect = canvas.getBoundingClientRect();
		const x = (e.clientX - rect.left) / scale;
		const y = (e.clientY - rect.top) / scale;

		const clickedElement = elements.find((el) => isPointInElement(x, y, el));
		if (clickedElement) {
			editingElement = clickedElement;
			tempText = clickedElement.text;
		}
	}

	function saveText() {
		if (editingElement) {
			editingElement.text = tempText;
			editingElement = null;
			render();
			saveState();
		}
	}

	function handleKeyDown(e) {
		if (e.key === 'Enter') {
			saveText();
		} else if (e.key === 'Escape') {
			cancelEdit();
		}
	}

	function cancelEdit() {
		editingElement = null;
		render();
	}

	// Add this function to handle text update
	function updateElementText() {
		if (editingElement) {
			editingElement.text = editText;
			editingElement = null;
			render();
			saveState();
		}
	}

	function initCanvas() {
		ctx = canvas.getContext('2d');
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		render();
	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.scale(scale, scale);

		drawGrid();
		connections.forEach(drawConnection);
		elements.forEach(drawElement);

		// Draw temporary connection line
		if (tempConnection) {
			ctx.beginPath();
			ctx.moveTo(sourceShape.x + sourceShape.width / 2, sourceShape.y + sourceShape.height / 2);
			ctx.lineTo(tempConnection.end.x, tempConnection.end.y);
			ctx.strokeStyle = '#2563eb';
			ctx.setLineDash([5, 5]);
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.setLineDash([]);
		}

		ctx.restore();
	}

	function isPointInElement(x, y, element) {
		switch (element.type) {
			case 'rectangle':
			case 'database':
			case 'document':
				return (
					x >= element.x &&
					x <= element.x + element.width &&
					y >= element.y &&
					y <= element.y + element.height
				);

			case 'circle':
				const centerX = element.x + element.width / 2;
				const centerY = element.y + element.height / 2;
				const radiusX = element.width / 2;
				const radiusY = element.height / 2;
				return Math.pow((x - centerX) / radiusX, 2) + Math.pow((y - centerY) / radiusY, 2) <= 1;

			case 'diamond':
				const points = [
					{ x: element.x + element.width / 2, y: element.y },
					{ x: element.x + element.width, y: element.y + element.height / 2 },
					{ x: element.x + element.width / 2, y: element.y + element.height },
					{ x: element.x, y: element.y + element.height / 2 }
				];
				return isPointInPolygon(x, y, points);

			default:
				return false;
		}
	}

	function isPointInPolygon(x, y, points) {
		let inside = false;
		for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
			const xi = points[i].x,
				yi = points[i].y;
			const xj = points[j].x,
				yj = points[j].y;

			const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
			if (intersect) inside = !inside;
		}
		return inside;
	}

	function drawConnection(connection) {
		const startElement = elements.find((el) => el.id === connection.start);
		const endElement = elements.find((el) => el.id === connection.end);

		if (!startElement || !endElement) return;

		ctx.beginPath();
		ctx.moveTo(startElement.x + startElement.width / 2, startElement.y + startElement.height / 2);
		ctx.lineTo(endElement.x + endElement.width / 2, endElement.y + endElement.height / 2);
		ctx.strokeStyle = '#2563eb';
		ctx.lineWidth = 2;
		ctx.stroke();

		// Draw arrow head
		const angle = Math.atan2(endElement.y - startElement.y, endElement.x - startElement.x);
		ctx.beginPath();
		ctx.moveTo(endElement.x + endElement.width / 2, endElement.y + endElement.height / 2);
		ctx.lineTo(
			endElement.x + endElement.width / 2 - 10 * Math.cos(angle - Math.PI / 6),
			endElement.y + endElement.height / 2 - 10 * Math.sin(angle - Math.PI / 6)
		);
		ctx.lineTo(
			endElement.x + endElement.width / 2 - 10 * Math.cos(angle + Math.PI / 6),
			endElement.y + endElement.height / 2 - 10 * Math.sin(angle + Math.PI / 6)
		);
		ctx.closePath();
		ctx.fillStyle = '#2563eb';
		ctx.fill();
	}

	function drawElement(element) {
		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = '#2563eb';
		ctx.lineWidth = 2;

		switch (element.type) {
			case 'rectangle':
				ctx.beginPath();
				ctx.rect(element.x, element.y, element.width, element.height);
				ctx.fill();
				ctx.stroke();
				break;

			case 'circle':
				ctx.beginPath();
				ctx.ellipse(
					element.x + element.width / 2,
					element.y + element.height / 2,
					element.width / 2,
					element.height / 2,
					0,
					0,
					2 * Math.PI
				);
				ctx.fill();
				ctx.stroke();
				break;

			case 'diamond':
				ctx.beginPath();
				ctx.moveTo(element.x + element.width / 2, element.y);
				ctx.lineTo(element.x + element.width, element.y + element.height / 2);
				ctx.lineTo(element.x + element.width / 2, element.y + element.height);
				ctx.lineTo(element.x, element.y + element.height / 2);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				break;
		}

		// Draw element text
		ctx.fillStyle = '#000000';
		ctx.font = '14px Public Sans';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(element.text, element.x + element.width / 2, element.y + element.height / 2);
	}

	function drawGrid() {
		const gridSize = 20;
		ctx.strokeStyle = '#f0f0f0';
		ctx.lineWidth = 0.5;

		for (let x = 0; x < canvas.width; x += gridSize) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.height);
			ctx.stroke();
		}

		for (let y = 0; y < canvas.height; y += gridSize) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.width, y);
			ctx.stroke();
		}
	}

	function handleDrop(e) {
		const rect = canvas.getBoundingClientRect();
		const x = (e.clientX - rect.left) / scale;
		const y = (e.clientY - rect.top) / scale;

		const newElement = {
			type: selectedShape.type,
			x,
			y,
			width: 100,
			height: 60,
			text: selectedShape.label,
			id: `element-${Date.now()}`
		};

		elements = [...elements, newElement];
		saveState();
		render();
	}

	function handleCanvasMouseDown(e) {
		const rect = canvas.getBoundingClientRect();
		const x = (e.clientX - rect.left) / scale;
		const y = (e.clientY - rect.top) / scale;

		const clickedElement = elements.find((el) => isPointInElement(x, y, el));

		if (clickedElement) {
			if (isConnectionMode) {
				if (!sourceShape) {
					sourceShape = clickedElement;
					tempConnection = { start: sourceShape, end: { x, y } };
				} else {
					connections.push({
						start: sourceShape.id,
						end: clickedElement.id,
						type: 'straight'
					});
					sourceShape = null;
					tempConnection = null;
					isConnectionMode = false;
					saveState();
				}
			} else {
				selectedElement = clickedElement;
			}
		}
		render();
	}

	function handleCanvasMouseMove(e) {
		if (tempConnection) {
			const rect = canvas.getBoundingClientRect();
			const x = (e.clientX - rect.left) / scale;
			const y = (e.clientY - rect.top) / scale;
			tempConnection.end = { x, y };
			render();
		} else if (selectedElement && !isConnectionMode) {
			const rect = canvas.getBoundingClientRect();
			selectedElement.x = (e.clientX - rect.left) / scale;
			selectedElement.y = (e.clientY - rect.top) / scale;
		}
		render();
	}

	function handleCanvasMouseUp(e) {
		if (isDrawingConnection) {
			const rect = canvas.getBoundingClientRect();
			const x = (e.clientX - rect.left) / scale;
			const y = (e.clientY - rect.top) / scale;

			const endElement = elements.find((el) => isPointInElement(x, y, el));

			if (endElement && endElement !== selectedElement) {
				connections.push({
					start: selectedElement.id,
					end: endElement.id,
					type: 'straight'
				});
				saveState();
			}
		}

		isDrawingConnection = false;
		selectedElement = null;
		render();
	}

	function saveState() {
		history.push({
			elements: JSON.parse(JSON.stringify(elements)),
			connections: JSON.parse(JSON.stringify(connections))
		});
	}

	function undo() {
		if (history.length > 1) {
			history.pop();
			const previousState = history[history.length - 1];
			elements = previousState.elements;
			connections = previousState.connections;
			render();
		}
	}

	onMount(() => {
		onAuthStateChanged(auth, (userData) => {
			if (userData) {
				user = userData;
				initCanvas();
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
					<Card.Title class="text-2xl">Flowchart Creator</Card.Title>
					<Card.Description>Design professional flowcharts with ease</Card.Description>
				</div>
				<div class="flex gap-2">
					<Button.Root variant="outline" class="gap-2">
						<Save size={16} />
						Save
					</Button.Root>
					<Button.Root variant="outline" class="gap-2">
						<Download size={16} />
						Export
					</Button.Root>
					<Button.Root variant="outline" class="gap-2">
						<Share size={16} />
						Share
					</Button.Root>
				</div>
			</Card.Header>
		</Card.Root>

		<div class="grid grid-cols-[300px_1fr] gap-4">
			<!-- Tools Panel -->
			<div class="space-y-4">
				<!-- Shapes -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Shapes</Card.Title>
					</Card.Header>
					<Card.Content>
						<Tabs.Root value="basic">
							<Tabs.List>
								<Tabs.Trigger value="basic">Basic</Tabs.Trigger>
								<Tabs.Trigger value="advanced">Advanced</Tabs.Trigger>
							</Tabs.List>
							<Tabs.Content value="basic">
								<div class="grid grid-cols-2 gap-2 p-2">
									{#each shapes[0].items as shape}
										<div
											class="p-3 bg-white rounded-lg border-2 cursor-move hover:border-blue-500 transition-colors"
											draggable="true"
											on:dragstart={() => (selectedShape = shape)}
										>
											<div class="flex flex-col items-center gap-1">
												<svelte:component this={shape.icon} size={20} />
												<span class="text-xs">{shape.label}</span>
											</div>
										</div>
									{/each}
								</div>
							</Tabs.Content>
						</Tabs.Root>
					</Card.Content>
				</Card.Root>

				<Button.Root
					variant="outline"
					class="w-full justify-start gap-2"
					on:click={() => {
						isConnectionMode = !isConnectionMode;
						sourceShape = null;
						tempConnection = null;
					}}
				>
					<ArrowRight size={16} />
					{isConnectionMode ? 'Cancel Connection' : 'Connect Shapes'}
				</Button.Root>

				<!-- Properties -->
				<!-- In the Properties Card -->
				<Card.Root>
					<Card.Header>
						<Card.Title>Properties</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							<Button.Root variant="outline" class="w-full justify-start gap-2" on:click={undo}>
								<RotateCcw size={16} />
								Undo
							</Button.Root>

							<div class="flex items-center gap-2">
								<Button.Root variant="outline" size="sm">
									<Minus size={16} />
								</Button.Root>
								<span class="text-sm">{Math.round(scale * 100)}%</span>
								<Button.Root variant="outline" size="sm">
									<Plus size={16} />
								</Button.Root>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
			<!-- Canvas -->
			<div class="relative">
				<canvas
					bind:this={canvas}
					class="w-full h-[800px] bg-white object-cover"
					on:dragover|preventDefault
					on:drop|preventDefault={handleDrop}
					on:mousedown={handleCanvasMouseDown}
					on:mousemove={handleCanvasMouseMove}
					on:mouseup={handleCanvasMouseUp}
					on:dblclick={handleDoubleClick}
				></canvas>

				{#if editingElement}
					<div
						class="absolute bg-white shadow-lg p-2 rounded-md border-2"
						style="left: {editingElement.x}px; top: {editingElement.y - 40}px;"
					>
						<input
							type="text"
							bind:value={tempText}
							class="border rounded px-2 py-1 text-sm"
							on:keydown={handleKeyDown}
							autofocus
						/>
						<div class="flex gap-2 mt-2">
							<Button.Root size="sm" variant="default" on:click={saveText}>Save</Button.Root>
							<Button.Root size="sm" variant="outline" on:click={cancelEdit}>Cancel</Button.Root>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
